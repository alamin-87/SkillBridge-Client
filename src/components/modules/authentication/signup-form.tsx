"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, GraduationCap, User } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "TUTOR"]).refine((val) => val, {
    message: "Please select a role",
  }),
});

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card> & { className?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT" as "STUDENT" | "TUTOR",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating account...");
      try {
        const { error } = await authClient.signUp.email(value);

        if (error) {
          toast.error(error.message || "Signup failed", { id: toastId });
          return;
        }

        toast.success("Account created successfully. Please login ✅", {
          id: toastId,
        });
        router.push("/login");
      } catch {
        toast.error("Something went wrong. Try again.", { id: toastId });
      }
    },
  });

  const handleGoogleSignup = async () => {
    const toastId = toast.loading("Redirecting to Google...");
    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}`,
      });

      if (error)
        toast.error(error.message || "Google signup failed", { id: toastId });
    } catch {
      toast.error("Google signup failed. Try again.", { id: toastId });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md shadow-sm", className)} {...props}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Choose your role and start your journey with SkillBridge.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        {/* Form */}
        <form
          id="signup-form"
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-3">
            {/* Role */}
            <form.Field
              name="role"
              children={(field) => (
                <Field>
                  <FieldLabel>I want to join as</FieldLabel>

                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(val) =>
                      field.handleChange(val as "STUDENT" | "TUTOR")
                    }
                    className="grid grid-cols-2 gap-2"
                  >
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted">
                      <RadioGroupItem value="STUDENT" />
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Student</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted">
                      <RadioGroupItem value="TUTOR" />
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm font-medium">Tutor</span>
                    </label>
                  </RadioGroup>

                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            {/* Name + Email (2 columns on md) */}
            <div className="grid gap-3 md:grid-cols-2">
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Full name</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            {/* Password */}
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Password</FieldLabel>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
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
            form="signup-form"
            type="submit"
            className="w-full"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline">
            Sign in
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
