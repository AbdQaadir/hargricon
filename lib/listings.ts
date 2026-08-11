import type { Profile } from "@prisma/client"

import { DEMO_LISTINGS, type Listing } from "@/constants/listings"
import { prisma } from "@/lib/db/client"

export type ListingWithFarmer = Listing & {
  farmer: Pick<
    Profile,
    "firstName" | "lastName" | "phone" | "whatsapp" | "district"
  > | null
}

export async function getListings(): Promise<ListingWithFarmer[]> {
  const authUserIds = [
    ...new Set(DEMO_LISTINGS.map((listing) => listing.farmerAuthUserId)),
  ]

  const profiles = await prisma.profile.findMany({
    where: { authUserId: { in: authUserIds } },
    select: {
      authUserId: true,
      firstName: true,
      lastName: true,
      phone: true,
      whatsapp: true,
      district: true,
    },
  })

  const profileByAuthUserId = new Map(
    profiles.map((profile) => [profile.authUserId, profile])
  )

  return DEMO_LISTINGS.map((listing) => ({
    ...listing,
    farmer: profileByAuthUserId.get(listing.farmerAuthUserId) ?? null,
  }))
}

export async function getListing(
  id: string
): Promise<ListingWithFarmer | null> {
  const listings = await getListings()
  return listings.find((listing) => listing.id === id) ?? null
}
