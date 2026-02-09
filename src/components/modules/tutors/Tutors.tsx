"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TutorCard } from "@/components/modules/home/DiscoverTutorsSection"; // or move TutorCard to shared component
import { Tutor } from "@/types";

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
  const sp = useSearchParams();

  const [search, setSearch] = React.useState(initialSearch);
  const [sort, setSort] = React.useState(initialSort);

  const submit = () => {
    const params = new URLSearchParams(sp.toString());
    params.set("search", search);
    params.set("sort", sort);
    params.set("page", "1");
    router.push(`/tutors?${params.toString()}`);
  };

  const clear = () => {
    setSearch("");
    setSort("rating_desc");
    router.push("/tutors");
  };

  const page = meta?.page ?? initialPage ?? 1;
  const total = meta?.total ?? initialTutors.length;
  const limit = meta?.limit ?? 12;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goPage = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(p));
    router.push(`/tutors?${params.toString()}`);
  };

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Browse Tutors</h1>
        <p className="text-sm text-muted-foreground">
          Search and compare tutors by subject, price, and rating.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-5">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-7">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tutors (Math, IELTS, React...)"
                className="pl-9"
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="rating_desc">Top rated</option>
                <option value="rating_asc">Lowest rated</option>
                <option value="price_asc">Lowest price</option>
                <option value="price_desc">Highest price</option>
              </select>
            </div>

            <div className="flex gap-2 md:col-span-2">
              <Button className="flex-1" onClick={submit}>
                Apply
              </Button>
              <Button variant="outline" onClick={clear}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {initialTutors.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-lg font-semibold">No tutors found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try different keywords or clear filters.
          </p>
          <Button className="mt-4" variant="outline" onClick={clear}>
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{initialTutors.length}</span> tutors
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowUpDown className="h-4 w-4" />
              Sorted by <span className="font-medium">{sort}</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {initialTutors.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => goPage(page - 1)}
            >
              Prev
            </Button>

            <p className="text-sm text-muted-foreground">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => goPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
