"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { adminRoute } from "@/routes/adminRoute";
import { studentRoute } from "@/routes/studentRoute";
import { tutorRoute } from "@/routes/tutorRoute";
import { Route } from "@/types";
import { Roles } from "@/constance/role";
import { cn } from "@/lib/utils";
import { getIconComponent } from "@/lib/icon-mapper";
import { authClient } from "@/lib/auth-client";
import { Logo, LogoText } from "./logo";
import { Button } from "../ui/button";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: { role?: string; name?: string; email?: string } | null;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Resolved Icons via Mapper
  const SparklesIcon = getIconComponent("Sparkles");
  const LogOutIcon = getIconComponent("LogOut");

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh(); 
          },
        },
      });
    } catch(err) {
      console.error(err);
    }
  };

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
    <Sidebar collapsible="icon" className="border-r-0 bg-sidebar shadow-xl" {...props}>
      <SidebarHeader className="border-b px-6 py-5">
        <Logo url="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-violet-600 p-2 shadow-lg shadow-primary/20">
             <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <LogoText className="text-xl font-bold tracking-tight text-foreground">
            Skill<span className="text-primary">Bridge</span>
          </LogoText>
        </Logo>
      </SidebarHeader>

      <SidebarContent className="gap-2 px-2 py-4">
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");

                  // Unified icon resolution using Mapper
                  const Icon = getIconComponent(item.icon || "Circle");

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={cn(
                          "transition-all duration-200 ease-in-out h-10 px-4",
                          active
                            ? "bg-primary/15 text-primary shadow-sm hover:bg-primary/20"
                            : "hover:bg-accent/50 hover:text-accent-foreground text-muted-foreground"
                        )}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3"
                        >
                          <Icon className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active ? "text-primary" : "text-muted-foreground/70"
                          )} />
                          <span className="font-medium">{item.title}</span>
                          {active && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          )}
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

      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-2">
            <Button 
                variant="ghost" 
                className="justify-start gap-3 h-10 w-full hover:bg-destructive/10 hover:text-destructive group transition-colors px-4" 
                onClick={handleLogout}
            >
                <LogOutIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                <span className="font-medium">Logout</span>
            </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
