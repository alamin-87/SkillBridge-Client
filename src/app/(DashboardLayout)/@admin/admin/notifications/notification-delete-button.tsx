"use client";

import { useTransition } from "react";
import { deleteAdminNotificationAction } from "@/actions/admin-action";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NotificationDeleteButton({
  notificationId,
}: {
  notificationId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    startTransition(async () => {
      const res = await deleteAdminNotificationAction(notificationId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={onDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
