import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Languages, CalendarClock, BookOpen, MapPin } from "lucide-react";
import type { Tutor } from "@/types";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function TutorProfileView({ tutor }: { tutor: Tutor }) {
  const displayName = tutor.user?.name ?? tutor.name ?? "Tutor";

  const languagesArray = Array.isArray(tutor.languages)
    ? tutor.languages
    : typeof tutor.languages === "string"
      ? tutor.languages.split(",").map((l: string) => l.trim()).filter(Boolean)
      : [];

  const categories = tutor.categories?.map((c) => c.category?.name).filter(Boolean) ?? [];

  const availability = Array.isArray(tutor.availability) ? tutor.availability : [];
  const openSlots = availability
    .filter((s) => !s.isBooked)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

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
                    src={tutor.profileImage || "/images/default-avatar.png"}
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
                        {tutor.title ?? "Professional Tutor"}
                      </p>

                      {(tutor as any).location && (
                        <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {(tutor as any).location}
                        </p>
                      )}
                    </div>

                    {/* Rating block */}
                    <div className="flex items-center gap-2">
                      {typeof tutor.avgRating === "number" && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3.5 w-3.5" />
                          {tutor.avgRating.toFixed(1)}
                        </Badge>
                      )}
                      {typeof tutor.totalReviews === "number" && (
                        <Badge variant="outline">{tutor.totalReviews} reviews</Badge>
                      )}
                      {typeof tutor.experienceYrs === "number" && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {tutor.experienceYrs}+ yrs
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <BookOpen className="h-4 w-4" />
                      Categories
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {categories.length > 0 ? (
                        categories.map((name) => (
                          <Badge key={name} variant="outline" className="rounded-full">
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="rounded-full">
                          Expert Tutor
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {tutor.bio && (
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                      {tutor.bio}
                    </p>
                  )}

                  {/* Languages */}
                  {languagesArray.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Languages className="h-4 w-4" />
                        Languages
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {languagesArray.map((l: string) => (
                          <Badge key={l} variant="secondary" className="rounded-full">
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability (main) */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" />
                  Availability
                </h2>
                <Badge variant="outline">
                  {openSlots.length} open slots
                </Badge>
              </div>

              <Separator className="my-4" />

              {openSlots.length === 0 ? (
                <div className="rounded-lg border p-6 text-center">
                  <p className="text-sm font-medium">No available slots right now</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try again later or message the tutor.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {openSlots.slice(0, 8).map((slot) => (
                    <div
                      key={slot.id}
                      className="rounded-xl border p-4 transition hover:bg-muted/50"
                    >
                      <p className="text-sm font-semibold">
                        {formatDateTime(slot.startTime)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {openSlots.length > 8 && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Showing 8 slots. View full availability during booking.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reviews placeholder */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Reviews</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Reviews will appear here after booking completion.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Pricing / Actions */}
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="text-3xl font-bold">
                  {tutor.hourlyRate ? `৳${tutor.hourlyRate}/hr` : "Flexible"}
                </p>
              </div>

              <Button className="w-full">Book a Session</Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/messages?tutor=${tutor.id}`}>Message Tutor</Link>
              </Button>

              <p className="text-xs text-muted-foreground">
                Booking flow will be available in student dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Quick facts */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">Quick info</h3>
              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{tutor.experienceYrs ?? 0}+ yrs</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">
                    {(tutor.avgRating ?? 0).toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-medium">{tutor.totalReviews ?? 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available slots</span>
                  <span className="font-medium">{openSlots.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

/** Formatting helpers */
function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}