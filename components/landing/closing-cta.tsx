"use client"

import { ArrowRightIcon, BinocularsIcon } from "@phosphor-icons/react"

import { buttonVariants } from "@/components/ui/button"

function ClosingCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Don&apos;t let this harvest go to waste.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground sm:text-lg">
          Whether you&apos;re selling produce or sourcing it, hargricon connects
          you in minutes.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/auth/sign-up" className={buttonVariants({ size: "xl" })}>
            Register your farm
            <ArrowRightIcon data-icon="inline-end" />
          </a>

          <a
            href="/produce"
            className={buttonVariants({ variant: "secondary", size: "xl" })}
          >
            Find nearby produce
            <BinocularsIcon data-icon="inline-end" />
          </a>
        </div>
      </div>
    </section>
  )
}

export { ClosingCta }
