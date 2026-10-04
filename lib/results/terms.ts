/**
 * The term pickers of Results and Attendance: which terms to offer and which
 * one is chosen. The list is the school's terms
 * (`GET /academic-year-term/term/school`, see `useSchoolTerms`); the term the
 * screen's own answer is for is always offered, so the picker still works
 * while the list loads or if it fails.
 */
import type { TermRef } from "@/types/learner";

/** What a picker needs of a term (a `SchoolTerm`, or a `ReportTerm`). */
export interface PickerTerm {
  id: string;
  name: string;
  session: string | null;
  isCurrent: boolean;
}

/** One option of a term picker. */
export interface TermOption {
  id: string;
  /** "First term · 2026/2027". */
  label: string;
}

/**
 * A term's name with its session.
 *
 * @param name - "First term".
 * @param session - "2026/2027", or null.
 * @returns "First term · 2026/2027", or the name alone.
 */
export function termLabel(name: string, session: string | null | undefined): string {
  return session ? `${name} · ${session}` : name;
}

/**
 * The options of a term picker: the school's terms (in the order given,
 * newest first), with the term on screen added at the top when the list lacks
 * it or has not loaded.
 *
 * @param terms - The terms, or undefined while loading or after a failure.
 * @param shown - The term the screen's answer is for.
 * @param shownSession - Its session, when the answer carries it separately.
 * @returns The options, never with the same id twice.
 */
export function termOptions(terms: readonly PickerTerm[] | undefined, shown: TermRef | null | undefined, shownSession?: string | null): TermOption[] {
  const options: TermOption[] = [];
  const seen = new Set<string>();
  for (const term of terms ?? []) {
    if (seen.has(term.id)) continue;
    seen.add(term.id);
    options.push({ id: term.id, label: termLabel(term.name, term.session) });
  }
  if (shown && !seen.has(shown.id)) {
    options.unshift({ id: shown.id, label: termLabel(shown.name, shownSession ?? shown.session) });
  }
  return options;
}

/**
 * The school's current term (the one marked `isCurrent`).
 *
 * @param terms - The terms, or undefined.
 * @returns Its id, or undefined when none is marked or the list is not loaded.
 */
export function currentTermId(terms: readonly PickerTerm[] | undefined): string | undefined {
  return terms?.find((term) => term.isCurrent)?.id;
}

/**
 * The term the picker shows as chosen: the one in the address, else the
 * school's current term, else the one the answer is for (the API answers for
 * the current term when none is asked for), else the newest in the list.
 *
 * @param requested - `?term=`, or undefined.
 * @param terms - The terms, or undefined.
 * @param shownId - The id of the term the screen's answer is for.
 * @returns The id, or undefined before anything has loaded.
 */
export function chosenTermId(requested: string | undefined, terms: readonly PickerTerm[] | undefined, shownId: string | undefined): string | undefined {
  return requested || currentTermId(terms) || shownId || terms?.[0]?.id;
}
