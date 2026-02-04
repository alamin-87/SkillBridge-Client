"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

export function Navbar() {
  const menu = [
    { title: "Home", href: "/" },
    { title: "Browse Tutors", href: "/tutors" },
    { title: "Categories", href: "/categories" },
    { title: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">SkillBridge</span>
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
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Sign up</Link>
          </Button>
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
                    <span className="text-lg font-semibold tracking-tight">SkillBridge</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                {menu.map((m) => (
                  <Link key={m.title} href={m.href} className="text-sm font-semibold">
                    {m.title}
                  </Link>
                ))}

                <div className="mt-4 flex flex-col gap-3">
                  <ModeToggle />
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
