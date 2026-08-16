"use client"

import { HandshakeIcon, PackageIcon, SparkleIcon } from "@phosphor-icons/react"

import { CONDITION_LABELS, getUnitLabel } from "@/constants/produce"
import type { getListingForFarmer } from "@/lib/db/listing"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageGallery } from "@/components/image-gallery"
import { BuyerMatchesPanel } from "./buyer-matches-panel"
import {
  PriceRecommendationPanel,
  type Recommendation,
} from "./price-recommendation-panel"

type ListingDetail = NonNullable<
  Awaited<ReturnType<typeof getListingForFarmer>>
>

function AiBadge() {
  return (
    <Badge
      variant="outline"
      className="w-fit border-primary/30 bg-primary/10 text-primary"
    >
      Powered by Gemini
    </Badge>
  )
}

function ProduceTabs({
  listing,
  initialRecommendation,
  harvestDateLabel,
}: {
  listing: ListingDetail
  initialRecommendation: Recommendation | null
  harvestDateLabel: string
}) {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">
              <PackageIcon data-icon="inline-start" />
              Details
            </TabsTrigger>
            <TabsTrigger value="price">
              <SparkleIcon data-icon="inline-start" />
              Price
            </TabsTrigger>
            <TabsTrigger value="buyers">
              <HandshakeIcon data-icon="inline-start" />
              Buyers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex flex-col gap-5 pt-4">
            <ImageGallery images={listing.images} alt={listing.crop.name} />
            {listing.description && (
              <p className="text-muted-foreground">{listing.description}</p>
            )}
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-muted-foreground">Available</dt>
                <dd className="font-medium">
                  {listing.quantity.toLocaleString()}{" "}
                  {getUnitLabel(listing.unit)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Price</dt>
                <dd className="font-medium">
                  {listing.askingPrice.toLocaleString()} RWF /{" "}
                  {getUnitLabel(listing.unit)}
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
              {listing.farm && (
                <div>
                  <dt className="text-muted-foreground">Farm</dt>
                  <dd className="font-medium">{listing.farm.name}</dd>
                </div>
              )}
            </dl>
          </TabsContent>

          <TabsContent value="price" className="flex flex-col gap-3 pt-4">
            <AiBadge />
            <PriceRecommendationPanel
              listing={listing}
              initialRecommendation={initialRecommendation}
            />
          </TabsContent>

          <TabsContent value="buyers" className="flex flex-col gap-3 pt-4">
            <AiBadge />
            <BuyerMatchesPanel listing={listing} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export { ProduceTabs }
