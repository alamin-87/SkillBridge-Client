import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* 🚀 Header Area Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-[120px] rounded-lg" />
          <Skeleton className="h-10 w-[120px] rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-[1px] w-full mt-2 mb-6" />

      {/* 🧩 Stats Cards Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-xl border border-border/40 shadow-sm bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 📊 Main Content Area Skeleton */}
      <div className="grid gap-6 md:grid-cols-7 mt-6">
        {/* Large Chart/Table Area */}
        <Card className="md:col-span-4 lg:col-span-5 rounded-2xl border border-border/40 shadow-sm bg-card/30">
          <CardHeader>
            <Skeleton className="h-6 w-40 rounded-md mb-1" />
            <Skeleton className="h-4 w-60 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              <Skeleton className="h-10 w-full rounded-md" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Activity/Recent Area */}
        <Card className="md:col-span-3 lg:col-span-2 rounded-2xl border border-border/40 shadow-sm bg-card/30">
          <CardHeader>
            <Skeleton className="h-6 w-32 rounded-md mb-1" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-3 w-2/3 rounded-md" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
