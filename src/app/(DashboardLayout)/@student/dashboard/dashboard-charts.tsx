"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIconComponent } from "@/lib/icon-mapper";

interface DashboardChartsProps {
  bookings: any[];
  assignments: any[];
  payments: any[];
  reviews: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-xl shadow-black/10 transition-all">
        {label && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm font-bold mt-1">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.payload.fill || entry.stroke || "#7c3aed" }} />
            <span className="capitalize">{entry.name}:</span>
            <span className="text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardCharts({
  bookings,
  assignments,
  payments,
  reviews,
}: DashboardChartsProps) {
  const PieChartIcon = getIconComponent("PieChart");
  const ActivityIcon = getIconComponent("Activity");
  const WalletIcon = getIconComponent("Wallet");
  const TrendingUpIcon = getIconComponent("TrendingUp");

  // 1. Prepare Booking Status Data (Pie)
  const bookingStatusData = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "CONFIRMED").length },
    { name: "Completed", value: bookings.filter((b) => b.status === "COMPLETED").length },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "CANCELLED").length },
    { name: "Pending", value: bookings.filter((b) => b.status === "PENDING").length },
  ].filter((d) => d.value > 0);

  const totalBookings = bookings.length;

  // 2. Prepare Activity Overview (Horizontal Bar)
  const activityData = [
    { name: "Bookings", count: bookings.length, fill: "url(#colorBookings)" },
    { name: "Tasks", count: assignments.length, fill: "url(#colorTasks)" },
    { name: "Reviews", count: reviews.length, fill: "url(#colorReviews)" },
    { name: "Payments", count: payments.length, fill: "url(#colorPayments)" },
  ];

  // 3. Payment Amount Data (Bar Chart)
  const paymentData = payments
    .slice(-8)
    .map((p, i) => ({
      name: `T${i + 1}`,
      amount: p.amount || 0,
    }));

  // 4. Booking History Trend (Area Chart)
  // Aggregate bookings by date
  const bookingHistoryMap: Record<string, number> = {};
  bookings.slice(-15).forEach((b) => {
    const date = new Date(b.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    bookingHistoryMap[date] = (bookingHistoryMap[date] || 0) + 1;
  });

  const bookingHistoryData = Object.entries(bookingHistoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Activity Distribution */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            <ActivityIcon className="h-4 w-4 text-primary" /> Metrics Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} layout="vertical" margin={{ left: -15, right: 15, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorReviews" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#f472b6" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorPayments" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={11} tickLine={false} axisLine={false} fontWeight="bold" />
                <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.4 }} content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Booking Status - Pie */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            <PieChartIcon className="h-4 w-4 text-emerald-500" /> Session Status
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="h-[200px] w-full">
            {bookingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="pie0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="pie1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="pie2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="pie3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#pie${index % 4})`} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                No session data
              </div>
            )}
          </div>
          {bookingStatusData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-8">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-br from-foreground to-muted-foreground">
                  {totalBookings}
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Total</span>
              </div>
          )}
        </CardContent>
      </Card>

      {/* Booking History Trend */}
      <Card className="lg:col-span-1 md:col-span-2 shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            <TrendingUpIcon className="h-4 w-4 text-violet-500" /> Booking History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[200px] w-full">
            {bookingHistoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="Bookings" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorHistory)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                   No booking history
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Timeline */}
      <Card className="lg:col-span-1 md:col-span-2 shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            <WalletIcon className="h-4 w-4 text-amber-500" /> Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[200px] w-full">
            {paymentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} content={<CustomTooltip />} />
                    <Bar dataKey="amount" name="Amount (৳)" fill="url(#colorAmount)" radius={[4, 4, 0, 0]} barSize={18} className="hover:brightness-110 transition-all" />
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                   No payments yet
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

