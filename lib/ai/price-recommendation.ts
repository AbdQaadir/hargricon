import type { District, ListingCondition } from "@prisma/client"

import { getUnitLabel, type Unit } from "@/constants/produce"
import { prisma } from "@/lib/db/client"
import { GEMINI_MODEL, generateStructured } from "@/lib/ai/gemini"

const RECOMMENDATION_SCHEMA = {
  type: "object",
  properties: {
    recommendedPrice: {
      type: "number",
      description:
        "Recommended asking price, in the unit specified in the prompt",
    },
    rationale: {
      type: "string",
      description:
        "One or two sentence explanation grounded in the market data given",
    },
  },
  required: ["recommendedPrice", "rationale"],
} as const

export class NoMarketDataError extends Error {
  constructor() {
    super("No recent market price data available for this crop yet.")
    this.name = "NoMarketDataError"
  }
}

export async function getPriceRecommendation({
  cropId,
  district,
  condition,
  unit = "KG",
  listingId,
}: {
  cropId: string
  district: District
  condition: ListingCondition
  unit?: Unit
  listingId?: string
}) {
  const crop = await prisma.crop.findUniqueOrThrow({ where: { id: cropId } })

  let markets = await prisma.market.findMany({ where: { district } })
  let scope: "local" | "national" = "local"
  if (markets.length === 0) {
    markets = await prisma.market.findMany()
    scope = "national"
  }

  const prices = await prisma.marketPrice.findMany({
    where: { cropId, marketId: { in: markets.map((m) => m.id) } },
    include: { market: true },
    orderBy: { recordedDate: "desc" },
    take: 30,
  })

  if (prices.length === 0) {
    throw new NoMarketDataError()
  }

  const marketDataSummary = prices
    .map(
      (p) =>
        `${p.market.name} (${p.market.district}) — ${p.priceType} ${p.price} RWF/${p.unit} on ${p.recordedDate.toISOString().slice(0, 10)}`
    )
    .join("\n")

  const conditionNote =
    condition === "OVERRIPE_DISCOUNT"
      ? "The produce is overripe/discounted condition, so the recommendation should be below typical fresh pricing."
      : condition === "NEARLY_RIPE"
        ? "The produce is nearly ripe, needs to sell soon."
        : "The produce is fresh."

  const unitLabel = getUnitLabel(unit)
  const unitNote =
    unit === "KG"
      ? "Price per kg, matching the market data below directly."
      : `The farmer sells by the ${unitLabel}, not by the kg. The market data below is priced per kg — first estimate a typical weight (or count, for "piece") for one ${unitLabel} of ${crop.name} as commonly sold in Rwanda, convert the per-kg price using that estimate, and state the assumed conversion explicitly in your rationale (e.g. "assuming ~20kg per crate").`

  const prompt = `You are helping a smallholder farmer in Rwanda price their produce for sale.

Crop: ${crop.name}
Farmer's district: ${district}
${conditionNote}
${unitNote}
${scope === "national" ? "No markets recorded in this district — using national e-Soko data as a reference instead." : "Recent e-Soko market prices from markets in this district:"}

${marketDataSummary}

Recommend a single asking price in RWF per ${unitLabel} that is fair to the farmer and competitive for buyers, using only the data above. Briefly explain your reasoning in plain text only, no markdown formatting.`

  const parsed = await generateStructured<{
    recommendedPrice: number
    rationale: string
  }>({ prompt, schema: RECOMMENDATION_SCHEMA })

  const recommendation = await prisma.priceRecommendation.create({
    data: {
      cropId,
      listingId,
      district,
      unit,
      recommendedPrice: parsed.recommendedPrice,
      rationale: parsed.rationale,
      modelVersion: GEMINI_MODEL,
    },
  })

  return recommendation
}
