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
import { TrendingUp, BarChart3, PieChartIcon } from "lucide-react";

interface TutorDashboardChartsProps {
  sessions: any[];
  assignments: any[];
  earnings: any[];
}

export function TutorDashboardCharts({
  sessions,
  assignments,
  earnings,
}: TutorDashboardChartsProps) {
  // 1. Session Status Data (Donut Chart)
  const sessionStatusData = [
    { name: "Confirmed", value: sessions.filter((s) => s.status === "CONFIRMED").length },
    { name: "Completed", value: sessions.filter((s) => s.status === "COMPLETED").length },
    { name: "Cancelled", value: sessions.filter((s) => s.status === "CANCELLED").length },
    { name: "Pending", value: sessions.filter((s) => s.status === "PENDING").length },
  ].filter((d) => d.value > 0);

  const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

  // 2. Earnings Trend - Last 10 valid payments
  const earningsData = earnings
    .filter((e) => 
      (e.status === "SUCCESS" || e.status === "SUCCEEDED" || e.status === "COMPLETED") &&
      e.booking?.status !== "CANCELLED"
    )
    .slice(0, 10)
    .reverse()
    .map((e, i) => ({
      name: `T${i + 1}`,
      amount: e.amount || 0,
    }));

  // 3. Platform Activity Summary
  const activityData = [
    { name: "Sessions", count: sessions.length, fill: "#3b82f6" },
    { name: "Assignments", count: assignments.length, fill: "#8b5cf6" },
    { name: "Earnings", count: earnings.length, fill: "#10b981" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Session Analytics */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <PieChartIcon className="w-3 h-3 text-indigo-500" />
            Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="relative pt-4">
          <div className="h-[180px] w-full">
            {sessionStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sessionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground uppercase font-bold italic">
                No session activity
              </div>
            )}
          </div>
          {sessionStatusData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
              <span className="text-2xl font-black tabular-nums">{sessions.length}</span>
              <span className="text-[8px] font-bold uppercase tracking-tighter text-muted-foreground">Total Units</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings Overview */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Revenue Stream
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[180px] w-full">
            {earningsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    formatter={(v) => [`৳${v}`, 'Revenue']}
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground uppercase font-bold italic">
                Awaiting first payment
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Bar Chart */}
      <Card className="lg:col-span-1 md:col-span-2 shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-3 h-3 text-violet-500" />
            Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} layout="vertical" margin={{ left: -10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                <Tooltip 
                   cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
