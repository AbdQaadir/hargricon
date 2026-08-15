import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"

const patchSchema = z.object({
  liked: z.boolean(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.getSession()
  const user = session.data?.user

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    )
  }

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    )
  }

  const profile = await prisma.profile.findUnique({
    where: { authUserId: user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 })
  }

  const { id } = await params
  const existing = await prisma.learningEntry.findFirst({
    where: { id, farmerId: profile.id },
  })

  if (!existing) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 })
  }

  const entry = await prisma.learningEntry.update({
    where: { id },
    data: { liked: parsed.data.liked },
  })

  return NextResponse.json({ entry })
}
