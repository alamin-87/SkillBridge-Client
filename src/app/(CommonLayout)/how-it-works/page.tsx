import Link from "next/link";
import {
  Search,
  CalendarCheck,
  GraduationCap,
  UserPlus,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Rocket,
  MessageCircleQuestion,
  Star,
  CheckCircle2
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
    title: "Find Your Perfect Match",
    description: "Browse thousands of expert tutors by subject, availability, and hourly rate. Use our instant smart search to pinpoint precisely who you need.",
    icon: Search,
    color: "from-[#3b82f6] to-[#06b6d4]",
    lightUrl: "bg-[#3b82f6]/10 text-[#3b82f6]",
  },
  {
    title: "Book Instantly",
    description: "No more waiting for email replies. Pick an open slot on their interactive calendar, confirm your payment securely, and you're set.",
    icon: CalendarCheck,
    color: "from-[#10b981] to-[#34d399]",
    lightUrl: "bg-[#10b981]/10 text-[#10b981]",
  },
  {
    title: "Learn & Grow",
    description: "Join your scheduled session, master new skills rapidly, and leave a glowing review to help the community.",
    icon: GraduationCap,
    color: "from-[#8b5cf6] to-[#c084fc]",
    lightUrl: "bg-[#8b5cf6]/10 text-[#8b5cf6]",
  },
];

