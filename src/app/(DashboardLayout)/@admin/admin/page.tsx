import Link from "next/link";
import { getAdminDashboardAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
} from "lucide-react";
import { getIconComponent } from "@/lib/icon-mapper";

function fmtDate(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString(undefined, {
    month: "short", day: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const { success, data, message } = await getAdminDashboardAction();
  if (!success) return <div>Failed to load dashboard: {message}</div>;

  const stats = data ?? {};
  const summary = stats.summary ?? {};
  const charts = stats.charts ?? {};

  const quickLinks = [
    { label: "Users", href: "/admin/users", icon: "Users", color: "text-blue-500" },
    { label: "Bookings", href: "/admin/bookings", icon: "BookOpen", color: "text-emerald-500" },
    { label: "Payments", href: "/admin/payments", icon: "CreditCard", color: "text-violet-500" },
    { label: "Categories", href: "/admin/categories", icon: "FolderOpen", color: "text-amber-500" },
    { label: "Reviews", href: "/admin/reviews", icon: "Star", color: "text-yellow-500" },
    { label: "Assignments", href: "/admin/assignments", icon: "ClipboardList", color: "text-pink-500" },
    { label: "Tutor Requests", href: "/admin/tutor-requests", icon: "UserCheck", color: "text-teal-500" },
    { label: "Notifications", href: "/admin/notifications", icon: "Bell", color: "text-orange-500" },
  ];

  // Resolve all icons
  const ShieldIcon = getIconComponent("Shield");
  const UsersIcon = getIconComponent("Users");
  const DollarIcon = getIconComponent("DollarSign");
  const BookIcon = getIconComponent("BookOpen");
  const StarIcon = getIconComponent("Star");
  const FolderIcon = getIconComponent("FolderOpen");
  const ClipboardIcon = getIconComponent("ClipboardList");
  const UserCheckIcon = getIconComponent("UserCheck");
  const AlertIcon = getIconComponent("AlertTriangle");
  const TrendingIcon = getIconComponent("TrendingUp");
  const ActivityIcon = getIconComponent("Activity");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-primary" />
            Admin Command Center
          </h2>
          <p className="text-sm text-muted-foreground">
            Full platform overview and system management
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/tutor-requests">
              Pending Requests
              {(summary.pendingTutorRequests ?? 0) > 0 && (
                <Badge variant="destructive" className="ml-1.5 h-5 px-1.5 text-[10px]">
                  {summary.pendingTutorRequests}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Key Metrics ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.totalUsers ?? 0}</p>
            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
              <span>{summary.totalStudents ?? 0} students</span>
              <span>{summary.totalTutors ?? 0} tutors</span>
              <span>{summary.totalAdmins ?? 0} admins</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">৳{(summary.totalRevenue ?? 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.totalSuccessfulPayments ?? 0} successful payments
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <BookIcon className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.totalBookings ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.completedBookings ?? 0} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Rating</CardTitle>
            <StarIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.platformAvgRating ?? 0}/5</p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.totalReviews ?? 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Secondary Metrics ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Categories</CardTitle>
            <FolderIcon className="h-3.5 w-3.5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.totalCategories ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Assignments</CardTitle>
            <ClipboardIcon className="h-3.5 w-3.5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.totalAssignments ?? 0}</p>
            <p className="text-xs text-muted-foreground">{summary.totalSubmissions ?? 0} submissions</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Tutor Profiles</CardTitle>
            <UserCheckIcon className="h-3.5 w-3.5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.totalTutorProfiles ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pending Requests</CardTitle>
            <AlertIcon className="h-3.5 w-3.5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.pendingTutorRequests ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Distribution Charts (visual bars) ─── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-blue-500" />
              User Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(charts.userRoleDistribution ?? []).map((item: any) => {
              const total = summary.totalUsers || 1;
              const pct = Math.round((item.value / total) * 100);
              const colors: Record<string, string> = {
                Students: "bg-blue-500", Tutors: "bg-emerald-500", Admins: "bg-violet-500",
              };
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${colors[item.name] ?? "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookIcon className="h-4 w-4 text-violet-500" />
              Booking Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(charts.bookingStatusDistribution ?? []).map((item: any) => {
              const total = summary.totalBookings || 1;
              const pct = Math.round((item.value / total) * 100);
              const colors: Record<string, string> = {
                Pending: "bg-amber-500", Confirmed: "bg-blue-500",
                Completed: "bg-emerald-500", Cancelled: "bg-red-500",
              };
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${colors[item.name] ?? "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ─── Monthly Trends (Bar Charts) ─── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingIcon className="h-4 w-4 text-emerald-500" />
              Monthly Bookings (12 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {(charts.monthlyBookings ?? []).map((m: any, i: number) => {
                const max = Math.max(...(charts.monthlyBookings ?? []).map((x: any) => x.count), 1);
                const h = Math.max((m.count / max) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] text-muted-foreground">{m.count || ""}</span>
                    <div
                      className="w-full bg-emerald-500/80 rounded-t transition-all hover:bg-emerald-500"
                      style={{ height: `${h}%` }}
                      title={`${m.month}: ${m.count}`}
                    />
                    <span className="text-[7px] text-muted-foreground truncate w-full text-center">
                      {m.month?.split(" ")[0]?.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarIcon className="h-4 w-4 text-violet-500" />
              Monthly Revenue (12 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {(charts.monthlyRevenue ?? []).map((m: any, i: number) => {
                const max = Math.max(...(charts.monthlyRevenue ?? []).map((x: any) => x.amount), 1);
                const h = Math.max((m.amount / max) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] text-muted-foreground">
                      {m.amount ? `৳${m.amount}` : ""}
                    </span>
                    <div
                      className="w-full bg-violet-500/80 rounded-t transition-all hover:bg-violet-500"
                      style={{ height: `${h}%` }}
                      title={`${m.month}: ৳${m.amount}`}
                    />
                    <span className="text-[7px] text-muted-foreground truncate w-full text-center">
                      {m.month?.split(" ")[0]?.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Top Tutors ─── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Rated */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <StarIcon className="h-4 w-4 text-yellow-500" />
              Top Rated Tutors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(stats.topTutors ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No tutors yet.</p>
            ) : (
              (stats.topTutors ?? []).map((tutor: any, i: number) => (
                <div key={tutor.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden">
                    {tutor.image ? (
                      <img src={tutor.image} alt={tutor.name} className="h-full w-full object-cover" />
                    ) : (
                      tutor.name?.[0]?.toUpperCase() ?? "?"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tutor.name}</p>
                    <p className="text-xs text-muted-foreground">{tutor.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {(tutor.avgRating ?? 0).toFixed(1)}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{tutor.totalReviews} reviews</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Earners */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingIcon className="h-4 w-4 text-emerald-500" />
              Top Earning Tutors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(stats.topEarners ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No earnings yet.</p>
            ) : (
              (stats.topEarners ?? []).map((tutor: any, i: number) => (
                <div key={tutor.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden">
                    {tutor.image ? (
                      <img src={tutor.image} alt={tutor.name} className="h-full w-full object-cover" />
                    ) : (
                      tutor.name?.[0]?.toUpperCase() ?? "?"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tutor.name}</p>
                    <p className="text-xs text-muted-foreground">{tutor.email}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">
                    ৳{(tutor.totalEarnings ?? 0).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-blue-500" />
              Recent Users
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link href="/admin/users">View all <ArrowUpRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(stats.recentUsers ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent users.</p>
            ) : (
              (stats.recentUsers ?? []).map((u: any) => (
                <div key={u.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                      {u.image ? (
                        <img src={u.image} alt={u.name} className="h-full w-full object-cover" />
                      ) : (
                        u.name?.[0]?.toUpperCase() ?? "?"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="secondary" className="text-[9px] h-4">{u.role}</Badge>
                    <span className="text-[10px] text-muted-foreground">{fmtDate(u.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-emerald-500" />
              Recent Bookings
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link href="/admin/bookings">View all <ArrowUpRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(stats.recentBookings ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent bookings.</p>
            ) : (
              (stats.recentBookings ?? []).map((b: any) => (
                <div key={b.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {b.student?.name ?? "Student"} → {b.tutor?.name ?? "Tutor"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{fmtDate(b.createdAt)}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      b.status === "COMPLETED" ? "border-emerald-200 text-emerald-600" :
                      b.status === "CONFIRMED" ? "border-blue-200 text-blue-600" :
                      b.status === "CANCELLED" ? "border-red-200 text-red-600" :
                      "border-amber-200 text-amber-600"
                    }
                  >
                    {b.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Quick Navigation ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Navigation</CardTitle>
          <CardDescription>Jump to any management section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((link) => {
              const QuickIcon = getIconComponent(link.icon);
              return (
                <Button
                  key={link.href}
                  asChild
                  variant="outline"
                  className="h-auto py-3 flex flex-col gap-1.5 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Link href={link.href}>
                    <QuickIcon className={`h-5 w-5 ${link.color}`} />
                    <span className="text-xs font-medium">{link.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
