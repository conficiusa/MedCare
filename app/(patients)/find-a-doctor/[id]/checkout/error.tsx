"use client";

import { Button } from "@/components/ui/button";
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
    <main className="flex h-full min-h-[calc(100dvh_-_4rem)] flex-col items-center justify-center gap-6">
      <h2 className="text-center">
        Something went wrong
      </h2>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}
