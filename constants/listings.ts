import type { District } from "@prisma/client"

export type Unit = "KG" | "TONNE" | "CRATE" | "SACK" | "BUNCH" | "PIECE"

export type ListingCondition = "FRESH" | "NEARLY_RIPE" | "OVERRIPE_DISCOUNT"

export type ListingStatus =
  "ACTIVE" | "PENDING" | "SOLD" | "EXPIRED" | "CANCELLED"

export type Listing = {
  id: string
  farmerAuthUserId: string
  cropName: string
  quantity: number
  unit: Unit
  condition: ListingCondition
  pricePerUnit: number
  district: District
  description: string
  status: ListingStatus
  harvestDate: string
}

export const UNIT_LABELS: Record<Unit, string> = {
  KG: "kg",
  TONNE: "tonne",
  CRATE: "crate",
  SACK: "sack",
  BUNCH: "bunch",
  PIECE: "piece",
}

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  FRESH: "Fresh",
  NEARLY_RIPE: "Nearly ripe",
  OVERRIPE_DISCOUNT: "Overripe, discounted",
}

export const STATUS_LABELS: Record<ListingStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SOLD: "Sold",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
}

export const DEMO_LISTINGS: Listing[] = [
  {
    id: "l1",
    farmerAuthUserId: "seed-farmer-1",
    cropName: "Irish potato",
    quantity: 800,
    unit: "KG",
    condition: "FRESH",
    pricePerUnit: 350,
    district: "MUSANZE",
    description:
      "Freshly harvested Irish potatoes, sorted by size. Ready for pickup this week.",
    status: "ACTIVE",
    harvestDate: "2026-08-04",
  },
  {
    id: "l2",
    farmerAuthUserId: "seed-farmer-1",
    cropName: "Maize",
    quantity: 1200,
    unit: "KG",
    condition: "FRESH",
    pricePerUnit: 280,
    district: "MUSANZE",
    description:
      "Dried maize, well stored, low moisture content. Good for milling.",
    status: "ACTIVE",
    harvestDate: "2026-07-28",
  },
  {
    id: "l3",
    farmerAuthUserId: "seed-farmer-1",
    cropName: "Beans",
    quantity: 15,
    unit: "SACK",
    condition: "FRESH",
    pricePerUnit: 32000,
    district: "MUSANZE",
    description: "Mixed beans, cleaned and sorted, packed in 50kg sacks.",
    status: "PENDING",
    harvestDate: "2026-07-15",
  },
  {
    id: "l4",
    farmerAuthUserId: "seed-farmer-2",
    cropName: "Rice",
    quantity: 40,
    unit: "SACK",
    condition: "FRESH",
    pricePerUnit: 45000,
    district: "KAYONZA",
    description:
      "Locally grown paddy rice from the Kayonza marshlands, milled and bagged.",
    status: "ACTIVE",
    harvestDate: "2026-08-01",
  },
  {
    id: "l5",
    farmerAuthUserId: "seed-farmer-2",
    cropName: "Groundnut",
    quantity: 600,
    unit: "KG",
    condition: "FRESH",
    pricePerUnit: 900,
    district: "KAYONZA",
    description: "Sun-dried groundnuts, shelled and ready for sale.",
    status: "ACTIVE",
    harvestDate: "2026-08-06",
  },
  {
    id: "l6",
    farmerAuthUserId: "seed-farmer-2",
    cropName: "Sweet potato",
    quantity: 500,
    unit: "KG",
    condition: "NEARLY_RIPE",
    pricePerUnit: 250,
    district: "KAYONZA",
    description: "Sweet potatoes, a few days from full ripeness.",
    status: "EXPIRED",
    harvestDate: "2026-07-10",
  },
  {
    id: "l7",
    farmerAuthUserId: "seed-farmer-3",
    cropName: "Tomato",
    quantity: 60,
    unit: "CRATE",
    condition: "FRESH",
    pricePerUnit: 12000,
    district: "HUYE",
    description:
      "Fresh tomatoes, harvested this morning, crated for transport.",
    status: "ACTIVE",
    harvestDate: "2026-08-09",
  },
  {
    id: "l8",
    farmerAuthUserId: "seed-farmer-3",
    cropName: "Avocado",
    quantity: 300,
    unit: "KG",
    condition: "FRESH",
    pricePerUnit: 600,
    district: "HUYE",
    description: "Hass and local avocado varieties, hand-picked.",
    status: "ACTIVE",
    harvestDate: "2026-08-05",
  },
  {
    id: "l9",
    farmerAuthUserId: "seed-farmer-3",
    cropName: "Banana",
    quantity: 200,
    unit: "BUNCH",
    condition: "OVERRIPE_DISCOUNT",
    pricePerUnit: 1500,
    district: "HUYE",
    description:
      "Ripe bananas priced to move quickly, still good for cooking or juice.",
    status: "ACTIVE",
    harvestDate: "2026-07-30",
  },
  {
    id: "l10",
    farmerAuthUserId: "seed-farmer-3",
    cropName: "Cassava",
    quantity: 900,
    unit: "KG",
    condition: "FRESH",
    pricePerUnit: 180,
    district: "HUYE",
    description: "Freshly uprooted cassava, available for bulk buyers.",
    status: "SOLD",
    harvestDate: "2026-07-20",
  },
]
