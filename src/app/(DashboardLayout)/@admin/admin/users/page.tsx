import Link from "next/link";
import { getAdminUsersAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminUserRowActions from "./user-row-actions";

function fmtDate(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString();
}

export default async function AdminUsersPage() {
  const { success, data, message } = await getAdminUsersAction();
  if (!success) return <div>Failed to load users: {message}</div>;

  const users = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">Manage user status (ban/unban) and roles</p>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((u: any) => (
                <div
                  key={u.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{u.name ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground">Joined: {fmtDate(u.createdAt)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{u.role}</Badge>
                    <Badge variant={u.status === "BANNED" ? "destructive" : "secondary"}>
                      {u.status}
                    </Badge>

                    {/* quick profile view */}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/users/${u.id}`}>View</Link>
                    </Button>

                    {/* actions */}
                    <AdminUserRowActions userId={u.id} status={u.status} role={u.role} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
