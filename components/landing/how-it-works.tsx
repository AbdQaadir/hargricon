"use client"

import { Fragment } from "react"
import {
  ArrowRightIcon,
  ChatCircleTextIcon,
  StorefrontIcon,
  TagIcon,
  type Icon,
} from "@phosphor-icons/react"

const steps: { icon: Icon; title: string; description: string }[] = [
  {
    icon: ChatCircleTextIcon,
    title: "Describe what you have",
    description: "Tell us about your produce in plain language.",
  },
  {
    icon: TagIcon,
    title: "Get a fair price, instantly",
    description:
      "AI suggests a price range based on crop type, condition, and urgency.",
  },
  {
    icon: StorefrontIcon,
    title: "Get discovered by nearby buyers",
    description:
      "Markets, restaurants, and cooperatives near you are matched automatically.",
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>

        <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-start sm:gap-4">
          {steps.map(({ icon: StepIcon, title, description }, index) => (
            <Fragment key={title}>
              <li className="flex flex-col items-start gap-3">
                <div className="flex size-10 items-center justify-center border border-border text-primary">
                  <StepIcon weight="bold" className="size-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Step {index + 1}
                </span>
                <h3 className="font-heading text-lg font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </li>
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden pt-5 text-border sm:flex sm:justify-center"
                >
                  <ArrowRightIcon className="size-5" />
                </div>
              )}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  )
}

export { HowItWorks }
