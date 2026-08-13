"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Crop, District, Farm } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "@phosphor-icons/react"
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
import { ProduceFormFields } from "./produce-form-fields"

function AddProduceDialog({
  crops,
  farms,
  defaultDistrict,
}: {
  crops: Crop[]
  farms: Farm[]
  defaultDistrict: District
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset,
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

  async function onSubmit(values: ListingFormValues) {
    try {
      await apiClient.post(API_ROUTES.listings, {
        ...values,
        quantity: Number(values.quantity),
        askingPrice: Number(values.askingPrice),
      })
      toast.success("Produce listed.")
      reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        Add produce
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List new produce</DialogTitle>
          <DialogDescription>
            Buyers will see this in the marketplace once it&apos;s listed.
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
              {isSubmitting ? "Listing..." : "Add produce"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AddProduceDialog }
