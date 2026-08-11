import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { ROUTES } from "@/lib/routes"
import { forgotPasswordSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = forgotPasswordSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    )
  }

  await auth.requestPasswordReset({
    email: parsed.data.email,
    redirectTo: ROUTES.resetPassword,
  })

  // Always report success, whether or not the email is registered,
  // so this endpoint cannot be used to check which emails have accounts.
  return NextResponse.json({ success: true })
}
