import { prisma } from "@/lib/db/client"

export async function getBuyers() {
  return prisma.buyer.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })
}

export async function getBuyersByIds(ids: string[]) {
  return prisma.buyer.findMany({
    where: { id: { in: ids } },
  })
}
