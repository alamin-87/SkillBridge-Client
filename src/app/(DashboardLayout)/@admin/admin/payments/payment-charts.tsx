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
import { Users, GraduationCap, CreditCard } from "lucide-react";

interface PaymentChartsProps {
  payments: any[];
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-xl shadow-black/10 transition-all">
        {label && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{label}</p>}
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
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.payload.fill || "#8b5cf6" }} />
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

export function PaymentCharts({ payments }: PaymentChartsProps) {
  // Aggregate data by Tutor
  const tutorDataMap: Record<string, number> = {};
  const studentDataMap: Record<string, number> = {};
  const statusDataMap: Record<string, number> = {};

  payments.forEach((p) => {
    const amount = p.amount || 0;
    const status = p.status || "UNKNOWN";
    
    // Status distribution
    statusDataMap[status] = (statusDataMap[status] || 0) + 1;

    if (status === "SUCCESS") {
      // Tutor revenue
      const tutorName = p.booking?.tutor?.name || "Unknown Tutor";
      tutorDataMap[tutorName] = (tutorDataMap[tutorName] || 0) + amount;

      // Student spending
      const studentName = p.booking?.student?.name || "Unknown Student";
      studentDataMap[studentName] = (studentDataMap[studentName] || 0) + amount;
    }
  });

  const tutorData = Object.entries(tutorDataMap)
    .map(([name, amount]) => ({ name, amount, fill: "url(#colorTutor)" }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const studentData = Object.entries(studentDataMap)
    .map(([name, amount]) => ({ name, amount, fill: "url(#colorStudent)" }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const statusData = Object.entries(statusDataMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tutor Revenue Bar Chart */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-1">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <Users className="w-4 h-4 text-violet-500" />
            Top Tutors Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            {tutorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tutorData} layout="vertical" margin={{ left: -15, right: 15, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTutor" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    fontSize={10}
                    width={80}
                    tickLine={false}
                    axisLine={false}
                    fontWeight="bold"
                    tickFormatter={(v) => v.length > 8 ? v.slice(0, 8) + '...' : v}
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    content={<CustomTooltip />}
                    formatter={(v: any) => [`৳${v}`, 'Revenue']}
                  />
                  <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={20}>
                    {tutorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No revenue data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Spending Bar Chart */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-1">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            Top Students Spending
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            {studentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentData} layout="vertical" margin={{ left: -15, right: 15, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudent" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    fontSize={10}
                    width={80}
                    tickLine={false}
                    axisLine={false}
                    fontWeight="bold"
                    tickFormatter={(v) => v.length > 8 ? v.slice(0, 8) + '...' : v}
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    content={<CustomTooltip />}
                    formatter={(v: any) => [`৳${v}`, 'Spent']}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20}>
                    {studentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No spending data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Pie Chart */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-1">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <CreditCard className="w-4 h-4 text-emerald-500" />
            Transaction Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="h-[250px] w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="pt0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="pt1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="pt2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#pt${index % 3})`} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No transaction data
              </div>
            )}
          </div>
          {statusData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-8">
              <span className="text-3xl font-black tabular-nums bg-clip-text text-transparent bg-linear-to-br from-foreground to-muted-foreground">
                {payments.length}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Txns</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
