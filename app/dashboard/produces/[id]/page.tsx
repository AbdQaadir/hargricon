import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, MapPinIcon } from "@phosphor-icons/react/ssr"

import {
  CONDITION_LABELS,
  STATUS_LABELS,
  UNIT_LABELS,
} from "@/constants/listings"
import { DISTRICTS } from "@/lib/districts"
import { requireProfile } from "@/lib/db/profile"
import { getListing } from "@/lib/listings"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function DashboardProducePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireProfile()
  const { id } = await params
  const listing = await getListing(id)

  if (!listing || listing.farmerAuthUserId !== profile.authUserId) {
    notFound()
  }

  const districtLabel =
    DISTRICTS.find((d) => d.value === listing.district)?.label ??
    listing.district
  const harvestDateLabel = new Date(listing.harvestDate).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  )

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
              {listing.cropName}
            </h1>
            <Badge variant="outline">
              {CONDITION_LABELS[listing.condition]}
            </Badge>
            <Badge
              variant={listing.status === "ACTIVE" ? "default" : "secondary"}
            >
              {STATUS_LABELS[listing.status]}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPinIcon className="size-4" />
            {districtLabel}
          </p>
        </div>

        <Link
          href={ROUTES.listing(listing.id)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View public listing
        </Link>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5">
          <p className="text-muted-foreground">{listing.description}</p>
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Available</dt>
              <dd className="font-medium">
                {listing.quantity.toLocaleString()} {UNIT_LABELS[listing.unit]}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-medium">
                {listing.pricePerUnit.toLocaleString()} RWF /{" "}
                {UNIT_LABELS[listing.unit]}
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
