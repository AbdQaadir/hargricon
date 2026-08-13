import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, PlantIcon } from "@phosphor-icons/react/ssr"

import { STATUS_LABELS, getUnitLabel } from "@/constants/produce"
import { getFarm } from "@/lib/db/farm"
import { getListingsForFarm } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { DISTRICTS } from "@/lib/districts"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FarmImageCarousel } from "@/components/farm-image-carousel"
import { ProduceThumbnail } from "@/components/produce-thumbnail"
import { EditFarmDialog } from "../edit-farm-dialog"

export const dynamic = "force-dynamic"

export default async function DashboardFarmPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireProfile()
  const { id } = await params
  const [farm, listings] = await Promise.all([
    getFarm(id, profile.id),
    getListingsForFarm(id, profile.id),
  ])

  if (!farm) {
    notFound()
  }

  const districtLabel =
    DISTRICTS.find((d) => d.value === farm.district)?.label ?? farm.district
  const addedLabel = farm.createdAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={ROUTES.dashboardFarms}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon />
        Back to farms
      </Link>

      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {farm.name}
        </h1>
        <EditFarmDialog farm={farm} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FarmImageCarousel images={farm.images} alt={farm.name} />

        <Card>
          <CardContent className="flex flex-col gap-5">
            {farm.description && (
              <p className="text-muted-foreground">{farm.description}</p>
            )}
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium">{districtLabel}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Size</dt>
                <dd className="font-medium">
                  {farm.sizeHectares != null
                    ? `${farm.sizeHectares.toLocaleString()} ha`
                    : "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Added</dt>
                <dd className="font-medium">{addedLabel}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Produce from this farm
        </h2>

        {listings.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PlantIcon />
              </EmptyMedia>
              <EmptyTitle>No produce listed from this farm yet</EmptyTitle>
              <EmptyDescription>
                Produce you list from this farm will show up here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link key={listing.id} href={ROUTES.dashboardProduce(listing.id)}>
                <Card
                  size="sm"
                  className="h-full gap-3 overflow-hidden pt-0 transition-shadow hover:shadow-md"
                >
                  <ProduceThumbnail
                    images={listing.images}
                    alt={listing.crop.name}
                    className="h-32"
                  />
                  <CardContent className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="truncate">
                        {listing.crop.name}
                      </CardTitle>
                      <Badge
                        variant={
                          listing.status === "AVAILABLE"
                            ? "default"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        {STATUS_LABELS[listing.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {listing.quantity.toLocaleString()}{" "}
                      {getUnitLabel(listing.unit)} ·{" "}
                      {listing.askingPrice.toLocaleString()} RWF
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
