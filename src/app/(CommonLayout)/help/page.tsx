"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, User, CreditCard, Video, ShieldAlert, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCard, setOpenCard] = useState<string | null>("student-1");

  const toggleCard = (id: string) => {
    setOpenCard(openCard === id ? null : id);
  };

  const articleCategories = [
    {
      id: "students",
      title: "For Students",
      icon: User,
      gradient: "from-[#3b82f6] to-[#06b6d4]",
      articles: [
        { id: "student-1", question: "How do I book a session?", answer: "Browse the 'Find a Tutor' page, select a subject, and choose a tutor. On their profile, pick an available time slot from their calendar and click 'Book Session'. You'll be prompted to checkout securely." },
        { id: "student-2", question: "What happens if I miss a scheduled class?", answer: "If you cancel at least 24 hours in advance, you can reschedule for free. Cancellations within 24 hours may be subject to a fee at your tutor's discretion. If you entirely miss a session without notice, you will forfeit the booking amount." },
        { id: "student-3", question: "Are my sessions recorded?", answer: "Yes. For your safety and to ensure high-quality learning, all video sessions on SkillBridge are recorded and securely encrypted. They are kept for 30 days for dispute resolution purposes only." }
      ]
    },
    {
      id: "tutors",
      title: "For Tutors",
      icon: BookOpen,
      gradient: "from-[#10b981] to-[#34d399]",
      articles: [
        { id: "tutor-1", question: "How and when do I get paid?", answer: "When you complete a session, the funds are automatically dispersed to your connected bank account minus the platform fee. Payouts are batched weekly on Fridays via secure direct deposit." },
        { id: "tutor-2", question: "Can I set my own hourly rate?", answer: "Absolutely. As an independent contractor, you have full control over your pricing. You can adjust your hourly rate from your Tutor Dashboard at any time." },
        { id: "tutor-3", question: "How does the rating system work?", answer: "After a session concludes, the student will be prompted to leave a 1-5 star rating and an optional text review. Your average rating dictates your ranking in the global search algorithm." }
      ]
    },
    {
      id: "technical",
      title: "Technical & Billing",
      icon: CreditCard,
      gradient: "from-[#f59e0b] to-[#fbbf24]",
      articles: [
        { id: "tech-1", question: "The video call won't connect. What do I do?", answer: "Ensure you are using the latest version of Chrome, Firefox, or Safari. Check that you have granted browser permissions for both your microphone and camera. If it still fails, check your ad-blocker." },
        { id: "tech-2", question: "My credit card was declined.", answer: "Please verify that the billing zip code matches the card. If you're an international user, ensure your bank allows foreign transactions. You can update your payment methods in the Billing section of your profile." },
        { id: "tech-3", question: "How do I request a refund?", answer: "If a tutor didn't show up or violated our robust Terms of Service, go to your dashboard, find the specific booking, and click 'Report Issue'. Our Trust & Safety team will review the session recording and issue a refund if the complaint is valid." }
      ]
    }
  ];

  // Filter functionality
  const filteredCategories = articleCategories.map(cat => ({
    ...cat,
    articles: cat.articles.filter(
      article => 
        article.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.articles.length > 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 overflow-x-hidden">
      {/* 🚀 Hero Header with Search */}
      <section className="relative pt-32 pb-24 border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-y-1/2 bg-[#7c3aed] opacity-20 blur-[120px] rounded-full pointer-events-none z-0 animate-blob" />
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <Badge variant="outline" className="mb-6 border-white/20 bg-white/5 text-white backdrop-blur-md px-4 py-1.5 shadow-xl inline-flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#f59e0b]" /> Knowledge Base
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#a855f7]">help you?</span>
          </h1>
          
          <div className="relative max-w-2xl mx-auto mt-10 shadow-2xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Search className="h-6 w-6 text-muted-foreground focus-within:text-[#7c3aed] transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search for answers (e.g., 'refunds', 'scheduling')"
              className="relative z-10 h-16 pl-14 pr-4 rounded-2xl bg-background/95 border-0 shadow-[0_0_40px_-5px_rgba(124,58,237,0.3)] text-lg font-medium focus-visible:ring-2 focus-visible:ring-[#7c3aed]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 🧩 FAQ Categories Grid */}
      <section className="container mx-auto px-4 -mt-12 relative z-20 mb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Quick Links Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-3d bg-card/80 backdrop-blur-xl border-border/40 shadow-xl rounded-3xl overflow-hidden sticky top-24">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">Topics Overview</h3>
                <div className="space-y-4">
                  {articleCategories.map((cat) => (
                    <a 
                      key={cat.id} 
                      href={`#${cat.id}`}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                          <cat.icon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">{cat.title}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </a>
                  ))}
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <Button asChild variant="outline" className="w-full justify-start rounded-xl">
                      <Link href="/contact" className="font-bold">
                        <Video className="mr-2 h-4 w-4" /> Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Accordion List */}
          <div className="lg:col-span-2 space-y-12 pb-10">
            {filteredCategories.length === 0 ? (
              <div className="rounded-3xl border border-border/50 bg-card/40 p-16 text-center flex flex-col items-center justify-center shadow-inner">
                <Search className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-2xl font-bold">No results found</p>
                <p className="mt-2 text-muted-foreground font-medium">
                  We couldn't find any articles matching "{searchQuery}". 
                  <br />Try adjusting your search terms or contact support directly.
                </p>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.id} id={cat.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`size-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-md`}>
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold">{cat.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {cat.articles.map((article) => {
                      const isOpen = openCard === article.id;
                      return (
                        <Card 
                          key={article.id} 
                          className={`transition-all duration-300 border-border/40 overflow-hidden ${
                            isOpen ? "shadow-md ring-1 ring-[#7c3aed]/50 bg-background" : "shadow-sm hover:border-border/80 bg-card/60"
                          }`}
                        >
                          <button 
                            onClick={() => toggleCard(article.id)}
                            className="w-full text-left p-5 flex items-start justify-between gap-4 focus:outline-none"
                            aria-expanded={isOpen}
                          >
                            <span className={`font-bold text-lg transition-colors ${isOpen ? "text-[#7c3aed]" : "text-foreground"}`}>
                              {article.question}
                            </span>
                            <div className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                              <ChevronDown className={`h-5 w-5 ${isOpen ? "text-[#7c3aed]" : "text-muted-foreground"}`} />
                            </div>
                          </button>
                          
                          <div 
                            className={`px-5 pb-5 text-muted-foreground leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pb-0"
                            }`}
                          >
                            <div className="pt-2 border-t border-border/40">
                              {article.answer}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            
            {/* Still Need Help Footer Block */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#1a1035] to-[#2d1b54] dark:from-[#0f0a1e] dark:to-[#1a1230] border border-border/20 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/20 blur-2xl rounded-full" />
               <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Still need help?</h3>
               <p className="text-white/70 mb-6 relative z-10">Our support team is available around the clock to assist you.</p>
               <Button asChild className="bg-white text-background hover:bg-white/90 font-bold px-8 relative z-10">
                 <Link href="/contact">Send us a message</Link>
               </Button>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
