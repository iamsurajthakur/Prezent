// src/components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Home, FileText, User } from "lucide-react"; // example icons

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold">Prezent</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup title="Main">
          <a href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
            <Home className="w-5 h-5" />
            Dashboard
          </a>
          <a href="/new-presentation" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
            <FileText className="w-5 h-5" />
            New Presentation
          </a>
        </SidebarGroup>

        <SidebarGroup title="Account">
          <a href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
            <User className="w-5 h-5" />
            Profile
          </a>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <a href="/logout" className="text-red-500 hover:underline">
          Logout
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}