import type { LearningTopic } from "@prisma/client"

export const LEARNING_TOPIC_LABELS: Record<LearningTopic, string> = {
  STORAGE: "Storage",
  PEST_MANAGEMENT: "Pest management",
  SOIL_HEALTH: "Soil health",
  PLANTING: "Planting",
  HARVESTING: "Harvesting",
  MARKET_TIMING: "Market timing",
  GENERAL: "General",
}
