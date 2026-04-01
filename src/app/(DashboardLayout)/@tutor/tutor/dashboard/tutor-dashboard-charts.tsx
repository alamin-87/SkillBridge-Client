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
import { getIconComponent } from "@/lib/icon-mapper";

interface TutorDashboardChartsProps {
  sessions: any[];
  assignments: any[];
  earnings: any[];
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-xl shadow-black/10 transition-all">
        {label && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => {
          let value = entry.value;
          let name = entry.name;
          if (formatter) {
             const formatted = formatter(value, name);
             if (Array.isArray(formatted)) {
                value = formatted[0];
                name = formatted[1] || name;
             } else {
                value = formatted;
             }
          }
          return (
            <div key={index} className="flex items-center gap-2 text-sm font-bold mt-1">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.payload.fill || "#7c3aed" }} />
              <span className="capitalize">{name}:</span>
              <span className="text-foreground">{value}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export function TutorDashboardCharts({
  sessions,
  assignments,
  earnings,
}: TutorDashboardChartsProps) {
  // Resolved Icons via Mapper
  const PieChartIcon = getIconComponent("PieChart");
  const TrendingUpIcon = getIconComponent("TrendingUp");
  const BarChart3Icon = getIconComponent("BarChart3");

  // 1. Session Status Data (Donut Chart)
  const sessionStatusData = [
    { name: "Confirmed", value: sessions.filter((s) => s.status === "CONFIRMED").length },
    { name: "Completed", value: sessions.filter((s) => s.status === "COMPLETED").length },
    { name: "Cancelled", value: sessions.filter((s) => s.status === "CANCELLED").length },
    { name: "Pending", value: sessions.filter((s) => s.status === "PENDING").length },
  ].filter((d) => d.value > 0);

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
    { name: "Sessions", count: sessions.length, fill: "url(#colorSessions)" },
    { name: "Assignments", count: assignments.length, fill: "url(#colorTasks)" },
    { name: "Earnings", count: earnings.length, fill: "url(#colorEarnings)" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Session Analytics */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <PieChartIcon className="w-4 h-4 text-indigo-500" />
            Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="h-[200px] w-full">
            {sessionStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="s0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="s3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={sessionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {sessionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#s${index % 4})`} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                No session activity
              </div>
            )}
          </div>
          {sessionStatusData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-8">
              <span className="text-3xl font-black tabular-nums bg-clip-text text-transparent bg-linear-to-br from-foreground to-muted-foreground">
                {sessions.length}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Units</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings Overview */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
            Revenue Stream
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[200px] w-full">
            {earningsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="amountGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                    formatter={(v: any) => [`৳${v}`, 'Revenue']}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="amount" fill="url(#amountGrad)" radius={[4, 4, 0, 0]} barSize={16} className="hover:brightness-110 transition-all" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Awaiting first payment
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Bar Chart */}
      <Card className="lg:col-span-1 md:col-span-2 shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <BarChart3Icon className="w-4 h-4 text-violet-500" />
            Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} layout="vertical" margin={{ left: -15, right: 15, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#34d399" stopOpacity={1}/>
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

    </div>
  );
}
