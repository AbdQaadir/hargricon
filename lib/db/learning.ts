import { prisma } from "@/lib/db/client"

export async function getLearningThreads(farmerId: string) {
  return prisma.learningThread.findMany({
    where: { farmerId },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getLearningThread(id: string, farmerId: string) {
  return prisma.learningThread.findFirst({
    where: { id, farmerId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })
}
