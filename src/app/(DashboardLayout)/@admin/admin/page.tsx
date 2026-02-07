import Link from "next/link";
import { getAdminDashboardAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const { success, data, message } = await getAdminDashboardAction();
  if (!success) return <div>Failed to load dashboard: {message}</div>;

  const stats = data ?? {};
  const bookingStatus = stats.bookingStatus ?? { confirmed: 0, completed: 0, cancelled: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Platform overview and management
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/users">Manage users</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/categories">Manage categories</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalUsers ?? 0}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Tutors</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalTutors ?? 0}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Students</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalStudents ?? 0}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalBookings ?? 0}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalCategories ?? 0}</CardContent>
        </Card>
      </div>

      {/* Booking status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking status</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/bookings">View bookings</Link>
          </Button>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="secondary">CONFIRMED: {bookingStatus.confirmed ?? 0}</Badge>
          <Badge variant="secondary">COMPLETED: {bookingStatus.completed ?? 0}</Badge>
          <Badge variant="secondary">CANCELLED: {bookingStatus.cancelled ?? 0}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
