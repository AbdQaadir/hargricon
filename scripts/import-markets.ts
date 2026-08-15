import { readFileSync } from "node:fs"

import { prisma } from "@/lib/db/client"
import type { District } from "@prisma/client"

type EsokoMarket = {
  id: number
  name: string
  district: string
  latitude: number | null
  longitude: number | null
}

async function main() {
  const path = process.argv[2] ?? "data/esoko-markets.json"
  const markets: EsokoMarket[] = JSON.parse(readFileSync(path, "utf-8"))

  let imported = 0
  let skipped = 0

  for (const market of markets) {
    const district = market.district?.toUpperCase() as District | undefined

    if (!district) {
      console.warn(
        `Skipping market "${market.name}" (id ${market.id}): no district`
      )
      skipped++
      continue
    }

    await prisma.market.upsert({
      where: { esokoId: market.id },
      update: {
        name: market.name,
        district,
        latitude: market.latitude,
        longitude: market.longitude,
      },
      create: {
        esokoId: market.id,
        name: market.name,
        district,
        latitude: market.latitude,
        longitude: market.longitude,
      },
    })
    imported++
  }

  console.log(`Imported ${imported} markets, skipped ${skipped}.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
