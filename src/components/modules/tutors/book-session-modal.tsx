"use client";

import * as React from "react";
import { createBookingAction } from "@/actions/booking-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
};

function fmt(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BookSessionModal({
  tutorProfileId,
  tutorId,
  hourlyRate,
  openSlots,
}: {
  tutorProfileId: string;
  tutorId: string;
  hourlyRate: number;
  openSlots: Slot[];
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Slot | null>(
    openSlots?.[0] ?? null,
  );
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const price = Number(hourlyRate ?? 0);

  const onConfirm = async () => {
    if (!selected) return;

    setLoading(true);
    toast.loading("Creating your booking…", { id: "booking" });

    const res = await createBookingAction({
      tutorProfileId,
      tutorId,
      availabilityId: selected.id,
      scheduledStart: selected.startTime,
      scheduledEnd: selected.endTime,
      price,
    });

    if (!res.success) {
      toast.error(res.message || "Booking failed. Please try again.", {
        id: "booking",
      });
      setLoading(false);
      return;
    }

    // Booking created successfully — redirect to payment checkout
    const bookingId = res.data?.id;

    toast.success("Booking created! Redirecting to payment…", {
      id: "booking",
      duration: 3000,
    });

    setOpen(false);

    // Redirect to the checkout page to complete payment
    if (bookingId) {
      router.push(`/dashboard/checkout/${bookingId}`);
    } else {
      // Fallback: go to bookings page if no ID returned
      toast.info("Please complete payment from your bookings page.", {
        id: "booking-fallback",
      });
      router.push("/dashboard/bookings");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={openSlots.length === 0}>
          Book a Session
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Book a session</DialogTitle>
          <DialogDescription>
            Select an available slot. You&apos;ll be redirected to complete
            payment after confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-semibold">৳{price}</p>
            </div>
            <Badge variant="secondary">{openSlots.length} slots</Badge>
          </div>

          {openSlots.length === 0 ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              No available slots right now.
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">Choose a slot</p>

              <div className="max-h-56 space-y-2 overflow-auto pr-1">
                {openSlots.map((s) => {
                  const active = selected?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelected(s)}
                      className={[
                        "w-full rounded-lg border p-3 text-left transition",
                        active
                          ? "border-primary/50 bg-primary/5"
                          : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {fmt(s.startTime)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(s.startTime).toLocaleTimeString(
                              undefined,
                              { hour: "numeric", minute: "2-digit" },
                            )}{" "}
                            –{" "}
                            {new Date(s.endTime).toLocaleTimeString(undefined, {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {active ? (
                          <Badge>Selected</Badge>
                        ) : (
                          <Badge variant="outline">Pick</Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading || !selected || openSlots.length === 0}
            className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Proceed to Payment
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
