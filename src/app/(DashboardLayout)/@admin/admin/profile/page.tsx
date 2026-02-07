import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminProfileForm from "./profile-form";
import { getAdminMeAction } from "@/actions/admin-action";

export default async function AdminProfilePage() {
  const { success, data, message } = await getAdminMeAction();
  if (!success) return <div>Failed to load profile: {message}</div>;

  const me = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Admin Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your account information
          </p>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Account</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{me?.role ?? "ADMIN"}</Badge>
            <Badge variant="secondary">{me?.status ?? "ACTIVE"}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{me?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{me?.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{me?.phone ?? "—"}</p>
            </div>
          </div>

          {/* Edit Form */}
          <AdminProfileForm defaultValues={me} />
        </CardContent>
      </Card>
    </div>
  );
}
