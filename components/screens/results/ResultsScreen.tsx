"use client";

import React, { useCallback, useId, useMemo } from "react";
import { Info } from "lucide-react";
import { useReportCard, useSchoolTerms } from "@/hooks/learner/queries";
import { ScreenError, ScreenLoading, EmptyNote } from "@/components/tl/states";
import { PageHeader } from "@/components/tl/bits";
import { card as cardClass, primaryButton } from "@/components/tl/styles";
import { resultsSubtitle } from "@/lib/results/report";
import { chosenTermId, currentTermId, termOptions, type TermOption } from "@/lib/results/terms";
import type { ReportCard } from "@/types/learner";
import { ReportSheet } from "./ReportSheet";
import { SubjectPanel } from "./SubjectPanel";
import { SummaryCards } from "./SummaryCards";
import { TermPicker, useTermParam } from "./TermPicker";

/** Props for {@link ResultsView}. */
export interface ResultsViewProps {
  /** B5's answer for the chosen term. */
  card: ReportCard;
  /** The term picker's options. */
  termOptions: TermOption[];
  /** The chosen term's id. */
  termId: string | undefined;
  /** Picks a term. */
  onTermChange: (termId: string) => void;
  /** True while another term loads over this one. */
  busy?: boolean;
}

/**
 * "Print report card", disabled with the reason when there is nothing to
 * print yet.
 *
 * @param props - Component props.
 * @param props.disabled - Whether the term has no report card.
 * @returns The button and its note.
 */
function PrintButton({ disabled }: { disabled: boolean }) {
  const noteId = useId();
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className={primaryButton}
        disabled={disabled}
        aria-describedby={disabled ? noteId : undefined}
        title="Print or save your report card as a PDF"
        onClick={() => window.print()}
      >
        Print report card
      </button>
      {disabled ? (
        <p id={noteId} className="text-xs text-tl-muted">
          There is no report card to print yet.
        </p>
      ) : null}
    </div>
  );
}

/**
 * The Results screen's content for one B5 answer: heading with the term
 * picker and print button, the summary cards, the printable report card (or
 * a note that results are not out), and the per-subject view.
 *
 * @param props - See {@link ResultsViewProps}.
 * @param props.card - The report card.
 * @param props.termOptions - The picker's terms.
 * @param props.termId - The chosen term.
 * @param props.onTermChange - Picks a term.
 * @param props.busy - Whether another term is loading.
 * @returns The screen.
 */
export function ResultsView({ card, termOptions: options, termId, onTermChange, busy = false }: ResultsViewProps) {
  const none = card.status === "none" || card.rows.length === 0;
  const teachers = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of card.rows) if (row.teacher) map.set(row.course.id, row.teacher.name);
    return map;
  }, [card.rows]);

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader
        title="Results"
        subtitle={resultsSubtitle(card)}
        guide="results-header"
        printHide
        actions={
          <>
            <TermPicker options={options} value={termId} onChange={onTermChange} guide="results-term" busy={busy} />
            <PrintButton disabled={none} />
          </>
        }
      />

      <div aria-busy={busy} className={`flex flex-col gap-[18px] transition-opacity ${busy ? "opacity-60" : ""}`}>
        <SummaryCards card={card} teachers={teachers} />

        {none ? (
          <section className={cardClass} aria-label="Report card" data-guide="results-report-card">
            <EmptyNote title={`Your ${card.term.name.toLowerCase()} results aren't out yet.`}>They appear here once your school publishes them.</EmptyNote>
          </section>
        ) : (
          <>
            {card.status === "partial" ? (
              <div role="status" className="flex items-start gap-3 rounded-2xl border border-tl-warning/30 bg-tl-warning-bg px-4 py-3.5 text-[15px] text-tl-warning">
                <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <p>Some results aren&apos;t published yet. Your report card is final once your school publishes the term.</p>
              </div>
            ) : null}
            <ReportSheet card={card} />
            <SubjectPanel key={card.term.id} card={card} />
          </>
        )}
      </div>
    </div>
  );
}

/**
 * The Results screen (`/results`): one B5 report-card call for the term in
 * `?term=` (the current term by default) and the B5 term list for the
 * picker. Uses `useSearchParams`, so its page wraps it in Suspense.
 *
 * @returns The screen with its loading and error states.
 */
export default function ResultsScreen() {
  const { termParam, setTerm } = useTermParam("/results");
  const { data, isLoading, isFetching, error, refetch } = useReportCard(termParam);
  const terms = useSchoolTerms();

  const options = useMemo(() => termOptions(terms.data, data?.term, data?.session), [terms.data, data?.term, data?.session]);
  const currentId = currentTermId(terms.data);
  // The current term needs no ?term= (the API answers for it by default).
  const onTermChange = useCallback((termId: string) => setTerm(termId === currentId ? null : termId), [setTerm, currentId]);

  if (isLoading) return <ScreenLoading label="Loading your results" blocks={3} />;
  if (error || !data) return <ScreenError message={error ?? "We couldn't load your results. Please try again."} onRetry={refetch} />;
  return <ResultsView card={data} termOptions={options} termId={chosenTermId(termParam, terms.data, data.term.id)} onTermChange={onTermChange} busy={isFetching} />;
}
