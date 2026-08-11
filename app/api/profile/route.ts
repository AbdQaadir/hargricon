import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import { profileSchema } from "@/lib/validations/profile"

export async function PATCH(request: Request) {
  const session = await auth.getSession()
  const user = session.data?.user

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    )
  }

  const body = await request.json()
  const parsed = profileSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    )
  }

  const { phone, district, bio } = parsed.data

  await prisma.profile.update({
    where: { authUserId: user.id },
    data: { phone, district, bio: bio || null },
  })

  return NextResponse.json({ success: true })
}
