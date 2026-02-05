import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="container mx-auto px-4 py-14">
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Ready to start learning?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a free account and book your first session today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tutors">Browse tutors</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
