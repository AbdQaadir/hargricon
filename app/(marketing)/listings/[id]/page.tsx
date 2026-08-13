import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr"

import {
  CONDITION_LABELS,
  getUnitLabel,
  STATUS_LABELS,
} from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"
import { getPublicListing } from "@/lib/db/listing"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
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
import { ImageGallery } from "@/components/image-gallery"

export const dynamic = "force-dynamic"

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getPublicListing(id)

  if (!listing) {
    notFound()
  }

  const districtLabel =
    DISTRICTS.find((d) => d.value === listing.district)?.label ??
    listing.district
  const farmerName = listing.farmer
    ? `${listing.farmer.firstName} ${listing.farmer.lastName ?? ""}`.trim()
    : "Farmer"
  const phoneDigits = listing.farmer?.phone.replace(/\D/g, "")
  const whatsappDigits = (
    listing.farmer?.whatsapp ?? listing.farmer?.phone
  )?.replace(/\D/g, "")
  const harvestDateLabel = listing.harvestDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href={ROUTES.listings}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon />
        Back to listings
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {listing.crop.name}
            </h1>
            <Badge variant="outline">
              {CONDITION_LABELS[listing.condition]}
            </Badge>
            {listing.status !== "AVAILABLE" && (
              <Badge variant="secondary">{STATUS_LABELS[listing.status]}</Badge>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPinIcon className="size-4" />
            {districtLabel}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="font-heading text-3xl font-bold text-primary">
            {listing.askingPrice.toLocaleString()} RWF
          </span>
          <span className="block text-sm text-muted-foreground">
            per {getUnitLabel(listing.unit)}
          </span>
        </div>
      </div>

      {listing.images.length > 0 && (
        <div className="mt-6">
          <ImageGallery images={listing.images} alt={listing.crop.name} />
        </div>
      )}

      <Card className="mt-8">
        <CardContent className="flex flex-col gap-5">
          {listing.description && (
            <p className="text-muted-foreground">{listing.description}</p>
          )}
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Available</dt>
              <dd className="font-medium">
                {listing.quantity.toLocaleString()} {getUnitLabel(listing.unit)}
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
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact the farmer</CardTitle>
          <CardDescription>
            Reach out directly to arrange pickup and payment. Hargricon
            doesn&apos;t take a cut or sit in the middle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{farmerName}</p>
          <p className="text-sm text-muted-foreground">{districtLabel}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          {phoneDigits && (
            <a
              href={`tel:${phoneDigits}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
            >
              <PhoneIcon data-icon="inline-start" />
              Call {listing.farmer?.phone}
            </a>
          )}
          {whatsappDigits && (
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              <WhatsappLogoIcon data-icon="inline-start" />
              WhatsApp
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
