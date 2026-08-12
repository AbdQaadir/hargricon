import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import { listingSchema } from "@/lib/validations/listing"

export async function POST(request: Request) {
  const session = await auth.getSession()
  const user = session.data?.user

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    )
  }

  const body = await request.json()
  const parsed = listingSchema.safeParse(body)

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

  const {
    cropId,
    quantity,
    unit,
    condition,
    askingPrice,
    harvestDate,
    district,
    description,
  } = parsed.data

  const crop = await prisma.crop.findUnique({ where: { id: cropId } })

  if (!crop) {
    return NextResponse.json({ error: "Select a crop." }, { status: 400 })
  }

  const listing = await prisma.listing.create({
    data: {
      farmerId: profile.id,
      cropId,
      quantity,
      unit,
      condition,
      askingPrice,
      harvestDate: new Date(harvestDate),
      district,
      description: description || null,
    },
  })

  return NextResponse.json({ listing })
}
