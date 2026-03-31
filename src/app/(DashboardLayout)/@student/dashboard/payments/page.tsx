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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIconComponent, getGradientForString } from "@/lib/icon-mapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
          Completed
        </Badge>
      );
    case "PENDING":
    case "INITIATED":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
        >
          Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"
        >
          Failed
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20"
        >
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="capitalize">
          {status.toLowerCase()}
        </Badge>
      );
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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
          <p className="text-muted-foreground w-full max-w-2xl">
            View all your past transactions, invoices, and completed payments
            for your bookings.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-dashed group"
        >
          <Link href="/help">
            <HelpCircle className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
            <span>Need Help? Visit Help Center</span>
          </Link>
        </Button>
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
                Any successful or pending payments made towards your tutor
                bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="pl-6 font-semibold">
                      Reference
                    </TableHead>
                    <TableHead className="font-semibold">
                      Instructor & Session
                    </TableHead>
                    <TableHead className="font-semibold">
                      Payment Details
                    </TableHead>
                    <TableHead className="text-right pr-6 font-semibold">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => {
                    const TutorIcon = getIconComponent("User");
                    const tutorName =
                      payment.booking?.tutor?.name || "SkillBridge Tutor";
                    const tutorImage =
                      payment.booking?.tutorProfile?.profileImage;

                    return (
                      <TableRow
                        key={payment.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <TableCell className="pl-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm tracking-tight">
                              {payment.booking?.id
                                ? `Booking #${payment.booking.id.split("-").pop()?.toUpperCase()}`
                                : "Service"}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/70 uppercase">
                              ID:{" "}
                              {payment.transactionId ||
                                payment.id.split("-").pop()?.toUpperCase()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                            <Link
                              href={`/tutors/${payment.booking?.tutorProfile?.id}`}
                              className="flex items-center gap-3 py-1 group/tutor hover:opacity-80 transition-all"
                            >
                              <Avatar className="h-9 w-9 border-2 border-background shadow-sm group-hover/tutor:border-primary/50 transition-colors">
                                <AvatarImage src={tutorImage} />
                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold font-mono">
                                  {tutorName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground leading-none mb-1 group-hover/tutor:text-primary transition-colors">
                                  {tutorName}
                                </span>
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground group-hover/tutor:text-muted-foreground/80 transition-colors">
                                  <Clock className="w-3 h-3" />
                                  <span>{fmt(payment.createdAt)}</span>
                                </div>
                              </div>
                            </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-bold text-foreground">
                                ৳{payment.amount?.toLocaleString() || "0"}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                Paid via Stripe
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground/60 italic flex items-center gap-1">
                              <Receipt className="w-2.5 h-2.5" />
                              Official Receipt Available
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
  );
}
