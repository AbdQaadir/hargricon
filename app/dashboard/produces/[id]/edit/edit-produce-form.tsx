"use client"

import { useRouter } from "next/navigation"
import type { Crop, Farm, Listing } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { ROUTES } from "@/lib/routes"
import {
  listingFormSchema,
  type ListingFormValues,
} from "@/lib/validations/listing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProduceFormFields } from "../../produce-form-fields"

function EditProduceForm({
  listing,
  crops,
  farms,
}: {
  listing: Listing
  crops: Crop[]
  farms: Farm[]
}) {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      cropId: listing.cropId,
      farmId: listing.farmId ?? "",
      quantity: String(listing.quantity),
      unit: listing.unit as ListingFormValues["unit"],
      condition: listing.condition,
      askingPrice: String(listing.askingPrice),
      harvestDate: listing.harvestDate.toISOString().slice(0, 10),
      district: listing.district,
      description: listing.description ?? "",
      images: listing.images,
    },
  })

  async function onSubmit(values: ListingFormValues) {
    try {
      await apiClient.patch(API_ROUTES.listing(listing.id), {
        ...values,
        quantity: Number(values.quantity),
        askingPrice: Number(values.askingPrice),
      })
      toast.success("Produce updated.")
      router.push(ROUTES.dashboardProduce(listing.id))
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <ProduceFormFields
            control={control}
            errors={errors}
            crops={crops}
            farms={farms}
            setValue={setValue}
            listingId={listing.id}
          />

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.dashboardProduce(listing.id))}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { EditProduceForm }
