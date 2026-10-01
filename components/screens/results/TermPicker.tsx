"use client";

import React, { useCallback, useId } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fieldControl, fieldLabel } from "@/components/tl/styles";
import { hrefWithParam } from "@/lib/results/url";
import type { TermOption } from "@/lib/results/terms";

/** Props for {@link TermPicker}. */
export interface TermPickerProps {
  /** The terms to offer (see `termOptions`). */
  options: TermOption[];
  /** The chosen term's id. */
  value: string | undefined;
  /** Called with the newly chosen term's id. */
  onChange: (termId: string) => void;
  /** The guide target name ("results-term"). */
  guide?: string;
  /** True while the chosen term loads; the select stays usable. */
  busy?: boolean;
}

/**
 * The labelled term select of Results and Attendance. Hidden in print.
 *
 * @param props - See {@link TermPickerProps}.
 * @param props.options - The terms.
 * @param props.value - The chosen term.
 * @param props.onChange - Picks a term.
 * @param props.guide - Guide target name.
 * @param props.busy - Whether the chosen term is loading.
 * @returns The picker.
 */
export function TermPicker({ options, value, onChange, guide, busy }: TermPickerProps) {
  const id = useId();
  const selected = value && options.some((option) => option.id === value) ? value : options[0]?.id ?? "";
  return (
    <div className="flex min-w-[200px] flex-col gap-1.5" data-guide={guide} data-print-hide="1">
      <label htmlFor={id} className={fieldLabel}>
        Term
      </label>
      <select
        id={id}
        value={selected}
        aria-busy={busy || undefined}
        disabled={options.length === 0}
        onChange={(event) => onChange(event.target.value)}
        className={fieldControl}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * The term in the address (`?term=`) and a setter that replaces it, keeping
 * the other parameters. Needs a Suspense boundary above it (it reads
 * `useSearchParams`).
 *
 * @param fallbackPath - The page's path, used when the router has none.
 * @returns `termParam` (undefined for the current term) and `setTerm` (null clears it).
 */
export function useTermParam(fallbackPath: string): { termParam: string | undefined; setTerm: (termId: string | null) => void } {
  const router = useRouter();
  const pathname = usePathname() || fallbackPath;
  const searchParams = useSearchParams();
  const termParam = searchParams?.get("term") || undefined;
  const setTerm = useCallback(
    (termId: string | null) => router.replace(hrefWithParam(pathname, searchParams, "term", termId), { scroll: false }),
    [router, pathname, searchParams]
  );
  return { termParam, setTerm };
}
