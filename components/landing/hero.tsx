"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRightIcon, BinocularsIcon } from "@phosphor-icons/react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides: { src: string; alt: string }[] = [
  {
    src: "/images/hero/farmer-harvesting.jpg",
    alt: "Farmer harvesting fresh produce in the field",
  },
  {
    src: "/images/hero/market-produce.jpg",
    alt: "Crates of fresh fruits and vegetables at a local market",
  },
  {
    src: "/images/hero/buyer-purchasing.jpg",
    alt: "Buyer selecting produce from a vendor",
  },
]

const SLIDE_DURATION_MS = 5000

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, SLIDE_DURATION_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              index === activeSlide ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
      </div>

      <div className="relative mx-auto box-border max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="inline-block border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          AI-powered produce marketplace
        </span>

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
          Produce shouldn&apos;t{" "}
          <span className="stroke-1 text-destructive italic">rot.</span>
          <br />
          Hargricon connects farmers to buyers before it does.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-white/80 sm:text-lg">
          Across Sub-Saharan Africa, nearly half of all fruits and vegetables
          grown never reach a plate, lost to spoilage, poor market access, and
          mistimed pricing. Hargricon helps farmers report, price, and find
          buyers for their produce before it&apos;s wasted.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/auth/sign-up" className={buttonVariants({ size: "xl" })}>
            Register your farm
            <ArrowRightIcon data-icon="inline-end" />
          </a>

          <a
            href="/produce"
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            )}
          >
            Find nearby produce
            <BinocularsIcon data-icon="inline-end" />
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === activeSlide
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Hero }
