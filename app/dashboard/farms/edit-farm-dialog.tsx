"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Farm } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilSimpleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
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
import { FarmFormFields } from "./farm-form-fields"

function EditFarmDialog({ farm }: { farm: Farm }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormValues>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      name: farm.name,
      district: farm.district,
      sizeHectares: farm.sizeHectares != null ? String(farm.sizeHectares) : "",
      description: farm.description ?? "",
      images: farm.images,
    },
  })

  async function onSubmit(values: FarmFormValues) {
    try {
      await apiClient.patch(API_ROUTES.farm(farm.id), {
        ...values,
        sizeHectares: values.sizeHectares
          ? Number(values.sizeHectares)
          : undefined,
      })
      toast.success("Farm updated.")
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
          <DialogTitle>Edit farm</DialogTitle>
          <DialogDescription>
            Changes apply immediately to your farm details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FarmFormFields control={control} errors={errors} />

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

export { EditFarmDialog }
