import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Search, ShieldCheck } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="container mx-auto px-4 py-14">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <p className="text-sm text-muted-foreground">
          Book a session in minutes — simple and fast.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <HowCard
          icon={<Search className="h-5 w-5 text-primary" />}
          title="Browse tutors"
          desc="Filter by subject, rating, and price to find the best match."
        />
        <HowCard
          icon={<CalendarCheck className="h-5 w-5 text-primary" />}
          title="Pick a time"
          desc="See availability slots and book instantly."
        />
        <HowCard
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
          title="Learn confidently"
          desc="Attend sessions and leave reviews to help others."
        />
      </div>
    </section>
  );
}

function HowCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3">{icon}</div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
