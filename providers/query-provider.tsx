"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError } from "@/lib/apiError";

/**
 * Whether a failed query is worth retrying automatically. Client errors (4xx)
 * and auth failures never are; transient network/server errors get two more
 * attempts with back-off.
 *
 * @param failureCount - How many attempts have already failed.
 * @param error - The thrown value from the last attempt.
 * @returns True to try again.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  if (error instanceof ApiError) return error.isTransient && !error.isAuthError && error.code !== "RATE_LIMITED";
  return true;
}

/**
 * Builds the app's QueryClient. Read-mostly data stays fresh for 60 s by
 * default (screens override per resource); nothing refetches just because the
 * window regained focus, which was the main source of duplicate requests.
 *
 * @returns A configured client.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: shouldRetry,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: { retry: false },
    },
  });
}

/**
 * Provides the QueryClient to the app; one instance per browser session.
 *
 * @param props - Standard children.
 * @param props.children - The tree that may run queries.
 * @returns The provider element.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
