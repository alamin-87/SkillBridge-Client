import Link from "next/link";
import { getAdminBookingsAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function fmt(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function badgeVariant(status?: string) {
  if (status === "CANCELLED") return "destructive";
  return "secondary";
}

export default async function AdminBookingsPage() {
  const { success, data, message } = await getAdminBookingsAction();
  if (!success) return <div>Failed to load bookings: {message}</div>;

  const bookings = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Bookings</h2>
          <p className="text-sm text-muted-foreground">
            All bookings across the platform
          </p>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
        </CardHeader>

        <CardContent>
          {bookings.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              No bookings found.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b: any) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {b.student?.name ?? "Student"} →{" "}
                      {b.tutor?.name ?? "Tutor"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fmt(b.scheduledStart)} – {fmt(b.scheduledEnd)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Booking ID: {b.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={badgeVariant(b.status)}>{b.status}</Badge>
                    <span className="text-sm font-semibold">৳{b.price}</span>

                    {/* Quick links */}
                    {b.student?.id && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/users/${b.student.id}`}>Student</Link>
                      </Button>
                    )}
                    {b.tutor?.id && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/tutors/${b.tutorProfileId}`}>Tutor</Link>
                      </Button>
                    )}
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
