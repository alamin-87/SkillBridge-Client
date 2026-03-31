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
    { name: "Graded", value: totalGraded, fill: "#10b981" },
    { name: "Pending", value: totalPending, fill: "#f59e0b" },
  ].filter(d => d.value > 0);

  // 2. Submissions per Assignment (Bar Chart)
  const submissionData = assignments.slice(0, 8).map((a) => ({
    name: a.title.length > 10 ? a.title.slice(0, 10) + '...' : a.title,
    count: (a.submissions || []).length,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Grading Progress - Horizontal Bar */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Grading Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            {completionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} layout="vertical" margin={{ left: -10, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No submissions to track
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Distribution */}
      <Card className="lg:col-span-2 shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ClipboardList className="w-3 h-3 text-violet-500" />
            Student Engagement (Submissions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            {submissionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                  <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                Create assignments to see engagement
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
