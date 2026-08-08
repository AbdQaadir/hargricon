"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserIcon, SignOutIcon } from "@phosphor-icons/react"

import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/client"

function SiteHeader() {
  const router = useRouter()
  const session = authClient.useSession()
  const user = session.data?.user

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar size="sm">
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href="/account" />}>
                  <UserIcon />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await authClient.signOut()
                    router.push("/")
                    router.refresh()
                  }}
                >
                  <SignOutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className={buttonVariants({ size: "sm" })}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
