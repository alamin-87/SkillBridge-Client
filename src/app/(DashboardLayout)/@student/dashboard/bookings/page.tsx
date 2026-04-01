"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Calendar,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getStudentBookingsAction,
  cancelBookingAction,
} from "@/actions/student-action";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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
    b?.tutor?.user?.name || b?.tutor?.name || b?.tutorName || "Tutor";

  const tutorImage =
    b?.tutor?.user?.image || b?.tutor?.image || b?.tutorImage || null;

  const tutorId =
    b?.tutorProfileId ||
    b?.tutorProfile?.id ||
    b?.tutor?.id ||
    b?.tutorId ||
    null;

  const hourlyRate =
    b?.tutorProfile?.hourlyRate ?? b?.tutor?.tutorProfile?.hourlyRate ?? null;

  return { tutorId, tutorName, tutorImage, hourlyRate };
}

function statusVariant(
  status?: string,
): "secondary" | "destructive" | "outline" | "default" {
  switch (status) {
    case "CANCELLED":
      return "destructive";
    case "COMPLETED":
      return "default";
    default:
      return "secondary";
  }
}

function getStatusIcon(status?: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "CANCELLED":
      return <XCircle className="h-3.5 w-3.5" />;
    default:
      return <Clock className="h-3.5 w-3.5" />;
  }
}

