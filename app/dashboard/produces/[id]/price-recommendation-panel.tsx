"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Listing } from "@prisma/client"
import { SparkleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { getUnitLabel } from "@/constants/produce"
import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Recommendation = {
  id: string
  recommendedPrice: number
  rationale: string
  unit: string
  generatedAt: string | Date
}

function PriceRecommendationPanel({
  listing,
  initialRecommendation,
}: {
  listing: Listing
  initialRecommendation: Recommendation | null
}) {
  const router = useRouter()
  const [recommendation, setRecommendation] = useState(initialRecommendation)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  async function getSuggestion() {
    setIsSuggesting(true)
    try {
      const { data } = await apiClient.post<{ recommendation: Recommendation }>(
        API_ROUTES.priceRecommendation,
        {
          cropId: listing.cropId,
          district: listing.district,
          condition: listing.condition,
          unit: listing.unit,
          listingId: listing.id,
        }
      )
      setRecommendation(data.recommendation)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't get a price suggestion."))
    } finally {
      setIsSuggesting(false)
    }
  }

  async function applyPrice() {
    if (!recommendation) return
    setIsApplying(true)
    try {
      await apiClient.patch(API_ROUTES.listing(listing.id), {
        cropId: listing.cropId,
        farmId: listing.farmId ?? undefined,
        quantity: listing.quantity,
        unit: listing.unit,
        condition: listing.condition,
        askingPrice: Math.round(recommendation.recommendedPrice),
        harvestDate: listing.harvestDate.toISOString().slice(0, 10),
        district: listing.district,
        description: listing.description ?? undefined,
        images: listing.images,
      })
      toast.success("Listing price updated.")
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't update the price."))
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <SparkleIcon className="size-5 text-primary" />
          <p className="font-medium">AI Price Assistant</p>
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary"
          >
            Powered by Gemini
          </Badge>
        </div>

        {recommendation ? (
          <>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
              <span>
                Suggested:{" "}
                <span className="font-medium">
                  {recommendation.recommendedPrice.toLocaleString()} RWF/
                  {getUnitLabel(recommendation.unit)}
                </span>
              </span>
              <span className="text-muted-foreground">
                You&apos;re asking {listing.askingPrice.toLocaleString()} RWF/
                {getUnitLabel(listing.unit)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {recommendation.rationale}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isApplying}
                onClick={applyPrice}
              >
                {isApplying ? "Updating..." : "Apply this price"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isSuggesting}
                onClick={getSuggestion}
              >
                <SparkleIcon data-icon="inline-start" />
                {isSuggesting ? "Thinking..." : "Refresh suggestion"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Not sure your price is competitive? Get a fair asking price
              grounded in recent e-Soko market data for this crop and district,
              priced per {getUnitLabel(listing.unit)}.
            </p>
            <Button
              type="button"
              size="sm"
              className="w-fit"
              disabled={isSuggesting}
              onClick={getSuggestion}
            >
              <SparkleIcon data-icon="inline-start" />
              {isSuggesting ? "Thinking..." : "Get AI suggestion"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export { PriceRecommendationPanel }
