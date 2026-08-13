"use client"
import { ImageIcon } from "@phosphor-icons/react/ssr"
import { CldImage } from "next-cloudinary"

import { cn } from "@/lib/utils"

function ProduceThumbnail({
  images,
  alt,
  className,
}: {
  images: string[]
  alt: string
  className?: string
}) {
  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-video items-center justify-center rounded-t-xl bg-muted",
          className
        )}
      >
        <ImageIcon className="size-8 text-muted-foreground" />
      </div>
    )
  }

  return (
    <CldImage
      src={images[0]}
      alt={alt}
      width={480}
      height={270}
      crop="fill"
      className={cn("aspect-video w-full object-cover", className)}
    />
  )
}

export { ProduceThumbnail }