function getPaymentBadge(paymentStatus?: string) {
  switch (paymentStatus) {
    case "PAID":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 gap-1 pb-1">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20 gap-1 pb-1">
          <RefreshCw className="h-3 w-3" />
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 gap-1 pb-1">
          <AlertTriangle className="h-3 w-3" />
          Unpaid
        </Badge>
      );
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border/50 p-2.5 rounded-xl shadow-lg transition-all">
        {label && <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs font-bold">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill || "#3b82f6" }} />
            <span className="capitalize">{entry.name}:</span>
            <span className="text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentMyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const { success, data } = await getStudentBookingsAction({
        page: 1,
        limit: 50,
      });
      if (success && Array.isArray(data)) {
        setBookings(data);
      }
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this session? The tutor will be notified and the slot will be released.",
      )
    )
      return;

    setIsCancelling(id);
    try {
      const res = await cancelBookingAction(id);
      if (res.success) {
        toast.success(
          "Session cancelled. The slot has been refunded to the tutor's availability.",
        );
        fetchBookings();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsCancelling(null);
    }
  };

  // Prepare Analytics Data
  const bookingStatusData = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "CONFIRMED").length },
    { name: "Completed", value: bookings.filter((b) => b.status === "COMPLETED").length },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "CANCELLED").length },
    { name: "Pending", value: bookings.filter((b) => b.status === "PENDING").length },
  ].filter(d => d.value > 0);

  const bookingTrendMap: Record<string, number> = {};
  bookings.slice(-7).reverse().forEach(b => {
    const day = new Date(b.createdAt).toLocaleDateString(undefined, { weekday: 'short' });
    bookingTrendMap[day] = (bookingTrendMap[day] || 0) + 1;
  });
  const bookingTrendData = Object.entries(bookingTrendMap).map(([name, value]) => ({ name, value }));

  const PIE_COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <Card>
          <CardContent className="p-8 flex justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 animate-spin" />
              <span>Loading bookings…</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Session Bookings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your scheduled learning sessions and track your attendance.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-right">
                <p className="text-sm font-bold">{bookings.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Total Bookings</p>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <div className="text-right">
                <p className="text-sm font-bold text-emerald-500">{bookings.filter(b => b.status === 'COMPLETED').length}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Success Rate</p>
            </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
             <CardHeader className="pb-0 pt-6 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                    <PieChartIcon className="w-4 h-4 text-blue-500" /> Status Distribution
                </CardTitle>
             </CardHeader>
             <CardContent className="p-4">
                 <div className="h-[180px] w-full">
                    {bookingStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    {PIE_COLORS.map((color, i) => (
                                        <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={bookingStatusData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {bookingStatusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#grad-${index % PIE_COLORS.length})`} className="hover:opacity-80 transition-opacity" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">No data yet</div>
                    )}
                 </div>
             </CardContent>
         </Card>

         <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-2">
             <CardHeader className="pb-0 pt-6 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Weekly Activity
                </CardTitle>
             </CardHeader>
             <CardContent className="p-4">
                 <div className="h-[180px] w-full">
                    {bookingTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bookingTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                                <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.3 }} content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Bookings" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">No bookings this week</div>
                    )}
                 </div>
             </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Detailed Schedule</CardTitle>
          </div>
          <CardDescription>Review and manage your individual session details.</CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {bookings.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed p-12 text-center bg-muted/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-bold">No bookings found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When you book a tutor, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b: any) => {
                const t = getTutorCardInfo(b);
                const isUnpaid =
                  b.paymentStatus !== "PAID" && b.status !== "CANCELLED";
                const canCancel =
                  b.status !== "CANCELLED" && b.status !== "COMPLETED" && b.paymentStatus !== "PAID";

                return (
                  <div
                    key={b.id}
                    className={`flex flex-col gap-4 rounded-3xl border border-border/50 p-6 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-lg hover:shadow-primary/5 group ${
                      isUnpaid
                        ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10"
                        : "bg-card/40 backdrop-blur-sm"
                    }`}
                  >
                    {/* Left: Tutor + schedule */}
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-md group-hover:border-primary transition-colors">
                        <AvatarImage
                          src={t.tutorImage ?? undefined}
                          alt={t.tutorName}
                        />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                          {getInitials(t.tutorName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-foreground group-hover:text-primary transition-colors">{t.tutorName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {fmt(b.scheduledStart)}{" "}
                                {b.scheduledEnd ? `– ${fmt(b.scheduledEnd)}` : ""}
                            </p>
                            <span className="text-muted-foreground/30">•</span>
                            <p className="text-xs font-bold text-primary">
                                {t.hourlyRate
                                    ? `৳${t.hourlyRate}/hr`
                                    : "Flexible pricing"}
                            </p>
                        </div>

                        {b?.cancelReason ? (
                          <div className="mt-2 bg-red-50/50 dark:bg-red-500/5 p-2 rounded-xl flex items-start gap-2 border border-red-100/50 dark:border-red-500/10">
                             <AlertTriangle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                             <p className="text-[10px] leading-relaxed font-bold text-red-600/80 italic">
                                {b.cancelReason}
                             </p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Right: status + payment status + price + actions */}
                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                       <div className="flex flex-col items-end gap-1.5 mr-2">
                          <div className="flex items-center gap-2">
                             {getPaymentBadge(b.paymentStatus)}
                             <Badge
                                variant={statusVariant(b.status)}
                                className="gap-1 font-bold rounded-full py-0.5"
                              >
                                {getStatusIcon(b.status)}
                                {b.status ?? "CONFIRMED"}
                              </Badge>
                          </div>
                          {typeof b.price === "number" ? (
                            <span className="text-sm font-black mr-1 tabular-nums">
                               ৳{b.price.toLocaleString()}
                            </span>
                          ) : null}
                       </div>

                      <div className="flex items-center gap-2">
                          {/* Cancel Button */}
                          {canCancel && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isCancelling === b.id}
                              onClick={() => handleCancelBooking(b.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 rounded-2xl font-bold border border-transparent hover:border-red-100"
                            >
                              {isCancelling === b.id ? (
                                <Clock className="w-3.5 h-3.5 animate-spin mr-1.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              Cancel
                            </Button>
                          )}

                          {/* Pay Now button for unpaid bookings */}
                          {isUnpaid && b.id ? (
                            <Button
                              asChild
                              size="sm"
                              className="h-9 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20 gap-1.5 font-bold px-4"
                            >
                              <Link href={`/dashboard/checkout/${b.id}`}>
                                <CreditCard className="h-3.5 w-3.5" />
                                Pay Now
                              </Link>
                            </Button>
                          ) : null}

                          {t.tutorId ? (
                            <Button asChild size="sm" variant="outline" className="h-9 rounded-2xl font-bold px-4 border-muted-foreground/20 hover:border-primary">
                              <Link href={`/tutors/${t.tutorId}`}>View Tutor</Link>
                            </Button>
                          ) : null}
                      </div>
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

