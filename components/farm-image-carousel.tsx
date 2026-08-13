"use client"

import { useEffect, useState } from "react"
import { BarnIcon } from "@phosphor-icons/react/ssr"
import { CldImage } from "next-cloudinary"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

function FarmImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
        <BarnIcon className="size-10 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((url, index) => (
            <CarouselItem key={url}>
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                <CldImage
                  src={url}
                  alt={`${alt} photo ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 480px, 100vw"
                  crop="fill"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm" />
            <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm" />
          </>
        )}
      </Carousel>
      {images.length > 1 && (
        <p className="text-center text-xs text-muted-foreground">
          {current + 1} / {images.length}
        </p>
      )}
    </div>
  )
}

export { FarmImageCarousel }
