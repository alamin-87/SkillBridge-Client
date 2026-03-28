"use client";

import Lottie from "lottie-react";
import { SignupForm } from "@/components/modules/authentication/signup-form";
import signupLottie from "../../../../../public/lottie/loginLottie.json";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Vibrant mesh gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ec4899]/8 via-[#f8f7ff] to-[#7c3aed]/10 dark:from-[#ec4899]/10 dark:via-[#0f0a1e] dark:to-[#7c3aed]/15" />
      
      {/* Animated gradient blobs */}
      <div className="absolute -top-32 -right-32 h-[450px] w-[450px] bg-gradient-to-br from-[#a855f7] to-[#7c3aed] opacity-20 blur-[80px] animate-blob" />
      <div className="absolute bottom-0 -left-20 h-[350px] w-[350px] bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] opacity-12 blur-[80px] animate-blob [animation-delay:3s]" />
      <div className="absolute top-1/2 right-1/4 h-[300px] w-[300px] bg-gradient-to-br from-[#ec4899] to-[#f472b6] opacity-10 blur-[80px] animate-blob [animation-delay:5s]" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: Branding panel */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-6 px-12 text-center">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-6 duration-700">
            <p className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#ec4899] to-[#7c3aed] bg-clip-text text-transparent">
              Get started free
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Join{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                SkillBridge
              </span>{" "}
              Today
            </h1>
          </div>
          <p className="max-w-md text-lg text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            Create your student account and start learning your favorite skills instantly.
          </p>

          <div className="animate-float-3d">
            <Lottie
              animationData={signupLottie}
              loop
              className="h-[340px] w-[340px] animate-in fade-in zoom-in-95 duration-700 delay-300 drop-shadow-2xl"
            />
          </div>

          <div className="mt-2 flex flex-col items-start gap-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white text-xs shadow-lg shadow-[#7c3aed]/30">🎓</span>
              Learn from verified tutors
            </p>
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white text-xs shadow-lg shadow-[#f59e0b]/30">🚀</span>
              Master new skills interactively
            </p>
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] text-white text-xs shadow-lg shadow-[#06b6d4]/30">📅</span>
              Book sessions with flexible scheduling
            </p>
          </div>
        </div>

        {/* Right: Signup Form */}
        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
