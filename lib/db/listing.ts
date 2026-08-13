import type { District, Prisma } from "@prisma/client"

import type { ListingSort } from "@/constants/produce"
import { prisma } from "@/lib/db/client"

const SORT_ORDER_BY: Record<
  ListingSort,
  Prisma.ListingOrderByWithRelationInput
> = {
  newest: { createdAt: "desc" },
  price_asc: { askingPrice: "asc" },
  price_desc: { askingPrice: "desc" },
  harvest_soonest: { harvestDate: "asc" },
}

const farmerContactSelect = {
  firstName: true,
  lastName: true,
  phone: true,
  whatsapp: true,
  district: true,
} as const

export async function getListingsForFarmer(farmerId: string) {
  return prisma.listing.findMany({
    where: { farmerId },
    include: { crop: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getListingForFarmer(id: string, farmerId: string) {
  return prisma.listing.findFirst({
    where: { id, farmerId },
    include: { crop: true, farm: true },
  })
}

export async function getListingsForFarm(farmId: string, farmerId: string) {
  return prisma.listing.findMany({
    where: { farmId, farmerId },
    include: { crop: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getPublicListings({
  crop,
  district,
  sort = "newest",
}: {
  crop?: string
  district?: District
  sort?: ListingSort
} = {}) {
  return prisma.listing.findMany({
    where: {
      status: "AVAILABLE",
      ...(crop
        ? { crop: { name: { contains: crop, mode: "insensitive" } } }
        : {}),
      ...(district ? { district } : {}),
    },
    include: {
      crop: true,
      farmer: { select: farmerContactSelect },
    },
    orderBy: SORT_ORDER_BY[sort],
  })
}

export async function getPublicListing(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      crop: true,
      farmer: { select: farmerContactSelect },
    },
  })
}
