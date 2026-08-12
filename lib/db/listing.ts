import type { District } from "@prisma/client"

import { prisma } from "@/lib/db/client"

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
    include: { crop: true },
  })
}

export async function getPublicListings({
  crop,
  district,
}: {
  crop?: string
  district?: District
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
    orderBy: { createdAt: "desc" },
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
