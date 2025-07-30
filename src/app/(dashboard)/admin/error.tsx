"use client"; // Error boundaries must be Client Components

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
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] absolute">
      <h1>Something went wrong!</h1>
      <Button
        type="button"
        size={"lg"}
        className="text-base"
        variant={"destructive"}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
