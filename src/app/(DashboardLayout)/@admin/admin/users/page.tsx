import Link from "next/link";
import { getAdminUsersAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import AdminUserRowActions from "./user-row-actions";
import UserFilters from "./user-filters";

function fmtDate(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const query: Record<string, any> = {};
  if (params?.search) query.search = params.search;
  if (params?.role && params.role !== "ALL") query.role = params.role;
  if (params?.status && params.status !== "ALL") query.status = params.status;
  if (params?.page) query.page = parseInt(params.page);

  const { success, data, message } = await getAdminUsersAction(query);
  if (!success) return <div>Failed to load users: {message}</div>;

  const users = Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : []);
  const meta = data?.meta ?? { total: users.length, page: 1, limit: 50, totalPages: 1 };

  // Build pagination URLs
  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams();
    if (params?.search) p.set("search", params.search);
    if (params?.role) p.set("role", params.role);
    if (params?.status) p.set("status", params.status);
    p.set("page", String(page));
    return `/admin/users?${p.toString()}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">User Management</h2>
            <p className="text-sm text-muted-foreground">
              {meta.total} total users · Manage accounts, roles, and access
            </p>
          </div>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Dashboard
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <UserFilters />

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Showing {users.length} of {meta.total} users
            {params?.search && (
              <span className="text-muted-foreground font-normal ml-1">
                matching &quot;{params.search}&quot;
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No users found matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">User</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Activity</th>
                    <th className="px-4 py-3 text-left font-medium">Joined</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr
                      key={u.id}
                      className="border-b transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                            {u.image ? (
                              <img
                                src={u.image}
                                alt={u.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              u.name?.[0]?.toUpperCase() ?? "?"
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{u.name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            u.role === "ADMIN"
                              ? "bg-violet-500/10 text-violet-600 border-violet-200"
                              : u.role === "TUTOR"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                                : "bg-blue-500/10 text-blue-600 border-blue-200"
                          }
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={u.status === "BANNED" ? "destructive" : "secondary"}
                          className={
                            u.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                              : ""
                          }
                        >
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          {u._count && (
                            <>
                              <span title="Student Bookings">
                                📚 {u._count.studentBookings ?? 0}
                              </span>
                              <span title="Tutor Bookings">
                                🎓 {u._count.tutorBookings ?? 0}
                              </span>
                              <span title="Reviews Given">
                                ⭐ {u._count.reviewsGiven ?? 0}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {fmtDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminUserRowActions
                          userId={u.id}
                          status={u.status}
                          role={u.role}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex gap-1">
              {meta.page > 1 && (
                <Button asChild size="sm" variant="outline" className="h-8">
                  <Link href={buildPageUrl(meta.page - 1)}>
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Link>
                </Button>
              )}
              {meta.page < meta.totalPages && (
                <Button asChild size="sm" variant="outline" className="h-8">
                  <Link href={buildPageUrl(meta.page + 1)}>
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
