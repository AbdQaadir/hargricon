import { GoogleGenAI } from "@google/genai"

export const GEMINI_MODEL = "gemini-flash-latest"

const globalForGemini = globalThis as unknown as {
  gemini: GoogleGenAI | undefined
}

export const gemini =
  globalForGemini.gemini ??
  new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

if (process.env.NODE_ENV !== "production") {
  globalForGemini.gemini = gemini
}

export async function generateStructured<T>({
  prompt,
  schema,
}: {
  prompt: string
  schema: Record<string, unknown>
}): Promise<T> {
  const interaction = await gemini.interactions.create({
    model: GEMINI_MODEL,
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema,
    },
  })

  if (!interaction.output_text) {
    throw new Error("Gemini returned an empty response.")
  }

  return JSON.parse(interaction.output_text) as T
}

export async function* generateStructuredStream({
  prompt,
  schema,
}: {
  prompt: string
  schema: Record<string, unknown>
}): AsyncGenerator<string, void, unknown> {
  const stream = await gemini.interactions.create({
    model: GEMINI_MODEL,
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema,
    },
    stream: true,
  })

  for await (const event of stream) {
    if (event.event_type === "step.delta" && event.delta.type === "text") {
      yield event.delta.text
    } else if (event.event_type === "error") {
      throw new Error(event.error?.message ?? "Gemini stream error.")
    }
  }
}
