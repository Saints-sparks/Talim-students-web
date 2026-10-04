"use client";

import React, { useMemo, useState } from "react";
import { GradePill, SubjectDot } from "@/components/tl/bits";
import { card as cardClass, focusRing, tile } from "@/components/tl/styles";
import { formatPercent, formatScore, positionText } from "@/lib/learner/format";
import { gradeTone } from "@/lib/learner/grades";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import { compareWithAverage, maxTotal } from "@/lib/results/report";
import type { ReportCard, ReportRow } from "@/types/learner";

/**
 * The subject's short name, else its title.
 *
 * @param row - A report-card row.
 * @returns The name for the list.
 */
function shortName(row: ReportRow): string {
  return row.course.short || row.course.title;
}

/**
 * One subject's detail: its score per column, the total in the subject's
 * tint with the grade, and how it compares with the class average.
 *
 * @param props - Component props.
 * @param props.card - B5's answer.
 * @param props.row - The chosen subject's row.
 * @returns The detail card.
 */
function SubjectDetail({ card, row }: { card: ReportCard; row: ReportRow }) {
  const outOf = maxTotal(card.columns);
  const meta = [row.course.code, row.teacher?.name, card.term.name].filter(Boolean).join(" · ");
  const compare = compareWithAverage(row.percent, row.classAverage) ?? "The class average isn't available yet.";
  return (
    <section aria-labelledby="result-subject-title" className={`${cardClass} self-start`}>
      <div className="flex items-center gap-2.5">
        <SubjectDot toneKey={row.course.colourKey} sizeClass="h-[11px] w-[11px]" />
        <h2 id="result-subject-title" className="text-xl font-extrabold tracking-[-0.3px] text-tl-ink">
          {row.course.title}
        </h2>
      </div>
      <p className="mt-1 text-sm text-tl-muted">{meta}</p>
      <ul className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3" aria-label={`${row.course.title} scores`}>
        {card.columns.map((column, index) => (
          <li key={column.id} className={tile}>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.05em] text-tl-muted">{column.name}</p>
            <p className="mt-2 text-[26px] font-extrabold tracking-[-0.6px] text-tl-ink">{formatScore(row.scores[index])}</p>
            <p className="mt-0.5 text-[13px] text-tl-muted">out of {column.maxScore}</p>
          </li>
        ))}
        <li
          title="Your total for the term, and the grade it earns"
          className={`${subjectToneClass(row.course.colourKey)} rounded-2xl border border-subj-solid/20 bg-subj-tint p-[18px] text-subj-ink`}
        >
          <p className="text-[13px] font-extrabold uppercase tracking-[0.05em]">Total</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
            <p className="text-[26px] font-extrabold tracking-[-0.6px]">
              {formatScore(row.total)} / {outOf}
            </p>
            <GradePill grade={row.grade} tone={gradeTone(row.grade, card.scale, card.passMark)} />
          </div>
          <p className="mt-0.5 text-[13px]">
            {formatPercent(row.percent)} · {positionText(row.position)}
          </p>
        </li>
      </ul>
      <p className="mt-4 text-sm text-tl-muted">{compare}</p>
    </section>
  );
}

/**
 * The per-subject split view under the report card (hidden in print): the
 * subjects as toggle buttons with their percents, and the chosen one's detail.
 *
 * @param props - Component props.
 * @param props.card - B5's answer with at least one row.
 * @returns The panel.
 */
export function SubjectPanel({ card }: { card: ReportCard }) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const byId = useMemo(() => new Map(card.rows.map((row) => [row.course.id, row])), [card.rows]);
  const chosen = (chosenId ? byId.get(chosenId) : undefined) ?? card.rows[0];
  if (!chosen) return null;

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(220px,280px)_1fr]" data-guide="results-subjects" data-print-hide="1">
      <ul aria-label="Choose a subject" className="flex max-h-[620px] flex-col gap-2 overflow-y-auto p-0.5">
        {card.rows.map((row) => {
          const on = row.course.id === chosen.course.id;
          return (
            <li key={row.course.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setChosenId(row.course.id)}
                title={[row.course.title, row.teacher?.name].filter(Boolean).join(" · ")}
                className={`${subjectToneClass(row.course.colourKey)} flex min-h-[44px] w-full items-center gap-2 rounded-[14px] border bg-tl-surface px-4 py-3.5 text-left shadow-[0_1px_2px_rgba(15,27,46,0.04)] transition-colors ${
                  on ? "border-subj-solid ring-1 ring-subj-solid" : "border-tl-line hover:bg-tl-bg"
                } ${focusRing}`}
              >
                <SubjectDot toneKey={row.course.colourKey} />
                <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-tl-ink">{shortName(row)}</span>
                <span className="text-[15px] font-extrabold text-tl-ink">{formatPercent(row.percent)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <SubjectDetail card={card} row={chosen} />
    </div>
  );
}
