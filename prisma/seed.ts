import { prisma } from "@/lib/db/client"

const demoFarmers = [
  {
    authUserId: "seed-farmer-1",
    email: "uwase.farm@example.com",
    firstName: "Aline",
    lastName: "Uwase",
    district: "MUSANZE" as const,
    phone: "+250788100001",
  },
  {
    authUserId: "seed-farmer-2",
    email: "kayonza.coop@example.com",
    firstName: "Eric",
    lastName: "Nshimiyimana",
    district: "KAYONZA" as const,
    phone: "+250788100002",
  },
  {
    authUserId: "seed-farmer-3",
    email: "huye.harvest@example.com",
    firstName: "Claudine",
    lastName: "Mukamana",
    district: "HUYE" as const,
    phone: "+250788100003",
  },
]

async function main() {
  for (const farmer of demoFarmers) {
    await prisma.profile.upsert({
      where: { authUserId: farmer.authUserId },
      update: {},
      create: farmer,
    })
  }

  console.log(`Seeded ${demoFarmers.length} demo farmer profiles.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
