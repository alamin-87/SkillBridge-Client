"use client";

import Lottie from "lottie-react";
import { VerifyEmailForm } from "@/components/modules/authentication/verify-email-form";
import loginLottie from "../../../../../public/lottie/Login Leady.json";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#06b6d4]/8 via-[#f8f7ff] to-[#7c3aed]/10 dark:from-[#06b6d4]/10 dark:via-[#0f0a1e] dark:to-[#7c3aed]/15" />
      <div className="absolute -top-32 -left-32 h-[400px] w-[400px] bg-gradient-to-br from-[#06b6d4] to-[#7c3aed] opacity-18 blur-[80px] animate-blob" />
      <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] bg-gradient-to-br from-[#a855f7] to-[#ec4899] opacity-15 blur-[80px] animate-blob [animation-delay:3s]" />
      <div className="absolute top-1/2 left-1/4 h-[250px] w-[250px] bg-gradient-to-br from-[#10b981] to-[#34d399] opacity-10 blur-[60px] animate-blob [animation-delay:5s]" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col items-center justify-center gap-6 px-12 text-center">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-6 duration-700">
            <p className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] bg-clip-text text-transparent">Almost there</p>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#06b6d4] bg-clip-text text-transparent">Verify</span>{" "}your email
            </h1>
          </div>
          <p className="max-w-md text-lg text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            We&apos;ve sent a 6-digit code to your email inbox. Enter it to activate your SkillBridge account.
          </p>
          <div className="animate-float-3d">
            <Lottie animationData={loginLottie} loop className="h-[340px] w-[340px] animate-in fade-in zoom-in-95 duration-700 delay-300 drop-shadow-2xl" />
          </div>
          <div className="mt-2 flex flex-col items-start gap-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white text-xs shadow-lg shadow-[#7c3aed]/30">📧</span>
              Check your inbox (and spam folder)
            </p>
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec4899] to-[#f472b6] text-white text-xs shadow-lg shadow-[#ec4899]/30">⏱</span>
              Code expires in 2 minutes
            </p>
            <p className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-10 duration-700 delay-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#34d399] text-white text-xs shadow-lg shadow-[#10b981]/30">🔒</span>
              Your account is secured with verification
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
            <Suspense><VerifyEmailForm /></Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
