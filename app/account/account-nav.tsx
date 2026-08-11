"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SquaresFourIcon, UserIcon } from "@phosphor-icons/react"

import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

const navItems = [
  { href: ROUTES.account, label: "Dashboard", icon: SquaresFourIcon },
  { href: ROUTES.accountProfile, label: "Profile", icon: UserIcon },
]

function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 border-b border-border">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export { AccountNav }
