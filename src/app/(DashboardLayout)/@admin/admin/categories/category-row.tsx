"use client";

import { useState, useTransition } from "react";
import { deleteAdminCategoryAction, updateAdminCategoryAction } from "@/actions/admin-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategoryRow({ id, name }: { id: string; name: string }) {
  const [value, setValue] = useState(name);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onUpdate = () => {
    setError(null);
    start(async () => {
      const res = await updateAdminCategoryAction(id, { name: value });
      if (!res.success) setError(res.message || "Failed to update");
    });
  };

  const onDelete = () => {
    setError(null);
    start(async () => {
      const res = await deleteAdminCategoryAction(id);
      if (!res.success) setError(res.message || "Failed to delete");
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onUpdate}
            disabled={pending || !value.trim()}
          >
            {pending ? "Saving..." : "Update"}
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete} disabled={pending}>
            Delete
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
