"use client";

import { LoginForm } from "@/components/modules/authentication/login-form";
import Lottie from "lottie-react";
import loginLottie from "../../../../public/lottie/Login Leady.json";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: 3D animation + text */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-8 px-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-left-6 duration-700">
            Learn Smarter with <span className="text-primary">SkillBridge</span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            Connect with expert tutors, book sessions instantly, and grow your
            skills with confidence.
          </p>

          <Lottie
            animationData={loginLottie}
            loop
            className="h-[360px] w-[360px] animate-in fade-in zoom-in-95 duration-700 delay-300"
          />

          <div className="mt-4 space-y-2 text-sm text-muted-foreground flex gap-2">
            <p className="animate-in fade-in slide-in-from-left-10 duration-700 delay-500">
              🎓 Verified expert tutors
            </p>
            <p className="animate-in fade-in slide-in-from-left-10 duration-700 delay-700">
              ⏱ Flexible scheduling
            </p>
            <p className="animate-in fade-in slide-in-from-left-10 duration-700 delay-900">
              ⭐ Trusted by learners worldwide
            </p>
          </div>
        </div>

        {/* Right: Login */}
        <div className="flex mt-20 px-4">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
