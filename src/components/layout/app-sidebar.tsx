"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { BookOpen, Coffee, Settings2, SquareTerminal } from "lucide-react";
import { NavMain } from "./nav-main";

const myMenu = {
  user: {
    name: "Admin name",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
        },
        {
          title: "Clients",
          url: "/dashboard/clients",
        },
        {
          title: "Logs",
          url: "/dashboard/logs",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:font-normal hover:bg-transparent"
              asChild
            >
              <Link href="/dashboard">
                <div className="flex bg-teal-500 aspect-square size-9 items-center text-white justify-center rounded-md">
                  <Coffee />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-teal-600 font-semibold">
                    POS Realtime
                  </span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={myMenu.navMain} />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
