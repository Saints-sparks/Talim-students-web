"use client";

import React, { type ReactNode } from "react";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import { focusRing, pageSubtitle, pageTitle, pill } from "./styles";

/** Props for {@link SubjectDot}. */
export interface SubjectDotProps {
  /** The API's `colourKey`, or a course id when the payload has none. */
  toneKey: string | number;
  /** Diameter class; 9px by default. */
  sizeClass?: string;
}

/**
 * The small round dot in a subject's colour, beside its name. Decorative: the
 * name next to it carries the meaning.
 *
 * @param props - See {@link SubjectDotProps}.
 * @param props.toneKey - What the colour is derived from.
 * @param props.sizeClass - Size classes.
 * @returns The dot.
 */
export function SubjectDot({ toneKey, sizeClass = "h-[9px] w-[9px]" }: SubjectDotProps) {
  return <span aria-hidden className={`${subjectToneClass(toneKey)} inline-block shrink-0 rounded-full bg-subj-solid ${sizeClass}`} />;
}

/** Props for {@link GradePill}. */
export interface GradePillProps {
  /** The letter ("A"), or null when there is no grade yet. */
  grade: string | null;
  /** The tone the scale gives it. */
  tone: "success" | "info" | "warning" | "danger" | "muted";
  /** Extra classes. */
  className?: string;
}

const GRADE_TONE: Record<GradePillProps["tone"], string> = {
  success: "bg-tl-success-bg text-tl-success",
  info: "bg-tl-select text-tl-brand",
  warning: "bg-tl-warning-bg text-tl-warning",
  danger: "bg-tl-danger-bg text-tl-danger",
  muted: "bg-tl-track text-tl-muted",
};

/**
 * A letter grade in a coloured pill (the design's `gradePill`).
 *
 * @param props - See {@link GradePillProps}.
 * @param props.grade - The letter.
 * @param props.tone - Its colour.
 * @param props.className - Extra classes.
 * @returns The pill, or a dash when there is no grade.
 */
export function GradePill({ grade, tone, className = "" }: GradePillProps) {
  if (!grade) return <span className="text-sm text-tl-faint">—</span>;
  return <span className={`${pill} ${GRADE_TONE[tone]} ${className}`}>{grade}</span>;
}

/** Props for {@link PageHeader}. */
export interface PageHeaderProps {
  /** The page's one `h1`. */
  title: ReactNode;
  /** The grey line under it. */
  subtitle?: ReactNode;
  /** Controls on the right (print, term picker). */
  actions?: ReactNode;
  /** The guide target for the heading block. */
  guide?: string;
  /** Hide the header when printing. */
  printHide?: boolean;
}

/**
 * The heading block every screen starts with: title, subtitle and optional
 * actions that wrap under it on narrow screens.
 *
 * @param props - See {@link PageHeaderProps}.
 * @param props.title - The heading.
 * @param props.subtitle - The line under it.
 * @param props.actions - Controls beside it.
 * @param props.guide - Guide target name.
 * @param props.printHide - Whether to hide it in print.
 * @returns The header.
 */
export function PageHeader({ title, subtitle, actions, guide, printHide }: PageHeaderProps) {
  return (
    <div
      className="flex flex-wrap items-end justify-between gap-4"
      data-guide={guide}
      {...(printHide ? { "data-print-hide": "1" } : {})}
    >
      <div className="min-w-0">
        <h1 className={pageTitle}>{title}</h1>
        {subtitle ? <div className={pageSubtitle}>{subtitle}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-end gap-2.5">{actions}</div> : null}
    </div>
  );
}

/** Props for {@link Toggle}. */
export interface ToggleProps {
  /** Whether it is on. */
  checked: boolean;
  /** Called with the new value. */
  onChange: (next: boolean) => void;
  /** The accessible name (the row's label). */
  label: string;
  /** The id of the row's description, for `aria-describedby`. */
  describedBy?: string;
  /** Greyed out and not clickable (while saving). */
  disabled?: boolean;
}

/**
 * The design's switch (50 × 29 track, white knob): a real `role="switch"`
 * button, 44px tall to touch, that says on or off to screen readers.
 *
 * @param props - See {@link ToggleProps}.
 * @param props.checked - On or off.
 * @param props.onChange - Called on click.
 * @param props.label - The accessible name.
 * @param props.describedBy - The description's id.
 * @param props.disabled - Whether it is disabled.
 * @returns The switch.
 */
export function Toggle({ checked, onChange, label, describedBy, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex min-h-[44px] shrink-0 items-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
    >
      <span
        aria-hidden
        className={`flex h-[29px] w-[50px] rounded-full p-[3px] transition-colors ${checked ? "justify-end bg-tl-brand-fill" : "justify-start bg-tl-control"}`}
      >
        <span className="h-[23px] w-[23px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
      </span>
    </button>
  );
}

/** Props for {@link CountBadge}. */
export interface CountBadgeProps {
  /** How many; nothing is drawn at 0. */
  count: number;
  /** Classes for placement. */
  className?: string;
}

/**
 * The amber unread badge (sidebar, bell, thread list). Shows "99+" past 99.
 *
 * @param props - See {@link CountBadgeProps}.
 * @param props.count - The number.
 * @param props.className - Placement classes.
 * @returns The badge, or null at zero.
 */
export function CountBadge({ count, className = "" }: CountBadgeProps) {
  if (count <= 0) return null;
  return (
    <span className={`rounded-[9px] bg-tl-badge px-[7px] py-px text-xs font-extrabold leading-[1.4] text-white ${className}`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
