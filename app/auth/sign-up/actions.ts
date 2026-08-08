"use server"

import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth"

export async function signUpWithEmail(values: SignUpValues) {
  const parsed = signUpSchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const { email, firstName, lastName, phone, district, password } = parsed.data

  // Optionally restrict sign ups based on email address
  // if (!email.endsWith("@my-company.com")) {
  //  return { error: 'Email must be from my-company.com' };
  // }

  const { error } = await auth.signUp.email({
    email,
    name: lastName ? `${firstName} ${lastName}` : firstName,
    password,
  })

  if (error) {
    return { error: error.message || "Failed to create account" }
  }

  const session = await auth.getSession()
  const user = session.data?.user

  if (user) {
    await prisma.profile.create({
      data: {
        authUserId: user.id,
        email: user.email,
        firstName,
        lastName: lastName || null,
        phone,
        district,
      },
    })
  }

  redirect("/")
}
