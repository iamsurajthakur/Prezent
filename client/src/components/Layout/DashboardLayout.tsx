import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />

        <main className="flex-1 text-white p-4 bg-[#001A2C]">
          <SidebarTrigger className="hover:bg-[#002945] hover:text-white mb-4" />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}