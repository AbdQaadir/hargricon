"use client"

import Link from "next/link"

import { Logo } from "@/components/logo"
import { authClient } from "@/lib/auth/client"
import { SITE_NAME } from "@/lib/constants"
import { ROUTES } from "@/lib/routes"

function SiteFooter() {
  const session = authClient.useSession()
  const isSignedIn = Boolean(session.data?.user)

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <Logo iconClassName="size-4" textClassName="text-sm" />

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>

        <nav className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <Link
            href={isSignedIn ? ROUTES.account : ROUTES.signIn}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {isSignedIn ? "Dashboard" : "Sign in"}
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export { SiteFooter }
