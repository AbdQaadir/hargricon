import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { signInSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = signInSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    )
  }

  const { error } = await auth.signIn.email(parsed.data)

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to sign in. Try again" },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
