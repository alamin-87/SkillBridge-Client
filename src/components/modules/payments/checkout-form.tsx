"use client";

import * as React from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { syncPaymentAction } from "@/actions/payment-action";
import {
  CreditCard,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Clock,
  User,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Inner form – uses Stripe hooks (must be inside <Elements>)        */
/* ------------------------------------------------------------------ */
function PaymentForm({
  bookingId,
  amount,
  tutorName,
  scheduledStart,
  scheduledEnd,
}: {
  bookingId: string;
  amount: number;
  tutorName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    toast.loading("Processing your payment…", { id: "payment" });

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/bookings`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed. Please try again.", {
        id: "payment",
      });
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setSucceeded(true);
      
      // Perform manual fallback sync with backend
      await syncPaymentAction(bookingId);

      toast.success("Payment successful! Your session is confirmed. 🎉", {
        id: "payment",
        duration: 4000,
      });

      // Small delay so user sees the success state
      setTimeout(() => {
        router.push("/dashboard/bookings");
        router.refresh();
      }, 1500);
    } else {
      toast.info("Payment is being processed. We'll update you shortly.", {
        id: "payment",
      });
      setTimeout(() => {
        router.push("/dashboard/bookings");
        router.refresh();
      }, 2000);
    }

    setProcessing(false);
  };

  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (succeeded) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Your session has been confirmed and the tutor has been notified.
          Redirecting you to your bookings…
        </p>
        <div className="mt-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Booking Summary Card */}
      <Card className="border-border/50 bg-linear-to-br from-muted/30 to-muted/10 shadow-none">
        <CardContent className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Booking Summary
          </h3>
          <div className="space-y-3">
            {tutorName && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tutor</p>
                  <p className="font-semibold text-sm">{tutorName}</p>
                </div>
              </div>
            )}
            {scheduledStart && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="font-semibold text-sm">
                    {fmtDate(scheduledStart)} – {fmtDate(scheduledEnd)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg text-emerald-600">
                  ৳{amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Payment Element */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Details
        </h3>
        <div className="rounded-xl border border-border/50 bg-background p-4 shadow-sm">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          Your payment is secured with 256-bit SSL encryption via Stripe.
        </p>
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="w-full h-12 text-base font-semibold bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300"
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Payment…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Pay ৳{amount.toLocaleString()} Securely
          </span>
        )}
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Outer wrapper – loads Stripe Elements with clientSecret            */
/* ------------------------------------------------------------------ */
export function CheckoutForm({
  clientSecret,
  bookingId,
  amount,
  tutorName,
  scheduledStart,
  scheduledEnd,
}: {
  clientSecret: string;
  bookingId: string;
  amount: number;
  tutorName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}) {
  const stripePromise = React.useMemo(() => getStripe(), []);

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Bookings
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Complete Payment</h1>
            <p className="text-sm text-muted-foreground">
              Confirm your booking by completing payment below.
            </p>
          </div>
        </div>
      </div>

      {/* Stripe Elements Card */}
      <Card className="shadow-xl border-border/40 overflow-hidden">
        <CardHeader className="bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Secure Checkout</CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              SSL Encrypted
            </Badge>
          </div>
          <CardDescription>
            Enter your payment details to confirm the booking.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#10b981",
                  colorBackground: "#ffffff",
                  borderRadius: "8px",
                  fontFamily: "system-ui, sans-serif",
                },
              },
            }}
          >
            <PaymentForm
              bookingId={bookingId}
              amount={amount}
              tutorName={tutorName}
              scheduledStart={scheduledStart}
              scheduledEnd={scheduledEnd}
            />
          </Elements>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        By completing this payment you agree to the SkillBridge Terms of Service.
      </p>
    </div>
  );
}
