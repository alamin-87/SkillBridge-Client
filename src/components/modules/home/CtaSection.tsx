import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="container mx-auto px-4 py-16 pb-32">
      <Card className="relative overflow-hidden border-0 bg-background/0 lg:rounded-[3rem]">
        {/* Massive gradient background for the CTA */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        
        {/* Inner animated mesh blobs */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] bg-gradient-to-br from-[#7c3aed] to-[#ec4899] opacity-30 blur-[120px] rounded-full animate-blob pointer-events-none z-0" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] bg-gradient-to-br from-[#06b6d4] to-[#10b981] opacity-20 blur-[120px] rounded-full animate-blob [animation-delay:3s] pointer-events-none z-0" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1)_0,transparent_100%)] pointer-events-none z-0" />

        <CardContent className="relative z-10 flex flex-col items-center justify-center p-12 text-center lg:p-24 drop-shadow-lg">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.05)] border border-white/10 shadow-2xl backdrop-blur-xl mb-8 animate-float-3d">
            <Rocket className="h-8 w-8 text-white" />
          </div>

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-[#a855f7] via-[#f472b6] to-[#22d3ee] bg-clip-text text-transparent">Accelerate</span> <br className="hidden md:block" /> Your Learning?
          </h3>
          
          <p className="max-w-2xl text-lg md:text-xl font-medium text-white/70 mb-10">
            Join thousands of passionate learners defining the future of education. Create your free account in seconds and instantly book your first session today.
          </p>

          {/* Social Proof Avatars before CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex -space-x-3">
              {[
                "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                "https://i.pravatar.cc/150?u=a04258114e29026702d",
                "https://i.pravatar.cc/150?u=a048581f4e29026701d",
              ].map((src, i) => (
                <div key={i} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#2d1b54] overflow-hidden shadow-md transition-transform hover:-translate-y-1 hover:z-10 relative">
                  <img src={src} alt="User Avatar" className="h-full w-full object-cover" />
                </div>
              ))}
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#2d1b54] bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center shadow-md relative z-10">
                <span className="text-white text-xs sm:text-sm font-bold">10k+</span>
              </div>
            </div>
            <p className="text-sm font-bold text-white/90">
              Join <span className="text-[#22d3ee]">10,000+</span> learners today.
            </p>
          </div>

          <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-5">
            <Button asChild size="lg" className="group w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl bg-white text-[#5b21b6] hover:bg-gray-50 hover:text-[#7c3aed] hover:scale-[1.02] shadow-[0_0_40px_-5px_max(rgba(124,58,237,0.5))] transition-all duration-300">
              <Link href="/register" className="flex items-center">
                Start Learning Now <Sparkles className="ml-2 h-5 w-5 group-hover:animate-pulse" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="group w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-md hover:scale-[1.02] transition-all duration-300">
              <Link href="/tutors" className="flex items-center">
                Explore Top Tutors <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Micro trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold text-white/50 uppercase tracking-widest">
            <span className="flex items-center gap-2">✓ Verified Tutors</span>
            <span className="flex items-center gap-2">✓ Instant Booking</span>
            <span className="flex items-center gap-2">✓ Secure Payments</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
