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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardChartsProps {
  bookings: any[];
  assignments: any[];
  payments: any[];
  reviews: any[];
}

export function DashboardCharts({
  bookings,
  assignments,
  payments,
  reviews,
}: DashboardChartsProps) {
  // 1. Prepare Booking Status Data (Pie)
  const bookingStatusData = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "CONFIRMED").length },
    { name: "Completed", value: bookings.filter((b) => b.status === "COMPLETED").length },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "CANCELLED").length },
  ].filter((d) => d.value > 0);

  const COLORS = ["#3b82f6", "#10b981", "#ef4444"];
  const totalBookings = bookings.length;

  // 2. Prepare Activity Overview (Horizontal Bar)
  const activityData = [
    { name: "Bookings", count: bookings.length, fill: "#3b82f6" },
    { name: "Tasks", count: assignments.length, fill: "#8b5cf6" },
    { name: "Reviews", count: reviews.length, fill: "#ec4899" },
    { name: "Payments", count: payments.length, fill: "#f59e0b" },
  ];

  // 3. Payment Amount Data (Area Chart for better UX)
  const paymentData = payments
    .slice(-10)
    .map((p, i) => ({
      name: `Tx${i + 1}`,
      amount: p.amount || 0,
    }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Activity Distribution */}
      <Card className="shadow-xs border-primary/5 bg-background/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Activity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                 />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Booking Status - Compact Pie */}
      <Card className="shadow-xs border-primary/5 bg-background/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="h-[180px] w-full">
            {bookingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground uppercase">
                No Data
              </div>
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-6">
             <span className="text-xl font-black">{totalBookings}</span>
             <span className="text-[8px] uppercase tracking-tighter text-muted-foreground">Total</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Timeline - Full width on desktop mobile, 1 col on lg grid */}
      <Card className="lg:col-span-1 md:col-span-2 shadow-xs border-primary/5 bg-background/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Latest Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            {paymentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip 
                        formatter={(v) => `৳${v}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }}
                    />
                    <Bar dataKey="amount" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={15} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground uppercase">
                   Pending
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
