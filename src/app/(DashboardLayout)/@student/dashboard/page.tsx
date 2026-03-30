import Link from "next/link";
import {
  getStudentMeAction,
  getStudentBookingsAction,
  getMyTutorRequestAction,
} from "@/actions/student-action";
import { getAssignmentsAction } from "@/actions/assignment-action";
import { getMyPaymentsAction } from "@/actions/payment-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

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
  const [meRes, bookingsRes, assignmentsRes, paymentsRes, tutorReqRes] =
    await Promise.all([
      getStudentMeAction(),
      getStudentBookingsAction({ page: 1, limit: 10 }),
      getAssignmentsAction({ page: 1, limit: 10 }),
      getMyPaymentsAction({ page: 1, limit: 10 }),
      getMyTutorRequestAction(),
    ]);

  if (!meRes.success) return <div>Failed to load student info</div>;
  if (!bookingsRes.success) return <div>Failed to load bookings</div>;

  const me = meRes.data;
  const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
  const assignments = Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : [];
  const payments = Array.isArray(paymentsRes?.data) ? paymentsRes.data : [];

  const tutorRequest = tutorReqRes?.data;
  const stats = countByStatus(bookings);

  const recent = [...bookings]
    .sort((a, b) => {
      const da = new Date(a.scheduledStart ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.scheduledStart ?? b.createdAt ?? 0).getTime();
      return db - da;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Welcome{me?.name ? `, ${me.name}` : ""} 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s your latest activity overview.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/bookings">View all bookings</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bookings.length}</p>
            <p className="text-xs text-muted-foreground">{stats.CONFIRMED} upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.COMPLETED}</p>
            <p className="text-xs text-muted-foreground">sessions done</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{assignments.length}</p>
            <p className="text-xs text-muted-foreground">total received</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{payments.length}</p>
            <p className="text-xs text-muted-foreground">transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Become a Tutor CTA */}
      {!tutorRequest && (
        <Card className="bg-linear-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border-violet-200">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-violet-500" />
              <div>
                <p className="font-semibold">Want to become a Tutor?</p>
                <p className="text-sm text-muted-foreground">
                  Share your expertise and earn by teaching on SkillBridge
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="gap-1">
              <Link href="/dashboard/become-tutor">
                Apply Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {tutorRequest && (
        <Card className={`border-l-4 ${
          tutorRequest.status === "PENDING" ? "border-l-amber-500" :
          tutorRequest.status === "APPROVED" ? "border-l-emerald-500" :
          "border-l-red-500"
        }`}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <GraduationCap className={`h-6 w-6 ${
                tutorRequest.status === "PENDING" ? "text-amber-500" :
                tutorRequest.status === "APPROVED" ? "text-emerald-500" :
                "text-red-500"
              }`} />
              <div>
                <p className="font-semibold">Tutor Application</p>
                <p className="text-sm text-muted-foreground">
                  Status: <Badge variant="outline" className="ml-1">{tutorRequest.status}</Badge>
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/become-tutor">View Details</Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
