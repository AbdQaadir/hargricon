import {
  BuildingsIcon,
  EnvelopeIcon,
  GlobeIcon,
  PhoneIcon,
} from "@phosphor-icons/react/ssr"

import { BUYER_CATEGORY_LABELS } from "@/constants/buyers"
import { getBuyers } from "@/lib/db/buyer"
import { requireProfile } from "@/lib/db/profile"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const dynamic = "force-dynamic"

export default async function BuyersPage() {
  await requireProfile()
  const buyers = await getBuyers()

  const byCategory = new Map<string, typeof buyers>()
  for (const buyer of buyers) {
    const label = BUYER_CATEGORY_LABELS[buyer.category]
    byCategory.set(label, [...(byCategory.get(label) ?? []), buyer])
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Buyer directory
        </h2>
        <p className="text-sm text-muted-foreground">
          Cooperatives, wholesalers, retailers, and hotels you can reach out to
          directly. For AI-suggested matches on a specific listing, see that
          produce&apos;s detail page.
        </p>
      </div>

      {buyers.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BuildingsIcon />
            </EmptyMedia>
            <EmptyTitle>No buyer contacts yet</EmptyTitle>
            <EmptyDescription>
              Buyer contacts will show up here once they&apos;re added.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-8">
          {[...byCategory.entries()].map(([label, group]) => (
            <div key={label} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {label} ({group.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((buyer) => (
                  <Card key={buyer.id} size="sm">
                    <CardContent className="flex flex-col gap-2">
                      <p className="font-medium">{buyer.name}</p>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        {buyer.email && (
                          <a
                            href={`mailto:${buyer.email}`}
                            className="flex items-center gap-1.5 hover:text-foreground"
                          >
                            <EnvelopeIcon className="size-3.5 shrink-0" />
                            <span className="truncate">{buyer.email}</span>
                          </a>
                        )}
                        {buyer.phone && (
                          <span className="flex items-center gap-1.5">
                            <PhoneIcon className="size-3.5 shrink-0" />
                            {buyer.phone}
                          </span>
                        )}
                        {buyer.website && (
                          <a
                            href={
                              buyer.website.startsWith("http")
                                ? buyer.website
                                : `https://${buyer.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-foreground"
                          >
                            <GlobeIcon className="size-3.5 shrink-0" />
                            <span className="truncate">{buyer.website}</span>
                          </a>
                        )}
                        {!buyer.email && !buyer.phone && !buyer.website && (
                          <span className="text-xs italic">
                            No contact info on file
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
