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
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.payload.fill || entry.payload.stroke || "#10b981" }} />
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

  return (
    <div className="grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Revenue Timeline */}
      <Card className="md:col-span-2 shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Revenue Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} fontWeight="bold" />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(v: any) => [`৳${v}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} className="drop-shadow-sm" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No revenue history found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <PieChartIcon className="w-4 h-4 text-blue-500" />
            Payment Integrity
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="h-[250px] w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="st0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="st1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="st2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#st${index % 3})`} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No status data
              </div>
            )}
          </div>
          {statusData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-8">
              <span className="text-3xl font-black tabular-nums bg-clip-text text-transparent bg-linear-to-br from-foreground to-muted-foreground">
                {transactions.length}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Txns</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
