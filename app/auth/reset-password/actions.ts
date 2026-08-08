"use server"

import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/server"
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth"

export async function resetPasswordWithToken(
  token: string,
  values: ResetPasswordValues
) {
  const parsed = resetPasswordSchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  if (!token) {
    return { error: "This reset link is invalid or has expired." }
  }

  const { error } = await auth.resetPassword({
    newPassword: parsed.data.newPassword,
    token,
  })

  if (error) {
    return {
      error: error.message || "This reset link is invalid or has expired.",
    }
  }

  redirect("/auth/sign-in")
}
