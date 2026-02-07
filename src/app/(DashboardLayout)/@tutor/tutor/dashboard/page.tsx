import Link from "next/link";
import { getTutorSessionsAction } from "@/actions/tutor-action";
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

function countByStatus(list: any[]) {
  const base = { CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
  for (const b of list) {
    const s = b?.status;
    if (s && base[s as keyof typeof base] !== undefined) {
      base[s as keyof typeof base] += 1;
    }
  }
  return base;
}

export default async function TutorDashboardPage() {
  const { success, data } = await getTutorSessionsAction({ page: 1, limit: 10 });
  if (!success) return <div>Failed to load sessions</div>;

  const sessions = Array.isArray(data) ? data : [];
  const stats = countByStatus(sessions);

  const recent = [...sessions]
    .sort(
      (a, b) =>
        new Date(a.scheduledStart ?? 0).getTime() -
        new Date(b.scheduledStart ?? 0).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tutor Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Manage your upcoming and past sessions
          </p>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/tutor/availability">Manage availability</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {sessions.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.CONFIRMED}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.COMPLETED}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.CANCELLED}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming sessions</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/tutor/sessions">View all</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {recent.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              No sessions scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      Student: {s.student?.name ?? "Student"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fmt(s.scheduledStart)} – {fmt(s.scheduledEnd)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{s.status}</Badge>
                    <span className="text-sm font-semibold">
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
