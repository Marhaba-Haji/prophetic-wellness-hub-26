import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  FolderTree,
  FileText,
  Calendar,
  MessageSquare,
  CreditCard,
} from "lucide-react";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Inventory",
    url: "/admin/inventory",
    icon: BarChart3,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: FileText,
  },
  {
    title: "Appointments",
    url: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Contacts",
    url: "/admin/contacts",
    icon: MessageSquare,
  },
  {
    title: "Abandoned Payments",
    url: "/admin/abandoned-payments",
    icon: CreditCard,
  },
];

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/10">
        <Sidebar className="border-r" collapsible="icon">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <SidebarTrigger />
          </div>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
