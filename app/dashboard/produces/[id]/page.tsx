import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  MapPinIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react/ssr"

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
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageGallery } from "@/components/image-gallery"
import { AvailabilityToggle } from "./availability-toggle"
import { PriceRecommendationPanel } from "./price-recommendation-panel"

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

      <PriceRecommendationPanel
        listing={listing}
        initialRecommendation={recommendation}
      />

      <ImageGallery images={listing.images} alt={listing.crop.name} />

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
            {listing.farm && (
              <div>
                <dt className="text-muted-foreground">Farm</dt>
                <dd className="font-medium">{listing.farm.name}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
