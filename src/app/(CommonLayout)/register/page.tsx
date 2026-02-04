"use client";

import Lottie from "lottie-react";
import { SignupForm } from "@/components/modules/authentication/signup-form";
import signupLottie from "../../../../public/lottie/loginLottie.json"; // ✅ replace with signup lottie if you have

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Shared subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

      {/* Soft accent blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: animation + text */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-8 px-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-left-6 duration-700">
            Join{" "}
            <span className="text-primary">SkillBridge</span> Today
          </h1>

          <p className="max-w-md text-lg text-muted-foreground animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            Create your account as a student or tutor and start learning or
            teaching instantly.
          </p>

          <Lottie
            animationData={signupLottie}
            loop
            className="h-[360px] w-[360px] animate-in fade-in zoom-in-95 duration-700 delay-300"
          />

          <div className="mt-4 space-y-2 text-sm text-muted-foreground flex gap-2">
            <p className="animate-in fade-in slide-in-from-left-10 duration-700 delay-500">
              🎓 Learn from verified tutors
            </p>
            <p className="animate-in fade-in slide-in-from-left-10 duration-700 delay-700">
              🧑‍🏫 Teach and earn as a tutor
            </p>
            <p className="animate-in fade-in slide-in-from-left-10 duration-700 delay-900">
              📅 Book sessions with flexible scheduling
            </p>
          </div>
        </div>

        {/* Right: Signup */}
        <div className="flex mt-10 px-4 py-10">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
