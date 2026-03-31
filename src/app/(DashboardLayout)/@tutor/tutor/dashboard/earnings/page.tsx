import { getTutorEarningsAction } from "@/actions/tutor-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusStyle: Record<string, string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  SUCCESS: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  SUCCEEDED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200",
  INITIATED: "bg-amber-500/10 text-amber-600 border-amber-200",
  FAILED: "bg-red-500/10 text-red-600 border-red-200",
  REFUNDED: "bg-slate-500/10 text-slate-600 border-slate-200",
};

export default async function TutorEarningsPage() {
  const { success, data } = await getTutorEarningsAction({ limit: 100 });

  if (!success)
    return (
      <div className="text-center text-muted-foreground py-12">
        Failed to load earnings
      </div>
    );

  const transactions = Array.isArray(data) ? data : [];
  
  // Calculate from current list (for pending/recent)
  const calculatedTotal = transactions
    .filter(
      (t: any) =>
        t.status === "COMPLETED" || t.status === "SUCCEEDED" || t.status === "SUCCESS"
    )
    .reduce((sum: number, t: any) => sum + (t.amount ?? 0), 0);

  const pendingAmount = transactions
    .filter((t: any) => t.status === "PENDING" || t.status === "INITIATED")
    .reduce((sum: number, t: any) => sum + (t.amount ?? 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-500" />
              Earnings
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your revenue and payment history
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2 rounded-full border-dashed">
            <Link href="/help">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-emerald-600">
              ৳{calculatedTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              ৳{pendingAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No transactions found.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="p-3 text-left font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="p-3 text-left font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="p-3 text-left font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="p-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="p-3 text-left font-medium text-muted-foreground">
                      Transaction ID
                    </th>
                    <th className="p-3 text-right font-medium text-muted-foreground pr-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t: any) => (
                    <tr
                      key={t.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-3">
                        {t.booking?.student?.name ??
                          t.student?.name ??
                          "—"}
                      </td>
                      <td className="p-3 font-semibold tabular-nums">
                        ৳{(t.amount ?? 0).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            statusStyle[t.status] ?? "bg-slate-100 text-slate-800"
                          )}
                        >
                          {t.status === "SUCCESS" ? "Completed" : t.status === "INITIATED" ? "Pending" : t.status}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                        {t.transactionId ?? t.id}
                      </td>
                      <td className="p-3 text-right pr-6">
                        {t.bookingId && (
                           <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                             <Link href={`/tutor/dashboard/sessions?id=${t.bookingId}`} title="View Session">
                               <Eye className="h-4 w-4" />
                             </Link>
                           </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
