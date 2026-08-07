"use client"

import Link from "next/link"
import { LeafIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-1">
          <LeafIcon weight="fill" className="size-5 text-primary" />
          <span className="font-heading text-base font-bold tracking-tight">
            hargricon
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/auth/sign-in">Sign in</Link>}
          />
          <Button
            size="sm"
            render={<Link href="/auth/sign-up">Get Started</Link>}
          />
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
