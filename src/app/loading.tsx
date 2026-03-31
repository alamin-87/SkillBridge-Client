import { getIconComponent } from "@/lib/icon-mapper";

export default function Loading() {
  const Loader2Icon = getIconComponent("Loader2");
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 p-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring animation */}
        <div className="absolute size-16 animate-ping rounded-full bg-primary/20 duration-1000"></div>
        {/* Inner static backdrop for emphasis */}
        <div className="absolute size-12 rounded-full bg-primary/10"></div>
        {/* Spinning loader */}
        <Loader2Icon className="relative z-10 size-10 animate-spin text-primary" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Loading content
        </h3>
        <p className="text-sm text-muted-foreground animate-pulse">
          Please wait a moment while we prepare everything for you...
        </p>
      </div>
    </div>
  );
}
