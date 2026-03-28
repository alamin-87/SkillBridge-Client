import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterLoading() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-6 shadow-sm sm:p-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Section (Logo + Titles) */}
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Logo Placeholder */}
          <Skeleton className="size-14 rounded-2xl" /> 
          <div className="space-y-2 w-full flex flex-col items-center">
            {/* Title */}
            <Skeleton className="h-8 w-3/4 rounded-lg sm:w-2/3" /> 
            {/* Subtitle */}
            <Skeleton className="h-4 w-full rounded-md sm:w-5/6" /> 
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="mt-8 space-y-5">
          {/* Role Selection (Common in education platforms e.g., Student/Tutor) */}
          <div className="flex gap-4">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 flex-1 rounded-xl" />
          </div>

          {/* Name Fields Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 px-1" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 px-1" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

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
          <Skeleton className="mt-8 h-12 w-full rounded-lg" />

          {/* Footer Link (e.g., Already have an account?) */}
          <div className="mt-6 flex justify-center pt-2">
            <Skeleton className="h-4 w-[60%] rounded-md" />
          </div>
        </div>
        
      </div>
    </div>
  );
}
