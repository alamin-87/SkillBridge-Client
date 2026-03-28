"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Custom Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-[450px] flex-col items-center text-center">
        {/* Graphic Area */}
        <div className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
          <AlertCircle className="size-12 animate-pulse text-destructive" strokeWidth={1.5} />
        </div>
        
        {/* Content */}
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Oops! Something went wrong
        </h2>
        
        <p className="mb-8 leading-relaxed text-muted-foreground">
          We ran into an unexpected issue while loading this page. Our team has been notified, but you can try again in a moment.
        </p>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button 
            onClick={() => reset()} 
            className="group w-full sm:w-auto"
            size="lg"
          >
            <RefreshCcw className="mr-2 size-4 transition-transform duration-500 ease-in-out group-hover:-rotate-180" />
            Try Again
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        {/* Error Info (Optional/Dev Info) */}
        {error.digest && (
          <p className="mt-10 text-xs text-muted-foreground/50">
            Error Reference ID: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  );
}
