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
} from '@/components/ui/sidebar';
import { LayoutDashboard, Presentation, Folder } from 'lucide-react';
import { NavUser } from './NavUser';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserInfo } from '@/Api/stat';
import Logo from '@/Assets/logo.png'

const navItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Smart Slide',
    path: '/dashboard/slide',
    icon: Presentation,
  },
  {
    title: 'Library',
    path: '/dashboard/library',
    icon: Folder,
  },
];

interface UserInfo {
  _id: string
  fullName: string
  email: string
}

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

    useEffect(() => {
      const fetchUserInfo = async () => {
        const response = await getUserInfo()
        const userData = response.data.data
        setUserInfo(userData)
      }
      fetchUserInfo()
    }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={`transition-all ${
          state === 'collapsed'
            ? 'p-0 m-0 flex items-center justify-center mt-2'
            : 'p-2 m-2 bg-[#001A2C] rounded-md'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="size-8 shrink-0 rounded-lg flex items-center justify-center text-white font-medium">
            <img src={Logo} className='h-6 w-auto' alt="Logo" />

          </div>
          {state === 'expanded' && (
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
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setOpenMobile(false)}
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <span className="flex items-center gap-2 p-1.5 rounded-md text-sm font-semibold transition">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer of sidebar */}
      <NavUser
        user={{
          name: `${userInfo?.fullName}`,
          email: `${userInfo?.email}`,
          avatar: 'https://github.com/pranathip.png',
        }}
      />
    </Sidebar>
  );
}
