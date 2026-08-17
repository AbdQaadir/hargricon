import Link from "next/link"
import {
  BarnIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  SparkleIcon,
  StorefrontIcon,
  TagIcon,
  UserCheckIcon,
} from "@phosphor-icons/react/ssr"

import { getFarms } from "@/lib/db/farm"
import { getListingsForFarmer } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { DISTRICTS } from "@/lib/districts"
import { ROUTES } from "@/lib/routes"
import {
  CONDITION_LABELS,
  STATUS_LABELS,
  getUnitLabel,
} from "@/constants/produce"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function DashboardOverviewPage() {
  const profile = await requireProfile()

  const [farms, listings] = await Promise.all([
    getFarms(profile.id),
    getListingsForFarmer(profile.id),
  ])

  const activeListings = listings.filter((l) => l.status === "AVAILABLE")
  const reservedListings = listings.filter((l) => l.status === "RESERVED")
  const districtLabel =
    DISTRICTS.find((d) => d.value === profile.district)?.label ??
    profile.district

  return (
    <div className="flex h-full flex-1 flex-col justify-between gap-5 overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Welcome, {profile.firstName}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="size-3.5" />
            {districtLabel} District
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.dashboardNewProduce}
            className={buttonVariants({ size: "sm" })}
          >
            <PlusIcon className="size-4" />
            List Produce
          </Link>
          <Link
            href={ROUTES.dashboardFarms}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <BarnIcon className="size-4" />
            Add Farm
          </Link>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Produce</span>
            <StorefrontIcon className="size-4" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-heading text-2xl font-bold text-foreground">
              {activeListings.length}
            </span>
            <span className="text-xs text-muted-foreground">
              Batches for sale
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Registered Farms</span>
            <BarnIcon className="size-4" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-heading text-2xl font-bold text-foreground">
              {farms.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {farms.length === 1 ? "Farm unit" : "Farm units"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Pending Offers</span>
            <ClockIcon className="size-4" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-heading text-2xl font-bold text-foreground">
              {reservedListings.length}
            </span>
            <span className="text-xs text-muted-foreground">Reserved</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">AI Pricing</span>
            <SparkleIcon className="size-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-heading text-base font-bold text-foreground">
              e-Soko Sync
            </span>
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xs lg:col-span-7">
          <div className="flex shrink-0 items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground">
                Produce Inventory
              </h2>
              <p className="text-xs text-muted-foreground">
                Recent harvests listed for buyer matching
              </p>
            </div>
            <Link
              href={ROUTES.dashboardProduces}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all ({listings.length})
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pt-3">
            {listings.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2.5 py-8 text-center">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                  <TagIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No produce listed yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    List your harvest to receive AI price suggestions.
                  </p>
                </div>
                <Link
                  href={ROUTES.dashboardNewProduce}
                  className={buttonVariants({ size: "sm", className: "mt-1" })}
                >
                  <PlusIcon className="size-4" />
                  List Produce
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {listings.slice(0, 5).map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-xs transition-colors hover:bg-muted/30"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-heading font-bold text-foreground">
                        {listing.crop.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-heading text-sm font-bold text-foreground">
                            {listing.crop.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            {CONDITION_LABELS[listing.condition]}
                          </Badge>
                        </div>
                        <p className="truncate text-muted-foreground">
                          {listing.quantity} {getUnitLabel(listing.unit)} •
                          Harvest:{" "}
                          {new Date(listing.harvestDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <span className="font-heading text-sm font-bold text-foreground">
                          RWF {listing.askingPrice.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          per {getUnitLabel(listing.unit)}
                        </p>
                      </div>

                      <Badge
                        variant={
                          listing.status === "AVAILABLE"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[11px]"
                      >
                        {STATUS_LABELS[listing.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden lg:col-span-5">
          <div className="flex shrink-0 flex-col rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-foreground">
              <SparkleIcon className="size-4 text-primary" />
              Gemini Market Intelligence
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Get price recommendation benchmarks grounded in e-Soko market data
              for your district.
            </p>
            <div className="mt-3">
              <Link
                href={ROUTES.dashboardLearning}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "w-full text-xs font-medium",
                })}
              >
                <SparkleIcon className="size-3.5" />
                Ask AI Assistant
              </Link>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <UserCheckIcon className="size-4 text-muted-foreground" />
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    Farmer Contact Details
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Verified
                </Badge>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Phone:</span>
                  <span className="font-mono text-foreground">
                    {profile.phone || "Not set"}
                  </span>
                </div>
                {profile.whatsapp && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>WhatsApp:</span>
                    <span className="font-mono text-foreground">
                      {profile.whatsapp}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>District:</span>
                  <span className="text-foreground">{districtLabel}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
              <span className="text-[11px] text-muted-foreground">
                Visible to registered buyers
              </span>
              <Link
                href={ROUTES.dashboardProfile}
                className="text-xs font-medium text-primary hover:underline"
              >
                Edit Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
