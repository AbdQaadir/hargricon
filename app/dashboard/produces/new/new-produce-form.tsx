"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Crop, District, Farm } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import {
  listingFormSchema,
  type ListingFormValues,
} from "@/lib/validations/listing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProduceBasicFields } from "../produce-basic-fields"
import { ProducePriceFields } from "../produce-price-fields"

const STEP_1_FIELDS = [
  "images",
  "cropId",
  "farmId",
  "condition",
  "district",
  "quantity",
  "unit",
  "harvestDate",
  "description",
] as const

const STEPS = [
  { step: 1, label: "Details" },
  { step: 2, label: "Price" },
] as const

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      {STEPS.map(({ step: s, label }, index) => (
        <div key={s} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {step > s ? <CheckIcon className="size-3.5" /> : s}
            </div>
            <span
              className={cn(
                "text-sm",
                step === s
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
          {index < STEPS.length - 1 && <div className="h-px w-8 bg-border" />}
        </div>
      ))}
    </div>
  )
}

function NewProduceForm({
  crops,
  farms,
  defaultDistrict,
}: {
  crops: Crop[]
  farms: Farm[]
  defaultDistrict: District
}) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [priceRecommendationId, setPriceRecommendationId] = useState<
    string | undefined
  >()

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      cropId: "",
      farmId: "",
      quantity: "",
      unit: undefined,
      condition: undefined,
      askingPrice: "",
      harvestDate: "",
      district: defaultDistrict,
      description: "",
      images: [],
    },
  })

  async function goToPriceStep() {
    const valid = await trigger(STEP_1_FIELDS)
    if (valid) setStep(2)
  }

  async function onSubmit(values: ListingFormValues) {
    try {
      await apiClient.post(API_ROUTES.listings, {
        ...values,
        quantity: Number(values.quantity),
        askingPrice: Number(values.askingPrice),
        priceRecommendationId,
      })
      toast.success("Produce listed.")
      router.push(ROUTES.dashboardProduces)
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardContent>
        <StepIndicator step={step} />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {step === 1 && (
            <>
              <ProduceBasicFields
                control={control}
                errors={errors}
                crops={crops}
                farms={farms}
                setValue={setValue}
              />

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTES.dashboardProduces)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={goToPriceStep}>
                  Continue to price
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <ProducePriceFields
                control={control}
                errors={errors}
                setValue={setValue}
                autoSuggest
                onRecommendation={(rec) => setPriceRecommendationId(rec.id)}
              />

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Listing..." : "Add produce"}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export { NewProduceForm }
