"use client";

import { useEffect, useState } from "react";
import { getMyPaymentsAction } from "@/actions/payment-action";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Receipt,
  Clock,
  User,
  ArrowRight,
  HelpCircle,
  TrendingDown,
  Wallet,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIconComponent } from "@/lib/icon-mapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function fmt(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
    case "SUCCESS":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 pb-0.5">
          Completed
        </Badge>
      );
    case "PENDING":
    case "INITIATED":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20 pb-0.5"
        >
          Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20 pb-0.5"
        >
          Failed
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20 pb-0.5"
        >
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="capitalize pb-0.5 text-[10px]">
          {status.toLowerCase()}
        </Badge>
      );
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-md border border-border/50 p-2.5 rounded-xl shadow-lg transition-all">
          {label && <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs font-bold">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill || "#3b82f6" }} />
              <span className="capitalize">{entry.name}:</span>
              <span className="text-foreground">৳{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getMyPaymentsAction({ page: 1, limit: 100 });
        if (res?.data && Array.isArray(res.data)) {
          setPayments(res.data);
        }
      } catch (error) {
        console.error("Failed to load payments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Prepare Analytics
  const totalSpent = payments
    .filter(p => p.status === 'SUCCESS' || p.status === 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const spendingTrendMap: Record<string, number> = {};
  payments.slice(-10).reverse().forEach(p => {
    const date = new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    spendingTrendMap[date] = (spendingTrendMap[date] || 0) + (p.amount || 0);
  });
  const spendingTrendData = Object.entries(spendingTrendMap).map(([name, value]) => ({ name, value }));

  if (loading) {
     return (
        <div className="space-y-6 animate-pulse">
            <div className="h-10 w-48 bg-muted rounded-xl" />
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-3xl" />)}
            </div>
            <div className="h-[300px] bg-muted rounded-3xl" />
            <div className="h-64 bg-muted rounded-3xl" />
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Financial Overview</h2>
          <p className="text-muted-foreground w-full max-w-2xl text-sm">
            Track your education spending, manage receipts, and monitor transaction statuses.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 rounded-2xl border-dashed group h-10 px-4"
        >
          <Link href="/help">
            <HelpCircle className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-bold">Billing Help</span>
          </Link>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Spent</p>
                      <h3 className="text-xl font-black tabular-nums">৳{totalSpent.toLocaleString()}</h3>
                  </div>
              </div>
          </Card>
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Transactions</p>
                      <h3 className="text-xl font-black tabular-nums">{payments.length}</h3>
                  </div>
              </div>
          </Card>
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending</p>
                      <h3 className="text-xl font-black tabular-nums">{payments.filter(p => p.status === 'PENDING' || p.status === 'INITIATED').length}</h3>
                  </div>
              </div>
          </Card>
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Refunds</p>
                      <h3 className="text-xl font-black tabular-nums">{payments.filter(p => p.status === 'REFUNDED').length}</h3>
                  </div>
              </div>
          </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
          {/* Spending Chart */}
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 lg:col-span-3">
             <CardHeader className="pb-0 pt-6 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Activity className="w-4 h-4 text-primary" /> Spending Trend
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                 <div className="h-[250px] w-full">
                    {spendingTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendingTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" tickFormatter={(v) => `৳${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="value" name="Amount Spent" stroke="#3b82f6" fillOpacity={1} fill="url(#spendGrad)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">No recent transaction data</div>
                    )}
                 </div>
             </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="lg:col-span-3 shadow-lg border-primary/5 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </div>
              <CardDescription>
                Detailed log of all your educational investments.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <CreditCard className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">No Payments Yet</h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow className="hover:bg-transparent border-border/50">
                        <TableHead className="pl-6 font-bold uppercase tracking-widest text-[9px]">Reference</TableHead>
                        <TableHead className="font-bold uppercase tracking-widest text-[9px]">Instructor & Session</TableHead>
                        <TableHead className="font-bold uppercase tracking-widest text-[9px]">Payment Details</TableHead>
                        <TableHead className="text-right pr-6 font-bold uppercase tracking-widest text-[9px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment: any) => {
                        const tutorName = payment.booking?.tutor?.name || "SkillBridge Tutor";
                        const tutorImage = payment.booking?.tutorProfile?.profileImage;

                        return (
                          <TableRow
                            key={payment.id}
                            className="hover:bg-muted/30 transition-colors border-border/50 group"
                          >
                            <TableCell className="pl-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-sm tracking-tight text-foreground">
                                  {payment.booking?.id
                                    ? `Booking #${payment.booking.id.split("-").pop()?.toUpperCase()}`
                                    : "Service"}
                                </span>
                                <span className="text-[9px] font-mono font-black text-muted-foreground/50 uppercase tracking-tighter">
                                  REF: {payment.transactionId || payment.id.split("-").pop()?.toUpperCase()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                                <Link
                                  href={`/tutors/${payment.booking?.tutorProfile?.id}`}
                                  className="flex items-center gap-3 py-1 group/tutor hover:opacity-80 transition-all"
                                >
                                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover/tutor:border-primary transition-colors">
                                    <AvatarImage src={tutorImage} />
                                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                      {tutorName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground leading-none mb-1 group-hover/tutor:text-primary transition-colors">
                                      {tutorName}
                                    </span>
                                    <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/70">
                                      <Clock className="w-2.5 h-2.5" />
                                      <span>{fmt(payment.createdAt)}</span>
                                    </div>
                                  </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-sm font-black text-foreground tabular-nums">
                                    ৳{payment.amount?.toLocaleString() || "0"}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                                    STRIPE PK
                                  </span>
                                </div>
                                <div className="text-[9px] font-bold text-emerald-500/70 flex items-center gap-1 leading-none mt-0.5">
                                  <Receipt className="w-2.5 h-2.5" />
                                  E-RECEIPT GENERATED
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              {getStatusBadge(payment.status)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

