"use client";

import { LoginForm } from "@/components/modules/authentication/login-form";
import Lottie from "lottie-react";
import loginLottie from "../../../../../public/lottie/Login Leady.json";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Vibrant mesh gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7c3aed]/10 via-[#f8f7ff] to-[#ec4899]/8 dark:from-[#7c3aed]/15 dark:via-[#0f0a1e] dark:to-[#ec4899]/10" />
      
      {/* Animated gradient blobs */}
      <div className="absolute -top-32 -left-32 h-[450px] w-[450px] bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] opacity-20 blur-[80px] animate-blob" />
      <div className="absolute top-1/3 right-0 h-[350px] w-[350px] bg-gradient-to-br from-[#ec4899] to-[#f472b6] opacity-15 blur-[80px] animate-blob [animation-delay:2s]" />
      <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] opacity-12 blur-[80px] animate-blob [animation-delay:4s]" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: Branding panel */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-6 px-12 text-center">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-6 duration-700">
            <p className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
              Welcome back
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Learn Smarter with{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                SkillBridge
              </span>
            </h1>
          </div>
          <p className="max-w-md text-lg text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            Connect with expert tutors, book sessions instantly, and grow your
            skills with confidence.
          </p>

          <div className="animate-float-3d">
            <Lottie
              animationData={loginLottie}
              loop
              className="h-[340px] w-[340px] animate-in fade-in zoom-in-95 duration-700 delay-300 drop-shadow-2xl"
            />
          </div>

          <div className="mt-2 flex flex-col items-start gap-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white text-xs shadow-lg shadow-[#7c3aed]/30">🎓</span>
              Verified expert tutors
            </p>
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec4899] to-[#f472b6] text-white text-xs shadow-lg shadow-[#ec4899]/30">⏱</span>
              Flexible scheduling
            </p>
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] text-white text-xs shadow-lg shadow-[#06b6d4]/30">⭐</span>
              Trusted by learners worldwide
            </p>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
