import { z } from "zod"

import { DISTRICTS } from "@/lib/districts"

const districtValues = DISTRICTS.map((d) => d.value) as [
  (typeof DISTRICTS)[number]["value"],
  ...(typeof DISTRICTS)[number]["value"][],
]

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().optional(),
  phone: z.string().trim().min(1, "Phone number is required"),
  whatsapp: z.string().trim().optional(),
  district: z.enum(districtValues, {
    message: "Select your district",
  }),
  bio: z.string().trim().optional(),
})

export type ProfileValues = z.infer<typeof profileSchema>
