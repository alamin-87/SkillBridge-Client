"use client";

import { useState, useTransition } from "react";
import { createAdminCategoryAction } from "@/actions/admin-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategoryCreate() {
  const [name, setName] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onCreate = () => {
    setError(null);
    start(async () => {
      const res = await createAdminCategoryAction({ name });
      if (!res.success) {
        setError(res.message || "Failed to create");
        return;
      }
      setName("");
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={onCreate} disabled={pending || !name.trim()}>
          {pending ? "Creating..." : "Create"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
