"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, MailCheck, ArrowLeft, RotateCcw, Mail } from "lucide-react";
import { toast } from "sonner";

import { verifyEmailSchema } from "@/zod/auth.validation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

export function VerifyEmailForm({ className, ...props }: React.ComponentProps<typeof Card> & { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const [isResending, setIsResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(120);
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const form = useForm({
    defaultValues: { email: emailFromQuery, otp: "" },
    validators: { onSubmit: verifyEmailSchema, onChange: verifyEmailSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Verifying your email...");
      try {
        const res = await fetch("/api/v1/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: value.email, otp: value.otp }), credentials: "include" });
        const data = await res.json();
        if (!res.ok) { toast.error(data?.message || "Verification failed", { id: toastId }); return; }
        toast.success("Email verified successfully! 🎉", { id: toastId });
        setIsVerified(true);
        setTimeout(() => router.push("/login"), 2000);
      } catch { toast.error("Something went wrong. Please try again.", { id: toastId }); }
    },
  });

  const handleResendOtp = async () => {
    const email = form.getFieldValue("email");
    if (!email) { toast.error("Please enter your email address first."); return; }
    setIsResending(true);
    const toastId = toast.loading("Sending a new OTP...");
    try {
      const res = await fetch("/api/v1/auth/resend-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }), credentials: "include" });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.message || "Could not resend OTP", { id: toastId }); return; }
      toast.success("A new OTP has been sent to your email!", { id: toastId });
      setCooldown(120);
    } catch { toast.error("Failed to resend OTP. Try again.", { id: toastId }); }
    finally { setIsResending(false); }
  };

  if (isVerified) {
    return (
      <Card className={cn("card-3d w-full max-w-md border-border/40 bg-card/90 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_-12px_rgba(124,58,237,0.15),0_4px_16px_-4px_rgba(0,0,0,0.08)]", className)} {...props}>
        <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#34d399] shadow-xl shadow-[#10b981]/30">
            <MailCheck className="size-10 text-white" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold tracking-tight">Email Verified!</h3>
            <p className="text-muted-foreground leading-relaxed">Your email has been verified successfully. Redirecting you to login...</p>
          </div>
          <Loader2 className="size-5 animate-spin text-[#7c3aed]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("card-3d w-full max-w-md border-border/40 bg-card/90 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_-12px_rgba(124,58,237,0.15),0_4px_16px_-4px_rgba(0,0,0,0.08)]", className)} {...props}>
      <CardHeader className="space-y-3 text-center pb-6 pt-10">
        <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06b6d4] via-[#7c3aed] to-[#a855f7] shadow-xl shadow-[#7c3aed]/30 rotate-3 hover:rotate-0 transition-transform duration-300">
          <ShieldCheck className="size-8 text-white" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-2xl font-extrabold tracking-tight">Verify your email</CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">We sent a 6-digit verification code to your email.<br />Enter it below to complete your registration.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-8">
        <form id="verify-email-form" className="space-y-4" onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
          <div className="grid gap-4">
            <form.Field name="email" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel className="text-sm font-semibold">Email Address</FieldLabel>
                  <div className="relative group">
                    <Input type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} placeholder="you@example.com" autoComplete="email"
                      className="h-12 pl-11 bg-background/70 border-border/50 rounded-xl shadow-sm focus:shadow-lg focus:shadow-[#7c3aed]/10 focus:border-[#7c3aed]/40 transition-all" />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground group-focus-within:text-[#7c3aed] transition-colors" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />

            <form.Field name="otp" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel className="text-sm font-semibold">Verification Code (OTP)</FieldLabel>
                  <Input type="text" inputMode="numeric" maxLength={6} value={field.state.value}
                    onChange={(e) => { const val = e.target.value.replace(/\D/g, ""); field.handleChange(val); }}
                    onBlur={field.handleBlur} placeholder="• • • • • •" autoComplete="one-time-code"
                    className="h-14 text-center text-2xl font-bold tracking-[0.5em] font-mono bg-background/70 border-border/50 rounded-xl shadow-sm focus:shadow-lg focus:shadow-[#7c3aed]/10 focus:border-[#7c3aed]/40 transition-all" />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />
          </div>

          <Button form="verify-email-form" type="submit" size="lg"
            className="btn-3d w-full mt-2 h-12 font-bold text-[15px] rounded-xl bg-gradient-to-r from-[#06b6d4] via-[#7c3aed] to-[#a855f7] text-white hover:opacity-95 transition-all"
            disabled={form.state.isSubmitting || !form.state.canSubmit}>
            {form.state.isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Verifying...</>) : (<><ShieldCheck className="mr-2 h-5 w-5" />Verify Email</>)}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-sm text-muted-foreground">Didn&apos;t receive the code?</p>
          <Button type="button" variant="ghost" size="sm" onClick={handleResendOtp} disabled={isResending || cooldown > 0} className="group font-semibold">
            <RotateCcw className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
            {cooldown > 0 ? `Resend in ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}` : "Resend Code"}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pb-10 px-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#7c3aed] transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
