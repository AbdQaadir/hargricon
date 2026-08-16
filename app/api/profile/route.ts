import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import { profileSchema } from "@/lib/validations/profile"

export async function GET() {
  const session = await auth.getSession()
  const user = session.data?.user

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    )
  }

  const profile = await prisma.profile.findUnique({
    where: { authUserId: user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 })
  }

  return NextResponse.json(profile)
}

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

  const { firstName, lastName, phone, whatsapp, district, bio } = parsed.data

  const updated = await prisma.profile.update({
    where: { authUserId: user.id },
    data: {
      firstName,
      lastName: lastName || null,
      phone,
      whatsapp: whatsapp || null,
      district,
      bio: bio || null,
    },
  })

  return NextResponse.json({ success: true, profile: updated })
}
