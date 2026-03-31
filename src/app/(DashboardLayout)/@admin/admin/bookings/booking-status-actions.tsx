"use client";

import { useTransition } from "react";
import { updateAdminBookingStatusAction } from "@/actions/admin-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export default function BookingStatusActions({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const onStatusChange = (status: (typeof statuses)[number]) => {
    startTransition(async () => {
      const res = await updateAdminBookingStatusAction(bookingId, status);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 ml-auto"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            currentStatus
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status)}
            disabled={status === currentStatus}
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
