import type { ListingCondition } from "@prisma/client"
import { z } from "zod"

import { CONDITION_LABELS, UNIT_LABELS, type Unit } from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"

const districtValues = DISTRICTS.map((d) => d.value) as [
  (typeof DISTRICTS)[number]["value"],
  ...(typeof DISTRICTS)[number]["value"][],
]

const conditionValues = Object.keys(CONDITION_LABELS) as [
  ListingCondition,
  ...ListingCondition[],
]

const unitValues = Object.keys(UNIT_LABELS) as [Unit, ...Unit[]]

export const priceRecommendationSchema = z.object({
  cropId: z.string().min(1, "Select a crop"),
  district: z.enum(districtValues, { message: "Select a district" }),
  condition: z.enum(conditionValues, { message: "Select a condition" }),
  unit: z.enum(unitValues).optional(),
  listingId: z.string().optional(),
})

export type PriceRecommendationValues = z.infer<
  typeof priceRecommendationSchema
>

export const buyerMatchSchema = z.object({
  listingId: z.string().min(1),
})

export type BuyerMatchValues = z.infer<typeof buyerMatchSchema>

export const learningQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, "Ask a question first")
    .max(500, "Keep it under 500 characters"),
})

export type LearningQuestionValues = z.infer<typeof learningQuestionSchema>
