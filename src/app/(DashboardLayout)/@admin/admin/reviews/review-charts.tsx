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
      fill: "url(#colorTReviews)"
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const studentData = Object.entries(studentDataMap)
    .map(([name, count]) => ({ name, count, fill: "url(#colorSReviews)" }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const ratingData = Object.entries(ratingDataMap)
    .filter(([_, value]) => value > 0)
    .map(([rating, value]) => ({
      name: `${rating} Star`,
      value,
    }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Tutors by Rating */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-1">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <Users className="w-4 h-4 text-orange-500" />
            Top Rated Tutors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            {tutorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tutorData} layout="vertical" margin={{ left: -15, right: 15, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTReviews" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis type="number" domain={[0, 5]} hide />
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
                    formatter={(v: any) => [`${v}/5`, 'Avg Rating']}
                  />
                  <Bar dataKey="rating" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={20}>
                     {tutorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No tutor rating data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Activity */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-1">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            Most Active Students
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            {studentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentData} layout="vertical" margin={{ left: -15, right: 15, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSReviews" x1="0" y1="0" x2="1" y2="0">
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
                    formatter={(v: any) => [v, 'Reviews Given']}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20}>
                    {studentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No student activity data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="shadow-lg border-primary/5 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-1">
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            <Star className="w-4 h-4 text-emerald-500" />
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="h-[250px] w-full">
            {ratingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="rt1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="rt2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="rt3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fcd34d" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#eab308" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="rt4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a3e635" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#84cc16" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="rt5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={ratingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {ratingData.map((entry, index) => {
                      const starNum = parseInt(entry.name);
                      return <Cell key={`cell-${index}`} fill={`url(#rt${starNum})`} className="hover:opacity-80 transition-opacity" />;
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No rating distribution
              </div>
            )}
          </div>
          {ratingData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-8">
              <span className="text-3xl font-black tabular-nums bg-clip-text text-transparent bg-linear-to-br from-foreground to-muted-foreground">
                {reviews.length}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Reviews</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
