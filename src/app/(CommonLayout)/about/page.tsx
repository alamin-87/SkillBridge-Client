import Image from "next/image";
import Link from "next/link";
import { Users, Target, ShieldCheck, Globe, GraduationCap, Zap, TrendingUp, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About Us | SkillBridge",
  description: "Learn about SkillBridge's mission to connect passionate educators with eager learners worldwide.",
};

const stats = [
  { label: "Active Students", value: "50k+", icon: Users, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
  { label: "Expert Tutors", value: "2,500+", icon: GraduationCap, color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  { label: "Sessions Completed", value: "100k+", icon: Zap, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
  { label: "Countries Reached", value: "120+", icon: Globe, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
];

const values = [
  {
    title: "Accessibility",
    description: "Education shouldn't be bound by geography. We make world-class mentorship available to everyone with an internet connection.",
    icon: Globe,
    gradient: "from-[#3b82f6] to-[#06b6d4]",
  },
  {
    title: "Quality First",
    description: "Every tutor on our platform goes through a rigorous vetting process to ensure they possess both subject matter expertise and teaching capabilities.",
    icon: ShieldCheck,
    gradient: "from-[#10b981] to-[#34d399]",
  },
  {
    title: "Empowerment",
    description: "We empower tutors to build their own independent businesses while empowering students to take control of their educational journey.",
    icon: TrendingUp,
    gradient: "from-[#f59e0b] to-[#fbbf24]",
  },
  {
    title: "Community",
    description: "Learning is a collaborative effort. We foster an environment of mutual respect, curiosity, and shared success among our users.",
    icon: HeartHandshake,
    gradient: "from-[#ec4899] to-[#f472b6]",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 overflow-x-hidden">
      {/* 🚀 Hero Section */}
      <section className="relative pt-32 pb-24 border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] bg-gradient-to-br from-[#7c3aed] to-[#ec4899] opacity-20 blur-[120px] rounded-full animate-blob pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] bg-gradient-to-br from-[#3b82f6] to-[#10b981] opacity-20 blur-[100px] rounded-full animate-blob animation-delay-2000 pointer-events-none z-0" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-white/20 bg-white/5 text-white backdrop-blur-md px-4 py-1.5 shadow-xl">
            Our Mission & Vision
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Bridging the Gap Between <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
              Talent and Ambition
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 font-medium leading-relaxed">
            SkillBridge was founded on a simple belief: that personalized education is the ultimate catalyst for human potential. We are building the global infrastructure for 1-on-1 learning.
          </p>
        </div>
      </section>

      {/* 📊 Impact Stats */}
      <section className="container mx-auto px-4 -mt-12 relative z-20 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="card-3d bg-card/80 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-6 md:p-8 text-center flex flex-col items-center justify-center">
                <div className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 📖 The Story */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              The Story <br/> Behind <span className="text-[#7c3aed]">SkillBridge</span>
            </h2>
            <div className="w-20 h-2 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full" />
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We started SkillBridge in 2024 after realizing how difficult it was for students to find highly qualified, vetted tutors outside of traditional institutions. Finding someone who not only knew the subject, but knew how to teach it effectively, was largely left to chance.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, SkillBridge has evolved into a comprehensive digital ecosystem. We provide tutors with the scheduling, payment, and video tools they need to run their own micro-schools, while giving students a secure, transparent marketplace to discover perfectly matched mentors.
            </p>
            
            <div className="pt-4 flex gap-4">
              <Button asChild variant="default" size="lg" className="rounded-xl font-bold bg-[#7c3aed] hover:bg-[#6d28d9] shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]">
                <Link href="/tutors">Find a Tutor</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl border-border/60 hover:bg-muted font-bold">
                <Link href="/how-it-works">How We Work</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl card-3d border border-border/40">
            {/* Using a placeholder visual that fits our aesthetic without an external image */}
            <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 p-8 flex flex-col justify-between">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c3aed]/20 blur-3xl rounded-full" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ec4899]/20 blur-3xl rounded-full" />
               
               <div className="relative z-10 p-6 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 max-w-sm self-end mt-12 animate-in fade-in slide-in-from-right-8 duration-1000 slide-in-from-bottom-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center text-white">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">New milestone reached</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Over 100,000 learning hours facilitated across our secure network.</p>
               </div>
               
               <div className="relative z-10 p-6 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 max-w-sm animate-in fade-in slide-in-from-left-8 duration-1000 delay-500 slide-in-from-bottom-5">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="size-10 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-white">
                     <Target className="h-5 w-5" />
                   </div>
                   <div>
                     <p className="font-bold text-sm">Quality Guaranteed</p>
                     <p className="text-xs text-muted-foreground">Continuous vetting</p>
                   </div>
                 </div>
                 <p className="text-sm font-medium">We securely process ratings and feedback to ensure only top educators remain.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 Core Values */}
      <section className="py-24 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Our Core Core Values</h2>
            <p className="text-lg text-muted-foreground font-medium">
              The principles that guide our platform development, our community guidelines, and our everyday decisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <Card key={idx} className="bg-background border-border/50 shadow-md hover:shadow-xl transition-all duration-300 card-3d group">
                <CardContent className="p-8">
                  <div className={`mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${val.gradient} text-white shadow-lg group-hover:-translate-y-2 transition-transform duration-300`}>
                    <val.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {val.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 📩 Global Call to Action */}
      <section className="container mx-auto px-4 py-24">
        <Card className="relative overflow-hidden border-0 shadow-2xl rounded-[3rem] card-3d">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-gradient-to-br from-[#7c3aed] to-[#ec4899] opacity-30 blur-[150px] rounded-full pointer-events-none z-0" />
          
          <CardContent className="relative z-10 p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Join the Education Revolution
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Whether you're looking to share your expertise or accelerate your career, there's a place for you on SkillBridge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-xl font-bold text-base h-14 px-8 bg-white text-background hover:bg-white/90 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]">
                <Link href="/register">Create Free Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
