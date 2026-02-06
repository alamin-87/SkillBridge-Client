"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";
import { getSessionAction } from "@/actions/user-action";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constance/role";

type Role = "STUDENT" | "TUTOR" | "ADMIN";

type NavbarUser = {
  id: string;
  name?: string;
  email?: string;
  role: Role;
} | null;

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<NavbarUser>(null);
  const [loading, setLoading] = React.useState(true);

  const menu = [
    { title: "Home", href: "/" },
    { title: "Browse Tutors", href: "/tutors" },
    { title: "Categories", href: "/categories" },
    { title: "How It Works", href: "/how-it-works" },
  ];

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "TUTOR"
        ? "/tutor/dashboard"
        : "/dashboard";

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getSessionAction();
        setUser(res.user ?? null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };
  function getProfilePath(role?: string) {
    if (role === Roles.ADMIN) return "/admin/profile";
    if (role === Roles.TUTOR) return "/tutor/profile";
    return "/dashboard/profile"; // student default
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            SkillBridge
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 lg:flex">
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
        <div className="hidden items-center gap-2 lg:flex">
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
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                      SkillBridge
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                {menu.map((m) => (
                  <Link
                    key={m.title}
                    href={m.href}
                    className="text-sm font-semibold"
                  >
                    {m.title}
                  </Link>
                ))}

                <div className="mt-4 flex flex-col gap-3">
                  <ModeToggle />

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
                          <LayoutDashboard className="mr-2 h-4 w-4" />
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
                        <LogOut className="mr-2 h-4 w-4" />
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
