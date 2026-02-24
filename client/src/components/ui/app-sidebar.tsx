// src/components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Presentation, Folder, Monitor   } from "lucide-react"; // example icons
import { NavUser } from "./NavUser";

export function AppSidebar() {

  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
     <SidebarHeader className={`transition-all ${
    state === "collapsed"
      ? "p-0 m-0 flex items-center justify-center mt-2"
      : "p-2 m-2 bg-[#001A2C] rounded-md"
  }`}>
        <div className="flex items-center gap-2">
          <div className="size-8 shrink-0 rounded-lg bg-[#00406C] flex items-center justify-center text-white font-medium">
            <Monitor  className="w-4 h-4" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col overflow-hidden">
              <h2 className="text-sm font-semibold tracking-wide text-white truncate">
                Prezent Inc
              </h2>
              <span className="text-xs font-semibold truncate">Enterprise</span>
            </div>
          )}
          </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex hover:text-white items-center text-sm font-semibold gap-2 p-1.5 rounded-md hover:bg-[#001A2C]" asChild tooltip="Dashboard">
                <a href="/dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex hover:text-white items-center text-sm font-semibold gap-2 p-1.5 rounded-md hover:bg-[#001A2C]" asChild tooltip="Smart Slide">
                <a href="/new-presentation">
                  <Presentation className="w-4 h-4" />
                  <span>Smart Slide</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex hover:text-white items-center text-sm font-semibold gap-2 p-1.5 rounded-md hover:bg-[#001A2C]" asChild tooltip="Library">
                <a href="/library">
                  <Folder className="w-4 h-4" />
                  <span>Library</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer of sidebar */}
              <NavUser
                user={{
                  name: "Suraj Thakur",
                  email: "suraj@gmail.com",
                  avatar: "https://github.com/maxleiter.png",
                }}
              />
    </Sidebar>
  );
}