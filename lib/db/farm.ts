import { prisma } from "@/lib/db/client"

export async function getFarms(farmerId: string) {
  return prisma.farm.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getFarm(id: string, farmerId: string) {
  return prisma.farm.findFirst({
    where: { id, farmerId },
  })
}
