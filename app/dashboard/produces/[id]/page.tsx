import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, MapPinIcon } from "@phosphor-icons/react/ssr"

import {
  CONDITION_LABELS,
  getUnitLabel,
  STATUS_LABELS,
} from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"
import { getListingForFarmer } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function DashboardProducePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireProfile()
  const { id } = await params
  const listing = await getListingForFarmer(id, profile.id)

  if (!listing) {
    notFound()
  }

  const districtLabel =
    DISTRICTS.find((d) => d.value === listing.district)?.label ??
    listing.district
  const harvestDateLabel = listing.harvestDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={ROUTES.dashboardProduces}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon />
        Back to produce
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {listing.crop.name}
            </h1>
            <Badge variant="outline">
              {CONDITION_LABELS[listing.condition]}
            </Badge>
            <Badge
              variant={listing.status === "AVAILABLE" ? "default" : "secondary"}
            >
              {STATUS_LABELS[listing.status]}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPinIcon className="size-4" />
            {districtLabel}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5">
          {listing.description && (
            <p className="text-muted-foreground">{listing.description}</p>
          )}
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Available</dt>
              <dd className="font-medium">
                {listing.quantity.toLocaleString()} {getUnitLabel(listing.unit)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-medium">
                {listing.askingPrice.toLocaleString()} RWF /{" "}
                {getUnitLabel(listing.unit)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Harvested</dt>
              <dd className="font-medium">{harvestDateLabel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Condition</dt>
              <dd className="font-medium">
                {CONDITION_LABELS[listing.condition]}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
