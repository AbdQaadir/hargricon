import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import { getBuyerMatches, NoBuyersError } from "@/lib/ai/buyer-matching"
import { buyerMatchSchema } from "@/lib/validations/ai"

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
  const parsed = buyerMatchSchema.safeParse(body)

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

  const listing = await prisma.listing.findFirst({
    where: { id: parsed.data.listingId, farmerId: profile.id },
    include: { crop: true },
  })

  if (!listing) {
    return NextResponse.json({ error: "Produce not found." }, { status: 404 })
  }

  try {
    const matches = await getBuyerMatches({
      cropName: listing.crop.name,
      quantity: listing.quantity,
      unit: listing.unit as Parameters<typeof getBuyerMatches>[0]["unit"],
      district: listing.district,
      condition: listing.condition,
    })
    return NextResponse.json({ matches })
  } catch (error) {
    if (error instanceof NoBuyersError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    console.error(error)
    return NextResponse.json(
      { error: "Couldn't find buyer matches right now." },
      { status: 502 }
    )
  }
}
