import Link from "next/link"
import { MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react/ssr"
import type { District } from "@prisma/client"

import {
  CONDITION_LABELS,
  getUnitLabel,
  type ListingSort,
} from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"
import { getPublicListings } from "@/lib/db/listing"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ProduceFilters } from "./produce-filters"

export const dynamic = "force-dynamic"

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string; district?: string; sort?: string }>
}) {
  const { crop = "", district = "", sort = "" } = await searchParams
  const listings = await getPublicListings({
    crop: crop || undefined,
    district: (district as District) || undefined,
    sort: (sort as ListingSort) || undefined,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Browse produce
        </h1>
        <p className="text-muted-foreground">
          Fresh produce listed by farmers across Rwanda. Reach out directly, no
          account needed.
        </p>
      </div>

      <ProduceFilters />

      {listings.length === 0 ? (
        <Empty className="mt-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MagnifyingGlassIcon />
            </EmptyMedia>
            <EmptyTitle>No produce found</EmptyTitle>
            <EmptyDescription>
              Try a different crop or district, or check back soon as farmers
              list more produce.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const districtLabel =
              DISTRICTS.find((d) => d.value === listing.district)?.label ??
              listing.district
            const farmerName = listing.farmer
              ? `${listing.farmer.firstName} ${listing.farmer.lastName ?? ""}`.trim()
              : "Farmer"

            return (
              <Link key={listing.id} href={ROUTES.listing(listing.id)}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{listing.crop.name}</CardTitle>
                      <Badge variant="outline">
                        {CONDITION_LABELS[listing.condition]}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPinIcon className="size-3.5" />
                      {districtLabel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1">
                    <span className="font-heading text-2xl font-bold text-primary">
                      {listing.askingPrice.toLocaleString()} RWF{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / {getUnitLabel(listing.unit)}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {listing.quantity.toLocaleString()}{" "}
                      {getUnitLabel(listing.unit)} available
                    </span>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm text-muted-foreground">
                      {farmerName}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
