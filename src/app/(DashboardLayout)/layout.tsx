import { AppSidebar } from "@/components/layouts/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Roles } from "@/constance/role";
import { userService } from "@/services/user.services";
import { getIconComponent } from "@/lib/icon-mapper";
import Link from "next/link";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { ModeToggle } from "@/components/layouts/ModeToggle";
import { DashboardHeaderProfile } from "@/components/layouts/DashboardHeaderProfile";
import { Button } from "@/components/ui/button";

// Prevent Next.js from caching dashboard pages
export const dynamic = "force-dynamic";

function getRoleLabel(role?: string) {
  if (role === Roles.ADMIN) return "Admin";
  if (role === Roles.TUTOR) return "Tutor";
  return "Student";
}

function getInitials(name: string = ""): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
}

import { redirect } from "next/navigation";

export default async function DashboardLayout({
  admin,
  tutor,
  student,
}: {
  admin: React.ReactNode;
  tutor: React.ReactNode;
  student: React.ReactNode;
}) {
  const { data } = await userService.getMe();
  const userInfo = data;

  if (!userInfo) {
    redirect("/login");
  }

  const roleLabel = getRoleLabel(userInfo?.role);

  // Unified Icons via Mapper
  const HomeIcon = getIconComponent("Home");
  const DashboardIcon = getIconComponent("LayoutDashboard");
  const SearchIcon = getIconComponent("Search");
  const UserIcon = getIconComponent("User");
  const SettingsIcon = getIconComponent("Settings");
  const HelpIcon = getIconComponent("HelpCircle");
  const SparklesIcon = getIconComponent("Sparkles");

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />

      <SidebarInset className="bg-linear-to-b from-background via-background to-muted/20">
        {/* Tier 1: System Level Actions */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/60 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="hidden items-center gap-2 rounded-full border bg-muted/30 px-3 py-1.5 md:flex w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <SearchIcon className="h-4 w-4 text-muted-foreground" />
                    <input 
                        placeholder="Quick Search..." 
                        className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
                    />
                    <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <ModeToggle />
                <NotificationBell />
                <Separator orientation="vertical" className="h-4" />
                
                <DashboardHeaderProfile initialUser={userInfo} />
            </div>
        </header>

        {/* Tier 2: Content Context Bar */}
        <div className="sticky top-14 z-20 flex w-full border-b bg-background/40 px-6 py-4 backdrop-blur-sm md:top-12">
            <div className="flex w-full items-end justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-primary">
                                        <HomeIcon className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Home</span>
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard" className="flex items-center gap-1.5 transition-colors hover:text-primary">
                                        <DashboardIcon className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Dashboard</span>
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-semibold text-primary">{roleLabel}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {roleLabel} Dashboard
                        </h1>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 capitalize font-bold tracking-tight">
                            {userInfo?.role?.toLowerCase()}
                        </Badge>
                    </div>
                </div>

                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm" asChild>
                        <Link href="/help">
                            <HelpIcon className="h-4 w-4" />
                            <span>Help Center</span>
                        </Link>
                    </Button>
                    <Button size="sm" className="h-9 gap-2 shadow-md btn-3d bg-primary hover:bg-primary/90" asChild>
                         <Link href="/">
                            <SparklesIcon className="h-4 w-4" />
                            <span>Explore Tutors</span>
                         </Link>
                    </Button>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-8">
            <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-500">
                {/* Background decorative blob */}
                <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute top-1/2 -left-12 h-48 w-48 rounded-full bg-violet-600/5 blur-3xl" />

                <div className="relative rounded-2xl border bg-card/80 p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all md:p-8 lg:p-10 card-3d">
                    {userInfo?.role === Roles.ADMIN
                        ? admin
                        : userInfo?.role === Roles.TUTOR
                        ? tutor
                        : student}
                </div>
            </div>
          </div>
        </main>

        {/* Footer info (Subtle) */}
        <footer className="px-8 py-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold">
                SkillBridge Learning Systems &bull; Secured with 256-bit Encryption
            </p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
