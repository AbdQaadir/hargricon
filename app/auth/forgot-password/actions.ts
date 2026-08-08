"use server"

import { auth } from "@/lib/auth/server"
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations/auth"

export async function requestPasswordReset(values: ForgotPasswordValues) {
  const parsed = forgotPasswordSchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  await auth.requestPasswordReset({
    email: parsed.data.email,
    redirectTo: "/auth/reset-password",
  })

  return { success: true }
}
