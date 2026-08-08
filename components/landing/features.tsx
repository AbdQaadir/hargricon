"use client"

import {
  BellIcon,
  ChartLineUpIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PlantIcon,
  ShoppingCartIcon,
  TagIcon,
  type Icon,
} from "@phosphor-icons/react"

const farmerFeatures: { icon: Icon; title: string; description: string }[] = [
  {
    icon: ChartLineUpIcon,
    title: "AI-suggested fair pricing",
    description:
      "Get a price range based on crop type, condition, and local demand — no guesswork, no underselling.",
  },
  {
    icon: MapPinIcon,
    title: "Reach buyers nearby",
    description:
      "Get matched with markets, restaurants, and cooperatives close to your farm, automatically.",
  },
  {
    icon: BellIcon,
    title: "Real-time offer alerts",
    description:
      "Know the moment a buyer is interested, so your produce finds a buyer before it spoils.",
  },
]

const buyerFeatures: { icon: Icon; title: string; description: string }[] = [
  {
    icon: MagnifyingGlassIcon,
    title: "Find nearby produce",
    description:
      "Search fresh produce being offered near you, updated as farmers list it.",
  },
  {
    icon: TagIcon,
    title: "Transparent pricing",
    description:
      "See the same AI-suggested price the farmer does — no haggling from a cold start.",
  },
  {
    icon: HandshakeIcon,
    title: "Deal directly with farmers",
    description:
      "Message farmers to confirm details and arrange pickup, with no middleman markup.",
  },
]

function FeatureList({
  audience,
  audienceIcon: AudienceIcon,
  features,
}: {
  audience: string
  audienceIcon: Icon
  features: { icon: Icon; title: string; description: string }[]
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <AudienceIcon weight="fill" className="size-5 text-primary" />
        <h3 className="font-heading text-xl font-bold tracking-tight">
          {audience}
        </h3>
      </div>

      <ul className="flex flex-col gap-6">
        {features.map(({ icon: FeatureIcon, title, description }) => (
          <li key={title} className="flex gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center border border-border text-primary">
              <FeatureIcon weight="bold" className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-heading text-base font-bold">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Built for both sides of the market
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground sm:text-lg">
          Hargricon gives farmers a fair, fast way to sell their produce — and
          gives buyers a direct line to fresh produce nearby.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-16 sm:grid-cols-2 sm:gap-12">
          <FeatureList
            audience="For farmers"
            audienceIcon={PlantIcon}
            features={farmerFeatures}
          />
          <FeatureList
            audience="For buyers"
            audienceIcon={ShoppingCartIcon}
            features={buyerFeatures}
          />
        </div>
      </div>
    </section>
  )
}

export { Features }
