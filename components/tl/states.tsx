"use client";

import React, { type ReactNode } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { card, ghostButton } from "./styles";

/** Props for {@link ScreenLoading}. */
export interface ScreenLoadingProps {
  /** What is loading, read out to screen readers ("Loading your timetable"). */
  label: string;
  /** How many grey card blocks to draw. */
  blocks?: number;
}

/**
 * The loading state of a screen: a few pulsing card blocks, announced once as
 * "busy" so a screen reader says what is happening.
 *
 * @param props - See {@link ScreenLoadingProps}.
 * @param props.label - What is loading.
 * @param props.blocks - How many blocks to draw.
 * @returns The skeleton.
 */
export function ScreenLoading({ label, blocks = 3 }: ScreenLoadingProps) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">{label}</span>
      {Array.from({ length: blocks }, (_, index) => (
        <div key={index} className="h-[120px] animate-pulse rounded-[22px] border border-tl-line bg-tl-surface" aria-hidden />
      ))}
    </div>
  );
}

/** Props for {@link ScreenError}. */
export interface ScreenErrorProps {
  /** The sentence to show (already student-friendly). */
  message: string;
  /** Called by "Try again". */
  onRetry?: () => void;
}

/**
 * A failed load: the message in a card and a "Try again" button. It is an
 * alert, so it is read out when it appears.
 *
 * @param props - See {@link ScreenErrorProps}.
 * @param props.message - What went wrong.
 * @param props.onRetry - Retries the load.
 * @returns The error card.
 */
export function ScreenError({ message, onRetry }: ScreenErrorProps) {
  return (
    <div role="alert" className={`${card} flex flex-wrap items-center gap-4`}>
      <AlertCircle className="h-6 w-6 shrink-0 text-tl-danger" aria-hidden />
      <p className="min-w-[200px] flex-1 text-[15px] text-tl-body">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className={ghostButton}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

/** Props for {@link EmptyNote}. */
export interface EmptyNoteProps {
  /** The bold line. */
  title: ReactNode;
  /** The explanation under it. */
  children?: ReactNode;
  /** An optional action under the text. */
  action?: ReactNode;
}

/**
 * An empty state inside a card: an icon, a title and a sentence.
 *
 * @param props - See {@link EmptyNoteProps}.
 * @param props.title - The bold line.
 * @param props.children - The explanation.
 * @param props.action - An action below.
 * @returns The empty state.
 */
export function EmptyNote({ title, children, action }: EmptyNoteProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <Inbox className="h-8 w-8 text-tl-faint" aria-hidden />
      <p className="text-base font-bold text-tl-ink">{title}</p>
      {children ? <p className="max-w-[420px] text-[15px] text-tl-muted">{children}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
