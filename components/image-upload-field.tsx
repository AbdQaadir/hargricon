"use client"

import { useEffect, useRef } from "react"
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { ImageIcon, XIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

function ImageUploadField({
  value,
  onChange,
  folder,
  max = 5,
}: {
  value: string[]
  onChange: (urls: string[]) => void
  folder: string
  max?: number
}) {
  // The upload widget is created once and keeps its onSuccess closure from
  // that point, so it never sees a fresh `value` prop across re-renders.
  // Mutating this ref inside the handler (rather than reading `value`
  // directly) keeps consecutive uploads in a single batch from clobbering
  // each other.
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  const remaining = max - value.length

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {value.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-md border border-border"
            >
              <CldImage
                src={url}
                alt=""
                fill
                sizes="120px"
                crop="fill"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  onChange(value.filter((existing) => existing !== url))
                }
                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                <XIcon className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <CldUploadWidget
          signatureEndpoint="/api/uploads/sign"
          options={{
            folder,
            multiple: true,
            maxFiles: remaining,
            sources: ["local", "camera"],
            clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
            maxImageFileSize: 8_000_000,
          }}
          onSuccess={(result) => {
            const info = result.info
            if (info && typeof info === "object" && "secure_url" in info) {
              const next = [...valueRef.current, info.secure_url]
              valueRef.current = next
              onChange(next)
            }
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => open()}
            >
              <ImageIcon data-icon="inline-start" />
              Add photos ({value.length}/{max})
            </Button>
          )}
        </CldUploadWidget>
      )}
    </div>
  )
}

export { ImageUploadField }
