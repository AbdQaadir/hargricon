import Link from "next/link"
import { BinocularsIcon, PlantIcon } from "@phosphor-icons/react/ssr"

import { STATUS_LABELS, UNIT_LABELS } from "@/constants/listings"
import { requireProfile } from "@/lib/db/profile"
import { getListings } from "@/lib/listings"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
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

export const dynamic = "force-dynamic"

export default async function ProducesPage() {
  const profile = await requireProfile()
  const listings = await getListings()
  const myListings = listings.filter(
    (listing) => listing.farmerAuthUserId === profile.authUserId
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight">
            Your produce
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage the produce you&apos;ve listed for sale.
          </p>
        </div>
        <Link
          href={ROUTES.listings}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <BinocularsIcon data-icon="inline-start" />
          Browse marketplace
        </Link>
      </div>

      {myListings.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PlantIcon />
            </EmptyMedia>
            <EmptyTitle>No produce listed yet</EmptyTitle>
            <EmptyDescription>
              Once you list produce for sale, it&apos;ll show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {myListings.map((listing) => (
            <Link key={listing.id} href={ROUTES.dashboardProduce(listing.id)}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{listing.cropName}</CardTitle>
                    <Badge
                      variant={
                        listing.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {STATUS_LABELS[listing.status]}
                    </Badge>
                  </div>
                  <CardDescription>
                    {listing.quantity.toLocaleString()}{" "}
                    {UNIT_LABELS[listing.unit]} at{" "}
                    {listing.pricePerUnit.toLocaleString()} RWF per{" "}
                    {UNIT_LABELS[listing.unit]}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
