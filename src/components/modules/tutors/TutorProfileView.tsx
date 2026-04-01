import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Tutor } from "@/types";
import { BookSessionModal } from "./book-session-modal";
import { getIconComponent, getGradientForString } from "@/lib/icon-mapper";

export function TutorProfileView({ tutor }: { tutor: Tutor }) {
  
  // Resolved Icons via Mapper
  const StarIcon = getIconComponent("Star");
  const ClockIcon = getIconComponent("Clock");
  const LanguagesIcon = getIconComponent("Languages");
  const CalendarClockIcon = getIconComponent("CalendarClock");
  const BookOpenIcon = getIconComponent("BookOpen");
  const MapPinIcon = getIconComponent("MapPin");
  const GraduationCapIcon = getIconComponent("GraduationCap");
  const MessageSquareIcon = getIconComponent("MessageSquare");
  const ShieldCheckIcon = getIconComponent("ShieldCheck");
  const ZapIcon = getIconComponent("Zap");
  const displayName = tutor.user?.name ?? tutor.name ?? "Tutor";

  const languagesArray = Array.isArray(tutor.languages)
    ? tutor.languages
    : typeof tutor.languages === "string"
      ? tutor.languages
          .split(",")
          .map((l: string) => l.trim())
          .filter(Boolean)
      : [];

  const categories =
    tutor.categories?.map((c) => c.category?.name).filter(Boolean) ?? [];

  const availability = Array.isArray(tutor.availability)
    ? tutor.availability
    : [];
  const openSlots = availability
    .filter((s) => !s.isBooked)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20 pb-20">
      {/* 🚀 Dynamic Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-32 border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-linear-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] bg-linear-to-br from-[#ec4899] to-[#8b5cf6] opacity-20 blur-[120px] rounded-full animate-blob pointer-events-none z-0" />
        
        <div className="relative z-10 container mx-auto px-4">
          <Link href="/tutors" className="inline-flex items-center text-sm font-semibold text-white/70 hover:text-white mb-8 transition-colors">
            ← Back to Tutors
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative h-40 w-40 md:h-48 md:w-48 shrink-0 overflow-hidden rounded-full border-4 border-background/20 shadow-2xl backdrop-blur-sm group">
              <Image
                src={tutor.profileImage || "/images/default-avatar.png"}
                alt={`${displayName} profile image`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                <Badge variant="outline" className="border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#22d3ee] backdrop-blur-md px-3 py-1 uppercase tracking-widest text-[10px]">
                  Verified Tutor <ShieldCheckIcon className="ml-1.5 h-3 w-3 inline" />
                </Badge>
                {openSlots.length > 0 && (
                  <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#34d399] backdrop-blur-md px-3 py-1 uppercase tracking-widest text-[10px]">
                    Available Now <ZapIcon className="ml-1.5 h-3 w-3 inline" />
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2">
                {displayName}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-medium mb-4">
                {tutor.title ?? "Professional Educator & Mentor"}
              </p>

              {(tutor as any).location && (
                <p className="inline-flex items-center gap-2 text-sm text-white/60 mb-6 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <MapPinIcon className="h-4 w-4 text-[#ec4899] shrink-0" />
                  {(tutor as any).location}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {typeof tutor.avgRating === "number" && (
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-md border border-white/10">
                    <StarIcon className="h-5 w-5 text-[#f59e0b] shrink-0" fill="currentColor" />
                    <span className="text-white font-bold text-lg">{tutor.avgRating.toFixed(1)}</span>
                    <span className="text-white/50 text-sm">({tutor.totalReviews || 0} reviews)</span>
                  </div>
                )}
                {typeof tutor.experienceYrs === "number" && (
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-md border border-white/10">
                    <ClockIcon className="h-5 w-5 text-[#3b82f6] shrink-0" />
                    <span className="text-white font-bold text-lg">{tutor.experienceYrs}+</span>
                    <span className="text-white/50 text-sm">Years Exp.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 Content Grid */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Bio */}
            <Card className="card-3d bg-card/60 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                  <GraduationCapIcon className="h-7 w-7 text-[#7c3aed] shrink-0" />
                  About Me
                </h2>
                
                <div className="prose dark:prose-invert max-w-none">
                  {tutor.bio ? (
                    <p className="leading-relaxed text-muted-foreground text-base md:text-lg">
                      {tutor.bio}
                    </p>
                  ) : (
                    <p className="leading-relaxed text-muted-foreground italic">
                      This tutor hasn't added a biography yet.
                    </p>
                  )}
                </div>

                <Separator className="my-8 border-border/50" />

                <div className="grid sm:grid-cols-2 gap-8">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <BookOpenIcon className="h-4 w-4 text-[#ec4899] shrink-0" />
                      Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.length > 0 ? (
                        categories.map((name) => {
                          const CatIcon = getIconComponent(name);
                          const gradient = getGradientForString(name);
                          return (
                            <Badge
                              key={name}
                              variant="secondary"
                              className={`bg-linear-to-r ${gradient} text-white shadow-sm border-0 text-sm px-3 py-1 rounded-full flex items-center gap-1.5`}
                            >
                              <CatIcon className="h-3.5 w-3.5 shrink-0" /> {name}
                            </Badge>
                          );
                        })
                      ) : (
                        <Badge variant="secondary" className="rounded-full flex items-center gap-1.5">
                          <BookOpenIcon className="h-3.5 w-3.5 shrink-0"/> General subjects
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  {languagesArray.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <LanguagesIcon className="h-4 w-4 text-[#3b82f6] shrink-0" />
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {languagesArray.map((l: string) => (
                          <Badge
                            key={l}
                            variant="secondary"
                            className="bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20 border-0 text-sm px-3 py-1 rounded-full"
                          >
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="card-3d bg-card/60 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <CalendarClockIcon className="h-7 w-7 text-[#10b981] shrink-0" />
                    Available Sessions & Packages
                  </h2>
                  <Badge variant="outline" className="font-semibold text-sm px-3 py-1 border-[#10b981]/30 bg-[#10b981]/5 text-[#10b981]">
                    {openSlots.length} open slots
                  </Badge>
                </div>

                {openSlots.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center">
                    <p className="text-lg font-bold">No available slots right now</p>
                    <p className="mt-2 text-muted-foreground">
                      This tutor is currently fully booked. Please check back later or send them a message!
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4 font-medium bg-muted/30 p-3 rounded-lg border-l-4 border-l-[#10b981]">
                      Select an active time slot below. Tutors offer both one-time sessions and 30-day recurring package schedules.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {openSlots.slice(0, 9).map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-2xl border border-border/40 bg-background/50 p-4 transition-all hover:bg-muted/50 hover:border-[#10b981]/50 hover:shadow-md group cursor-default"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold group-hover:text-[#10b981] transition-colors flex items-center flex-wrap gap-1.5">
                            <span className="text-xs text-muted-foreground font-normal tracking-wide uppercase mr-0.5">Starts:</span>
                            {formatDateTime(slot.startTime)}
                          </p>
                          <Badge variant={(slot as any).type === 'PACKAGE_30D' ? "default" : "secondary"} className="text-[9px] h-4.5 px-1 shrink-0">
                            {(slot as any).type === 'PACKAGE_30D' ? '30 Days' : '1 Session'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <ClockIcon className="h-3 w-3 shrink-0" />
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </p>
                        <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
                           <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Total Price</span>
                           <span className="text-sm font-extrabold text-[#10b981]">
                             ৳{
                               (Number(tutor.hourlyRate ?? 0) * 
                               ((new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) / (1000 * 60 * 60)) * 
                               ((slot as any).type === "PACKAGE_30D" ? 30 : 1)).toLocaleString()
                             }
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {openSlots.length > 9 && (
                    <div className="mt-6 text-center">
                      <p className="text-sm font-semibold text-muted-foreground bg-muted/40 inline-block px-4 py-2 rounded-full">
                        + {openSlots.length - 9} more slots available during checkout
                      </p>
                    </div>
                  )}
                </>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="card-3d bg-card/60 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-10 text-center">
                <StarIcon className="h-12 w-12 text-[#f59e0b]/50 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Student Reviews</h2>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Detailed reviews and ratings will appear here after students complete their booked sessions with {displayName}.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            
            {/* Action Card */}
            <Card className="sticky top-24 card-3d border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#7c3aed]/10 to-[#ec4899]/10 z-0 pointer-events-none" />
              <CardContent className="p-8 relative z-10 space-y-6">
                <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 text-center shadow-inner">
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Base Hourly Rate</p>
                  <p className="text-4xl font-extrabold bg-linear-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
                    {tutor.hourlyRate ? `৳${tutor.hourlyRate.toLocaleString()}` : "Flexible"}
                  </p>
                  {tutor.hourlyRate && <p className="text-xs text-muted-foreground mt-2 font-medium">Varies by Session Duration<br/>(30-day packages billed at 30x rate)</p>}
                </div>

                <div className="space-y-3 pt-2">
                  <BookSessionModal
                    tutorProfileId={tutor.id}
                    tutorId={tutor.user?.id}
                    hourlyRate={Number(tutor.hourlyRate ?? 0)}
                    openSlots={openSlots}
                  />
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
                   <ShieldCheckIcon className="h-4 w-4 text-[#10b981] shrink-0" />
                   <span className="text-xs font-semibold text-muted-foreground">Secure Payments & Booking</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Summary */}
            <Card className="card-3d bg-card/60 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="font-bold text-lg mb-6">Tutor Snapshot</h3>
                
                <div className="space-y-5 text-sm font-medium">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-[#3b82f6] shrink-0" /> Experience
                    </span>
                    <span className="font-bold text-foreground bg-background rounded-md px-2 py-1 shadow-sm">
                      {tutor.experienceYrs ?? 0}+ yrs
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-[#f59e0b] shrink-0" /> Avg. Rating
                    </span>
                    <span className="font-bold text-foreground bg-background rounded-md px-2 py-1 shadow-sm">
                      {(tutor.avgRating ?? 0).toFixed(1)} / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MessageSquareIcon className="h-4 w-4 text-[#8b5cf6] shrink-0" /> Reviews
                    </span>
                    <span className="font-bold text-foreground bg-background rounded-md px-2 py-1 shadow-sm">
                      {tutor.totalReviews ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <CalendarClockIcon className="h-4 w-4 text-[#10b981] shrink-0" /> Upcoming Slots
                    </span>
                    <span className="font-bold text-foreground bg-background rounded-md px-2 py-1 shadow-sm">
                      {openSlots.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
