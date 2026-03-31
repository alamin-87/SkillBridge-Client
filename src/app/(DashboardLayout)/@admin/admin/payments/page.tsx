import { getAdminPaymentsAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { PaymentCharts } from "./payment-charts";

const statusBadge: Record<string, string> = {
  SUCCESS: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  INITIATED: "bg-amber-500/10 text-amber-600 border-amber-200",
  FAILED: "bg-red-500/10 text-red-600 border-red-200",
  REFUNDED: "bg-blue-500/10 text-blue-600 border-blue-200",
};

export default async function AdminPaymentsPage() {
  const { data: payments, success } = await getAdminPaymentsAction();
  const allPayments = Array.isArray(payments) ? payments : [];

  const totalRevenue = allPayments
    .filter((p: any) => p.status === "SUCCESS")
    .reduce((sum: number, p: any) => sum + (p.amount ?? 0), 0);

  const completedCount = allPayments.filter((p: any) => p.status === "SUCCESS").length;
  const pendingCount = allPayments.filter((p: any) => p.status === "INITIATED").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-violet-500" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Payment Analytics & History</h2>
            <p className="text-sm text-muted-foreground">
              {allPayments.length} transactions across the platform
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <a href="/admin">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              Dashboard
            </a>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedCount}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Charts Component */}
      <PaymentCharts payments={allPayments} />


      {/* Payment List */}
      {allPayments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No payments recorded yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Tutor</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Method</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Transaction ID</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((payment: any) => (
                    <tr
                      key={payment.id}
                      className="border-b transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">
                            {payment.booking?.student?.name ?? "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.booking?.student?.email ?? ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">
                            {payment.booking?.tutor?.name ?? "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.booking?.tutor?.email ?? ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ৳{(payment.amount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {payment.method ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={statusBadge[payment.status] ?? ""}
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {payment.transactionId
                          ? payment.transactionId.slice(0, 16) + "…"
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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
