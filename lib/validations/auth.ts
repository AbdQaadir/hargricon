import { z } from "zod"

import { DISTRICTS } from "@/lib/districts"

const districtValues = DISTRICTS.map((d) => d.value) as [
  (typeof DISTRICTS)[number]["value"],
  ...(typeof DISTRICTS)[number]["value"][],
]

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().min(1, "Phone number is required"),
  district: z.enum(districtValues, {
    message: "Select your district",
  }),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type SignInValues = z.infer<typeof signInSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
