// src/components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Home, FileText, User } from "lucide-react"; // example icons
import { NavUser } from "./NavUser";

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <h2 className="text-xl font-bold">Prezent</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup title="Main">
          <a href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-[#001A2C] rounded-md">
            <Home className="w-5 h-5" />
            Dashboard
          </a>
          <a href="/new-presentation" className="flex items-center gap-2 p-2 rounded-md hover:bg-[#001A2C]">
            <FileText className="w-5 h-5" />
            New Presentation
          </a>
        </SidebarGroup>

        <SidebarGroup title="Account">
          <a href="/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-[#001A2C]">
            <User className="w-5 h-5" />
            Profile
          </a>
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