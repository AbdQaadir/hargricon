import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  MapPinIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react/ssr"

import { CONDITION_LABELS, STATUS_LABELS } from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"
import { getListingForFarmer } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { AvailabilityToggle } from "./availability-toggle"
import { ProduceTabs } from "./produce-tabs"

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
  const latestRecommendation = listing.priceRecommendations[0] ?? null
  // A recommendation priced for a unit the farmer has since changed away
  const recommendation =
    latestRecommendation?.unit === listing.unit ? latestRecommendation : null

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

        <div className="flex items-center gap-3">
          <AvailabilityToggle listingId={listing.id} status={listing.status} />
          <Link
            href={ROUTES.dashboardEditProduce(listing.id)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <PencilSimpleIcon data-icon="inline-start" />
            Edit
          </Link>
        </div>
      </div>

      <ProduceTabs
        listing={listing}
        initialRecommendation={recommendation}
        harvestDateLabel={harvestDateLabel}
      />
    </div>
  )
}
