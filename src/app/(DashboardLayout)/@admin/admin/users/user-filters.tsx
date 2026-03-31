"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const roles = ["ALL", "STUDENT", "TUTOR", "ADMIN"] as const;
const statuses = ["ALL", "ACTIVE", "BANNED"] as const;

export default function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [isPending, startTransition] = useTransition();

  const currentRole = searchParams.get("role") ?? "ALL";
  const currentStatus = searchParams.get("status") ?? "ALL";

  const applyFilters = useCallback(
    (overrides: Record<string, string> = {}) => {
      const params = new URLSearchParams(searchParams.toString());

      // merge overrides
      for (const [k, v] of Object.entries(overrides)) {
        if (v === "ALL" || !v) params.delete(k);
        else params.set(k, v);
      }

      // always reset to page 1 when filtering
      params.delete("page");

      startTransition(() => {
        router.push(`/admin/users?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");
    params.delete("page");
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const clearAll = () => {
    setSearch("");
    startTransition(() => {
      router.push("/admin/users");
    });
  };

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("role") ||
    searchParams.has("status");

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="admin-user-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button
          size="sm"
          onClick={handleSearch}
          disabled={isPending}
          className="px-4"
        >
          Search
        </Button>
        {hasFilters && (
          <Button size="sm" variant="ghost" onClick={clearAll} disabled={isPending}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-muted-foreground self-center mr-1">Role:</span>
        {roles.map((role) => (
          <Button
            key={role}
            size="sm"
            variant={currentRole === role ? "default" : "outline"}
            className="h-7 text-xs px-3"
            onClick={() => applyFilters({ role })}
            disabled={isPending}
          >
            {role === "ALL" ? "All Roles" : role}
          </Button>
        ))}

        <span className="text-xs font-medium text-muted-foreground self-center ml-3 mr-1">Status:</span>
        {statuses.map((st) => (
          <Button
            key={st}
            size="sm"
            variant={currentStatus === st ? "default" : "outline"}
            className="h-7 text-xs px-3"
            onClick={() => applyFilters({ status: st })}
            disabled={isPending}
          >
            {st === "ALL" ? "All Status" : st}
          </Button>
        ))}
      </div>
    </div>
  );
}
