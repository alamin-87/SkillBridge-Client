"use client";

import { useState, useTransition } from "react";
import { deleteAdminReviewAction } from "@/actions/admin-action";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ReviewDeleteButton({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
      return;
    }

    startTransition(async () => {
      const res = await deleteAdminReviewAction(reviewId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
      setConfirm(false);
    });
  }

  return (
    <Button
      variant={confirm ? "destructive" : "outline"}
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {confirm ? "Confirm?" : "Delete"}
    </Button>
  );
}
