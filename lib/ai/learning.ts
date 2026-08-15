import type { LearningTopic } from "@prisma/client"

import { LEARNING_TOPIC_LABELS } from "@/constants/learning"
import { prisma } from "@/lib/db/client"
import { generateStructured } from "@/lib/ai/gemini"

const SYSTEM_PROMPT = `You are an agricultural extension assistant for smallholder farmers in Rwanda, part of the Hargricon marketplace app. Farmers ask you practical questions — produce storage and preservation, reducing post-harvest losses, farming techniques, pest and disease management, and similar topics.

Give a one-sentence summary, then a list of concrete, actionable steps (not general theory). Classify the question into the single best-fitting topic. If a question is unrelated to farming or produce, set topic to GENERAL and say in the summary that you can only help with agricultural topics, with an empty steps list.`

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

export async function askLearningQuestion({
  farmerId,
  question,
}: {
  farmerId: string
  question: string
}) {
  const parsed = await generateStructured<{
    summary: string
    steps: string[]
    topic: LearningTopic
  }>({
    prompt: `${SYSTEM_PROMPT}\n\nFarmer's question: ${question}`,
    schema: ANSWER_SCHEMA,
  })

  if (!parsed.summary) {
    throw new Error("Gemini returned an empty answer.")
  }

  return prisma.learningEntry.create({
    data: {
      farmerId,
      question,
      summary: parsed.summary,
      steps: parsed.steps ?? [],
      topic: parsed.topic ?? "GENERAL",
    },
  })
}
