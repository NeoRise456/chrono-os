"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold font-display tracking-widest">ERR</h1>
          <p className="text-xl text-muted-foreground font-display">SYSTEM_ERROR</p>
        </div>
        <p className="text-muted-foreground max-w-md">
          An unexpected error has occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-foreground text-background font-display font-bold tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
        >
          RETRY
        </button>
      </div>
    </div>
  );
}
