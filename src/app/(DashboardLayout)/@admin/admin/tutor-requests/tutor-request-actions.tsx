"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  approveTutorRequestAction,
  rejectTutorRequestAction,
} from "@/actions/admin-action";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function TutorRequestActions({
  requestId,
}: {
  requestId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);

  function handleApprove() {
    startTransition(async () => {
      const res = await approveTutorRequestAction(requestId);
      if (res.success) {
        toast.success(res.message ?? "Request approved!");
        router.refresh();
      } else {
        toast.error(res.message ?? "Failed to approve");
      }
    });
  }

  function handleReject() {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      toast.error("Rejection reason must be at least 10 characters");
      return;
    }

    startTransition(async () => {
      const res = await rejectTutorRequestAction(
        requestId,
        rejectionReason.trim()
      );
      if (res.success) {
        toast.success(res.message ?? "Request rejected");
        setRejectOpen(false);
        router.refresh();
      } else {
        toast.error(res.message ?? "Failed to reject");
      }
    });
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={isPending}
        className="gap-1"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        Approve
      </Button>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={isPending} className="gap-1">
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Tutor Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Provide a reason for rejecting this application. The applicant will
              be notified via email.
            </p>
            <Textarea
              placeholder="Reason for rejection (min 10 characters)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              minLength={10}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : null}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
