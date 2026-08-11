import { BarnIcon, MapPinIcon } from "@phosphor-icons/react/ssr"

import { getFarms } from "@/lib/db/farm"
import { requireProfile } from "@/lib/db/profile"
import { DISTRICTS } from "@/lib/districts"
import {
  Card,
  CardContent,
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
import { AddFarmDialog } from "./add-farm-dialog"

export const dynamic = "force-dynamic"

export default async function FarmsPage() {
  const profile = await requireProfile()
  const farms = await getFarms(profile.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight">
            Your farms
          </h2>
          <p className="text-sm text-muted-foreground">
            Farms you manage produce from.
          </p>
        </div>
        <AddFarmDialog />
      </div>

      {farms.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarnIcon />
            </EmptyMedia>
            <EmptyTitle>No farms yet</EmptyTitle>
            <EmptyDescription>
              Add your first farm to start listing produce from it.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {farms.map((farm) => {
            const districtLabel =
              DISTRICTS.find((d) => d.value === farm.district)?.label ??
              farm.district

            return (
              <Card key={farm.id}>
                <CardHeader>
                  <CardTitle>{farm.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPinIcon className="size-3.5" />
                    {districtLabel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm">
                  {farm.sizeHectares != null && (
                    <span>{farm.sizeHectares.toLocaleString()} ha</span>
                  )}
                  {farm.description && (
                    <span className="text-muted-foreground">
                      {farm.description}
                    </span>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
