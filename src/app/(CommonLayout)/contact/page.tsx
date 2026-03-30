"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    value: "support@skillbridge.dev",
    description: "Drop us an email. We typically respond within 2-4 hours during business days.",
    gradient: "from-[#3b82f6] to-[#06b6d4]",
  },
  {
    icon: Phone,
    title: "Phone & WhatsApp",
    value: "+1 (555) 123-4567",
    description: "Available for urgent billing inquiries Mon-Fri, 9am - 5pm EST.",
    gradient: "from-[#10b981] to-[#34d399]",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "100 Silicon Way, Tech Park",
    description: "San Francisco, CA 94107. Come say hi if you are in the neighborhood!",
    gradient: "from-[#f59e0b] to-[#fbbf24]",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 overflow-x-hidden">
      {/* 🚀 Hero Header */}
      <section className="relative pt-32 pb-24 border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] opacity-20 blur-[120px] rounded-full animate-blob pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-y-1/2 bg-[#06b6d4] opacity-20 blur-[120px] rounded-full pointer-events-none z-0 animate-blob [animation-delay:2s]" />

        <div className="relative z-10 container mx-auto px-4 py-8 text-center max-w-3xl">
          <Badge variant="outline" className="mb-6 border-white/20 bg-white/5 text-white backdrop-blur-md px-4 py-1.5 shadow-xl inline-flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> We're here to help
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#a855f7]">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed">
            Whether you have a question about billing, need technical support, or want to partner with us, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      {/* 📬 Contact Methods */}
      <section className="container mx-auto px-4 -mt-12 relative z-20 mb-20">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {contactMethods.map((method, idx) => (
            <Card key={idx} className="card-3d bg-card/80 backdrop-blur-xl border-border/40 shadow-xl rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className={`mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${method.gradient} shadow-lg text-white`}>
                  <method.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="font-extrabold text-lg text-foreground mb-3">{method.value}</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[250px] mx-auto">
                  {method.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 📝 Contact Form */}
      <section className="container mx-auto px-4 max-w-5xl py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Send a Message</h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full" />
              <p className="text-lg text-muted-foreground font-medium">
                Fill out the form below and a member of our support staff will get back to you as soon as possible.
              </p>
            </div>

            <Card className="card-3d border-0 shadow-2xl bg-card rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/5 to-[#ec4899]/5 z-0 pointer-events-none" />
              <CardContent className="p-8 lg:p-10 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-foreground">Name</label>
                      <Input id="name" required placeholder="John Doe" className="h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-[#7c3aed]" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-foreground">Email Address</label>
                      <Input id="email" type="email" required placeholder="john@example.com" className="h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-[#7c3aed]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-foreground">Subject</label>
                    <Input id="subject" required placeholder="How can we help?" className="h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-[#7c3aed]" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-foreground">Message</label>
                    <Textarea 
                      id="message" 
                      required 
                      placeholder="Please provide as much detail as possible..." 
                      className="min-h-[150px] rounded-xl bg-background/50 border-border/50 focus-visible:ring-[#7c3aed] resize-none" 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isSuccess} 
                    className={`w-full h-14 rounded-xl font-bold text-base transition-all duration-300 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] ${isSuccess ? 'bg-[#10b981] hover:bg-[#10b981]' : 'bg-[#7c3aed] hover:bg-[#6d28d9]'}`}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : isSuccess ? (
                      <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Message Sent!</span>
                    ) : (
                      <span className="flex items-center gap-2">Send Message <Send className="h-4 w-4" /></span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:pt-12">
            <h3 className="text-2xl font-bold tracking-tight">Need immediate assistance?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Before reaching out, you might want to check our comprehensive Help Center. We've compiled detailed answers to the most common questions from both students and tutors regarding scheduling, payments, video sessions, and more.
            </p>
            
            <div className="bg-muted/40 p-6 rounded-2xl border border-border/50">
              <h4 className="font-bold flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-[#10b981]" /> Common Topics 
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li>• How to reset your password</li>
                <li>• Refund policies and disputing a session</li>
                <li>• Becoming an approved tutor</li>
                <li>• Testing your audio and video connections</li>
              </ul>
            </div>
            
            <div className="bg-[#7c3aed]/10 p-6 rounded-2xl border border-[#7c3aed]/20">
               <h4 className="font-bold text-[#7c3aed] flex items-center gap-2 mb-2">
                 Business Partnerships
               </h4>
               <p className="text-sm text-muted-foreground font-medium">
                 Representing an institution or seeking an API partnership? Please specify "Enterprise Partnership" in the subject line of your message to be routed to our specialized team directly.
               </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
