import Link from "next/link";
import {
  getTutorSessionsAction,
  getTutorAssignmentsAction,
  getTutorEarningsAction,
} from "@/actions/tutor-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
} from "lucide-react";
import { getIconComponent } from "@/lib/icon-mapper";

function fmt(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const statusColor: Record<string, string> = {
  CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-200",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-200",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200",
};

export default async function TutorDashboardPage() {
  const [sessionsRes, assignmentsRes, earningsRes] = await Promise.all([
    getTutorSessionsAction({ page: 1, limit: 50 }),
    getTutorAssignmentsAction({ limit: 50 }),
    getTutorEarningsAction({ limit: 50 }),
  ]);

  const sessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : [];
  const assignments = Array.isArray(assignmentsRes.data)
    ? assignmentsRes.data
    : [];
  const earnings = Array.isArray(earningsRes.data) ? earningsRes.data : [];

  const confirmed = sessions.filter(
    (s: any) => s.status === "CONFIRMED"
  ).length;
  const completed = sessions.filter(
    (s: any) => s.status === "COMPLETED"
  ).length;
  const totalRevenue = earnings.reduce(
    (sum: number, e: any) => sum + (e?.amount ?? 0),
    0
  );

  const upcoming = [...sessions]
    .filter((s: any) => s.status === "CONFIRMED")
    .sort(
      (a: any, b: any) =>
        new Date(a.scheduledStart ?? 0).getTime() -
        new Date(b.scheduledStart ?? 0).getTime()
    )
    .slice(0, 5);

  // Unified Icons via Mapper
  const CalendarIcon = getIconComponent("CalendarCheck");
  const TrendingIcon = getIconComponent("TrendingUp");
  const ClipboardIcon = getIconComponent("ClipboardList");
  const WalletIcon = getIconComponent("Wallet");
  const UsersIcon = getIconComponent("Users");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Tutor Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Overview of your sessions, assignments &amp; earnings
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/tutor/availability">
            Manage availability
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{sessions.length}</p>
            <p className="text-xs text-muted-foreground">
              {confirmed} upcoming
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <TrendingIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completed}</p>
            <p className="text-xs text-muted-foreground">sessions done</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assignments
            </CardTitle>
            <ClipboardIcon className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{assignments.length}</p>
            <p className="text-xs text-muted-foreground">total given</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ৳{totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {earnings.length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <UsersIcon className="h-4 w-4" /> Upcoming Sessions
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link
              href="/tutor/dashboard/sessions"
              className="flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {upcoming.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No upcoming sessions. Update your availability to start
              receiving bookings.
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((s: any) => (
                <div
                  key={s.id}
                  className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {s.student?.name ?? "Student"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fmt(s.scheduledStart)} – {fmt(s.scheduledEnd)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={statusColor[s.status] ?? ""}
                    >
                      {s.status}
                    </Badge>
                    <span className="text-sm font-semibold tabular-nums">
                      ৳{s.price}
                    </span>
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
