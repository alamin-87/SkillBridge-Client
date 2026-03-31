import Link from "next/link";
import {
  getTutorSessionsAction,
  getTutorAssignmentsAction,
  getTutorEarningsAction,
  getMyTutorProfileAction,
} from "@/actions/tutor-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/lib/icon-mapper";
import { TutorDashboardCharts } from "./tutor-dashboard-charts";
import { Separator } from "@/components/ui/separator";

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
  const [sessionsRes, assignmentsRes, earningsRes, profileRes] = await Promise.all([
    getTutorSessionsAction({ page: 1, limit: 100 }),
    getTutorAssignmentsAction({ limit: 100 }),
    getTutorEarningsAction({ limit: 100 }),
    getMyTutorProfileAction(),
  ]);

  // Resolved Icons via Mapper
  const ArrowRightIcon = getIconComponent("ArrowRight");
  const CalendarCheckIcon = getIconComponent("CalendarCheck");
  const TrendingUpIcon = getIconComponent("TrendingUp");
  const ClipboardListIcon = getIconComponent("ClipboardList");
  const WalletIcon = getIconComponent("Wallet");
  const UsersIcon = getIconComponent("Users");
  const ClockIcon = getIconComponent("Clock");
  const BriefcaseIcon = getIconComponent("Briefcase");

  const sessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : [];
  const assignments = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : [];
  const earnings = Array.isArray(earningsRes.data) ? earningsRes.data : [];
  const profile = profileRes.data;
  const availability = Array.isArray(profile?.availability) ? profile.availability : [];

  const confirmed = sessions.filter((s: any) => s.status === "CONFIRMED").length;
  const completed = sessions.filter((s: any) => s.status === "COMPLETED").length;
  
  // 🔥 Correct calculation based on confirmed/completed sessions
  const totalRevenue = sessions
    .filter((s: any) => s.status === "CONFIRMED" || s.status === "COMPLETED")
    .reduce((sum: number, s: any) => sum + (s.price ?? 0), 0);

  const openSlots = availability.filter((a: any) => !a.isBooked).length;

  const upcoming = [...sessions]
    .filter((s: any) => s.status === "CONFIRMED")
    .sort((a: any, b: any) => new Date(a.scheduledStart ?? 0).getTime() - new Date(b.scheduledStart ?? 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            Tutor Analytics
          </h2>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
            Track your sessions, assignments & professional growth
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" asChild size="sm" className="rounded-full font-bold">
              <Link href="/tutor/profile">View Profile</Link>
           </Button>
           <Button asChild size="sm" className="rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
             <Link href="/tutor/availability" className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" /> Manage Availability
             </Link>
           </Button>
        </div>
      </div>

      {/* Stat Cards - Modern High Density */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
               <CalendarCheckIcon className="h-5 w-5 text-indigo-500" />
               <Badge variant="secondary" className="text-[9px] font-black">{sessions.length}</Badge>
            </div>
            <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Sessions</p>
               <p className="text-xl font-black tabular-nums">{sessions.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
               <TrendingUpIcon className="h-5 w-5 text-emerald-500" />
               <Badge variant="secondary" className="text-[9px] font-black text-emerald-600">Done</Badge>
            </div>
            <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Completed</p>
               <p className="text-xl font-black tabular-nums">{completed}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-500/20 transition-all duration-300">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
               <ClipboardListIcon className="h-5 w-5 text-violet-500" />
               <Badge variant="secondary" className="text-[9px] font-black text-violet-600">Active</Badge>
            </div>
            <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assignments</p>
               <p className="text-xl font-black tabular-nums">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
               <UsersIcon className="h-5 w-5 text-blue-500" />
               <Badge variant="secondary" className="text-[9px] font-black text-blue-600">{openSlots} Wait</Badge>
            </div>
            <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Slots</p>
               <p className="text-xl font-black tabular-nums">{openSlots}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1 shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/20 transition-all duration-300">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
               <WalletIcon className="h-5 w-5 text-amber-500" />
               <span className="text-[10px] font-bold text-amber-600">{earnings.length} tx</span>
            </div>
            <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Revenue</p>
               <p className="text-xl font-black tabular-nums text-emerald-600">৳{totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <TutorDashboardCharts 
        sessions={sessions}
        assignments={assignments}
        earnings={earnings}
      />

      {/* Upcoming Sessions List */}
      <Card className="shadow-xl border-primary/5 bg-card/40 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5 bg-muted/5">
          <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
            <BriefcaseIcon className="h-4 w-4 text-indigo-500" /> Upcoming Engagement
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-bold hover:bg-indigo-500/10 hover:text-indigo-600 rounded-full">
            <Link href="/tutor/dashboard/sessions" className="flex items-center gap-1">
              View all <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-primary/5 p-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-4">
                 <CalendarCheckIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground">No upcoming sessions</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[250px] mx-auto">
                Update your available slots to start receiving bookings from students.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcoming.map((s: any) => (
                <div
                  key={s.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-primary/5 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 bg-card/10 backdrop-blur-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center font-bold text-indigo-600 text-xs">
                       {s.student?.name?.[0] || 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate text-sm">
                        {s.student?.name ?? "Student"}
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-tighter">
                         <ClockIcon className="w-3 h-3" />
                        {fmt(s.scheduledStart)} – {fmt(s.scheduledEnd)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-primary/5">
                    <Badge variant="outline" className={`text-[9px] font-black px-2 py-0 border-2 rounded-full ${statusColor[s.status] ?? ""}`}>
                       {s.status}
                    </Badge>
                    <span className="text-sm font-black tabular-nums bg-indigo-500/5 px-3 py-1 rounded-lg text-indigo-600">
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
