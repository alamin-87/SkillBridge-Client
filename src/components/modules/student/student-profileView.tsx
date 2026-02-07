import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Mail, Phone, CalendarDays, MapPin, User2, ShieldCheck } from "lucide-react";

export type Student = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  role?: "STUDENT" | "TUTOR" | "ADMIN" | string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt?: string;
  location?: string | null;
};

export function StudentProfileView({ student }: { student: Student }) {
  const displayName = student?.name?.trim() || "Student";
  const avatarSrc = student?.image?.trim() || "/images/default-avatar.png";

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header / About */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border">
                  <Image
                    src={avatarSrc}
                    alt={`${displayName} profile image`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h1 className="truncate text-2xl font-bold">{displayName}</h1>
                      <p className="text-muted-foreground">
                        {student?.role ? `${student.role}` : "STUDENT"}
                      </p>

                      {student?.location ? (
                        <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {student.location}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <User2 className="h-3.5 w-3.5" />
                        {student?.role ?? "STUDENT"}
                      </Badge>

                      <Badge variant="outline" className="gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {student?.status ?? "ACTIVE"}
                      </Badge>
                    </div>
                  </div>

                  {/* <Separator className="my-5" /> */}

                  {/* Contact */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {student?.email ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {student?.phone ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border p-4 sm:col-span-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Member since
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {student?.createdAt ? formatDate(student.createdAt) : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Extra IDs (optional) */}
                  {/* <div className="mt-5 rounded-xl border bg-muted/20 p-4">
                    <p className="text-xs font-medium text-muted-foreground">User ID</p>
                    <p className="mt-1 break-all text-sm font-semibold">{student?.id}</p>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings placeholder (if you add later) */}
          {/* <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Bookings</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Booking history will appear here (upcoming / completed / cancelled).
              </p>
            </CardContent>
          </Card> */}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">Actions</h3>
              <Separator />

              <Button asChild className="w-full">
                <Link href="/#">Message</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/#">Call</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">Quick info</h3>
              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{student?.role ?? "STUDENT"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{student?.status ?? "ACTIVE"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{student?.email ?? "—"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{student?.phone ?? "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

/** helpers */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
