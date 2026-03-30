import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Search, ShieldCheck, ArrowRight, Zap } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative container mx-auto px-4 py-20 lg:py-32">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] bg-gradient-to-br from-[#7c3aed]/10 to-[#ec4899]/10 blur-[100px] rounded-full pointer-events-none -z-10 animate-blob" />
      <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] bg-gradient-to-br from-[#06b6d4]/10 to-[#10b981]/10 blur-[80px] rounded-full pointer-events-none -z-10 animate-blob [animation-delay:2s]" />

      <div className="mb-16 text-center max-w-2xl mx-auto space-y-4 relative">
        <div className="inline-flex items-center justify-center rounded-full bg-[#f59e0b]/10 px-4 py-1.5 mb-2 border border-[#f59e0b]/20 text-sm font-bold text-[#f59e0b] shadow-sm uppercase tracking-widest">
          <Zap className="mr-2 h-4 w-4" /> Three Simple Steps
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899]">SkillBridge</span> Works
        </h2>
        <p className="text-lg text-muted-foreground font-medium">
          Whether you&apos;re looking to master a new skill or ace an upcoming exam, we make the process friction-free.
        </p>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {/* Desktop connection lines */}
        <div className="hidden md:block absolute top-[60px] left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-border/60 to-transparent -z-10" />

        <div className="relative z-10">
          <HowCard
            step="01"
            icon={<Search className="h-7 w-7 text-white" />}
            gradient="from-[#7c3aed] to-[#ec4899]"
            title="Find Your Expert"
            desc="Filter by subject, rating, availability, and hourly rate to find the absolute best match for your specific goals."
          />
          <ArrowRight className="hidden md:block absolute top-[52px] -right-5 h-6 w-6 text-muted-foreground/30 z-20" />
        </div>

        <div className="relative z-10 mt-0 md:mt-8">
          <HowCard
            step="02"
            icon={<CalendarCheck className="h-7 w-7 text-white" />}
            gradient="from-[#06b6d4] to-[#3b82f6]"
            title="Book Instantly"
            desc="View real-time availability slots on the tutor's calendar. Pick the time that works for you and secure your session immediately."
          />
          <ArrowRight className="hidden md:block absolute top-[52px] -right-5 h-6 w-6 text-muted-foreground/30 z-20" />
        </div>

        <div className="relative z-10 mt-0 md:mt-16">
          <HowCard
            step="03"
            icon={<ShieldCheck className="h-7 w-7 text-white" />}
            gradient="from-[#10b981] to-[#059669]"
            title="Learn & Grow"
            desc="Connect securely on our platform, master your chosen subject, and leave a review to build the community."
          />
        </div>
      </div>
    </section>
  );
}

function HowCard({ icon, gradient, title, desc, step }: { icon: React.ReactNode; gradient: string; title: string; desc: string; step: string }) {
  return (
    <Card className="card-3d relative h-full bg-card/60 backdrop-blur-xl border-border/40 shadow-lg shadow-black/5 rounded-3xl overflow-hidden group">
      <div className={`absolute top-0 right-0 p-6 text-7xl font-black opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none text-transparent bg-clip-text bg-gradient-to-b ${gradient}`}>
        {step}
      </div>
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className={`mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl ring-4 ring-background -rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
          {icon}
        </div>
        <h3 className="text-2xl font-extrabold mb-3 group-hover:text-foreground transition-colors">{title}</h3>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
