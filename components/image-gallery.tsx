"use client"
import { CldImage } from "next-cloudinary"

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {images.map((url, index) => (
        <div
          key={url}
          className="relative aspect-square overflow-hidden rounded-md border border-border"
        >
          <CldImage
            src={url}
            alt={`${alt} photo ${index + 1}`}
            fill
            sizes="200px"
            crop="fill"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export { ImageGallery }
