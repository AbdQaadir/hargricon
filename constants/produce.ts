import type { ListingCondition, ListingStatus } from "@prisma/client"

export type Unit = "KG" | "TONNE" | "CRATE" | "SACK" | "BUNCH" | "PIECE"

export const UNIT_LABELS: Record<Unit, string> = {
  KG: "kg",
  TONNE: "tonne",
  CRATE: "crate",
  SACK: "sack",
  BUNCH: "bunch",
  PIECE: "piece",
}

export function getUnitLabel(unit: string) {
  return UNIT_LABELS[unit as Unit] ?? unit
}

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  FRESH: "Fresh",
  NEARLY_RIPE: "Nearly ripe",
  OVERRIPE_DISCOUNT: "Overripe, discounted",
}

export const STATUS_LABELS: Record<ListingStatus, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
}
