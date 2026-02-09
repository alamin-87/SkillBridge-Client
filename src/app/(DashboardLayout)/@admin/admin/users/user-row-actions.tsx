"use client";

import { useTransition } from "react";
import { updateAdminUserAction } from "@/actions/admin-action";
import { Button } from "@/components/ui/button";

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

  const toggleStatus = () => {
    start(async () => {
      await updateAdminUserAction(userId, {
        status: status === "BANNED" ? "ACTIVE" : "BANNED",
      });
    });
  };

  const setRole = (nextRole: "STUDENT" | "TUTOR" | "ADMIN") => {
    start(async () => {
      await updateAdminUserAction(userId, { role: nextRole });
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant={status === "BANNED" ? "outline" : "destructive"}
        onClick={toggleStatus}
        disabled={pending}
      >
        {pending ? "Saving..." : status === "BANNED" ? "Unban" : "Ban"}
      </Button>

      {/* simple role buttons (easy to understand) */}
      <Button
        size="sm"
        variant={role === "STUDENT" ? "secondary" : "outline"}
        onClick={() => setRole("STUDENT")}
        disabled={pending}
      >
        Student
      </Button>
      <Button
        size="sm"
        variant={role === "TUTOR" ? "secondary" : "outline"}
        onClick={() => setRole("TUTOR")}
        disabled={pending}
      >
        Tutor
      </Button>
      <Button
        size="sm"
        variant={role === "ADMIN" ? "secondary" : "outline"}
        onClick={() => setRole("ADMIN")}
        disabled={pending}
      >
        Admin
      </Button>
    </div>
  );
}
