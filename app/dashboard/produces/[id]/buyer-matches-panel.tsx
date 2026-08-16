"use client"

import { useState } from "react"
import type { Buyer, Listing } from "@prisma/client"
import { EnvelopeIcon, PhoneIcon, SparkleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { BUYER_CATEGORY_LABELS } from "@/constants/buyers"
import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Match = { buyer: Buyer; reason: string }

function BuyerMatchesPanel({ listing }: { listing: Listing }) {
  const [matches, setMatches] = useState<Match[] | null>(null)
  const [isFinding, setIsFinding] = useState(false)

  async function findMatches() {
    setIsFinding(true)
    try {
      const { data } = await apiClient.post<{ matches: Match[] }>(
        API_ROUTES.buyerMatches,
        { listingId: listing.id }
      )
      setMatches(data.matches)
      if (data.matches.length === 0) {
        toast.info("No strong buyer matches found for this listing yet.")
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't find buyer matches."))
    } finally {
      setIsFinding(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {!matches && (
        <p className="text-sm text-muted-foreground">
          Get AI-suggested contacts from our buyer outreach list who are likely
          interested in this produce, so you can reach out directly.
        </p>
      )}

      <Button
        type="button"
        size="sm"
        className="w-fit"
        disabled={isFinding}
        onClick={findMatches}
      >
        <SparkleIcon data-icon="inline-start" />
        {isFinding
          ? "Thinking..."
          : matches
            ? "Refresh matches"
            : "Find buyer matches"}
      </Button>

      {matches && matches.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {matches.map(({ buyer, reason }) => (
            <div
              key={buyer.id}
              className="flex flex-col gap-1.5 rounded-lg border border-primary/20 bg-background p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{buyer.name}</p>
                <Badge variant="secondary" className="shrink-0">
                  {BUYER_CATEGORY_LABELS[buyer.category]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{reason}</p>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                {buyer.email && (
                  <a
                    href={`mailto:${buyer.email}`}
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <EnvelopeIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{buyer.email}</span>
                  </a>
                )}
                {buyer.phone && (
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon className="size-3.5 shrink-0" />
                    {buyer.phone}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { BuyerMatchesPanel }
