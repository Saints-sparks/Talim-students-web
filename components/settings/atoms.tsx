"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * The heading above each settings section.
 *
 * @param props - Component props.
 * @param props.title - Section name.
 * @param props.subtitle - One line explaining what it covers.
 * @returns The header element.
 */
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

/**
 * The bordered container settings rows sit in.
 *
 * @param props - Component props.
 * @param props.children - The rows.
 * @param props.className - Extra classes, usually spacing.
 * @returns The card element.
 */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white dark:border-[#30435F] dark:bg-[#1B2A44] ${className}`}>
      {children}
    </div>
  );
}

/**
 * One labelled switch. Disabled while its save is in flight, so a student
 * can't queue two conflicting writes for the same field.
 *
 * @param props - Component props.
 * @param props.label - What the switch controls.
 * @param props.description - One line of detail.
 * @param props.checked - Current value.
 * @param props.onChange - Called with the new value.
 * @param props.disabled - Blocks interaction while saving.
 * @returns The row element.
 */
export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{label}</p>
        {description && <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-[#003366] dark:bg-blue-600" : "bg-gray-200 dark:bg-slate-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

/** A hairline between two rows in a card. */
export function Divider() {
  return <div className="mx-4 h-px bg-gray-100 dark:bg-slate-700" />;
}

/**
 * An inline warning above a section — used when preferences could not be read
 * or a save failed, so the student is never left guessing.
 *
 * @param props - Component props.
 * @param props.message - What went wrong, or `null` to render nothing.
 * @returns The banner element, or nothing.
 */
export function InlineWarning({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-900/20"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-xs text-amber-700 dark:text-amber-300">{message}</p>
    </div>
  );
}

/** A row of pulsing bars standing in for a card of switches. */
export function ToggleSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-700" />
      ))}
    </div>
  );
}
