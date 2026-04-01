"use client";

import Link from "next/link";

import { useTransition, useState } from "react";
import {
  updateAdminUserAction,
  deleteAdminUserAction,
} from "@/actions/admin-action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Ban,
  ShieldCheck,
  Trash2,
  Loader2,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUserRowActions({
  userId,
  status,
  role,
}: {
  userId: string;
  status: "ACTIVE" | "BANNED";
  role: "STUDENT" | "TUTOR" | "ADMIN";
}) {
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleStatus = () => {
    const newStatus = status === "BANNED" ? "ACTIVE" : "BANNED";
    start(async () => {
      const res = await updateAdminUserAction(userId, { status: newStatus });
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  const setRole = (nextRole: "STUDENT" | "TUTOR" | "ADMIN") => {
    if (nextRole === role) return;
    start(async () => {
      const res = await updateAdminUserAction(userId, { role: nextRole });
      if (res.success) toast.success(`Role changed to ${nextRole}`);
      else toast.error(res.message);
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // auto-reset after 3s
      return;
    }
    start(async () => {
      const res = await deleteAdminUserAction(userId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
      setConfirmDelete(false);
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {pending && (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={pending}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Status Toggle */}
          <DropdownMenuItem onClick={toggleStatus} disabled={pending}>
            {status === "BANNED" ? (
              <>
                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
                Unban User
              </>
            ) : (
              <>
                <Ban className="h-4 w-4 mr-2 text-red-500" />
                Ban User
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Role Switching */}
          <DropdownMenuItem
            onClick={() => setRole("STUDENT")}
            disabled={pending || role === "STUDENT"}
            className={role === "STUDENT" ? "bg-muted/50" : ""}
          >
            <UserCog className="h-4 w-4 mr-2 text-blue-500" />
            Set Student
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setRole("TUTOR")}
            disabled={pending || role === "TUTOR"}
            className={role === "TUTOR" ? "bg-muted/50" : ""}
          >
            <UserCog className="h-4 w-4 mr-2 text-emerald-500" />
            Set Tutor
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setRole("ADMIN")}
            disabled={pending || role === "ADMIN"}
            className={role === "ADMIN" ? "bg-muted/50" : ""}
          >
            <UserCog className="h-4 w-4 mr-2 text-violet-500" />
            Set Admin
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete */}
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={pending}
            className={
              confirmDelete
                ? "text-red-600 bg-red-50 focus:bg-red-100"
                : "text-red-600"
            }
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {confirmDelete ? "Click again to confirm!" : "Delete User"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
