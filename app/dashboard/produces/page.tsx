import Link from "next/link"
import { PlantIcon, PlusIcon } from "@phosphor-icons/react/ssr"

import {
  CONDITION_LABELS,
  getUnitLabel,
  STATUS_LABELS,
} from "@/constants/produce"
import { getListingsForFarmer } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { DISTRICTS } from "@/lib/districts"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProduceThumbnail } from "@/components/produce-thumbnail"

export const dynamic = "force-dynamic"

export default async function ProducesPage() {
  const profile = await requireProfile()
  const listings = await getListingsForFarmer(profile.id)

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
        <Link href={ROUTES.dashboardNewProduce} className={buttonVariants()}>
          <PlusIcon data-icon="inline-start" />
          Add produce
        </Link>
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
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {listings.map((listing) => (
              <Link key={listing.id} href={ROUTES.dashboardProduce(listing.id)}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <ProduceThumbnail
                    images={listing.images}
                    alt={listing.crop.name}
                  />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{listing.crop.name}</CardTitle>
                      <Badge
                        variant={
                          listing.status === "AVAILABLE"
                            ? "default"
                            : "secondary"
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

          <Card className="hidden py-0 lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produce</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Harvest date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => {
                  const districtLabel =
                    DISTRICTS.find((d) => d.value === listing.district)
                      ?.label ?? listing.district
                  const harvestDateLabel =
                    listing.harvestDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })

                  return (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <Link
                          href={ROUTES.dashboardProduce(listing.id)}
                          className="flex items-center gap-3"
                        >
                          <ProduceThumbnail
                            images={listing.images}
                            alt={listing.crop.name}
                            className="size-10 shrink-0 rounded-md object-cover"
                          />
                          <span className="font-medium">
                            {listing.crop.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {listing.quantity.toLocaleString()}{" "}
                        {getUnitLabel(listing.unit)}
                      </TableCell>
                      <TableCell>
                        {listing.askingPrice.toLocaleString()} RWF/
                        {getUnitLabel(listing.unit)}
                      </TableCell>
                      <TableCell>
                        {CONDITION_LABELS[listing.condition]}
                      </TableCell>
                      <TableCell>{districtLabel}</TableCell>
                      <TableCell>{harvestDateLabel}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            listing.status === "AVAILABLE"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {STATUS_LABELS[listing.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  )
}
