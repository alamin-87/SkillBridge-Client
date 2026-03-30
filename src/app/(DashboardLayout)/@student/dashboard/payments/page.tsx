import { getMyPaymentsAction } from "@/actions/payment-action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Receipt, Clock } from "lucide-react";

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
      return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">Completed</Badge>;
    case "PENDING":
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">Pending</Badge>;
    case "FAILED":
      return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">Failed</Badge>;
    case "REFUNDED":
      return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20">Refunded</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function StudentPaymentsPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const limit = Number(searchParams?.limit ?? 10);

  const res = await getMyPaymentsAction({ page, limit });
  const payments = res?.data && Array.isArray(res.data) ? res.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
        <p className="text-muted-foreground w-full max-w-2xl">
          View all your past transactions, invoices, and completed payments for your bookings.
        </p>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Transactions</CardTitle>
          </div>
          <CardDescription>
            You have {payments.length} total recorded transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No Payments Yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Any successful or pending payments made towards your tutor bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="pl-6 font-semibold">Transaction ID</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Context</TableHead>
                    <TableHead className="text-right pr-6 font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-6 font-medium text-xs font-mono text-muted-foreground">
                        {payment.transactionId || payment.id.split("-").pop()?.toUpperCase() || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{fmt(payment.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        ৳{payment.amount?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-muted-foreground/80 break-words">
                          {payment.booking?.id ? `Booking #${payment.booking.id.split("-").pop()?.toUpperCase()}` : "Service Package"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        {getStatusBadge(payment.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
