import type { BuyerCategory } from "@prisma/client"

export const BUYER_CATEGORY_LABELS: Record<BuyerCategory, string> = {
  FARMERS_COOPERATIVE: "Farmers cooperative",
  WHOLESALERS: "Wholesaler",
  RETAILERS: "Retailer",
  SUPERMARKETS: "Supermarket",
  BUYERS: "Buyer",
}
