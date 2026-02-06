import Link from "next/link";
import { getStudentMeAction, getStudentBookingsAction } from "@/actions/student-action";
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

function countByStatus(bookings: any[]) {
  const base = { CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
  for (const b of bookings) {
    const s = b?.status;
    if (s && base[s as keyof typeof base] !== undefined) base[s as keyof typeof base] += 1;
  }
  return base;
}

// ✅ tutor info helper (supports different backend shapes)
function getTutorCardInfo(b: any) {
  const tutorName =
    b?.tutor?.user?.name ||
    b?.tutor?.name ||
    b?.tutorName ||
    "Tutor";

  const profileImage =
    b?.tutor?.user?.image ||
    b?.tutor?.profileImage ||
    b?.tutorImage ||
    null;

  // Prefer tutorProfileId for public profile route /tutors/:id
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

  return { tutorId, tutorName, profileImage, hourlyRate };
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase())
    .join("");
}

export default async function StudentDashboardHistoryPage() {
  const [meRes, bookingsRes] = await Promise.all([
    getStudentMeAction(),
    getStudentBookingsAction({ page: 1, limit: 10 }),
  ]);

  if (!meRes.success) return <div>Failed to load student info</div>;
  if (!bookingsRes.success) return <div>Failed to load bookings</div>;

  const me = meRes.data;
  const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];

  const stats = countByStatus(bookings);

  const recent = [...bookings]
    .sort((a, b) => {
      const da = new Date(a.scheduledStart ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.scheduledStart ?? b.createdAt ?? 0).getTime();
      return db - da;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header mini */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Welcome{me?.name ? `, ${me.name}` : ""} 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here’s your latest booking activity.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/bookings">View all bookings</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{bookings.length}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.CONFIRMED}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.COMPLETED}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.CANCELLED}</CardContent>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Recent bookings</CardTitle>
            <p className="text-sm text-muted-foreground">Last 5 sessions you booked.</p>
          </div>
        </CardHeader>

        <CardContent>
          {recent.length === 0 ? (
            <div className="rounded-lg border p-6 text-center">
              <p className="text-sm font-medium">No bookings yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a tutor and your sessions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((b: any) => {
                const t = getTutorCardInfo(b);

                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Tutor info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={t.profileImage ?? undefined} alt={t.tutorName} />
                        <AvatarFallback>{getInitials(t.tutorName)}</AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {t.tutorName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {t.hourlyRate ? `৳${t.hourlyRate}/hr` : "Flexible pricing"}
                          <span className="px-1">•</span>
                          {fmt(b.scheduledStart)}{" "}
                          {b.scheduledEnd ? `– ${fmt(b.scheduledEnd)}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Booking meta + button */}
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{b.status ?? "CONFIRMED"}</Badge>

                      {typeof b.price === "number" ? (
                        <span className="text-sm font-semibold">৳{b.price}</span>
                      ) : null}

                      {t.tutorId ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/tutors/${t.tutorId}`}>View Tutor</Link>
                        </Button>
                      ) : null}
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
