"use client"

import { ArrowRightIcon, BinocularsIcon } from "@phosphor-icons/react"

import { buttonVariants } from "@/components/ui/button"

function Hero() {
  return (
    <section className="mx-auto box-border max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <span className="inline-block border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
        AI-powered surplus produce marketplace
      </span>

      <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
        Surplus produce shouldn&apos;t{" "}
        <span className="stroke-1 text-destructive italic">rot.</span>
        <br />
        Hargricon connects farmers to buyers before it does.
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-balance text-muted-foreground sm:text-lg">
        Across Sub-Saharan Africa, nearly half of all fruits and vegetables
        grown never reach a plate — lost to spoilage, poor market access, and
        mistimed pricing. Hargricon helps farmers report, price, and find buyers
        for surplus produce before it&apos;s wasted.
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
    </section>
  )
}

export { Hero }
