"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { DISTRICTS } from "@/lib/districts"
import { farmFormSchema, type FarmFormValues } from "@/lib/validations/farm"
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

function AddFarmDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormValues>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      name: "",
      district: undefined,
      sizeHectares: "",
      description: "",
    },
  })

  async function onSubmit(values: FarmFormValues) {
    try {
      await apiClient.post(API_ROUTES.farms, {
        ...values,
        sizeHectares: values.sizeHectares
          ? Number(values.sizeHectares)
          : undefined,
      })
      toast.success("Farm added.")
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
        Add farm
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a farm</DialogTitle>
          <DialogDescription>Farms you manage produce from.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Farm name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Uwase family farm"
                  {...field}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
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
                  <NativeSelectOption value="">
                    Select a district
                  </NativeSelectOption>
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

          <Controller
            control={control}
            name="sizeHectares"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sizeHectares">Size (hectares)</Label>
                <Input
                  id="sizeHectares"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 2.5"
                  {...field}
                />
                {errors.sizeHectares && (
                  <p className="text-sm text-destructive">
                    {errors.sizeHectares.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional notes about this farm."
                  {...field}
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add farm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AddFarmDialog }
