import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import { signUpSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = signUpSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    )
  }

  const { email, firstName, lastName, phone, district, password } = parsed.data

  const { data, error } = await auth.signUp.email({
    email,
    name: lastName ? `${firstName} ${lastName}` : firstName,
    password,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 400 }
    )
  }

  const userId = data?.user?.id

  if (userId) {
    try {
      await prisma.profile.upsert({
        where: { authUserId: userId },
        update: {
          firstName,
          lastName: lastName || null,
          phone,
          district,
        },
        create: {
          authUserId: userId,
          email,
          firstName,
          lastName: lastName || null,
          phone,
          district,
        },
      })
    } catch (dbError) {
      console.error("Failed to create profile during signup:", dbError)
    }
  }

  // signUp.email establishes a session, but farmers should land on the sign-in
  // page and sign in explicitly rather than being dropped straight into the app.
  await auth.signOut()

  return NextResponse.json({ success: true })
}
