"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  completeBookingAction,
  cancelBookingAction,
} from "@/actions/tutor-action";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function SessionActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"complete" | "cancel" | null>(null);

  if (status !== "CONFIRMED") return null;

  function handleComplete() {
    setAction("complete");
    startTransition(async () => {
      await completeBookingAction(bookingId);
      router.refresh();
      setAction(null);
    });
  }

  function handleCancel() {
    setAction("cancel");
    startTransition(async () => {
      await cancelBookingAction(bookingId, "Cancelled by tutor");
      router.refresh();
      setAction(null);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
        onClick={handleComplete}
        disabled={isPending}
      >
        {isPending && action === "complete" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        <span className="ml-1 hidden sm:inline">Complete</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="text-red-600 border-red-200 hover:bg-red-50"
        onClick={handleCancel}
        disabled={isPending}
      >
        {isPending && action === "cancel" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        <span className="ml-1 hidden sm:inline">Cancel</span>
      </Button>
    </div>
  );
}
