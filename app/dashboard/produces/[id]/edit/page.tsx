import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr"

import { getCrops } from "@/lib/db/crop"
import { getFarms } from "@/lib/db/farm"
import { getListingForFarmer } from "@/lib/db/listing"
import { requireProfile } from "@/lib/db/profile"
import { ROUTES } from "@/lib/routes"
import { EditProduceForm } from "./edit-produce-form"

export const dynamic = "force-dynamic"

export default async function EditProducePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireProfile()
  const { id } = await params
  const [listing, crops, farms] = await Promise.all([
    getListingForFarmer(id, profile.id),
    getCrops(),
    getFarms(profile.id),
  ])

  if (!listing) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={ROUTES.dashboardProduce(listing.id)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon />
        Back to produce
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Edit {listing.crop.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Changes apply immediately to your marketplace listing.
        </p>
      </div>

      <EditProduceForm listing={listing} crops={crops} farms={farms} />
    </div>
  )
}
