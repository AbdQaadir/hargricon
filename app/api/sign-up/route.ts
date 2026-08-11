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

  // Optionally restrict sign ups based on email address
  // if (!email.endsWith("@my-company.com")) {
  //  return NextResponse.json({ error: "Email must be from my-company.com" }, { status: 400 });
  // }

  const { error } = await auth.signUp.email({
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

  return NextResponse.json({ success: true })
}
