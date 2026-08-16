"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarnIcon,
  GraduationCapIcon,
  HandshakeIcon,
  PlantIcon,
  SquaresFourIcon,
  UserIcon,
} from "@phosphor-icons/react"

import { ROUTES } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { href: ROUTES.dashboard, label: "Overview", icon: SquaresFourIcon },
  { href: ROUTES.dashboardFarms, label: "Farms", icon: BarnIcon },
  { href: ROUTES.dashboardProduces, label: "Produces", icon: PlantIcon },
  { href: ROUTES.dashboardBuyers, label: "Buyers", icon: HandshakeIcon },
  {
    href: ROUTES.dashboardLearning,
    label: "Learning",
    icon: GraduationCapIcon,
    badge: "AI",
  },
  { href: ROUTES.dashboardProfile, label: "Profile", icon: UserIcon },
]

function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo className="px-2 py-1" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon, badge }) => {
                const isActive =
                  href === ROUTES.dashboard
                    ? pathname === href
                    : pathname.startsWith(href)

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isActive}
                      tooltip={label}
                    >
                      <Icon />
                      <span>{label}</span>
                      {badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto border-primary/30 bg-primary/10 text-primary"
                        >
                          {badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export { DashboardSidebar }
