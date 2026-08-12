import Link from "next/link"
import { PlantIcon } from "@phosphor-icons/react/ssr"

import {
  CONDITION_LABELS,
  getUnitLabel,
  STATUS_LABELS,
} from "@/constants/produce"
import { getCrops } from "@/lib/db/crop"
import { getListingsForFarmer } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
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
import { AddProduceDialog } from "./add-produce-dialog"

export const dynamic = "force-dynamic"

export default async function ProducesPage() {
  const profile = await requireProfile()
  const [listings, crops] = await Promise.all([
    getListingsForFarmer(profile.id),
    getCrops(),
  ])

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
        <AddProduceDialog crops={crops} defaultDistrict={profile.district} />
      </div>

      {listings.length === 0 ? (
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
          {listings.map((listing) => (
            <Link key={listing.id} href={ROUTES.dashboardProduce(listing.id)}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{listing.crop.name}</CardTitle>
                    <Badge
                      variant={
                        listing.status === "AVAILABLE" ? "default" : "secondary"
                      }
                    >
                      {STATUS_LABELS[listing.status]}
                    </Badge>
                  </div>
                  <CardDescription>
                    {listing.quantity.toLocaleString()}{" "}
                    {getUnitLabel(listing.unit)} at{" "}
                    {listing.askingPrice.toLocaleString()} RWF per{" "}
                    {getUnitLabel(listing.unit)} ·{" "}
                    {CONDITION_LABELS[listing.condition]}
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
