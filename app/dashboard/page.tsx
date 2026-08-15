import Link from "next/link"
import {
  BarnIcon,
  MapPinIcon,
  PencilSimpleIcon,
  PlantIcon,
  SparkleIcon,
} from "@phosphor-icons/react/ssr"

import { getFarms } from "@/lib/db/farm"
import { getListingsForFarmer } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { DISTRICTS } from "@/lib/districts"
import { ROUTES } from "@/lib/routes"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function DashboardOverviewPage() {
  const profile = await requireProfile()

  const [farms, listings] = await Promise.all([
    getFarms(profile.id),
    getListingsForFarmer(profile.id),
  ])
  const activeListings = listings.filter(
    (listing) => listing.status === "AVAILABLE"
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

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <SparkleIcon className="mt-0.5 size-6 shrink-0 text-primary" />
            <div>
              <p className="font-medium">
                AI-powered tools, built for your farm
              </p>
              <p className="text-sm text-muted-foreground">
                Get fair asking-price suggestions grounded in real e-Soko market
                data when you list produce, and ask farming questions anytime.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.dashboardLearning}
            className={buttonVariants({ size: "sm", className: "shrink-0" })}
          >
            <SparkleIcon data-icon="inline-start" />
            Ask AI a question
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Farms</CardDescription>
            <CardTitle className="text-3xl">{farms.length}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Link
              href={ROUTES.dashboardFarms}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <BarnIcon data-icon="inline-start" />
              Manage farms
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active produce</CardDescription>
            <CardTitle className="text-3xl">{activeListings.length}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Link
              href={ROUTES.dashboardProduces}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <PlantIcon data-icon="inline-start" />
              View produce
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total listings</CardDescription>
            <CardTitle className="text-3xl">{listings.length}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Link
              href={ROUTES.listings}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Browse marketplace
            </Link>
          </CardFooter>
        </Card>
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
            href={ROUTES.dashboardProfile}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <PencilSimpleIcon data-icon="inline-start" />
            Edit profile
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
