"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Crop, Farm, Listing } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilSimpleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import {
  listingFormSchema,
  type ListingFormValues,
} from "@/lib/validations/listing"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProduceFormFields } from "../produce-form-fields"

function EditProduceDialog({
  listing,
  crops,
  farms,
}: {
  listing: Listing
  crops: Crop[]
  farms: Farm[]
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
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
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <PencilSimpleIcon data-icon="inline-start" />
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit produce</DialogTitle>
          <DialogDescription>
            Changes apply immediately to your marketplace listing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <ProduceFormFields
            control={control}
            errors={errors}
            crops={crops}
            farms={farms}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { EditProduceDialog }
