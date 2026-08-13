import Link from "next/link"
import { MapPinIcon } from "@phosphor-icons/react/ssr"
import type { Farm } from "@prisma/client"

import { DISTRICTS } from "@/lib/districts"
import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { FarmThumbnail } from "@/components/farm-thumbnail"

function FarmCard({ farm }: { farm: Farm }) {
  const districtLabel =
    DISTRICTS.find((d) => d.value === farm.district)?.label ?? farm.district

  return (
    <Link href={ROUTES.dashboardFarm(farm.id)} className="block">
      <Card
        size="sm"
        className="h-full gap-3 overflow-hidden pt-0 transition-shadow hover:shadow-md"
      >
        <FarmThumbnail images={farm.images} alt={farm.name} />
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="truncate">{farm.name}</CardTitle>
            {farm.sizeHectares != null && (
              <Badge variant="secondary" className="shrink-0">
                {farm.sizeHectares.toLocaleString()} ha
              </Badge>
            )}
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="size-3.5" />
            {districtLabel}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export { FarmCard }
