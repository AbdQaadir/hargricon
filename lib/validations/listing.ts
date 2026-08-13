import type { ListingCondition } from "@prisma/client"
import { z } from "zod"

import { CONDITION_LABELS, UNIT_LABELS, type Unit } from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"

const districtValues = DISTRICTS.map((d) => d.value) as [
  (typeof DISTRICTS)[number]["value"],
  ...(typeof DISTRICTS)[number]["value"][],
]

const unitValues = Object.keys(UNIT_LABELS) as [Unit, ...Unit[]]

const conditionValues = Object.keys(CONDITION_LABELS) as [
  ListingCondition,
  ...ListingCondition[],
]

function positiveNumberString(message: string) {
  return z
    .string()
    .trim()
    .min(1, message)
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message,
    })
}

export const listingSchema = z.object({
  cropId: z.string().min(1, "Select a crop"),
  farmId: z.string().optional(),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unit: z.enum(unitValues, { message: "Select a unit" }),
  condition: z.enum(conditionValues, { message: "Select a condition" }),
  askingPrice: z.number().positive("Price must be greater than 0"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  district: z.enum(districtValues, { message: "Select a district" }),
  description: z.string().trim().optional(),
  images: z
    .array(z.string())
    .min(1, "Add at least one photo")
    .max(5, "Up to 5 photos"),
})

export type ListingValues = z.infer<typeof listingSchema>

export const listingFormSchema = listingSchema.extend({
  quantity: positiveNumberString("Quantity must be greater than 0"),
  askingPrice: positiveNumberString("Price must be greater than 0"),
})

export type ListingFormValues = z.infer<typeof listingFormSchema>

// The only two states a farmer can toggle directly; Reserved/Sold/Expired
// are transaction- or time-driven, not a manual farmer action.
export const listingAvailabilitySchema = z.object({
  status: z.enum(["AVAILABLE", "CANCELLED"]),
})

export type ListingAvailabilityValues = z.infer<
  typeof listingAvailabilitySchema
>
