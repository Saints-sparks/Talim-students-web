"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";
import { messageForError } from "@/lib/errorMessages";

/**
 * The app-wide error boundary. Anything a screen throws during render lands
 * here instead of leaving the student on a blank page.
 *
 * @param props - Next.js error-boundary props.
 * @param props.error - What was thrown.
 * @param props.reset - Re-renders the segment.
 * @returns The error screen.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error("app", "Unhandled render error", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-[#0B1224]">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Something went wrong</h1>
        <p className="mb-6 text-gray-600 dark:text-slate-300">{messageForError(error)}</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003366] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#002244]"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
