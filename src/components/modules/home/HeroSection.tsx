import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getIconComponent } from "@/lib/icon-mapper";
import hero from "../../../../public/home/hero.jpg";

export function HeroSection() {
  const ArrowRightIcon = getIconComponent("ArrowRight");
  const StarIcon = getIconComponent("Star");
  const SparklesIcon = getIconComponent("Sparkles");
  const GraduationCapIcon = getIconComponent("GraduationCap");
  const UsersIcon = getIconComponent("Users");
  const CalendarCheckIcon = getIconComponent("CalendarCheck");

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Vibrant mesh gradient background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#7c3aed]/5 via-background to-[#ec4899]/5 dark:from-[#7c3aed]/10 dark:via-background dark:to-[#ec4899]/10" />
      
      {/* Animated gradient blobs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] bg-linear-to-br from-[#7c3aed] to-[#a855f7] opacity-20 blur-[100px] animate-blob" />
      <div className="absolute top-1/2 -right-32 h-[400px] w-[400px] bg-linear-to-br from-[#06b6d4] to-[#22d3ee] opacity-15 blur-[100px] animate-blob [animation-delay:2s]" />
      <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] bg-linear-to-br from-[#ec4899] to-[#f472b6] opacity-10 blur-[100px] animate-blob [animation-delay:4s]" />

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <Badge variant="outline" className="w-fit border-[#7c3aed]/30 bg-[#7c3aed]/10 text-[#7c3aed] px-3 lg:px-4 py-1.5 text-xs lg:text-sm font-medium rounded-full shadow-sm">
              <SparklesIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Connect • Learn • Grow Masterfully
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              Unlock Your <br className="hidden sm:block" />
              <span className="bg-linear-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                True Potential
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium">
              Join thousands of students mastering new skills. Match with verified expert tutors, book personalized sessions, and achieve your goals faster.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
              <Button asChild size="lg" className="btn-3d h-12 lg:h-14 px-6 lg:px-8 text-sm lg:text-base font-bold rounded-xl bg-linear-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white hover:opacity-95 transition-all w-full sm:w-auto">
                <Link href="/tutors">
                  Find Your Tutor <ArrowRightIcon className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="h-12 lg:h-14 px-6 lg:px-8 text-sm lg:text-base font-bold rounded-xl border-[#7c3aed]/30 hover:bg-[#7c3aed]/5 text-foreground hover:border-[#7c3aed]/60 transition-all w-full sm:w-auto shadow-sm">
                <Link href="/dashboard/become-tutor">Become a Tutor</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8 border-t border-border/50">
              <Stat icon={<UsersIcon className="h-4 w-4 lg:h-5 lg:w-5 text-[#7c3aed]" />} label="Active Tutors" value="500+" />
              <Stat icon={<GraduationCapIcon className="h-4 w-4 lg:h-5 lg:w-5 text-[#ec4899]" />} label="Subject Areas" value="120+" />
              <Stat icon={<StarIcon className="h-4 w-4 lg:h-5 lg:w-5 text-[#f59e0b]" />} label="Avg Rating" value="4.8/5" />
            </div>
          </div>

          {/* Right Image/Animation */}
          <div className="relative mt-10 lg:mt-0 lg:ml-auto w-full max-w-[500px] xl:max-w-[550px] mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="relative animate-float-3d">
              <Card className="overflow-hidden border-border/40 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.2)] rounded-3xl">
                <CardContent className="p-0">
                  <div className="relative w-full bg-muted overflow-hidden flex items-center justify-center">
                    <Image
                      src={hero}
                      alt="Student learning online"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      className="w-full h-auto object-contain"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent z-0" />
                  </div>
                </CardContent>
              </Card>

              {/* Floating review card */}
              <div className="absolute -bottom-5 left-4 sm:-bottom-8 sm:-left-8 sm:right-auto rounded-2xl border border-white/10 bg-background/90 p-3 sm:p-5 shadow-2xl backdrop-blur-xl animate-float-3d [animation-delay:1s] z-10 w-fit">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 border-background bg-linear-to-br from-[#7c3aed] to-[#ec4899] opacity-80" />
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-start text-yellow-500 mb-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold leading-tight">Trusted by 10k+</p>
                  </div>
                </div>
              </div>

              {/* Floating icon card */}
              <div className="absolute -top-6 -right-4 sm:top-12 sm:-left-12 flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white dark:bg-card shadow-xl border border-border/50 animate-float-3d [animation-delay:2.5s] z-10">
                <CalendarCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#06b6d4]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="rounded-lg bg-background/80 backdrop-blur-sm p-2 shadow-sm border border-border/50 inline-flex mb-1">
        {icon}
      </div>
      <div className="text-2xl font-bold bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{value}</div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
