"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getIconComponent } from "@/lib/icon-mapper";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

function getInitials(name: string = ""): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardHeaderProfile({ initialUser }: { initialUser: any }) {
  const router = useRouter();
  const [user, setUser] = React.useState(initialUser);

  // Resolved Icons via Mapper
  const LogOutIcon = getIconComponent("LogOut");
  const UserIcon = getIconComponent("User");
  const SettingsIcon = getIconComponent("Settings");
  const HelpCircleIcon = getIconComponent("HelpCircle");

  // Use Better Auth's client-side session for live updates
  const { data: sessionData } = authClient.useSession();

  React.useEffect(() => {
    // If the client-side session has user data, prefer it over the SSR prop
    if (sessionData?.user) {
      const u = sessionData.user as Record<string, unknown>;
      setUser({
        ...initialUser,
        name: u.name || initialUser?.name,
        email: u.email || initialUser?.email,
        image: u.image || initialUser?.image,
        role: u.role || initialUser?.role,
      });
    } else if (initialUser) {
      setUser(initialUser);
    }
  }, [sessionData, initialUser]);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null);
            router.push("/login");
            router.refresh(); // Native hard refresh tracking session drop completely globally
          },
        },
      });
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 border">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={(user?.role === "ADMIN") ? "/admin/profile" : (user?.role === "TUTOR" ? "/tutor/profile" : "/dashboard/profile")} className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <SettingsIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help" className="cursor-pointer">
              <HelpCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Help Center</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
