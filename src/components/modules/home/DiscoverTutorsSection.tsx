"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Star, Loader2, ArrowRight, Languages } from "lucide-react";
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

export function DiscoverTutorsSection() {
  const [query, setQuery] = React.useState("");
  const [tutors, setTutors] = React.useState<Tutor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
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
    loadTopTutors();
  }, [loadTopTutors]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const q = query.trim();
    if (!q) return loadTopTutors();

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

  const handleClear = async () => {
    setQuery("");
    await loadTopTutors();
  };

  return (
    <section className="container mx-auto px-4 py-14">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search panel */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Discover Tutors</h2>
                <p className="text-sm text-muted-foreground">
                  Search and instantly find the best tutors.
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="mt-6 space-y-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: Math, IELTS, React..."
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={loading || !query}
                >
                  Clear
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-xs font-medium text-muted-foreground">
                Popular searches
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Math", "English", "IELTS", "React", "Physics", "Python"].map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setQuery(s);
                        // trigger search
                        searchTutorsAction(s).then((res) =>
                          setTutors((res.tutors ?? []).slice(0, 3)),
                        );
                      }}
                    >
                      <Badge variant="secondary">{s}</Badge>
                    </button>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {query.trim() ? "Top matches" : "Top rated tutors"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {query.trim()
                    ? `Showing top results for “${query.trim()}”`
                    : "Handpicked for quality and ratings."}
                </p>
              </div>

              <Button asChild variant="outline" size="sm">
                <Link href="/tutors">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading tutors...
              </div>
            )}

            {!loading && !error && tutors.length === 0 && (
              <div className="rounded-lg border p-6 text-center">
                <p className="text-sm font-medium">No tutors found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different keyword.
                </p>
              </div>
            )}

            {!loading && !error && tutors.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tutors.map((t) => (
                  <TutorCard key={t.id} tutor={t} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
export function TutorCard({ tutor }: { tutor: Tutor }) {
  const subjects = tutor.subjects?.slice(0, 3) ?? [];
  const languages = Array.isArray(tutor.languages)
    ? tutor.languages.slice(0, 2)
    : typeof tutor.languages === "string"
      ? tutor.languages.split(",").map((l) => l.trim())
      : [];

  return (
    <Card className="group h-full overflow-hidden border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-5">
        {/* Top row */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage
              src={tutor.profileImage ?? undefined}
              alt={tutor.name}
            />
            <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="truncate text-base font-semibold leading-tight">
                  {tutor.user.name}
                </h4>
                <p className="truncate text-sm text-muted-foreground">
                  {tutor.title ?? "Expert Tutor"}
                </p>
                {typeof tutor.experienceYrs === "number" && (
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {tutor.experienceYrs}+ years experience
                  </p>
                )}
              </div>

              <div className=" flex flex-col">
                {/* rating pill */}
                {typeof tutor.avgRating === "number" && (
                  <div className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {tutor.avgRating.toFixed(1)}
                    </span>
                  </div>
                )}
                {typeof tutor.totalReviews === "number" && (
                  <span>{tutor.totalReviews} reviews</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subjects */}
        {subjects.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {subjects.map((s) => (
              <Badge key={s} variant="outline" className="rounded-full px-3">
                {s}
              </Badge>
            ))}
            {tutor.subjects && tutor.subjects.length > 3 && (
              <Badge variant="outline" className="rounded-full px-3">
                +{tutor.subjects.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Bio */}
        {tutor.bio && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {tutor.bio}
          </p>
        )}

        {/* small meta */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {languages && languages.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Languages className="h-3.5 w-3.5" />
              {languages.join(", ")}
            </span>
          )}
        </div>

        <Separator className="my-4" />

        {/* Bottom row (price + experience + CTA) */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              {tutor.hourlyRate
                ? `৳${tutor.hourlyRate}/hr`
                : "Flexible pricing"}
            </p>
          </div>

          <Button asChild size="sm" className="gap-2">
            <Link href={`/tutors/${tutor.id}`}>
              View <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getInitials(name: string = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}
function pickTopRated3(list: Tutor[]) {
  return [...list]
    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    .slice(0, 3);
}
