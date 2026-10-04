"use client";

import React, { useMemo } from "react";
import { GradePill } from "@/components/tl/bits";
import { card, cardTitle, tile } from "@/components/tl/styles";
import { formatPercent, formatScore, positionText } from "@/lib/learner/format";
import { gradeTone } from "@/lib/learner/grades";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import type { StudentSubjectDetail } from "@/types/learner";

/** The sums the Total tile and the partly-published note need. */
export interface ScoreSummary {
  /** Σ maxScore of every assessment (published or not). */
  maxTotal: number;
  /** How many assessments have a published score. */
  published: number;
  /** How many assessments there are. */
  count: number;
}

/**
 * Adds up a subject's assessments in one pass: the most the total can be,
 * and how many scores are out.
 *
 * @param assessments - B4's assessments.
 * @returns The sums.
 */
export function scoreSummary(assessments: StudentSubjectDetail["assessments"]): ScoreSummary {
  let maxTotal = 0;
  let published = 0;
  for (const assessment of assessments) {
    maxTotal += assessment.maxScore;
    if (assessment.score !== null) published += 1;
  }
  return { maxTotal, published, count: assessments.length };
}

/**
 * The line under the tiles when not every score is out, else null.
 *
 * @param summary - From {@link scoreSummary}.
 * @returns The note, or null when all (or there are no assessments) are published.
 */
export function partialNote(summary: ScoreSummary): string | null {
  if (!summary.count || summary.published === summary.count) return null;
  if (summary.published === 0) return "None of your scores are published yet.";
  return `${summary.published} of ${summary.count} scores are published. Your total counts only what's out so far.`;
}

/**
 * "Your scores in this subject": one tile per assessment the API sent (its
 * name, score and maximum; "Not published yet" until it is out) and the
 * Total tile in the subject's colour with the grade, percent and position.
 *
 * @param props - Component props.
 * @param props.detail - B4's answer.
 * @returns The card.
 */
export function ScoresCard({ detail }: { detail: StudentSubjectDetail }) {
  const summary = useMemo(() => scoreSummary(detail.assessments), [detail.assessments]);
  const note = partialNote(summary);
  const tone = gradeTone(detail.grade, detail.scale ?? [], detail.passMark ?? 50);

  return (
    <section aria-labelledby="subject-scores-title" className={card} data-guide="subject-scores">
      <h2 id="subject-scores-title" className={cardTitle}>
        Your scores in this subject
      </h2>
      <p className="mt-1 text-sm text-tl-muted">Only the total carries a grade.</p>
      <ul className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3">
        {detail.assessments.map((assessment) => {
          const out = assessment.score !== null;
          return (
            <li key={assessment.id} className={`${tile} p-[18px]`}>
              <p className="text-[13px] font-extrabold uppercase tracking-[0.05em] text-tl-muted">{assessment.name}</p>
              <p className="mt-2 text-[26px] font-extrabold tracking-[-0.6px] text-tl-ink">{formatScore(assessment.score)}</p>
              <p className="mt-0.5 text-[13px] text-tl-muted">out of {formatScore(assessment.maxScore)}</p>
              {out ? null : <p className="mt-1 text-[13px] font-bold text-tl-muted">Not published yet</p>}
            </li>
          );
        })}
        <li
          title="Your total for the term, and the grade it earns"
          className={`${subjectToneClass(detail.course.colourKey)} rounded-2xl border border-subj-solid/20 bg-subj-tint p-[18px] text-subj-ink`}
        >
          <p className="text-[13px] font-extrabold uppercase tracking-[0.05em]">Total</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
            <p className="text-[26px] font-extrabold tracking-[-0.6px]">
              {formatScore(detail.total)} / {formatScore(summary.maxTotal)}
            </p>
            {detail.grade ? (
              <span>
                <span className="sr-only">Grade </span>
                <GradePill grade={detail.grade} tone={tone} />
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[13px]">
            {formatPercent(detail.percent)} · {positionText(detail.position)}
          </p>
        </li>
      </ul>
      {note ? <p className="mt-3.5 text-sm text-tl-muted">{note}</p> : null}
    </section>
  );
}
