import XLSX from "xlsx"

import { prisma } from "@/lib/db/client"
import type { BuyerCategory } from "@prisma/client"

// Source columns have a leading space on " NAMES" and free-text categories.
const CATEGORY_MAP: Record<string, BuyerCategory> = {
  "Farmers Cooperative": "FARMERS_COOPERATIVE",
  Wholesalers: "WHOLESALERS",
  Retailers: "RETAILERS",
  Supermarkets: "SUPERMARKETS",
  Buyers: "BUYERS",
}

type OutreachRow = {
  " NAMES": string | null
  CATEGORY: string | null
  EMAIL: string | null
  CONTACT: string | number | null
  WEBSITE: string | null
}

async function main() {
  const path = process.argv[2]
  if (!path) {
    console.error("Usage: tsx scripts/import-buyers.ts <path-to-xlsx>")
    process.exit(1)
  }

  const workbook = XLSX.readFile(path)
  const sheetName = workbook.SheetNames[0]
  const rows = XLSX.utils.sheet_to_json<OutreachRow>(
    workbook.Sheets[sheetName],
    {
      defval: null,
    }
  )

  let imported = 0
  let skipped = 0
  let skippedNoCategory = 0

  for (const row of rows) {
    const name = row[" NAMES"]?.trim()
    if (!name) {
      // Blank filler rows left over from an Excel column-fill artifact.
      skipped++
      continue
    }

    const rawCategory = row.CATEGORY?.trim()
    const category = rawCategory ? CATEGORY_MAP[rawCategory] : undefined
    if (!category) {
      console.warn(`Skipping "${name}": unrecognized category "${rawCategory}"`)
      skippedNoCategory++
      continue
    }

    const existing = await prisma.buyer.findFirst({ where: { name } })
    if (existing) {
      skipped++
      continue
    }

    await prisma.buyer.create({
      data: {
        name,
        category,
        email: row.EMAIL?.trim() || null,
        phone: row.CONTACT != null ? String(row.CONTACT).trim() : null,
        website: row.WEBSITE?.trim() || null,
      },
    })
    imported++
  }

  console.log(
    `Imported ${imported} buyers, skipped ${skipped} (blank/duplicate), skipped ${skippedNoCategory} (unrecognized category).`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
