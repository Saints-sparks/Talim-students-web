"use client";

import React from "react";
import { AlertTriangle, Inbox, RefreshCw, WifiOff } from "lucide-react";
import { ApiError } from "@/lib/apiError";
import { messageForError } from "@/lib/errorMessages";

/**
 * A full-width loading state. Use a skeleton where the shape of the result is
 * known; this is for the cases where it is not.
 *
 * @param props - Component props.
 * @param props.message - What is being loaded.
 * @returns The loading element.
 */
export function LoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#003366] border-t-transparent dark:border-blue-300 dark:border-t-transparent" />
      <p className="font-medium text-gray-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

/** A rectangular placeholder that matches the shape of what is loading. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-[#30435F] ${className}`} aria-hidden />;
}

/**
 * A failed load, with the reason keyed on `error.code` and a way back.
 *
 * @param props - Component props.
 * @param props.error - The thrown value, or a ready-made message.
 * @param props.title - Heading; defaults to a neutral one.
 * @param props.onRetry - Called when the student asks to try again.
 * @param props.retryText - Label for the retry button.
 * @returns The error element.
 */
export function ErrorState({
  error,
  title,
  onRetry,
  retryText = "Try again",
}: {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  retryText?: string;
}) {
  const offline = error instanceof ApiError && error.code === "NETWORK_OFFLINE";
  const heading = title ?? (offline ? "You're offline" : "We couldn't load this");
  const message = messageForError(error);

  return (
    <div className="flex flex-1 items-center justify-center py-12" role="alert">
      <div className="mx-4 max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          {offline ? (
            <WifiOff className="h-6 w-6 text-red-600 dark:text-red-400" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          )}
        </div>
        <div className="mb-2 text-lg font-semibold text-gray-800 dark:text-slate-100">{heading}</div>
        <p className="mb-6 text-gray-600 dark:text-slate-300">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-[#003366] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#002244]"
          >
            <RefreshCw className="h-4 w-4" />
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * A successful load with nothing in it — distinct from a failure, and never
 * shown while a request is still in flight.
 *
 * @param props - Component props.
 * @param props.title - What is empty.
 * @param props.message - Why it might be empty, or what to do next.
 * @param props.icon - Replaces the default inbox glyph.
 * @param props.actionText - Label for the optional action.
 * @param props.onAction - Called when the student takes the action.
 * @returns The empty-state element.
 */
export function EmptyState({
  title,
  message,
  icon,
  actionText,
  onAction,
}: {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <div className="mx-4 max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-[#30435F]">
          {icon ?? <Inbox className="h-6 w-6 text-gray-400 dark:text-slate-400" />}
        </div>
        <div className="mb-2 text-lg font-semibold text-gray-800 dark:text-slate-100">{title}</div>
        <p className="mb-6 text-gray-600 dark:text-slate-300">{message}</p>
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-lg bg-[#003366] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#002244]"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
