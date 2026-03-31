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
import { Users, GraduationCap, Star } from "lucide-react";

interface ReviewChartsProps {
  reviews: any[];
}

export function ReviewCharts({ reviews }: ReviewChartsProps) {
  // Aggregate data by Tutor
  const tutorDataMap: Record<string, { total: number; count: number }> = {};
  const studentDataMap: Record<string, number> = {};
  const ratingDataMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((r) => {
    const rating = r.rating || 0;
    const tutorName = r.tutor?.name || "Unknown Tutor";
    const studentName = r.student?.name || "Unknown Student";

    // Tutor ratings
    if (!tutorDataMap[tutorName]) {
      tutorDataMap[tutorName] = { total: 0, count: 0 };
    }
    tutorDataMap[tutorName].total += rating;
    tutorDataMap[tutorName].count += 1;

    // Student reviews count
    studentDataMap[studentName] = (studentDataMap[studentName] || 0) + 1;

    // Rating distribution
    if (rating >= 1 && rating <= 5) {
      ratingDataMap[rating as 1 | 2 | 3 | 4 | 5]++;
    }
  });

  const tutorData = Object.entries(tutorDataMap)
    .map(([name, stats]) => ({
      name,
      rating: Number((stats.total / stats.count).toFixed(1)),
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const studentData = Object.entries(studentDataMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const ratingData = Object.entries(ratingDataMap).map(([rating, value]) => ({
    name: `${rating} Star`,
    value,
  }));

  const COLORS = ["#ef4444", "#f59e0b", "#eab308", "#84cc16", "#10b981"]; // Red to Green scale

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Top Tutors by Rating */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Users className="w-3 h-3 text-orange-500" />
            Top Rated Tutors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            {tutorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tutorData} layout="vertical" margin={{ left: 30, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.05} />
                  <XAxis type="number" domain={[0, 5]} hide />
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
                    formatter={(v) => [`${v}/5`, 'Avg Rating']}
                  />
                  <Bar dataKey="rating" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No tutor rating data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Activity */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <GraduationCap className="w-3 h-3 text-blue-500" />
            Most Active Students
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
                    formatter={(v) => [v, 'Reviews Given']}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic font-medium">
                No student activity data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Star className="w-3 h-3 text-emerald-500" />
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            {reviews.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ratingData.map((entry, index) => (
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
                No rating distribution
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
