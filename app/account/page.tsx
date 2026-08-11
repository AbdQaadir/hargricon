import Link from "next/link"
import { redirect } from "next/navigation"
import {
  BinocularsIcon,
  MapPinIcon,
  PencilSimpleIcon,
  PlantIcon,
} from "@phosphor-icons/react/ssr"

import { STATUS_LABELS, UNIT_LABELS } from "@/constants/listings"
import { getOrCreateProfile } from "@/lib/db/profile"
import { DISTRICTS } from "@/lib/districts"
import { getListings } from "@/lib/listings"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
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

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const profile = await getOrCreateProfile()

  if (!profile) {
    redirect("/auth/sign-in")
  }

  const listings = await getListings()
  const myListings = listings.filter(
    (listing) => listing.farmerAuthUserId === profile.authUserId
  )
  const districtLabel =
    DISTRICTS.find((d) => d.value === profile.district)?.label ??
    profile.district

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Welcome back, {profile.firstName}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
          <MapPinIcon className="size-4" />
          {districtLabel}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your contact info</CardTitle>
          <CardDescription>
            This is what buyers see and use to reach you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <span>{profile.phone}</span>
          {profile.whatsapp && (
            <span className="text-muted-foreground">
              WhatsApp: {profile.whatsapp}
            </span>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href={ROUTES.accountProfile}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <PencilSimpleIcon data-icon="inline-start" />
            Edit profile
          </Link>
        </CardFooter>
      </Card>

      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-bold tracking-tight">
            Your listings
          </h2>
          <Link
            href={ROUTES.listings}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <BinocularsIcon data-icon="inline-start" />
            Browse marketplace
          </Link>
        </div>

        {myListings.length === 0 ? (
          <Empty className="mt-4">
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
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myListings.map((listing) => (
              <Link key={listing.id} href={ROUTES.listing(listing.id)}>
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
    </div>
  )
}
