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
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const studentData = Object.entries(studentDataMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const statusData = Object.entries(statusDataMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Tutor Revenue Bar Chart */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Users className="w-3 h-3 text-violet-500" />
            Top Tutors Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            {tutorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tutorData} layout="vertical" margin={{ left: 30, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.05} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    fontSize={10}
                    width={80}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(v) => [`৳${v}`, 'Revenue']}
                  />
                  <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No revenue data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Spending Bar Chart */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <GraduationCap className="w-3 h-3 text-blue-500" />
            Top Students Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            {studentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentData} layout="vertical" margin={{ left: 30, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.05} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    fontSize={10}
                    width={80}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(v) => [`৳${v}`, 'Spent']}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No spending data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Pie Chart */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <CreditCard className="w-3 h-3 text-emerald-500" />
            Transaction Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No transaction data
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
