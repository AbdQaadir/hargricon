"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SignOutIcon, UserIcon } from "@phosphor-icons/react"

import { authClient } from "@/lib/auth/client"
import { ROUTES } from "@/lib/routes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

function getPageTitle(pathname: string) {
  if (pathname === ROUTES.dashboard) return "Overview"
  if (pathname.startsWith(ROUTES.dashboardFarms)) return "Farms"
  if (pathname.startsWith(ROUTES.dashboardProduces)) return "Produces"
  if (pathname.startsWith(ROUTES.dashboardBuyers)) return "Buyers"
  if (pathname.startsWith(ROUTES.dashboardLearning)) return "Learning"
  if (pathname.startsWith(ROUTES.dashboardProfile)) return "Profile"
  return "Dashboard"
}

function DashboardHeader({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="font-heading text-sm font-semibold">
        {getPageTitle(pathname)}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar size="sm">
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href={ROUTES.dashboardProfile} />}>
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await authClient.signOut()
                router.push(ROUTES.home)
                router.refresh()
              }}
            >
              <SignOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export { DashboardHeader }
