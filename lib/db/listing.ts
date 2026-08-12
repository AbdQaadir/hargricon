import { prisma } from "@/lib/db/client"

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
