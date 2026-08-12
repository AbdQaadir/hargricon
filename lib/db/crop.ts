import { prisma } from "@/lib/db/client"

export async function getCrops() {
  return prisma.crop.findMany({
    orderBy: { name: "asc" },
  })
}
