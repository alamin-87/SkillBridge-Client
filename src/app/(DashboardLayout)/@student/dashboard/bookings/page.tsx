"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getStudentBookingsAction,
  cancelBookingAction,
} from "@/actions/student-action";

function fmt(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase())
    .join("");
}

function getTutorCardInfo(b: any) {
  const tutorName =
    b?.tutor?.user?.name || b?.tutor?.name || b?.tutorName || "Tutor";

  const tutorImage =
    b?.tutor?.user?.image || b?.tutor?.image || b?.tutorImage || null;

  const tutorId =
    b?.tutorProfileId ||
    b?.tutorProfile?.id ||
    b?.tutor?.id ||
    b?.tutorId ||
    null;

  const hourlyRate =
    b?.tutorProfile?.hourlyRate ?? b?.tutor?.tutorProfile?.hourlyRate ?? null;

  return { tutorId, tutorName, tutorImage, hourlyRate };
}

function statusVariant(
  status?: string,
): "secondary" | "destructive" | "outline" | "default" {
  switch (status) {
    case "CANCELLED":
      return "destructive";
    case "COMPLETED":
      return "default";
    default:
      return "secondary";
  }
}

function getStatusIcon(status?: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "CANCELLED":
      return <XCircle className="h-3.5 w-3.5" />;
    default:
      return <Clock className="h-3.5 w-3.5" />;
  }
}

function getPaymentBadge(paymentStatus?: string) {
  switch (paymentStatus) {
    case "PAID":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20 gap-1">
          <RefreshCw className="h-3 w-3" />
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 gap-1">
          <AlertTriangle className="h-3 w-3" />
          Unpaid
        </Badge>
      );
  }
}

export default function StudentMyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const { success, data } = await getStudentBookingsAction({
        page: 1,
        limit: 50,
      });
      if (success && Array.isArray(data)) {
        setBookings(data);
      }
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this session? The tutor will be notified and the slot will be released.",
      )
    )
      return;

    setIsCancelling(id);
    try {
      const res = await cancelBookingAction(id);
      if (res.success) {
        toast.success(
          "Session cancelled. The slot has been refunded to the tutor's availability.",
        );
        fetchBookings();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <Card>
          <CardContent className="p-8 flex justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 animate-spin" />
              <span>Loading bookings…</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">My bookings</h2>
          <p className="text-sm text-muted-foreground">
            {bookings.length > 0
              ? `${bookings.length} total bookings`
              : "All your booked sessions."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>

        <CardContent>
          {bookings.length === 0 ? (
            <div className="rounded-lg border p-6 text-center">
              <p className="text-sm font-medium">No bookings found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When you book a tutor, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b: any) => {
                const t = getTutorCardInfo(b);
                const isUnpaid =
                  b.paymentStatus !== "PAID" && b.status !== "CANCELLED";
                const canCancel =
                  b.status !== "CANCELLED" && b.status !== "COMPLETED";

                return (
                  <div
                    key={b.id}
                    className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                      isUnpaid
                        ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10"
                        : ""
                    }`}
                  >
                    {/* Left: Tutor + schedule */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage
                          src={t.tutorImage ?? undefined}
                          alt={t.tutorName}
                        />
                        <AvatarFallback>
                          {getInitials(t.tutorName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">{t.tutorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {fmt(b.scheduledStart)}{" "}
                          {b.scheduledEnd ? `– ${fmt(b.scheduledEnd)}` : ""}
                          <span className="px-1">•</span>
                          {t.hourlyRate
                            ? `৳${t.hourlyRate}/hr`
                            : "Flexible pricing"}
                        </p>

                        {b?.cancelReason ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Cancel reason: {b.cancelReason}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Right: status + payment status + price + actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Badge
                        variant={statusVariant(b.status)}
                        className="gap-1"
                      >
                        {getStatusIcon(b.status)}
                        {b.status ?? "CONFIRMED"}
                      </Badge>

                      {getPaymentBadge(b.paymentStatus)}

                      {typeof b.price === "number" ? (
                        <span className="text-sm font-semibold">
                          ৳{b.price.toLocaleString()}
                        </span>
                      ) : null}

                      {/* Cancel Button */}
                      {canCancel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isCancelling === b.id}
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 font-bold"
                        >
                          {isCancelling === b.id ? (
                            <Clock className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          Cancel Session
                        </Button>
                      )}

                      {/* Pay Now button for unpaid bookings */}
                      {isUnpaid && b.id ? (
                        <Button
                          asChild
                          size="sm"
                          className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm gap-1.5"
                        >
                          <Link href={`/dashboard/checkout/${b.id}`}>
                            <CreditCard className="h-3.5 w-3.5" />
                            Pay Now
                          </Link>
                        </Button>
                      ) : null}

                      {t.tutorId ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/tutors/${t.tutorId}`}>View Tutor</Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
