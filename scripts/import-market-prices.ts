import XLSX from "xlsx"

import { prisma } from "@/lib/db/client"
import { COMMODITY_TO_CROP } from "@/lib/market-data/commodity-crop-map"
import type { MarketPriceType } from "@prisma/client"

// e-Soko doesn't include a unit column — its produce prices are consistently
// quoted per kg, so we default to that rather than leaving it blank.
const DEFAULT_UNIT = "kg"
const SOURCE = "esoko"

type EsokoPriceRow = {
  commodity_name_en: string | null
  market_name: string | null
  retail_average_price: number | null
  wholesale_average_price: number | null
  farmgate_average_price: number | null
  date: Date | null
}

const PRICE_FIELDS: { field: keyof EsokoPriceRow; type: MarketPriceType }[] = [
  { field: "retail_average_price", type: "RETAIL" },
  { field: "wholesale_average_price", type: "WHOLESALE" },
  { field: "farmgate_average_price", type: "FARMGATE" },
]

async function main() {
  const path = process.argv[2]
  if (!path) {
    console.error("Usage: tsx scripts/import-market-prices.ts <path-to-xlsx>")
    process.exit(1)
  }

  const workbook = XLSX.readFile(path, { cellDates: true })
  const sheetName = workbook.SheetNames[0]
  const rows = XLSX.utils.sheet_to_json<EsokoPriceRow>(
    workbook.Sheets[sheetName],
    {
      defval: null,
    }
  )

  const crops = await prisma.crop.findMany()
  const cropIdByName = new Map(crops.map((c) => [c.name, c.id]))

  const markets = await prisma.market.findMany()
  const marketsByName = new Map<string, { id: string }[]>()
  for (const market of markets) {
    const key = market.name.toLowerCase()
    const existing = marketsByName.get(key) ?? []
    existing.push({ id: market.id })
    marketsByName.set(key, existing)
  }

  let created = 0
  let skippedCrop = 0
  let skippedMarket = 0
  const unmappedCommodities = new Set<string>()

  for (const row of rows) {
    const cropName = row.commodity_name_en
      ? COMMODITY_TO_CROP[row.commodity_name_en]
      : undefined
    if (!cropName) {
      if (row.commodity_name_en) unmappedCommodities.add(row.commodity_name_en)
      skippedCrop++
      continue
    }
    const cropId = cropIdByName.get(cropName)
    if (!cropId) {
      skippedCrop++
      continue
    }

    const matchingMarkets = row.market_name
      ? marketsByName.get(row.market_name.toLowerCase())
      : undefined
    if (!matchingMarkets || matchingMarkets.length === 0) {
      skippedMarket++
      continue
    }

    if (!row.date) continue
    const recordedDate = new Date(
      Date.UTC(row.date.getFullYear(), row.date.getMonth(), row.date.getDate())
    )

    for (const market of matchingMarkets) {
      for (const { field, type } of PRICE_FIELDS) {
        const price = row[field]
        if (typeof price !== "number") continue

        await prisma.marketPrice.upsert({
          where: {
            cropId_marketId_priceType_source_recordedDate: {
              cropId,
              marketId: market.id,
              priceType: type,
              source: SOURCE,
              recordedDate,
            },
          },
          update: { price, unit: DEFAULT_UNIT },
          create: {
            cropId,
            marketId: market.id,
            priceType: type,
            price,
            unit: DEFAULT_UNIT,
            source: SOURCE,
            recordedDate,
          },
        })
        created++
      }
    }
  }

  console.log(`Upserted ${created} market price rows.`)
  console.log(`Skipped ${skippedCrop} rows (unmapped/unknown crop).`)
  console.log(`Skipped ${skippedMarket} rows (unmatched market name).`)
  if (unmappedCommodities.size > 0) {
    console.log(
      `Unmapped commodities encountered (${unmappedCommodities.size}):`,
      [...unmappedCommodities].sort().join(", ")
    )
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
