"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getIconComponent } from "@/lib/icon-mapper";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constance/role";
import { NotificationBell } from "@/components/shared/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Role = "STUDENT" | "TUTOR" | "ADMIN";

type NavbarUser = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role: Role;
} | null;

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // ─── Use Better Auth's client-side session hook ───
  // This fetches the session directly from the browser (via the
  // Next.js rewrite proxy), so the session cookie is natively
  // included — no fragile server-to-server cookie forwarding.
  const {
    data: sessionData,
    isPending,
  } = authClient.useSession();

  // Derive the NavbarUser from the session data
  const user: NavbarUser = React.useMemo(() => {
    if (!sessionData?.user) return null;
    const u = sessionData.user as Record<string, unknown>;
    return {
      id: u.id as string,
      name: (u.name as string) || undefined,
      email: (u.email as string) || undefined,
      image: (u.image as string) || undefined,
      role: ((u.role as Role) || "STUDENT"),
    };
  }, [sessionData]);

  const loading = isPending;

  // Resolved Icons via Mapper
  const GraduationCapIcon = getIconComponent("GraduationCap");
  const LayoutDashboardIcon = getIconComponent("LayoutDashboard");
  const UserIcon = getIconComponent("User");
  const HelpCircleIcon = getIconComponent("HelpCircle");
  const LogOutIcon = getIconComponent("LogOut");
  const MenuIcon = getIconComponent("Menu");

  const menu = [
    { title: "Home", href: "/" },
    { title: "Browse Tutors", href: "/tutors" },
    { title: "Categories", href: "/categories" },
    { title: "How It Works", href: "/how-it-works" },
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Help", href: "/help" },
  ];

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "TUTOR"
        ? "/tutor/dashboard"
        : "/dashboard";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };
  function getProfilePath(role?: string) {
    if (role === Roles.ADMIN) return "/admin/profile";
    if (role === Roles.TUTOR) return "/tutor/profile";
    return "/dashboard/profile";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex flex-1 justify-start">
          <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCapIcon className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            SkillBridge
          </span>
          </Link>
        </div>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center justify-center gap-6">
          {menu.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              {m.title}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        {/* <div className="hidden items-center gap-2 lg:flex">
          <ModeToggle />

          {!loading && !user && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}

          {!loading && user && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={dashboardHref}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <Button asChild variant="ghost" size="sm">
                <Link href={getProfilePath(user?.role)}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>

              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div> */}
        {/* Desktop actions */}
        <div className="hidden lg:flex flex-1 items-center justify-end gap-2">
          <ModeToggle />

          {loading ? (
            // 🔒 keeps space so navbar never moves
            <div className="flex items-center gap-2">
              <div className="h-9 w-[72px] opacity-0" />
              <div className="h-9 w-[88px] opacity-0" />
            </div>
          ) : !user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              {/* <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button> */}
            </>
          ) : (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1">
                    <Avatar className="h-9 w-9 shadow-sm border border-border/50">
                      <AvatarImage src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "user"}`} alt="User Avatar" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user?.name?.[0]?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal border-b border-border/40 pb-3 mb-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user?.name || "SkillBridge User"}</p>
                      <p className="text-xs text-muted-foreground leading-none">
                        {user?.email}
                      </p>
                      <div className="mt-2 text-[10px] font-bold tracking-widest text-[#7c3aed] uppercase">
                        {user?.role} ACCOUNT
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild className="cursor-pointer font-medium mb-1">
                    <Link href={dashboardHref} className="flex items-center w-full">
                      <LayoutDashboardIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer font-medium">
                    <Link href={getProfilePath(user?.role)} className="flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer font-medium mb-1">
                    <Link href="/help" className="flex items-center w-full">
                      <HelpCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      Help Center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 border-border/40" />
                  <DropdownMenuItem 
                    className="cursor-pointer font-semibold text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10 dark:focus:text-red-500" 
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Secure Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden flex-1 items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <GraduationCapIcon className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                      SkillBridge
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    {!loading && user && <NotificationBell />}
                    <ModeToggle />
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col justify-center items-center gap-4 border rounded-lg border-muted bg-popover p-4">
                  {menu.map((m) => (
                    <Link
                      key={m.title}
                      href={m.href}
                      className="text-sm text-black font-semibold bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 w-full text-center"
                    >
                      {m.title}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {!loading && !user && (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </>
                  )}

                  {!loading && user && (
                    <>
                      <Button asChild variant="outline">
                        <Link href={dashboardHref}>
                          <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>

                      <Button asChild variant="outline">
                        <Link href="/dashboard/profile">
                          <UserIcon className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>

                      <Button variant="destructive" onClick={handleLogout}>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
