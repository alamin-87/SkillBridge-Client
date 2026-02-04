import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* 404 Text */}
      <h1 className="text-7xl font-bold tracking-tight text-primary">
        HOME PAGE
      </h1>
    </div>
  );
}
