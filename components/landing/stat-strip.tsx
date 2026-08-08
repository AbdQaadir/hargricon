"use client"

import Image from "next/image"
import {
  BasketIcon,
  GlobeIcon,
  WarehouseIcon,
  type Icon,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const stats: {
  value: string
  description: string
  sourceLabel: string
  sourceUrl: string
  imageSrc?: string
  imagePlaceholder: string
  imageIcon: Icon
}[] = [
  {
    value: "20–30%",
    description:
      "of fruits, vegetables, and potatoes harvested in Rwanda are lost before reaching a buyer — the exact produce hargricon helps farmers sell.",
    sourceLabel: "Africa Press, 2025",
    sourceUrl:
      "https://www.africa-press.net/rwanda/all-news/cutting-post-harvest-losses-key-to-rwandas-food-security",
    imageSrc: "/images/wasted-fruits-and-veg.jpg",
    imagePlaceholder: "Photo: smallholder farmer with fresh harvest",
    imageIcon: BasketIcon,
  },
  {
    value: "40%",
    description:
      "of Rwanda's food is lost annually due to weak post-harvest management — poor storage, transport, and limited market access.",
    sourceLabel: "Africa Press, 2025",
    sourceUrl:
      "https://www.africa-press.net/rwanda/all-news/cutting-post-harvest-losses-key-to-rwandas-food-security",
    imageSrc: "/images/global-food-loss.avif",
    imagePlaceholder: "Photo: local market or produce supply chain",
    imageIcon: GlobeIcon,
  },
  {
    value: "15%",
    description:
      "is Rwanda's current post-harvest loss rate for maize — even with new drying grounds and solar dryers rolling out nationwide.",
    sourceLabel: "Ministry of Agriculture and Animal Resources, Rwanda",
    sourceUrl:
      "https://www.minagri.gov.rw/updates/news-details/maize-smallholder-farmers-reaping-big-from-enhanced-post-harvest-handling",
    imageSrc: "/images/post-harvest-loss.jpg",
    imagePlaceholder: "Photo: grain storage or cooperative warehouse",
    imageIcon: WarehouseIcon,
  },
]

function StatStrip() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          The scale of the problem
        </h2>

        <div className="mt-16 flex flex-col gap-16 sm:gap-20">
          {stats.map(
            (
              {
                value,
                description,
                sourceLabel,
                sourceUrl,
                imageSrc,
                imagePlaceholder,
                imageIcon: ImageIcon,
              },
              index
            ) => {
              const imageFirst = index % 2 === 0

              return (
                <div
                  key={value}
                  className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-12"
                >
                  <div
                    className={cn(
                      "relative aspect-4/3 overflow-hidden border border-border",
                      !imageSrc &&
                        "flex flex-col items-center justify-center gap-3 border-dashed bg-muted/50 p-6 text-center",
                      imageFirst ? "sm:order-1" : "sm:order-2"
                    )}
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={imagePlaceholder}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <ImageIcon className="size-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {imagePlaceholder}
                        </span>
                      </>
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex flex-col gap-3",
                      imageFirst ? "sm:order-2" : "sm:order-1"
                    )}
                  >
                    <span className="font-heading text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                      {value}
                    </span>
                    <p className="text-muted-foreground sm:text-lg">
                      {description}
                    </p>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      Source: {sourceLabel}
                    </a>
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}

export { StatStrip }
