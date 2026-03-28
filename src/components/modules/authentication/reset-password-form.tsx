"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, KeyRound, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

import { resetPasswordSchema } from "@/zod/auth.validation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useForm } from "@tanstack/react-form";

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<typeof Card> & { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm({
    defaultValues: { email: emailFromQuery, otp: "", newPassword: "" },
    validators: { onSubmit: resetPasswordSchema, onChange: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Resetting password...");
      try {
        const res = await fetch("/api/v1/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: value.email, otp: value.otp, newPassword: value.newPassword }) });
        const data = await res.json();
        if (!res.ok) { toast.error(data?.message || "Failed to reset password", { id: toastId }); return; }
        toast.success("Password reset securely. You can now login.", { id: toastId });
        router.push("/login");
      } catch { toast.error("Something went wrong. Try again.", { id: toastId }); }
    },
  });

  return (
    <Card className={cn("card-3d w-full max-w-md border-border/40 bg-card/90 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_-12px_rgba(124,58,237,0.15),0_4px_16px_-4px_rgba(0,0,0,0.08)]", className)} {...props}>
      <CardHeader className="space-y-3 text-center pb-6 pt-10">
        <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] via-[#7c3aed] to-[#ec4899] shadow-xl shadow-[#7c3aed]/30 rotate-3 hover:rotate-0 transition-transform duration-300">
          <KeyRound className="size-8 text-white" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-3xl font-extrabold tracking-tight">Reset Password</CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">Enter the OTP sent to your email and choose a new password.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-8">
        <form id="reset-password-form" className="space-y-4" onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
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

            <form.Field name="newPassword" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel className="text-sm font-semibold">New Password</FieldLabel>
                  <div className="relative group">
                    <Input type={showPassword ? "text" : "password"} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} placeholder="Choose a new password" autoComplete="new-password"
                      className="h-12 pl-11 pr-11 bg-background/70 border-border/50 rounded-xl shadow-sm focus:shadow-lg focus:shadow-[#7c3aed]/10 focus:border-[#7c3aed]/40 transition-all" />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground group-focus-within:text-[#7c3aed] transition-colors" />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />
          </div>

          <Button form="reset-password-form" type="submit" size="lg"
            className="btn-3d w-full mt-2 h-12 font-bold text-[15px] rounded-xl bg-gradient-to-r from-[#10b981] via-[#7c3aed] to-[#ec4899] text-white hover:opacity-95 transition-all"
            disabled={form.state.isSubmitting || !form.state.canSubmit}>
            {form.state.isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Resetting...</>) : "Reset Password"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pb-10 px-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#7c3aed] transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
