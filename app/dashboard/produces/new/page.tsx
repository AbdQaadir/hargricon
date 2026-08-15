import Link from "next/link"
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr"

import { getCrops } from "@/lib/db/crop"
import { getFarms } from "@/lib/db/farm"
import { requireProfile } from "@/lib/db/profile"
import { ROUTES } from "@/lib/routes"
import { NewProduceForm } from "./new-produce-form"

export const dynamic = "force-dynamic"

export default async function NewProducePage() {
  const profile = await requireProfile()
  const [crops, farms] = await Promise.all([getCrops(), getFarms(profile.id)])

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={ROUTES.dashboardProduces}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon />
        Back to produce
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          List new produce
        </h1>
        <p className="text-sm text-muted-foreground">
          Buyers will see this in the marketplace once it&apos;s listed.
        </p>
      </div>

      <NewProduceForm
        crops={crops}
        farms={farms}
        defaultDistrict={profile.district}
      />
    </div>
  )
}
