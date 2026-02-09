import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* 404 Text */}
      <h1 className="text-7xl font-bold tracking-tight text-primary">404</h1>

      <p className="mt-4 text-2xl font-semibold text-foreground">
        Page not found
      </p>

      <p className="mt-2 max-w-md text-muted-foreground">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
