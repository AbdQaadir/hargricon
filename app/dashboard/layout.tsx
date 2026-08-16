import { requireProfile } from "@/lib/db/profile"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireProfile()

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <DashboardHeader userName={profile.firstName} />
        <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
