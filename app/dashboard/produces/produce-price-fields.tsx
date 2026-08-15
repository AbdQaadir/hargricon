"use client"

import { useEffect, useRef, useState } from "react"
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form"
import { SparkleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { getUnitLabel } from "@/constants/produce"
import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import type { ListingFormValues } from "@/lib/validations/listing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Recommendation = {
  id: string
  recommendedPrice: number
  rationale: string
  unit: string
}

function ProducePriceFields({
  control,
  errors,
  setValue,
  listingId,
  autoSuggest,
  onRecommendation,
  showAiPanel = true,
}: {
  control: Control<ListingFormValues>
  errors: FieldErrors<ListingFormValues>
  setValue: UseFormSetValue<ListingFormValues>
  listingId?: string
  autoSuggest?: boolean
  onRecommendation?: (recommendation: Recommendation) => void
  showAiPanel?: boolean
}) {
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [rationale, setRationale] = useState<string | null>(null)
  const hasAutoRun = useRef(false)
  const [cropId, district, condition, unit] = useWatch({
    control,
    name: ["cropId", "district", "condition", "unit"],
  })

  async function suggestPrice() {
    if (!cropId || !condition) {
      toast.error("Select a crop and condition first.")
      return
    }
    setIsSuggesting(true)
    setRationale(null)
    try {
      const { data } = await apiClient.post<{ recommendation: Recommendation }>(
        API_ROUTES.priceRecommendation,
        { cropId, district, condition, unit, listingId }
      )
      const { recommendation } = data
      // Keep the unit in sync with what the price was actually suggested
      setValue("unit", recommendation.unit as ListingFormValues["unit"], {
        shouldDirty: true,
      })
      setValue(
        "askingPrice",
        String(Math.round(recommendation.recommendedPrice)),
        {
          shouldDirty: true,
        }
      )
      setRationale(recommendation.rationale)
      onRecommendation?.(recommendation)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't suggest a price."))
    } finally {
      setIsSuggesting(false)
    }
  }

  useEffect(() => {
    if (autoSuggest && !hasAutoRun.current && cropId && condition) {
      hasAutoRun.current = true
      suggestPrice()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSuggest, cropId, condition])

  return (
    <>
      {showAiPanel && (
        <div className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <SparkleIcon className="text-primary" />
            <p className="text-sm font-medium">AI price suggestion</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Get a fair asking price grounded in recent e-Soko market data for
            this crop and district
            {unit ? `, priced per ${getUnitLabel(unit)}` : ""}. You can still
            set your own price below.
          </p>
          <Button
            type="button"
            size="sm"
            className="w-fit"
            disabled={isSuggesting}
            onClick={suggestPrice}
          >
            <SparkleIcon data-icon="inline-start" />
            {isSuggesting
              ? "Thinking..."
              : rationale
                ? "Suggest again"
                : "Suggest price"}
          </Button>
          {rationale && (
            <p className="text-xs text-muted-foreground">{rationale}</p>
          )}
        </div>
      )}

      <Controller
        control={control}
        name="askingPrice"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="askingPrice">Price (RWF/unit)</Label>
            <Input
              id="askingPrice"
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 350"
              {...field}
            />
            {errors.askingPrice && (
              <p className="text-sm text-destructive">
                {errors.askingPrice.message}
              </p>
            )}
          </div>
        )}
      />
    </>
  )
}

export { ProducePriceFields }
