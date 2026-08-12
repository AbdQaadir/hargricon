"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Crop, District } from "@prisma/client"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { DISTRICTS } from "@/lib/districts"
import {
  listingFormSchema,
  type ListingFormValues,
} from "@/lib/validations/listing"
import { CONDITION_LABELS, UNIT_LABELS } from "@/constants/produce"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

function AddProduceDialog({
  crops,
  defaultDistrict,
}: {
  crops: Crop[]
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
      quantity: "",
      unit: undefined,
      condition: undefined,
      askingPrice: "",
      harvestDate: "",
      district: defaultDistrict,
      description: "",
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
          <Controller
            control={control}
            name="cropId"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cropId">Crop</Label>
                <NativeSelect id="cropId" className="w-full" {...field}>
                  <NativeSelectOption value="">
                    Select a crop
                  </NativeSelectOption>
                  {crops.map((crop) => (
                    <NativeSelectOption key={crop.id} value={crop.id}>
                      {crop.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {errors.cropId && (
                  <p className="text-sm text-destructive">
                    {errors.cropId.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 500"
                    {...field}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-destructive">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <NativeSelect id="unit" className="w-full" {...field}>
                    <NativeSelectOption value="">
                      Select a unit
                    </NativeSelectOption>
                    {Object.entries(UNIT_LABELS).map(([value, label]) => (
                      <NativeSelectOption key={value} value={value}>
                        {label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {errors.unit && (
                    <p className="text-sm text-destructive">
                      {errors.unit.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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

            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="condition">Condition</Label>
                  <NativeSelect id="condition" className="w-full" {...field}>
                    <NativeSelectOption value="">
                      Select condition
                    </NativeSelectOption>
                    {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                      <NativeSelectOption key={value} value={value}>
                        {label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {errors.condition && (
                    <p className="text-sm text-destructive">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="harvestDate"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="harvestDate">Harvest date</Label>
                  <Input id="harvestDate" type="date" {...field} />
                  {errors.harvestDate && (
                    <p className="text-sm text-destructive">
                      {errors.harvestDate.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="district"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <NativeSelect id="district" className="w-full" {...field}>
                    {DISTRICTS.map(({ value, label }) => (
                      <NativeSelectOption key={value} value={value}>
                        {label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {errors.district && (
                    <p className="text-sm text-destructive">
                      {errors.district.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional notes for buyers, e.g. sorting, packaging, pickup."
                  {...field}
                />
              </div>
            )}
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
