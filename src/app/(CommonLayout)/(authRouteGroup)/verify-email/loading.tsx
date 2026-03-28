import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyEmailLoading() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-6 shadow-sm sm:p-10 animate-in fade-in zoom-in-95 duration-500">

        {/* Icon + Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Skeleton className="size-16 rounded-full" />
          <div className="w-full flex flex-col items-center space-y-2">
            <Skeleton className="h-7 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-8 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 px-1" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>

          {/* OTP */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-36 px-1" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>

          {/* Submit */}
          <Skeleton className="mt-6 h-12 w-full rounded-lg" />

          {/* Resend */}
          <div className="flex flex-col items-center gap-2 pt-4">
            <Skeleton className="h-3 w-40 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>

      </div>
    </div>
  );
}
