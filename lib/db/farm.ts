import { prisma } from "@/lib/db/client"

export async function getFarms(farmerId: string) {
  return prisma.farm.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" },
  })
}
