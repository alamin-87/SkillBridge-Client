import { Skeleton } from "@/components/ui/skeleton";

export default function CommonLayoutLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-700 px-4 py-8 md:px-6 lg:py-12">
      {/* Top Header Placeholder */}
      <div className="mb-10 flex flex-col gap-3">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-12 w-[70%] rounded-xl sm:w-[50%] lg:w-[40%]" />
        <Skeleton className="mt-2 h-6 w-[90%] rounded-md sm:w-[60%] lg:w-[50%]" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Featured Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl border bg-card p-1 shadow-sm">
            <Skeleton className="h-[250px] w-full rounded-xl sm:h-[350px]" />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all"
              >
                {/* Image Placeholder */}
                <Skeleton className="aspect-video w-full rounded-xl" />
                
                {/* Meta Placeholder */}
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  
                  {/* Title Placeholder */}
                  <Skeleton className="h-7 w-full rounded-md" />
                  <Skeleton className="h-7 w-4/5 rounded-md" />
                  
                  {/* User/Author area */}
                  <div className="mt-4 flex items-center gap-3 pt-2">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 rounded-md" />
                      <Skeleton className="h-3 w-16 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar (Hidden on mobile) */}
        <aside className="hidden w-[320px] shrink-0 flex-col gap-6 lg:flex xl:w-[350px]">
          {/* Sidebar Widget 1 (e.g. Filter/Search/Promo) */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Skeleton className="mb-6 h-7 w-1/2 rounded-md" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
          
          {/* Sidebar Widget 2 (e.g. Recent/Popular items) */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Skeleton className="mb-6 h-7 w-2/3 rounded-md" />
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-12 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
