import { z } from "zod"

import { DISTRICTS } from "@/lib/districts"

const districtValues = DISTRICTS.map((d) => d.value) as [
  (typeof DISTRICTS)[number]["value"],
  ...(typeof DISTRICTS)[number]["value"][],
]

export const farmSchema = z.object({
  name: z.string().trim().min(1, "Farm name is required"),
  district: z.enum(districtValues, {
    message: "Select a district",
  }),
  sizeHectares: z.number().positive("Size must be greater than 0").optional(),
  description: z.string().trim().optional(),
  images: z
    .array(z.string())
    .min(1, "Add at least one photo")
    .max(5, "Up to 5 photos"),
})

export type FarmValues = z.infer<typeof farmSchema>

export const farmFormSchema = farmSchema.extend({
  sizeHectares: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (!Number.isNaN(Number(val)) && Number(val) > 0), {
      message: "Size must be greater than 0",
    }),
})

export type FarmFormValues = z.infer<typeof farmFormSchema>
