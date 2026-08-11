import Link from "next/link"
import { MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react/ssr"

import { CONDITION_LABELS, UNIT_LABELS } from "@/constants/listings"
import { DISTRICTS } from "@/lib/districts"
import { getListings } from "@/lib/listings"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string; district?: string }>
}) {
  const { crop = "", district = "" } = await searchParams
  const listings = await getListings()

  const filtered = listings.filter((listing) => {
    if (listing.status !== "ACTIVE") return false
    if (crop && !listing.cropName.toLowerCase().includes(crop.toLowerCase())) {
      return false
    }
    if (district && listing.district !== district) return false
    return true
  })

  const hasFilters = Boolean(crop || district)

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

      <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          name="crop"
          defaultValue={crop}
          placeholder="Search by crop, e.g. maize"
          className="sm:max-w-xs"
        />
        <NativeSelect
          name="district"
          defaultValue={district}
          className="sm:max-w-52"
        >
          <NativeSelectOption value="">All districts</NativeSelectOption>
          {DISTRICTS.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <Button type="submit">
          <MagnifyingGlassIcon data-icon="inline-start" />
          Filter
        </Button>
        {hasFilters && (
          <Link
            href={ROUTES.listings}
            className={buttonVariants({ variant: "ghost" })}
          >
            Clear
          </Link>
        )}
      </form>

      {filtered.length === 0 ? (
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
          {filtered.map((listing) => {
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
                      <CardTitle>{listing.cropName}</CardTitle>
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
                      {listing.pricePerUnit.toLocaleString()} RWF{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / {UNIT_LABELS[listing.unit]}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {listing.quantity.toLocaleString()}{" "}
                      {UNIT_LABELS[listing.unit]} available
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
