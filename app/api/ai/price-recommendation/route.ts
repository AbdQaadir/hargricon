import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import {
  getPriceRecommendation,
  NoMarketDataError,
} from "@/lib/ai/price-recommendation"
import { priceRecommendationSchema } from "@/lib/validations/ai"

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
  const parsed = priceRecommendationSchema.safeParse(body)

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

  const { cropId, district, condition, unit, listingId } = parsed.data

  if (listingId) {
    const listing = await prisma.listing.findFirst({
      where: { id: listingId, farmerId: profile.id },
    })
    if (!listing) {
      return NextResponse.json({ error: "Produce not found." }, { status: 404 })
    }
  }

  try {
    const recommendation = await getPriceRecommendation({
      cropId,
      district,
      condition,
      unit,
      listingId,
    })
    return NextResponse.json({ recommendation })
  } catch (error) {
    if (error instanceof NoMarketDataError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    console.error(error)
    return NextResponse.json(
      { error: "Couldn't generate a price recommendation right now." },
      { status: 502 }
    )
  }
}
