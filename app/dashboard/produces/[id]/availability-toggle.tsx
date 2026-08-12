"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { ListingStatus } from "@prisma/client"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

function AvailabilityToggle({
  listingId,
  status,
}: {
  listingId: string
  status: ListingStatus
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [available, setAvailable] = useState(status === "AVAILABLE")

  async function handleChange(checked: boolean) {
    setAvailable(checked)
    try {
      await apiClient.patch(API_ROUTES.listingStatus(listingId), {
        status: checked ? "AVAILABLE" : "CANCELLED",
      })
      toast.success(checked ? "Marked as available." : "Marked as unavailable.")
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      setAvailable(!checked)
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="availability"
        checked={available}
        disabled={isPending}
        onCheckedChange={handleChange}
      />
      <Label htmlFor="availability" className="text-sm font-normal">
        {available ? "Available" : "Unavailable"}
      </Label>
    </div>
  )
}

export { AvailabilityToggle }
