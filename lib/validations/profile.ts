import { z } from "zod"

import { DISTRICTS } from "@/lib/districts"

const districtValues = DISTRICTS.map((d) => d.value) as [
  (typeof DISTRICTS)[number]["value"],
  ...(typeof DISTRICTS)[number]["value"][],
]

export const profileSchema = z.object({
  phone: z.string().trim().min(1, "Phone number is required"),
  district: z.enum(districtValues, {
    message: "Select your district",
  }),
  bio: z.string().trim().optional(),
})

export type ProfileValues = z.infer<typeof profileSchema>
