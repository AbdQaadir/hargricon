import { prisma } from "@/lib/db/client"

const crops = [
  { name: "Irish potato", category: "Tuber" },
  { name: "Sweet potato", category: "Tuber" },
  { name: "Cassava", category: "Tuber" },
  { name: "Maize", category: "Grain" },
  { name: "Rice", category: "Grain" },
  { name: "Beans", category: "Legume" },
  { name: "Groundnut", category: "Legume" },
  { name: "Tomato", category: "Vegetable" },
  { name: "Avocado", category: "Fruit" },
  { name: "Banana", category: "Fruit" },
]

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

  for (const crop of crops) {
    await prisma.crop.upsert({
      where: { name: crop.name },
      update: { category: crop.category },
      create: crop,
    })
  }

  console.log(`Seeded ${crops.length} crops.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
