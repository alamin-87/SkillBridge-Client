import Link from "next/link";
import { getAdminNotificationsAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Info, Mail, AlertCircle, Calendar, ArrowLeft } from "lucide-react";
import SendNotificationForm from "./send-notification-form";
import NotificationDeleteButton from "./notification-delete-button";

function fmtDate(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getTypeIcon(type: string) {
  switch (type) {
    case "BOOKING":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "PAYMENT":
      return <Mail className="h-4 w-4 text-emerald-500" />;
    case "SYSTEM":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    default:
      return <Bell className="h-4 w-4 text-primary" />;
  }
}

export default async function AdminNotificationsPage() {
  const { success, data, message } = await getAdminNotificationsAction();
  if (!success) return <div>Failed to load notifications: {message}</div>;

  const notifications = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            <div>
                <h2 className="text-xl font-bold tracking-tight">Notification Management</h2>
                <p className="text-sm text-muted-foreground">
                  {notifications.length} notifications · Monitor and manage platform alerts
                </p>
            </div>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: Notification List */}
        <div className="md:col-span-2 space-y-4">
            <Card>
                <CardHeader className="pb-3 bg-muted/10">
                    <CardTitle className="text-base">System Notifications History</CardTitle>
                    <CardDescription>A log of all recent notifications sent across the platform.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No notifications to display.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((n: any) => (
                                <div key={n.id} className="p-4 flex gap-4 hover:bg-muted/10 transition-colors">
                                    <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        {getTypeIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-sm font-semibold leading-none">{n.title}</h4>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <Badge variant="secondary" className="text-[10px] rounded-sm h-4">
                                                        {n.type}
                                                    </Badge>
                                                    <Badge variant={n.isRead ? "secondary" : "default"} className="text-[10px] rounded-sm h-4">
                                                        {n.isRead ? "Read" : "Unread"}
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Info className="h-2 w-2" />
                                                        Sent to: {n.user?.name || "Unknown"} ({n.userId.slice(0, 8)}...)
                                                    </span>
                                                </div>
                                            </div>
                                            <NotificationDeleteButton notificationId={n.id} />
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">{n.message}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium pt-2 italic">
                                            {fmtDate(n.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Right column: Interaction Form */}
        <div className="space-y-6">
            <SendNotificationForm />
        </div>
      </div>
    </div>
  );
}
