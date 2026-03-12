import { Outlet, Link, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  slide: 'Slide',
  library: 'Library',
};

export const DashboardLayout = () => {
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-[#001A2C] text-white">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            {/* Left: Trigger + Breadcrumb */}
            <div className="flex items-center gap-3 pt-1">
              <SidebarTrigger className="hover:bg-[#002945] hover:text-white rounded-md p-2" />

              <Breadcrumb className="text-gray-400 [&_a:hover]:text-white">
                <BreadcrumbList>
                  {segments.map((segment, index) => {
                    const to = '/' + segments.slice(0, index + 1).join('/');
                    const label = ROUTE_LABELS[segment] || segment;
                    const isLast = index === segments.length - 1;

                    return (
                      <React.Fragment key={to}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="text-white/40 font-medium">
                              {label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={to}>{label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Page Content */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
