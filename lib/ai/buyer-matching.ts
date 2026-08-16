import type { ListingCondition } from "@prisma/client"

import { BUYER_CATEGORY_LABELS } from "@/constants/buyers"
import { getUnitLabel, type Unit } from "@/constants/produce"
import { prisma } from "@/lib/db/client"
import { generateStructured } from "@/lib/ai/gemini"

const MATCH_SCHEMA = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          buyerId: { type: "string" },
          reason: {
            type: "string",
            description: "One sentence on why this buyer is a good fit",
          },
        },
        required: ["buyerId", "reason"],
      },
      description: "Up to 5 best-fit buyers, ranked most relevant first",
    },
  },
  required: ["matches"],
} as const

export class NoBuyersError extends Error {
  constructor() {
    super("No buyer contacts available yet.")
    this.name = "NoBuyersError"
  }
}

export async function getBuyerMatches({
  cropName,
  quantity,
  unit,
  district,
  condition,
}: {
  cropName: string
  quantity: number
  unit: Unit
  district: string
  condition: ListingCondition
}) {
  const buyers = await prisma.buyer.findMany({ orderBy: { name: "asc" } })

  if (buyers.length === 0) {
    throw new NoBuyersError()
  }

  const buyerList = buyers
    .map((b) => `${b.id} | ${b.name} | ${BUYER_CATEGORY_LABELS[b.category]}`)
    .join("\n")

  const prompt = `You are matching a Rwandan smallholder farmer's produce listing to the most relevant buyer contacts from an outreach list.

Listing: ${quantity.toLocaleString()} ${getUnitLabel(unit)} of ${cropName}, condition: ${condition.toLowerCase().replace("_", " ")}, farmer's district: ${district}.

Buyer contacts (id | name | category) — none have recorded location or specific produce preferences, so judge fit from the organization's name and category (e.g. a coffee cooperative likely wants coffee, a supermarket or hotel likely wants general fresh produce in retail quantities, a wholesaler likely wants larger volumes):

${buyerList}

Pick up to 5 buyers from this exact list who are the best fit for this listing, ranked most relevant first. Only use the ids given above, never invent new ones — if fewer than 5 are a reasonable fit, return fewer. Give a one-sentence reason for each, in plain text, no markdown.`

  const parsed = await generateStructured<{
    matches: { buyerId: string; reason: string }[]
  }>({ prompt, schema: MATCH_SCHEMA })

  const buyerById = new Map(buyers.map((b) => [b.id, b]))

  return parsed.matches.flatMap((match) => {
    const buyer = buyerById.get(match.buyerId)
    return buyer ? [{ buyer, reason: match.reason }] : []
  })
}
