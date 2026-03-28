import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-6 shadow-sm sm:p-10 animate-in fade-in zoom-in-95 duration-500">

        {/* Header Section (Logo + Titles) */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Skeleton className="size-14 rounded-2xl" />
          <div className="w-full flex flex-col items-center space-y-2">
            <Skeleton className="h-8 w-3/4 rounded-lg sm:w-2/3" />
            <Skeleton className="h-4 w-full rounded-md sm:w-5/6" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="mt-8 space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-12 px-1" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 px-1" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Submit Button */}
          <Skeleton className="mt-6 h-12 w-full rounded-lg" />

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-3 w-8 rounded-full" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Google Button */}
          <Skeleton className="h-11 w-full rounded-lg" />

          {/* Footer Link */}
          <div className="mt-6 flex justify-center pt-2">
            <Skeleton className="h-4 w-[55%] rounded-md" />
          </div>
        </div>

      </div>
    </div>
  );
}
