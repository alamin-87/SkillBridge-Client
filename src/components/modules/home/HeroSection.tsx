import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import hero from "../../../../public/home/hero.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              Connect • Learn • Grow
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find the right tutor and{" "}
              <span className="text-primary">learn faster</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground">
              SkillBridge connects students with verified tutors. Browse by
              subject, check availability, and book sessions instantly.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/tutors">
                  Browse Tutors <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="/register">Become a Tutor</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 text-sm">
              <Stat label="Tutors" value="500+" />
              <Stat label="Subjects" value="120+" />
              <Stat label="Avg rating" value="4.8/5" />
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-80 w-full sm:h-105">
                  <Image
                    src={hero}
                    alt="Student learning online"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="absolute -bottom-6 left-6 hidden rounded-xl border bg-background/80 p-4 shadow-sm backdrop-blur lg:block">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Star className="h-4 w-4 text-yellow-500" />
                Trusted reviews from real students
              </div>
              <p className="text-xs text-muted-foreground">
                Book confidently with verified ratings
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3 text-center">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
