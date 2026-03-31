import Link from "next/link";
import { getAdminBookingsAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowLeft } from "lucide-react";
import BookingDeleteButton from "./booking-delete-button";
import BookingStatusActions from "./booking-status-actions";

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

export default async function AdminBookingsPage() {
  const { success, data, message } = await getAdminBookingsAction();
  if (!success) return <div>Failed to load bookings: {message}</div>;

  const bookings = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-violet-500" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Booking Management</h2>
            <p className="text-sm text-muted-foreground">
              {bookings.length} total bookings across the platform
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
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/10 border-l-4 border-l-primary/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {b.student?.name ?? "Student"} →{" "}
                      {b.tutor?.name ?? "Tutor"}
                    </p>
                    <p className="text-sm text-muted-foreground py-0.5">
                      {fmt(b.scheduledStart)} – {fmt(b.scheduledEnd)}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-tighter text-muted-foreground">
                        ID: {b.id.slice(0, 12)}...
                        </span>
                        <Badge variant="outline" className="text-[10px] h-4">
                           {b.paymentStatus}
                        </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <BookingStatusActions bookingId={b.id} currentStatus={b.status} />
                    <span className="text-sm font-bold w-16 text-right">৳{b.price}</span>

                    <div className="flex items-center gap-1.5 ml-2 border-l pl-2 border-muted/50">
                      {b.student?.id && (
                        <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                          <Link href={`/users/${b.student.id}`}>User</Link>
                        </Button>
                      )}
                      {b.tutor?.id && (
                        <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                          <Link href={`/tutors/${b.tutorProfileId}`}>Tutor</Link>
                        </Button>
                      )}
                      
                      {/* delete action */}
                      <BookingDeleteButton bookingId={b.id} />
                    </div>
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
