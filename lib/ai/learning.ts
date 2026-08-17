import type { LearningMessage, LearningTopic } from "@prisma/client"

import { LEARNING_TOPIC_LABELS } from "@/constants/learning"
import { prisma } from "@/lib/db/client"
import { generateStructuredStream } from "@/lib/ai/gemini"

const SYSTEM_PROMPT = `You are an agricultural extension assistant for smallholder farmers in Rwanda, part of the Hargricon marketplace app. Farmers ask you practical questions — produce storage and preservation, reducing post-harvest losses, farming techniques, pest and disease management, and similar topics.

Give a one-sentence summary, then a list of concrete, actionable steps (not general theory). Classify the question into the single best-fitting topic. If a question is unrelated to farming or produce, set topic to GENERAL and say in the summary that you can only help with agricultural topics, with an empty steps list.

If a conversation so far is provided, use it as context and answer the farmer's latest message as a natural follow-up.`

const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "One sentence takeaway answering the question",
    },
    steps: {
      type: "array",
      items: { type: "string" },
      description:
        "Ordered, concrete, actionable steps. Plain text, no markdown.",
    },
    topic: {
      type: "string",
      enum: Object.keys(LEARNING_TOPIC_LABELS),
    },
  },
  required: ["summary", "steps", "topic"],
} as const

const TITLE_MAX_LENGTH = 60

type PartialLearningAnswer = {
  summary: string
  steps: string[]
  topic: string | null
}

export type LearningStreamChunk =
  | ({ type: "partial" } & PartialLearningAnswer)
  | {
      type: "done"
      threadId: string
      userMessage: LearningMessage
      assistantMessage: LearningMessage
    }
  | { type: "error"; message: string }

/**
 * Best-effort extraction of the schema's fields from a possibly-incomplete
 * JSON string as it streams in. Only ever feeds a live preview: the final
 * DB-persisted message always comes from a full `JSON.parse` once the stream
 * closes, so a misread here just self-corrects on the next chunk.
 */
function extractPartialLearningAnswer(raw: string): PartialLearningAnswer {
  function readString(
    from: number
  ): { value: string; complete: boolean; end: number } | null {
    let i = from
    while (i < raw.length && raw[i] !== '"') i++
    if (i >= raw.length) return null
    i++
    let value = ""
    while (i < raw.length) {
      const ch = raw[i]
      if (ch === "\\") {
        if (i + 1 >= raw.length) return { value, complete: false, end: i }
        const next = raw[i + 1]
        if (next === "u") {
          if (i + 6 > raw.length) return { value, complete: false, end: i }
          value += String.fromCharCode(parseInt(raw.slice(i + 2, i + 6), 16))
          i += 6
        } else {
          value += { n: "\n", t: "\t", r: "\r" }[next] ?? next
          i += 2
        }
        continue
      }
      if (ch === '"') return { value, complete: true, end: i + 1 }
      value += ch
      i++
    }
    return { value, complete: false, end: i }
  }

  const result: PartialLearningAnswer = { summary: "", steps: [], topic: null }

  const summaryKey = raw.indexOf('"summary"')
  if (summaryKey !== -1) {
    const colon = raw.indexOf(":", summaryKey)
    if (colon !== -1) {
      const extracted = readString(colon)
      if (extracted) result.summary = extracted.value
    }
  }

  const stepsKey = raw.indexOf('"steps"')
  if (stepsKey !== -1) {
    const bracket = raw.indexOf("[", stepsKey)
    if (bracket !== -1) {
      let i = bracket + 1
      while (i < raw.length) {
        while (i < raw.length && /[\s,]/.test(raw[i])) i++
        if (i >= raw.length || raw[i] !== '"') break
        const extracted = readString(i)
        if (!extracted || !extracted.complete) break
        result.steps.push(extracted.value)
        i = extracted.end
      }
    }
  }

  const topicKey = raw.indexOf('"topic"')
  if (topicKey !== -1) {
    const colon = raw.indexOf(":", topicKey)
    if (colon !== -1) {
      const extracted = readString(colon)
      if (extracted?.complete) result.topic = extracted.value
    }
  }

  return result
}

function deriveTitle(question: string) {
  return question.length > TITLE_MAX_LENGTH
    ? `${question.slice(0, TITLE_MAX_LENGTH - 3)}...`
    : question
}

async function* streamAnswer(
  prompt: string
): AsyncGenerator<
  { type: "partial" } & PartialLearningAnswer,
  { summary: string; steps: string[]; topic: LearningTopic },
  unknown
> {
  let raw = ""

  for await (const delta of generateStructuredStream({
    prompt,
    schema: ANSWER_SCHEMA,
  })) {
    raw += delta
    yield { type: "partial", ...extractPartialLearningAnswer(raw) }
  }

  const parsed = JSON.parse(raw) as {
    summary: string
    steps: string[]
    topic: LearningTopic
  }

  if (!parsed.summary) {
    throw new Error("Gemini returned an empty answer.")
  }

  return {
    summary: parsed.summary,
    steps: parsed.steps ?? [],
    topic: parsed.topic ?? "GENERAL",
  }
}

export async function* streamNewLearningThread({
  farmerId,
  question,
}: {
  farmerId: string
  question: string
}): AsyncGenerator<LearningStreamChunk, void, unknown> {
  const generator = streamAnswer(
    `${SYSTEM_PROMPT}\n\nFarmer's question: ${question}`
  )

  let next = await generator.next()
  while (!next.done) {
    yield next.value
    next = await generator.next()
  }
  const answer = next.value

  const { thread, userMessage, assistantMessage } = await prisma.$transaction(
    async (tx) => {
      const thread = await tx.learningThread.create({
        data: {
          farmerId,
          title: deriveTitle(question),
          topic: answer.topic,
        },
      })
      const userMessage = await tx.learningMessage.create({
        data: { threadId: thread.id, role: "USER", content: question },
      })
      const assistantMessage = await tx.learningMessage.create({
        data: {
          threadId: thread.id,
          role: "ASSISTANT",
          content: answer.summary,
          steps: answer.steps,
        },
      })
      return { thread, userMessage, assistantMessage }
    }
  )

  yield { type: "done", threadId: thread.id, userMessage, assistantMessage }
}

export async function* streamLearningReply({
  threadId,
  farmerId,
  question,
}: {
  threadId: string
  farmerId: string
  question: string
}): AsyncGenerator<LearningStreamChunk, void, unknown> {
  const thread = await prisma.learningThread.findFirst({
    where: { id: threadId, farmerId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })

  if (!thread) {
    throw new Error("Conversation not found.")
  }

  const transcript = thread.messages
    .map(
      (message) =>
        `${message.role === "USER" ? "Farmer" : "Assistant"}: ${message.content}`
    )
    .join("\n")

  const generator = streamAnswer(
    `${SYSTEM_PROMPT}\n\nConversation so far:\n${transcript}\n\nFarmer: ${question}`
  )

  let next = await generator.next()
  while (!next.done) {
    yield next.value
    next = await generator.next()
  }
  const answer = next.value

  const { userMessage, assistantMessage } = await prisma.$transaction(
    async (tx) => {
      const userMessage = await tx.learningMessage.create({
        data: { threadId, role: "USER", content: question },
      })
      const assistantMessage = await tx.learningMessage.create({
        data: {
          threadId,
          role: "ASSISTANT",
          content: answer.summary,
          steps: answer.steps,
        },
      })
      await tx.learningThread.update({
        where: { id: threadId },
        data: { topic: answer.topic },
      })
      return { userMessage, assistantMessage }
    }
  )

  yield { type: "done", threadId, userMessage, assistantMessage }
}
