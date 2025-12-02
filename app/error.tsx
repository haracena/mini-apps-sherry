"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-red-500/10 p-6 mx-auto w-fit mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-neutral-400 mb-6">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        {error.digest && (
          <p className="text-xs text-neutral-500 mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}
