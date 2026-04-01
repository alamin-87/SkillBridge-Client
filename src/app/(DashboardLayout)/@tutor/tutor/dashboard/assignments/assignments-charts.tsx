"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle2 } from "lucide-react";

interface AssignmentsChartsProps {
  assignments: any[];
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

export function AssignmentsCharts({ assignments }: AssignmentsChartsProps) {
  // 1. Prepare Completion Data (Graded vs Pending) - Total across all assignments
  let totalGraded = 0;
  let totalPending = 0;

  assignments.forEach((a) => {
    (a.submissions || []).forEach((s: any) => {
      if (s.grade !== null && s.grade !== undefined) totalGraded++;
      else totalPending++;
    });
  });

  const completionData = [
    { name: "Graded", value: totalGraded, fill: "url(#colorGraded)" },
    { name: "Pending", value: totalPending, fill: "url(#colorPending)" },
  ].filter(d => d.value > 0);

  // 2. Submissions per Assignment (Bar Chart)
  const submissionData = assignments.slice(0, 8).map((a) => ({
    name: a.title, // Keep full title for hover, truncate in tick
    count: (a.submissions || []).length,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Grading Progress - Horizontal Bar */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Grading Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            {completionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} layout="vertical" margin={{ left: -20, right: 15, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGraded" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#34d399" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={11} tickLine={false} axisLine={false} fontWeight="bold" />
                  <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.4 }} content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Count" radius={[0, 6, 6, 0]} barSize={20}>
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No submissions
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Distribution */}
      <Card className="lg:col-span-2 shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <ClipboardList className="w-4 h-4 text-violet-500" />
            Student Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            {submissionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => v.length > 8 ? v.slice(0, 8) + '...' : v} 
                    fontWeight="bold" 
                  />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Submissions" fill="url(#colorEngagement)" radius={[4, 4, 0, 0]} barSize={24} className="hover:brightness-110 transition-all" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Create assignments to see engagement
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
