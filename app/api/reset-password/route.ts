import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { resetPasswordRequestSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = resetPasswordRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    )
  }

  const { error } = await auth.resetPassword({
    newPassword: parsed.data.newPassword,
    token: parsed.data.token,
  })

  if (error) {
    return NextResponse.json(
      {
        error: error.message || "This reset link is invalid or has expired.",
      },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
