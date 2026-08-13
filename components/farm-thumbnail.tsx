"use client"
import { BarnIcon, ImagesIcon } from "@phosphor-icons/react/ssr"
import { CldImage } from "next-cloudinary"

function FarmThumbnail({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-t-xl bg-muted">
        <BarnIcon className="size-7 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative h-32 overflow-hidden rounded-t-xl">
      <CldImage
        src={images[0]}
        alt={alt}
        width={400}
        height={128}
        crop="fill"
        className="h-32 w-full object-cover"
      />
      {images.length > 1 && (
        <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <ImagesIcon className="size-3.5" />
          {images.length}
        </div>
      )}
    </div>
  )
}

export { FarmThumbnail }
