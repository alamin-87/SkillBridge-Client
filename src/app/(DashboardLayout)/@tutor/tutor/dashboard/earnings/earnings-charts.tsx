"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

interface EarningsChartsProps {
  transactions: any[];
}

export function EarningsCharts({ transactions }: EarningsChartsProps) {
  // 1. Prepare Revenue Data (Area Chart)
  const revenueData = transactions
    .slice(0, 15)
    .reverse()
    .map((t, i) => ({
      name: new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount: t.amount || 0,
    }));

  // 2. Prepare Status Distribution (Pie)
  const statusCounts: Record<string, number> = {};
  transactions.forEach((t) => {
    const s = t.status === "SUCCESS" || t.status === "SUCCEEDED" || t.status === "COMPLETED" ? "Successful" : t.status === "INITIATED" || t.status === "PENDING" ? "Pending" : "Failed";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Revenue Timeline */}
      <Card className="md:col-span-2 shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Revenue Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(v) => [`৳${v}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No revenue history found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <PieChartIcon className="w-3 h-3 text-blue-500" />
            Payment Integrity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No status data
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
