"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, ArrowRight, BookOpen, Layers, Sparkles, AlertCircle, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/services/category.services";
import { getIconComponent, getGradientForString } from "@/lib/icon-mapper";
import { getCategoriesAction } from "@/actions/category-action";

export function CategoriesView({
  categories,
  error,
  meta,
  searchParams,
}: {
  categories: Category[];
  error: string | null;
  meta?: any;
  searchParams?: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  // Initialize with current query parameter to avoid hydration mismatch
  const [searchTerm, setSearchTerm] = useState(searchParams?.searchTerm || "");
  const [isNavigating, setIsNavigating] = useState(false);
  const [suggestions, setSuggestions] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced effect for suggestions dropdown
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { categories: sugCategories } = await getCategoriesAction({ searchTerm, limit: "5" });
        setSuggestions(sugCategories);
      } catch (e) {
        setSuggestions([]);
      }
    };

    const handler = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Effect for updating URL (Main page search)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Don't trigger if it hasn't changed from URL
      const currentUrlTerm = searchParamsHook.get('searchTerm') || '';
      if (searchTerm === currentUrlTerm) return;
      
      setIsNavigating(true);
      const params = new URLSearchParams(searchParamsHook.toString());
      if (searchTerm) {
        params.set("searchTerm", searchTerm);
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1"); // Reset to page 1 on search
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, pathname, router, searchParamsHook]);

  // Handle Loading state clearing when URL actually changes
  useEffect(() => {
    setIsNavigating(false);
  }, [searchParamsHook]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      
      {/* 🚀 Feature Hero Banner for Attraction */}
      <section className="relative overflow-hidden pt-16 pb-20 mb-10 border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-y-1/2 bg-[#7c3aed] opacity-20 blur-[120px] rounded-full pointer-events-none z-0 animate-blob" />
        <div className="absolute top-1/2 right-1/4 h-[300px] w-[300px] -translate-y-1/2 bg-[#ec4899] opacity-20 blur-[100px] rounded-full pointer-events-none z-0 animate-blob [animation-delay:2s]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-white/20 bg-white/5 text-white backdrop-blur-md px-4 py-1.5 shadow-xl inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#f59e0b]" /> Elevate Your Career
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Master Premium <span className="bg-gradient-to-r from-[#22d3ee] to-[#a855f7] bg-clip-text text-transparent">Subjects</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 font-medium mb-10">
            Browse our extensive catalog of tutoring categories. Find vetted experts, book interactive sessions, and fast-track your learning journey.
          </p>

          <div className="max-w-xl mx-auto relative group z-50">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-[#7c3aed] transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search subjects (e.g. Mathematics, React, Node.js)"
              className="relative z-10 h-16 pl-12 pr-4 rounded-2xl bg-background/95 border-0 shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)] text-base font-semibold focus-visible:ring-2 focus-visible:ring-[#7c3aed]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {isNavigating && (
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-10">
                <Loader2 className="h-5 w-5 text-[#7c3aed] animate-spin" />
              </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-4">
                <ul className="py-2">
                  {suggestions.map((sug) => (
                    <li key={sug.id}>
                      <button
                        className="w-full text-left px-5 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 group/item"
                        onClick={() => {
                          setSearchTerm(sug.name);
                          setShowSuggestions(false);
                          
                          // Trigger strict route update immediately
                          setIsNavigating(true);
                          const params = new URLSearchParams(searchParamsHook.toString());
                          params.set("searchTerm", sug.name);
                          params.set("page", "1");
                          router.push(`${pathname}?${params.toString()}`);
                        }}
                      >
                        <Search className="h-4 w-4 text-muted-foreground group-hover/item:text-[#7c3aed] transition-colors" />
                        <span className="font-medium text-foreground group-hover/item:text-[#7c3aed] transition-colors">{sug.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🧩 Dynamic Grid Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="h-6 w-6 text-[#7c3aed]" /> Available Categories
          </h2>
          {meta?.total > 0 && (
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Showing {categories.length} of {meta.total} Result{meta.total > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <h3 className="text-lg font-bold">Network Error</h3>
            <p className="font-medium text-sm text-destructive/80">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-card/40 p-16 text-center flex flex-col items-center justify-center shadow-inner h-64">
             <div className="flex size-16 items-center justify-center rounded-full bg-muted shadow-inner mb-4">
                 <Search className="h-8 w-8 text-muted-foreground opacity-50" />
             </div>
             <p className="text-xl font-bold">No categories found</p>
             <p className="mt-2 text-sm text-muted-foreground font-medium max-w-sm">
               We couldn't find any subjects matching "{searchTerm}". Please try a different keyword or variation.
             </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((c: any) => {
                const Icon = getIconComponent(c.icon || c.name);
                const gradient = getGradientForString(c.name);
                // Handle different ways tutor count might be mapped
                const tCount = c._count?.tutorLinks || c.tutorCount || 0;
                
                return (
                  <Link
                    key={c.id}
                    href={`/tutors?category=${encodeURIComponent(c.name)}`}
                    className="group"
                  >
                    <Card className="card-3d h-full bg-card/60 backdrop-blur-md border-border/40 shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(124,58,237,0.2)] transition-all duration-300 rounded-2xl overflow-hidden">
                      <CardContent className="flex h-full flex-col p-6">
                        <div className="flex items-start justify-between gap-3 mb-6">
                          <div className={`flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          
                          <Badge variant="secondary" className="bg-muted/60 font-medium px-2 py-0.5 whitespace-nowrap text-xs border-0">
                            {tCount} Tutor{tCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-extrabold mb-1 group-hover:text-[#7c3aed] transition-colors">{c.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground line-clamp-2 mt-auto">
                          Find top-rated experts and dedicated mentors for {c.name}.
                        </p>

                        <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                           <span className="text-sm font-bold text-[#7c3aed] flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                             Explore Subject
                           </span>
                           <ArrowRight className="h-4 w-4 text-[#7c3aed] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="font-bold border-border/40"
                >
                  Previous
                </Button>
                <div className="text-sm font-semibold tracking-wide bg-card border border-border/40 px-4 py-2 rounded-lg shadow-sm">
                  Page {meta.page} of {meta.totalPages}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="font-bold border-border/40"
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
