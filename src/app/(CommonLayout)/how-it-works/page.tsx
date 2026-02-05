import Link from "next/link";
import {
  Search,
  CalendarCheck,
  GraduationCap,
  UserPlus,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const studentSteps = [
  {
    title: "Search tutors",
    description: "Find tutors by category, rating, price, and availability.",
    icon: Search,
  },
  {
    title: "Book instantly",
    description: "Pick a slot that works for you and confirm the session.",
    icon: CalendarCheck,
  },
  {
    title: "Learn & review",
    description: "Join the session, improve fast, then leave a review.",
    icon: GraduationCap,
  },
];

const tutorSteps = [
  {
    title: "Create profile",
    description: "Show your expertise, subjects, rate, and teaching style.",
    icon: UserPlus,
  },
  {
    title: "Set availability",
    description: "Add time slots — students can book instantly.",
    icon: Clock,
  },
  {
    title: "Teach securely",
    description: "Manage sessions, track bookings, and build trust with reviews.",
    icon: ShieldCheck,
  },
];

export default function HowItWorksPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary">SkillBridge Guide</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          How SkillBridge Works
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Whether you’re a student looking to learn or a tutor ready to teach,
          SkillBridge makes it simple to connect and grow.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/tutors">
              Browse tutors <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Become a tutor</Link>
          </Button>
        </div>
      </div>

      <Separator className="my-10" />

      {/* Student Flow */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">For Students</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn anything in three steps.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {studentSteps.map((s, i) => (
            <Card
              key={s.title}
              className="transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Tutor Flow */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">For Tutors</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start teaching and earning with clarity.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {tutorSteps.map((s, i) => (
            <Card
              key={s.title}
              className="transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick answers before you begin.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>How do I book a tutor?</AccordionTrigger>
            <AccordionContent>
              Browse tutors, open a profile, choose an available slot, and confirm
              booking. Your upcoming sessions will show in your dashboard.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>How do tutors set availability?</AccordionTrigger>
            <AccordionContent>
              Tutors add time slots from their dashboard. Students can book those
              slots instantly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>When can I leave a review?</AccordionTrigger>
            <AccordionContent>
              Students can leave reviews after a session is completed, helping the
              community make better choices.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border bg-muted/30 p-8 text-center">
        <h3 className="text-xl font-semibold">Ready to get started?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Join SkillBridge today — learn faster or start earning as a tutor.
        </p>

        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/register">Create account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tutors">Browse tutors</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
