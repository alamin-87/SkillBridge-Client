import { getTutorSessionsAction } from "@/actions/tutor-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import SessionActions from "./session-actions";

function fmt(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
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

export default async function TutorSessionsPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const targetId = searchParams?.id;
  const { success, data } = await getTutorSessionsAction({
    page: 1,
    limit: 100,
  });

  if (!success)
    return (
      <div className="text-center text-muted-foreground py-12">
        Failed to load sessions
      </div>
    );

  const sessions = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-blue-500" />
          All Sessions
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage and track all your tutoring sessions
        </p>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No sessions found. Update your availability to receive bookings.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: any) => (
            <Card
              key={s.id}
              id={`session-${s.id}`}
              className={cn(
                "transition-all duration-500",
                targetId === s.id 
                  ? "ring-2 ring-primary bg-primary/5 shadow-md scale-[1.01]" 
                  : "hover:bg-muted/30"
              )}
            >
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold truncate">
                      {s.student?.name ?? "Student"}
                    </p>
                    <Badge
                      variant="outline"
                      className={statusColor[s.status] ?? ""}
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {fmt(s.scheduledStart)} – {fmt(s.scheduledEnd)}
                  </p>
                  {s.student?.email && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.student.email}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold tabular-nums">
                    ৳{s.price}
                  </span>
                  <SessionActions
                    bookingId={s.id}
                    status={s.status}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
