"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Signing in...");
      try {
        const { error } = await authClient.signIn.email(value);

        if (error) {
          toast.error(error.message || "Invalid credentials", { id: toastId });
          return;
        }

        toast.success("Signed in successfully.", {
          id: toastId,
        });

        router.push("/");
      } catch {
        toast.error("Something went wrong. Try again.", { id: toastId });
      }
    },
  });

  const handleGoogleLogin = async () => {
    const toastId = toast.loading("Redirecting to Google...");
    setIsGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}`,
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed", { id: toastId });
      }
    } catch {
      toast.error("Google sign-in failed. Try again.", { id: toastId });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card
      className={cn("w-full max-w-md shadow-lg border-primary/10", className)}
      {...props}
    >
      <CardHeader className="space-y-2 text-center pb-8 pt-8">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-md">
          Sign in to continue your learning journey with SkillBridge.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google Authentication */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-background hover:bg-muted font-medium transition-all"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-5 w-5" />
          )}
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Or sign in with email
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Login Form */}
        <form
          id="login-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-5">
            {/* Email Field */}
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Email Address</FieldLabel>
                    <Input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-11"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Password Field */}
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel>Password</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-primary hover:underline underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>

          <Button
            form="login-form"
            type="submit"
            size="lg"
            className="w-full mt-4 font-semibold text-md"
            disabled={form.state.isSubmitting || !form.state.canSubmit}
          >
            {form.state.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pb-8">
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
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
      <path
        d="M44.5 20H24v8.5h11.7C34.6 33.6 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.5 0 6.6 1.3 9 3.4l6-6C35.3 4.7 29.9 2.5 24 2.5 12.7 2.5 3.5 11.7 3.5 23S12.7 43.5 24 43.5 44.5 35 44.5 23c0-1-.1-2-.3-3z"
        fill="currentColor"
      />
    </svg>
  );
}
