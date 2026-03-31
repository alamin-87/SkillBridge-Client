"use client";

import * as React from "react";
import Link from "next/link";
import { getIconComponent } from "@/lib/icon-mapper";
import { toast } from "sonner";

import { loginSchema } from "@/zod/auth.validation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<typeof Card> & { className?: string }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const router = useRouter();

  // Resolved Icons via Mapper
  const EyeIcon = getIconComponent("Eye");
  const EyeOffIcon = getIconComponent("EyeOff");
  const Loader2Icon = getIconComponent("Loader2");
  const MailIcon = getIconComponent("Mail");
  const LockIcon = getIconComponent("Lock");

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema, onChange: loginSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Signing in...");
      try {
        const { error } = await authClient.signIn.email(value);
        if (error) {
          const isNotVerified =
            error.status === 403 || error.code === "EMAIL_NOT_VERIFIED" || error.code === "FORBIDDEN" || error.message?.toLowerCase().includes("verify");
          if (isNotVerified) {
            toast.error(error.message || "Please verify your email before logging in.", { id: toastId });
            router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
            return;
          }
          toast.error(error.message || "Invalid credentials", { id: toastId });
          return;
        }
        toast.success("Signed in successfully.", { id: toastId });
        router.refresh();
        router.push("/dashboard");
      } catch {
        toast.error("Something went wrong. Try again.", { id: toastId });
      }
    },
  });

  const handleGoogleLogin = async () => {
    const toastId = toast.loading("Redirecting to Google...");
    setIsGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}` });
      if (error) toast.error(error.message || "Google sign-in failed", { id: toastId });
    } catch {
      toast.error("Google sign-in failed. Try again.", { id: toastId });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "card-3d w-full max-w-md border-border/40 bg-card/90 backdrop-blur-2xl rounded-2xl",
        "shadow-[0_8px_40px_-12px_rgba(124,58,237,0.15),0_4px_16px_-4px_rgba(0,0,0,0.08)]",
        className,
      )}
      {...props}
    >
      <CardHeader className="space-y-3 text-center pb-6 pt-10">
        <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#7c3aed] via-[#a855f7] to-[#ec4899] shadow-xl shadow-[#7c3aed]/30 rotate-3 hover:rotate-0 transition-transform duration-300">
          <LockIcon className="size-8 text-white" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-3xl font-extrabold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          Sign in to continue your learning journey with SkillBridge.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-8">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 bg-background/70 hover:bg-muted/80 font-medium transition-all border-border/50 shadow-sm hover:shadow-md"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Or</span>
          <Separator className="flex-1" />
        </div>

        <form id="login-form" className="space-y-4" onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
          <div className="grid gap-4">
            <form.Field name="email" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel className="text-sm font-semibold">Email Address</FieldLabel>
                  <div className="relative group">
                    <Input type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                      placeholder="you@example.com" autoComplete="email"
                      className="h-12 pl-11 bg-background/70 border-border/50 rounded-xl shadow-sm focus:shadow-lg focus:shadow-[#7c3aed]/10 focus:border-[#7c3aed]/40 transition-all" />
                    <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground group-focus-within:text-[#7c3aed] transition-colors" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />

            <form.Field name="password" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-sm font-semibold">Password</FieldLabel>
                    <Link href="/forgot-password" className="text-xs font-bold bg-linear-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Input type={showPassword ? "text" : "password"} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                      placeholder="Enter your password" autoComplete="current-password"
                      className="h-12 pl-11 pr-11 bg-background/70 border-border/50 rounded-xl shadow-sm focus:shadow-lg focus:shadow-[#7c3aed]/10 focus:border-[#7c3aed]/40 transition-all" />
                    <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground group-focus-within:text-[#7c3aed] transition-colors" />
                    <button type="button" onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOffIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />
          </div>

          <Button form="login-form" type="submit" size="lg"
            className="btn-3d w-full mt-2 h-12 font-bold text-[15px] rounded-xl bg-linear-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white hover:opacity-95 transition-all"
            disabled={form.state.isSubmitting || !form.state.canSubmit}>
            {form.state.isSubmitting ? (<><Loader2Icon className="mr-2 h-5 w-5 animate-spin" />Signing in...</>) : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pb-10 px-8">
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold bg-linear-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Create one now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path d="M44.5 20H24v8.5h11.7C34.6 33.6 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.5 0 6.6 1.3 9 3.4l6-6C35.3 4.7 29.9 2.5 24 2.5 12.7 2.5 3.5 11.7 3.5 23S12.7 43.5 24 43.5 44.5 35 44.5 23c0-1-.1-2-.3-3z" fill="currentColor" />
    </svg>
  );
}
