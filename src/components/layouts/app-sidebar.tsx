"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { adminRoute } from "@/routes/adminRoute";
import { studentRoute } from "@/routes/studentRoute";
import { tutorRoute } from "@/routes/tutorRoute";
import { Route } from "@/types";
import { Roles } from "@/constance/role";
import { cn } from "@/lib/utils";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: { role?: string } | null;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  let routes: Route[] = [];

  switch (user?.role) {
    case Roles.ADMIN:
      routes = adminRoute;
      break;
    case Roles.TUTOR:
      routes = tutorRoute;
      break;
    default:
      routes = studentRoute;
      break;
  }

  return (
    <Sidebar {...props}>
      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={cn(
                            active && "bg-primary/10 text-primary font-medium",
                          )}
                        >
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
