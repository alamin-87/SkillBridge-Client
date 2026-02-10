import Link from "next/link";
import { getStudentBookingsAction } from "@/actions/student-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase())
    .join("");
}

function getTutorCardInfo(b: any) {
  const tutorName =
    b?.tutor?.user?.name ||
    b?.tutor?.name ||
    b?.tutorName ||
    "Tutor";

  const tutorImage =
    b?.tutor?.user?.image ||
    b?.tutor?.image ||
    b?.tutorImage ||
    null;

  const tutorId =
    b?.tutorProfileId ||
    b?.tutorProfile?.id ||
    b?.tutor?.id ||
    b?.tutorId ||
    null;

  const hourlyRate =
    b?.tutorProfile?.hourlyRate ??
    b?.tutor?.tutorProfile?.hourlyRate ??
    null;

  return { tutorId, tutorName, tutorImage, hourlyRate };
}

function statusVariant(status?: string) {
  // keep simple; using "secondary" always is fine too
  return "secondary" as const;
}

export default async function StudentMyBookingsPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const limit = Number(searchParams?.limit ?? 10);

  const { success, data, meta } = await getStudentBookingsAction({ page, limit });
  if (!success) return <div>Failed to load bookings</div>;

  const bookings = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">My bookings</h2>
          <p className="text-sm text-muted-foreground">
            {meta?.total ? `${meta.total} total` : "All your booked sessions."}
          </p>
        </div>

        {/* Optional: add filters later */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>

        <CardContent>
          {bookings.length === 0 ? (
            <div className="rounded-lg border p-6 text-center">
              <p className="text-sm font-medium">No bookings found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When you book a tutor, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b: any) => {
                const t = getTutorCardInfo(b);

                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Left: Tutor + schedule */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={t.tutorImage ?? undefined} alt={t.tutorName} />
                        <AvatarFallback>{getInitials(t.tutorName)}</AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">{t.tutorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {fmt(b.scheduledStart)}{" "}
                          {b.scheduledEnd ? `– ${fmt(b.scheduledEnd)}` : ""}
                          <span className="px-1">•</span>
                          {t.hourlyRate ? `৳${t.hourlyRate}/hr` : "Flexible pricing"}
                        </p>

                        {b?.cancelReason ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Cancel reason: {b.cancelReason}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Right: status + price + actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Badge variant={statusVariant(b.status)}>
                        {b.status ?? "CONFIRMED"}
                      </Badge>

                      {typeof b.price === "number" ? (
                        <span className="text-sm font-semibold">৳{b.price}</span>
                      ) : null}

                      {t.tutorId ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/tutors/${t.tutorId}`}>View Tutor</Link>
                        </Button>
                      ) : null}

                      {/* Optional: booking details route */}
                      {/* {b.id ? (
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/dashboard/bookings/${b.id}`}>Details</Link>
                        </Button>
                      ) : null} */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
