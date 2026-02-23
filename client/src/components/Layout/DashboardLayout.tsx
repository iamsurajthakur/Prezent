import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar"

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="min-h-screen w-full text-white p-6 bg-[#001A2C]">
                <SidebarTrigger />
                    {children}
            </main>
        </SidebarProvider>
    )
}