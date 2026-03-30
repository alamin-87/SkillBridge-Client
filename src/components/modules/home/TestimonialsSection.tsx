"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "High School Student",
    content: "SkillBridge completely transformed how I prepare for my exams. I matched with a brilliant math tutor who helped me boost my grades from a C to an A+!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "Michael Chen",
    role: "University Freshman",
    content: "The booking process is incredibly smooth, and the quality of experts on the platform is unmatched. Worth every penny for learning advanced physics.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    name: "Emma Watson",
    role: "Language Learner",
    content: "Finding an English tutor with native proficiency was hard until I found SkillBridge. The 1-on-1 sessions are deeply engaging and highly flexible.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    name: "David Smith",
    role: "Career Switcher",
    content: "I wanted to learn React to switch careers. My mentor from SkillBridge guided me through every concept and reviewed my code. Just got my first tech job!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative container mx-auto px-4 py-20 lg:py-28 overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/2 right-1/4 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 bg-[#f59e0b]/10 blur-[120px] rounded-full point-events-none -z-10 animate-blob" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-[#ec4899]/10 blur-[120px] rounded-full point-events-none -z-10 animate-blob [animation-delay:4s]" />

      <div className="mb-16 text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#ec4899]">Thousands</span>
        </h2>
        <p className="text-lg text-muted-foreground font-medium">
          Don't just take our word for it. Read what our successful students have to say about their learning experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {testimonials.map((t, i) => (
          <Card key={i} className="card-3d h-full bg-card/60 backdrop-blur-xl border-border/40 shadow-lg shadow-black/5 rounded-3xl group">
            <CardContent className="p-8 relative h-full flex flex-col justify-between">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-[#f59e0b]/10 group-hover:text-[#f59e0b]/20 transition-colors" />
              
              <div>
                <div className="flex text-[#f59e0b] mb-4 drop-shadow-sm">
                  {Array(t.rating).fill(0).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                  {Array(5 - t.rating).fill(0).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 text-muted" />
                  ))}
                </div>
                
                <p className="text-base font-medium leading-relaxed italic text-foreground mb-8">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#f59e0b] to-[#ec4899] text-white font-bold text-sm">
                    {t.name.substring(0,2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-extrabold text-sm">{t.name}</h4>
                  <p className="text-xs font-semibold text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
