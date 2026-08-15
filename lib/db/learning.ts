import { prisma } from "@/lib/db/client"

export async function getLearningEntries(farmerId: string) {
  return prisma.learningEntry.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" },
  })
}
