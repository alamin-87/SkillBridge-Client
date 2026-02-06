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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Roles } from "@/constance/role";
import { userService } from "@/services/user.services";
import { Home } from "lucide-react";
import Link from "next/link";

function getRoleLabel(role?: string) {
  if (role === Roles.ADMIN) return "Admin";
  if (role === Roles.TUTOR) return "Tutor";
  return "Student";
}

export default async function DashboardLayout({
  admin,
  tutor,
  student,
}: {
  admin: React.ReactNode;
  tutor: React.ReactNode;
  student: React.ReactNode;
}) {
  const { data } = await userService.getSession();
  const userInfo = data?.user;

  const roleLabel = getRoleLabel(userInfo?.role);

  function getInitials(name: string = ""): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />

      <SidebarInset className="bg-muted/20">
        {/* Sticky topbar */}
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="mr-1 data-[orientation=vertical]:h-5"
            />

            {/* Left: Breadcrumb + Title */}
            <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div className="min-w-0 flex">
                <div>
                  <Breadcrumb>
                    <BreadcrumbList>
                      {/* Home */}
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink asChild>
                          <Link href="/" className="flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            Home
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbSeparator className="hidden md:block" />

                      {/* Dashboard */}
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/dashboard">
                          Dashboard
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbSeparator className="hidden md:block" />

                      {/* Role */}
                      <BreadcrumbItem>
                        <BreadcrumbPage>{roleLabel}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>

                  <div className="mt-0.5 flex items-center gap-2">
                    <h1 className="truncate text-base font-semibold md:text-lg">
                      {roleLabel} Dashboard
                    </h1>
                    <Badge variant="secondary" className="rounded-full">
                      {userInfo?.role ?? "UNKNOWN"}
                    </Badge>
                  </div>
                </div>

                <p className="hidden text-xs text-muted-foreground md:block mt-7 ml-3">
                  Manage your account, bookings, and settings from here.
                </p>
              </div>

              {/* Right: small user display */}
              <div className="hidden items-center gap-2 md:flex">
                <div className="text-right flex items-center gap-2">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage
                      src={userInfo?.image ?? undefined}
                      alt={userInfo?.name ?? "User"}
                    />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {userInfo?.name ?? "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userInfo?.email ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
            <div className="rounded-xl border bg-background p-4 shadow-sm md:p-6">
              {userInfo?.role === Roles.ADMIN
                ? admin
                : userInfo?.role === Roles.TUTOR
                  ? tutor
                  : student}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
