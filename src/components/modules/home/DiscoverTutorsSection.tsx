"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Loader2,
  ArrowRight,
  Languages,
  BookOpen,
  CalendarClock,
  Sparkles,
} from "lucide-react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getTutorsAction } from "@/actions/tutor-action";
import {
  getTopRatedTutorsAction,
  searchTutorsAction,
} from "@/actions/tutor-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tutor } from "@/types";
import { Separator } from "@/components/ui/separator";
import { getIconComponent, getGradientForString } from "@/lib/icon-mapper";

export function DiscoverTutorsSection() {
  const [query, setQuery] = React.useState("");
  const [tutors, setTutors] = React.useState<Tutor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  // Debounce the query input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const loadTopTutors = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTopRatedTutorsAction();
      setTutors(res.tutors ?? []);
    } catch {
      setError("Could not load tutors. Please try again.");
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      loadTopTutors();
      return;
    }

    const fetchSearchedTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchTutorsAction(q);
        setTutors(pickTopRated3(res.tutors ?? []));
      } catch {
        setError("Search failed. Please try again.");
        setTutors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchedTutors();
  }, [debouncedQuery, loadTopTutors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by the debounced effect
  };

  const handleClear = async () => {
    setQuery("");
    await loadTopTutors();
  };

  const handlePopularSearch = (s: string) => {
    setQuery(s);
    setLoading(true);
    searchTutorsAction(s).then((res) => {
      setTutors((res.tutors ?? []).slice(0, 3));
      setLoading(false);
    }).catch(() => {
      setError("Search failed.");
      setLoading(false);
    });
  };

  return (
    <section className="relative container mx-auto px-4 py-20 lg:py-28">
      {/* Decorative background meshes */}
      <div className="absolute top-1/2 left-0 h-[600px] w-[600px] -translate-y-1/2 -translate-x-1/2 bg-[#06b6d4]/5 blur-[120px] rounded-full point-events-none -z-10" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-[#ec4899]/5 blur-[120px] rounded-full point-events-none -z-10" />

      <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#ec4899]">Perfect Match</span>
        </h2>
        <p className="text-lg text-muted-foreground font-medium">
          Whether you need help with a tough subject or want to learn a new skill, we have the right expert for you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Search panel */}
        <Card className="lg:col-span-4 border-border/40 bg-card/60 backdrop-blur-2xl shadow-xl shadow-[#7c3aed]/5 rounded-3xl h-fit sticky top-24">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#ec4899] shadow-lg shadow-[#7c3aed]/20">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Discover Tutors</h3>
                <p className="text-sm text-muted-foreground">Search our global network.</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
              <div className="relative group">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Mathematics, React, IELTS"
                  className="h-14 pl-12 bg-background/50 border-border/60 rounded-xl shadow-inner focus:shadow-md focus:shadow-[#7c3aed]/10 transition-all font-medium text-base"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#7c3aed] transition-colors" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" className="btn-3d flex-1 h-12 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-bold rounded-xl text-base" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Searching</>
                  ) : "Search Tutors"}
                </Button>

                <Button type="button" variant="outline" onClick={handleClear} disabled={loading || !query} className="h-12 rounded-xl border-border/60 hover:bg-muted/50 font-bold">
                  Clear
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-[#f59e0b]" /> Popular Searches
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["Math", "English", "IELTS", "React", "Physics", "Python"].map((s) => (
                  <button key={s} type="button" onClick={() => handlePopularSearch(s)} className="group">
                    <Badge variant="secondary" className="px-3.5 py-1.5 text-sm font-medium bg-secondary/50 hover:bg-[#7c3aed]/10 hover:text-[#7c3aed] transition-colors rounded-lg border border-border/50 group-hover:border-[#7c3aed]/30 shadow-sm">
                      {s}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-card/40 backdrop-blur-md p-6 rounded-3xl border border-border/40 shadow-sm">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {query.trim() ? (
                  <><Search className="h-6 w-6 text-[#7c3aed]" /> Search Results</>
                ) : (
                  <><Star className="h-6 w-6 text-[#f59e0b]" /> Top Rated Tutors</>
                )}
              </h3>
              <p className="text-base text-muted-foreground mt-1">
                {query.trim()
                  ? `Showing top results for "${query.trim()}"`
                  : "Handpicked experts for guaranteed quality."}
              </p>
            </div>

            <Button asChild variant="ghost" className="font-bold text-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#7c3aed]/10 rounded-xl group">
              <Link href="/tutors">
                View all tutors <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm font-bold text-destructive shadow-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center p-12 text-[#7c3aed] gap-4 bg-card/30 rounded-3xl border border-border/40 h-64">
              <Loader2 className="h-10 w-10 animate-spin opacity-50" />
              <p className="font-bold animate-pulse">Scanning the network...</p>
            </div>
          )}

          {!loading && !error && tutors.length === 0 && (
            <div className="rounded-3xl border border-border/50 bg-card/30 p-12 text-center h-64 flex flex-col items-center justify-center shadow-inner">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-xl font-bold text-foreground">No matches found</p>
              <p className="mt-2 text-base text-muted-foreground">
                We couldn&apos;t find anyone for &quot;{query}&quot;. Try a broader term.
              </p>
            </div>
          )}

          {!loading && !error && tutors.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {tutors.map((t) => (
                <TutorCard key={t.id} tutor={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const name = tutor.user?.name ?? "Tutor";

  const languages = Array.isArray(tutor.languages)
    ? tutor.languages.slice(0, 2)
    : typeof tutor.languages === "string"
      ? tutor.languages.split(",").map((l: string) => l.trim()).filter(Boolean).slice(0, 2)
      : [];

  const categories = tutor.categories?.slice(0, 2) ?? [];
  const { nextSlotLabel, availableCount } = getAvailabilitySummary(tutor.availability);

  return (
    <Card className="card-3d group h-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl flex flex-col shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(124,58,237,0.3)]">
      <CardContent className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <Avatar className="h-16 w-16 border-2 border-background shadow-md ring-2 ring-primary/10">
            <AvatarImage src={tutor.profileImage ?? undefined} alt={name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-[#7c3aed] to-[#ec4899] text-white text-lg font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end gap-1.5">
            {typeof tutor.avgRating === "number" && (
              <div className="rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] px-3 py-1 text-xs font-bold text-white shadow-sm shadow-[#f59e0b]/20 flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-white" />
                {tutor.avgRating.toFixed(1)}
              </div>
            )}
            {typeof tutor.totalReviews === "number" && (
              <span className="text-[11px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                {tutor.totalReviews} views
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xl font-extrabold leading-tight mb-2 truncate group-hover:text-[#7c3aed] transition-colors">{name}</h4>
          <div className="flex flex-wrap items-center gap-2">
            {categories.length ? (
              categories.map((c) => {
                const CatIcon = getIconComponent((c.category as any).icon || c.category.name);
                const gradient = getGradientForString(c.category.name);
                return (
                  <Badge key={c.category.id} variant="secondary" className={`rounded-md px-2.5 py-1 text-xs font-semibold bg-gradient-to-r ${gradient} text-white shadow-sm border-0 flex items-center gap-1.5`}>
                    <CatIcon className="h-3 w-3" /> {c.category.name}
                  </Badge>
                );
              })
            ) : (
              <Badge variant="secondary" className="rounded-md px-2.5 py-1 text-xs font-semibold bg-secondary/60 flex items-center gap-1.5">
                <BookOpen className="h-3 w-3" /> General Expert
              </Badge>
            )}
          </div>
        </div>

        {tutor.bio && (
          <p className="line-clamp-2 text-sm font-medium leading-relaxed text-muted-foreground mb-6 flex-1">
            {tutor.bio}
          </p>
        )}

        <div className="mt-auto space-y-3 pb-5 border-b border-border/40">
          <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            {typeof tutor.experienceYrs === "number" && (
              <span className="inline-flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md">
                <Clock className="h-3.5 w-3.5 text-[#7c3aed]" />
                {tutor.experienceYrs}+ Yrs Exp
              </span>
            )}
            {languages.length > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md truncate max-w-[120px]">
                <Languages className="h-3.5 w-3.5 text-[#ec4899]" />
                {languages.join(", ")}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-2 text-xs font-semibold mt-1">
            <div className={`p-1 rounded-full ${availableCount > 0 ? "bg-[#10b981]/10 text-[#10b981]" : "bg-muted text-muted-foreground"}`}>
              <CalendarClock className="h-3.5 w-3.5" />
            </div>
            {availableCount > 0 ? (
              <span className="text-foreground">Next: <span className="text-[#10b981]">{nextSlotLabel}</span> ({availableCount} left)</span>
            ) : (
              <span className="text-muted-foreground">Fully Booked</span>
            )}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-extrabold text-foreground tracking-tight">
              {tutor.hourlyRate ? `৳${tutor.hourlyRate}` : "Negotiable"} <span className="text-xs font-medium text-muted-foreground font-sans">/hr</span>
            </p>
          </div>
          <Button asChild size="sm" className="h-9 px-4 rounded-xl bg-foreground text-background hover:bg-[#7c3aed] hover:text-white transition-colors duration-300 shadow-md">
            <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getInitials(name: string = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}

function pickTopRated3(list: Tutor[]) {
  return [...list].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0)).slice(0, 3);
}

function getAvailabilitySummary(availability?: any[]) {
  if (!Array.isArray(availability) || availability.length === 0) {
    return { nextSlotLabel: "—", availableCount: 0 };
  }
  const open = availability.filter((s) => !s.isBooked && s.startTime).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  if (open.length === 0) return { nextSlotLabel: "—", availableCount: 0 };
  const next = open[0];
  const label = formatSlot(next.startTime);
  return { nextSlotLabel: label, availableCount: open.length };
}

function formatSlot(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
