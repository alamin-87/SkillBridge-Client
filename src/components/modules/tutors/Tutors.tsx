"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getIconComponent } from "@/lib/icon-mapper";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TutorCard } from "@/components/modules/home/DiscoverTutorsSection"; 
import { Tutor } from "@/types";
import { searchTutorsAction } from "@/actions/tutor-action";

export function TutorsPageClient({
  initialTutors,
  meta,
  initialSearch,
  initialSort,
  initialPage,
}: {
  initialTutors: Tutor[];
  meta: any;
  initialSearch: string;
  initialSort: string;
  initialPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  const [search, setSearch] = React.useState(initialSearch);
  const [sort, setSort] = React.useState(initialSort);
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Resolved Icons via Mapper
  const SearchIcon = getIconComponent("Search");
  const ArrowUpDownIcon = getIconComponent("ArrowUpDown");
  const Loader2Icon = getIconComponent("Loader2");
  const StarIcon = getIconComponent("Star");
  const SparklesIcon = getIconComponent("Sparkles");
  const FilterXIcon = getIconComponent("FilterX");
  
  // Suggestion States
  const [suggestions, setSuggestions] = React.useState<Tutor[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Auto-Complete Suggestions Effect
  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search || search.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { tutors: sugTutors } = await searchTutorsAction(search);
        setSuggestions(sugTutors ?? []);
      } catch (e) {
        setSuggestions([]);
      }
    };

    const handler = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Main debounced search/sort effect that triggers URL updates
  React.useEffect(() => {
    const handler = setTimeout(() => {
      // Don't trigger if it hasn't changed from URL
      const currentUrlSearch = searchParamsHook.get('search') || '';
      const currentUrlSort = searchParamsHook.get('sort') || 'rating_desc';
      
      if (search === currentUrlSearch && sort === currentUrlSort) return;
      
      setIsNavigating(true);
      const params = new URLSearchParams(searchParamsHook.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      if (sort !== 'rating_desc') {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }
      params.set("page", "1"); // reset to page 1 on new search/sort
      
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [search, sort, pathname, router, searchParamsHook]);

  // End loading state when URL finishes changing
  React.useEffect(() => {
    setIsNavigating(false);
  }, [searchParamsHook]);

  const clearFilters = () => {
    setSearch("");
    setSort("rating_desc");
    router.push(pathname);
  };

  const page = meta?.page ?? initialPage ?? 1;
  const total = meta?.total ?? initialTutors.length;
  const limit = meta?.limit ?? 12;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goPage = (p: number) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20 pb-20">
      
      {/* 🚀 Premium Hero Banner */}
      <section className="relative overflow-hidden pt-16 pb-20 mb-10 border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-linear-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] bg-linear-to-br from-[#7c3aed] to-[#ec4899] opacity-20 blur-[120px] rounded-full animate-blob pointer-events-none z-0" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] bg-linear-to-br from-[#06b6d4] to-[#10b981] opacity-20 blur-[120px] rounded-full animate-blob [animation-delay:3s] pointer-events-none z-0" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-white/20 bg-white/5 text-white backdrop-blur-md px-4 py-1.5 shadow-xl inline-flex items-center gap-2">
            <StarIcon className="h-4 w-4 text-[#f59e0b]" fill="currentColor" /> Top Rated Experts
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Find Your <span className="bg-linear-to-r from-[#a855f7] via-[#f472b6] to-[#22d3ee] bg-clip-text text-transparent">Perfect</span> Tutor
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 font-medium mb-10">
            Search and connect with elite educators across the globe. Compare ratings, read reviews, and book sessions seamlessly.
          </p>

          <div className="max-w-3xl mx-auto grid gap-4 md:grid-cols-12 relative z-50">
            
            {/* Live Search Input with Suggestions */}
            <div className="relative md:col-span-8 group z-50">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <SearchIcon className="h-5 w-5 text-muted-foreground group-focus-within:text-[#7c3aed] transition-colors" />
              </div>
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search by name, subject, or keyword..."
                className="relative z-10 h-14 pl-12 pr-4 rounded-xl bg-background/95 border-0 shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)] text-base font-semibold focus-visible:ring-2 focus-visible:ring-[#7c3aed]"
              />
              {isNavigating && (
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-10">
                  <Loader2Icon className="h-5 w-5 text-[#a855f7] animate-spin" />
                </div>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-4">
                  <ul className="py-2">
                    {suggestions.map((sug) => (
                      <li key={sug.id}>
                        <button
                          className="w-full text-left px-5 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 group/item border-b border-border/30 last:border-0"
                          onClick={() => {
                            setSearch(sug.user.name);
                            setShowSuggestions(false);
                            // Set instantly
                            setIsNavigating(true);
                            const params = new URLSearchParams(searchParamsHook.toString());
                            params.set("search", sug.user.name);
                            params.set("page", "1");
                            router.push(`${pathname}?${params.toString()}`);
                          }}
                        >
                          <div className="h-8 w-8 rounded-full bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
                            <SparklesIcon className="h-4 w-4 text-[#7c3aed]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground group-hover/item:text-[#7c3aed] transition-colors">
                              {sug.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {sug.bio || "Top rated tutor"}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative md:col-span-4 z-40">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-14 w-full rounded-xl border-0 bg-background/95 px-4 text-base font-semibold shadow-[0_0_40px_-10px_rgba(236,72,153,0.3)] focus:ring-2 focus:ring-[#ec4899] appearance-none cursor-pointer"
              >
                <option value="rating_desc">⭐ Top Rated</option>
                <option value="rating_asc">📉 Lowest Rated</option>
                <option value="price_asc">💵 Lowest Price</option>
                <option value="price_desc">💎 Highest Price</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🧩 Dynamic Grid Section */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-[#ec4899]" /> Available Tutors
          </h2>
          <div className="flex items-center gap-3">
            {searchParamsHook.toString() && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="h-8 rounded-full border-destructive/30 text-destructive hover:bg-destructive dark:hover:text-white"
              >
                <FilterXIcon className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
              </Button>
            )}
            <Badge variant="secondary" className="px-3 py-1 text-sm bg-muted/80">
              Showing {initialTutors.length} of {total}
            </Badge>
          </div>
        </div>

        {initialTutors.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-card/40 p-16 text-center flex flex-col items-center justify-center shadow-inner min-h-[400px]">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted shadow-inner mb-6">
                <SearchIcon className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <p className="text-2xl font-bold mb-2">No tutors found</p>
            <p className="max-w-md text-muted-foreground font-medium mb-8">
              We couldn't find any educators matching your search criteria. Try using different keywords, general subjects, or clear your filters.
            </p>
            <Button size="lg" className="rounded-xl px-8" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {initialTutors.map((t) => (
                <TutorCard key={t.id} tutor={t} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 mb-8 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl px-6 h-12 font-bold border-border/50 shadow-sm"
                  disabled={page <= 1}
                  onClick={() => goPage(page - 1)}
                >
                  Previous
                </Button>

                <div className="h-12 flex items-center justify-center px-6 rounded-xl bg-card border border-border/50 shadow-sm font-semibold tracking-wide text-muted-foreground">
                  Page <span className="text-foreground mx-1">{page}</span> of <span className="text-foreground ml-1">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  className="rounded-xl px-6 h-12 font-bold border-border/50 shadow-sm"
                  disabled={page >= totalPages}
                  onClick={() => goPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