const tutorSteps = [
  {
    title: "Build Your Brand",
    description: "Create a stunning profile highlighting your expertise, years of experience, and unique teaching methodology.",
    icon: UserPlus,
    color: "from-[#f59e0b] to-[#fbbf24]",
    lightUrl: "bg-[#f59e0b]/10 text-[#f59e0b]",
  },
  {
    title: "Control Your Schedule",
    description: "You are the boss. Add your exact availability slots to your dashboard calendar, and let students book you on autopilot.",
    icon: Clock,
    color: "from-[#ec4899] to-[#f472b6]",
    lightUrl: "bg-[#ec4899]/10 text-[#ec4899]",
  },
  {
    title: "Teach & Earn",
    description: "Conduct your sessions, guarantee safe payouts through our secure system, and build a powerful 5-star reputation.",
    icon: ShieldCheck,
    color: "from-[#6366f1] to-[#818cf8]",
    lightUrl: "bg-[#6366f1]/10 text-[#6366f1]",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 overflow-hidden">
      
      {/* 🚀 Premium Hero Banner */}
      <section className="relative overflow-hidden pt-24 pb-32 mb-16 border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] bg-gradient-to-br from-[#7c3aed] to-[#ec4899] opacity-30 blur-[150px] rounded-full animate-blob pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] opacity-20 blur-[150px] rounded-full animate-blob [animation-delay:4s] pointer-events-none z-0" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-white/20 bg-white/5 text-white backdrop-blur-md px-4 py-1.5 shadow-xl inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#22d3ee]" /> The Official SkillBridge Guide
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            How SkillBridge <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">Works</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 font-medium mb-12">
            Whether you are a passionate student striving for excellence or an expert tutor ready to monetize your skills, we've engineered the perfect platform for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl bg-white text-[#5b21b6] hover:bg-gray-100 hover:text-[#7c3aed] shadow-[0_0_40px_-5px_rgba(124,58,237,0.5)] transition-all group">
              <Link href="/tutors" className="flex items-center">
                Find a Tutor <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-md transition-all">
              <Link href="/register">Become an Educator</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 🧭 Student Flow */}
      <section className="container mx-auto px-4 mb-24 relative z-20">
        <div className="text-center mb-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#06b6d4]/20 border border-[#3b82f6]/30 shadow-lg backdrop-blur-xl mb-6">
            <GraduationCap className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">The Student Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Learn absolutely anything in three simple, frictionless steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent z-0" />
          
          {studentSteps.map((s, i) => (
            <div key={s.title} className="relative z-10 group">
              <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-xl font-bold shadow-lg ring-8 ring-background group-hover:scale-110 transition-transform duration-300 mb-8`}>
                {i + 1}
              </div>
              <Card className="card-3d h-full bg-card/60 backdrop-blur-xl border-border/40 hover:shadow-2xl hover:border-[#3b82f6]/50 transition-all duration-300 rounded-3xl overflow-hidden text-center p-2">
                <CardContent className="p-8">
                  <div className={`mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl ${s.lightUrl} group-hover:rotate-6 transition-transform duration-300`}>
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4"><Separator className="border-border/60" /></div>

      {/* 🚀 Tutor Flow */}
      <section className="container mx-auto px-4 mt-24 mb-24 relative z-20">
        <div className="text-center mb-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b]/20 to-[#fbbf24]/20 border border-[#f59e0b]/30 shadow-lg backdrop-blur-xl mb-6">
            <Rocket className="h-8 w-8 text-[#f59e0b]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">The Tutor Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Monetize your expertise. Start teaching and earning with absolute autonomy.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent z-0" />
          
          {tutorSteps.map((s, i) => (
            <div key={s.title} className="relative z-10 group">
              <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-xl font-bold shadow-lg ring-8 ring-background group-hover:scale-110 transition-transform duration-300 mb-8`}>
                {i + 1}
              </div>
              <Card className="card-3d h-full bg-card/60 backdrop-blur-xl border-border/40 hover:shadow-2xl hover:border-[#f59e0b]/50 transition-all duration-300 rounded-3xl overflow-hidden text-center p-2">
                <CardContent className="p-8">
                  <div className={`mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl ${s.lightUrl} group-hover:-rotate-6 transition-transform duration-300`}>
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ❓ FAQ */}
      <section className="container mx-auto px-4 mb-24 max-w-4xl relative z-20">
        <Card className="border-0 shadow-2xl bg-card rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#7c3aed]/5 to-transparent pointer-events-none" />
          <CardContent className="p-8 md:p-14 relative z-10">
            <div className="mb-10 text-center">
              <MessageCircleQuestion className="h-12 w-12 text-[#a855f7] mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="mt-3 text-sm text-muted-foreground font-medium">Everything you need to know before joining the platform.</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="q1" className="border border-border/60 rounded-xl px-2 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline px-4 py-4">
                  How exactly do I book a tutor?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed font-medium">
                  It's incredibly simple! Browse the Tutors page, examine their specific profiles, and locate the "Availability" section. Click any open slot, confirm the total price, and successfully lock in your booking. All upcoming sessions are displayed natively in your secure dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2" className="border border-border/60 rounded-xl px-2 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline px-4 py-4">
                  As a tutor, how do I manage my schedule?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed font-medium">
                  Tutors possess full autonomy via their personalized teaching dashboard. You simply add distinct time slots whenever you wish to teach. Students scrolling your profile can only book the precise slots you have explicitly approved.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3" className="border border-border/60 rounded-xl px-2 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline px-4 py-4">
                  When can I leave a review?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed font-medium">
                  To prevent spam and guarantee authenticity, students are solely permitted to leave reviews after an officially booked session reaches standard completion. This preserves platform integrity and assists the community in making optimal choices.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* 🚀 Final Call to Action */}
      <section className="container mx-auto px-4 z-20 relative">
        <Card className="relative overflow-hidden border-0 bg-background/0 lg:rounded-[3rem] shadow-2xl">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0,transparent_100%)] pointer-events-none z-0" />

          <CardContent className="relative z-10 flex flex-col items-center justify-center p-12 text-center lg:p-24">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.05)] border border-white/10 shadow-2xl backdrop-blur-xl mb-8 animate-float-3d">
              <Star className="h-8 w-8 text-[#f59e0b]" fill="currentColor" />
            </div>

            <h3 className="text-3xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
              Ready to Accelerate Your Journey?
            </h3>
            
            <p className="max-w-2xl text-lg md:text-xl font-medium text-white/70 mb-10">
              Join the massive community of passionate learners and elite educators currently defining the future of online education.
            </p>

            <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl btn-3d bg-white text-[#5b21b6] hover:bg-gray-100 hover:text-[#7c3aed] shadow-[0_0_40px_-5px_max(rgba(124,58,237,0.5))] transition-all">
                <Link href="/register">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-[#10b981]" /> Create Free Account
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-md transition-all">
                <Link href="/tutors">
                  Explore Platform
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

    </main>
  );
}
