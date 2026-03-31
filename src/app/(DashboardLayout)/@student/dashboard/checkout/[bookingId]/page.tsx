import { createPaymentIntentAction } from "@/actions/payment-action";
import { getStudentBookingsAction } from "@/actions/student-action";
import { CheckoutForm } from "@/components/modules/payments/checkout-form";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  // 1. Create Stripe PaymentIntent for this booking
  const paymentRes = await createPaymentIntentAction(bookingId);

  if (!paymentRes?.success || !paymentRes?.data?.clientSecret) {
    return (
      <div className="w-full max-w-lg mx-auto py-12">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Bookings
        </Link>

        <Card className="border-destructive/30 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold">Payment Unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              {paymentRes?.message ||
                "Unable to initialize payment for this booking. The booking may already be paid or may not exist."}
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/bookings">Return to Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Fetch booking details for summary display
  let tutorName: string | undefined;
  let scheduledStart: string | undefined;
  let scheduledEnd: string | undefined;

  try {
    const bookingsRes = await getStudentBookingsAction({ page: 1, limit: 100 });
    if (bookingsRes?.success && Array.isArray(bookingsRes.data)) {
      const booking = bookingsRes.data.find((b: any) => b.id === bookingId);
      if (booking) {
        tutorName = booking.tutor?.name || booking.tutorProfile?.name || "Tutor";
        scheduledStart = booking.scheduledStart;
        scheduledEnd = booking.scheduledEnd;
      }
    }
  } catch {
    // Non-critical – form will still work without summary details
  }

  return (
    <div className="py-4">
      <CheckoutForm
        clientSecret={paymentRes.data.clientSecret}
        bookingId={bookingId}
        amount={paymentRes.data.amount}
        tutorName={tutorName}
        scheduledStart={scheduledStart}
        scheduledEnd={scheduledEnd}
      />
    </div>
  );
}
