"use client";

import React, { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Toggle } from "@/components/tl/bits";
import { focusRing } from "@/components/tl/styles";

const ROW = "flex items-center gap-4 border-t border-tl-line-soft py-4";
const LABEL = "text-[15px] font-bold text-tl-ink";
const DESC = "mt-[3px] text-sm text-tl-muted";

/**
 * The list the rows of a Settings panel sit in.
 *
 * @param props - Standard children.
 * @param props.children - The rows.
 * @param props.label - The list's accessible name, when the panel heading is not enough.
 * @returns The list.
 */
export function RowList({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <ul className="mt-4 flex flex-col" aria-label={label}>
      {children}
    </ul>
  );
}

/** Props for {@link ToggleRow}. */
export interface ToggleRowProps {
  /** A stable id; the description gets `${id}-desc`. */
  id: string;
  /** The bold line, also the switch's name. */
  label: string;
  /** The grey line, read as the switch's description. */
  description: string;
  /** On or off. */
  checked: boolean;
  /** Called with the new value. */
  onChange: (next: boolean) => void;
  /** While this row saves (or the preferences load). */
  disabled?: boolean;
}

/**
 * A row with a label, a description and a switch (the design's `toggleRow`).
 *
 * @param props - See {@link ToggleRowProps}.
 * @param props.id - The row's id.
 * @param props.label - The bold line.
 * @param props.description - The grey line.
 * @param props.checked - On or off.
 * @param props.onChange - Called on click.
 * @param props.disabled - Whether the switch is disabled.
 * @returns The list item.
 */
export function ToggleRow({ id, label, description, checked, onChange, disabled }: ToggleRowProps) {
  const descId = `${id}-desc`;
  return (
    <li className={ROW}>
      <div className="min-w-0 flex-1">
        <div className={LABEL}>{label}</div>
        <div id={descId} className={DESC}>
          {description}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} describedBy={descId} disabled={disabled} />
    </li>
  );
}

/** Props for {@link LinkRow}. */
export interface LinkRowProps {
  /** The bold line. */
  label: string;
  /** The grey line, when there is one. */
  description?: string;
  /** A short value before the chevron ("2 devices"). */
  value?: ReactNode;
  /** What the row opens. */
  onClick: () => void;
  /** The guide target. */
  guide?: string;
}

/**
 * A row that opens something (a sheet, the tour): the whole row is one
 * button with a chevron (the design's `linkRow`).
 *
 * @param props - See {@link LinkRowProps}.
 * @param props.label - The bold line.
 * @param props.description - The grey line.
 * @param props.value - The value before the chevron.
 * @param props.onClick - Called on click.
 * @param props.guide - Guide target name.
 * @returns The list item.
 */
export function LinkRow({ label, description, value, onClick, guide }: LinkRowProps) {
  return (
    <li className="border-t border-tl-line-soft">
      <button
        type="button"
        onClick={onClick}
        title={description}
        data-guide={guide}
        className={`group flex min-h-[44px] w-full items-center gap-4 rounded-[14px] py-4 text-left ${focusRing}`}
      >
        <span className="min-w-0 flex-1">
          <span className={`block ${LABEL} group-hover:text-tl-brand`}>{label}</span>
          {description ? <span className={`block ${DESC}`}>{description}</span> : null}
        </span>
        {value ? <span className="shrink-0 text-[15px] font-bold text-tl-muted">{value}</span> : null}
        <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-tl-faint" />
      </button>
    </li>
  );
}

/**
 * A row with a label and a read-only value (the design's `valueRow`).
 *
 * @param props - The row.
 * @param props.label - The bold line.
 * @param props.value - The value on the right.
 * @returns The list item.
 */
export function ValueRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <li className={ROW}>
      <div className={`min-w-0 flex-1 ${LABEL}`}>{label}</div>
      <div className="shrink-0 text-[15px] font-bold text-tl-muted">{value}</div>
    </li>
  );
}

/**
 * A save or load problem under a panel's heading.
 *
 * @param props - The message.
 * @param props.message - The sentence, or null to show nothing.
 * @param props.tone - `alert` for a failed save (read out at once), `note` for a calmer status.
 * @returns The message, or null.
 */
export function PanelMessage({ message, tone }: { message: string | null; tone: "alert" | "note" }) {
  if (!message) return null;
  return (
    <p
      role={tone === "alert" ? "alert" : "status"}
      className={`mt-4 rounded-[14px] px-4 py-3 text-sm leading-normal ${
        tone === "alert" ? "bg-tl-danger-bg text-tl-danger" : "bg-tl-warning-bg text-tl-warning"
      }`}
    >
      {message}
    </p>
  );
}
