"use server"

import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/server"
import { signInSchema, type SignInValues } from "@/lib/validations/auth"

export async function signInWithEmail(values: SignInValues) {
  const parsed = signInSchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const { error } = await auth.signIn.email(parsed.data)

  if (error) {
    return { error: error.message || "Failed to sign in. Try again" }
  }

  redirect("/")
}
