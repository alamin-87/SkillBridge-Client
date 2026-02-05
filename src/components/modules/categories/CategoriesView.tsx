import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Category } from "@/services/category.services";

export function CategoriesView({
  categories,
  error,
}: {
  categories: Category[];
  error: string | null;
}) {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Explore tutoring categories and find the right tutor faster.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {categories.length === 0 && !error ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-lg font-semibold">No categories found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please check again later.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/tutors?category=${encodeURIComponent(c.name)}`}
              className="group"
            >
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold">{c.name}</h3>
                    </div>

                    {typeof c.tutorCount === "number" && (
                      <Badge variant="secondary">{c.tutorCount} tutors</Badge>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-0 text-primary group-hover:underline"
                    >
                      Browse tutors <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
