"use client";

import React, { type ReactNode } from "react";
import { GradePill } from "@/components/tl/bits";
import { pill, pillTone, statCard } from "@/components/tl/styles";
import { formatPercent, ordinal } from "@/lib/learner/format";
import { gradeTone } from "@/lib/learner/grades";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import { movementNote } from "@/lib/results/report";
import type { ReportCard, ReportHighlight } from "@/types/learner";

/** One summary card. */
interface SummaryCard {
  label: string;
  value: string;
  pill: ReactNode;
  note: string;
  tip: string;
}

/**
 * The percent pill of a highlighted subject, in that subject's colours.
 *
 * @param props - Component props.
 * @param props.highlight - The subject.
 * @returns The pill.
 */
function SubjectPercentPill({ highlight }: { highlight: ReportHighlight }) {
  return <span className={`${pill} ${subjectToneClass(highlight.colourKey)} bg-subj-tint px-2.5 text-subj-ink`}>{formatPercent(highlight.percent)}</span>;
}

/**
 * The four cards above the report card: term average, class position,
 * strongest subject and the one that needs attention. Before results are out
 * each shows a dash, as the design does.
 *
 * @param card - B5's answer.
 * @param teachers - Course id → teacher name, for the hover text.
 * @returns The cards, in the design's order.
 */
export function summaryCards(card: ReportCard, teachers: ReadonlyMap<string, string>): SummaryCard[] {
  const { overall, strongest, weakest } = card;
  const subjects = card.rows.length;
  // The term average covers only subjects with a published score (A7).
  const scored = card.rows.reduce((count, row) => count + (row.percent === null ? 0 : 1), 0);
  // With one scored subject the API names it both strongest and weakest.
  const sameHighlight = Boolean(strongest && weakest && strongest.courseId === weakest.courseId);
  const noScores = card.status === "none" || overall.percent === null;
  const tipFor = (h: ReportHighlight) => [h.title, teachers.get(h.courseId)].filter(Boolean).join(" · ");
  return [
    noScores
      ? { label: "Term average", value: "—", pill: null, note: "No scores published yet", tip: "" }
      : {
          label: "Term average",
          value: formatPercent(overall.percent),
          pill: <GradePill grade={overall.grade} tone={gradeTone(overall.grade, card.scale, card.passMark)} />,
          note: scored < subjects ? `Across ${scored} of ${subjects} subjects so far` : `Across all ${subjects} subject${subjects === 1 ? "" : "s"}`,
          tip: `The average of your ${scored} subject total${scored === 1 ? "" : "s"} published so far`,
        },
    overall.position && card.status !== "none"
      ? {
          label: "Class position",
          value: ordinal(overall.position.rank),
          pill: <span className={`${pill} px-2.5 font-bold ${pillTone.muted}`}>of {overall.position.of}</span>,
          note: movementNote(overall.position, overall.previousPosition),
          tip: `Your overall standing in ${card.student.class.name}`,
        }
      : { label: "Class position", value: "—", pill: null, note: "Not ranked yet", tip: "" },
    strongest && card.status !== "none"
      ? {
          label: "Strongest subject",
          value: strongest.short || strongest.title,
          pill: <SubjectPercentPill highlight={strongest} />,
          note: strongest.position ? `${ordinal(strongest.position.rank)} in class` : "",
          tip: tipFor(strongest),
        }
      : { label: "Strongest subject", value: "—", pill: null, note: "", tip: "" },
    weakest && card.status !== "none" && !sameHighlight
      ? {
          label: "Needs attention",
          value: weakest.short || weakest.title,
          pill: <SubjectPercentPill highlight={weakest} />,
          note: overall.percent !== null && weakest.percent < overall.percent ? "Below your term average" : "",
          tip: tipFor(weakest),
        }
      : { label: "Needs attention", value: "—", pill: null, note: sameHighlight ? "Only one subject has scores so far" : "", tip: "" },
  ];
}

/**
 * The row of four summary cards (hidden when printing).
 *
 * @param props - Component props.
 * @param props.card - B5's answer.
 * @param props.teachers - Course id → teacher name.
 * @returns The cards.
 */
export function SummaryCards({ card, teachers }: { card: ReportCard; teachers: ReadonlyMap<string, string> }) {
  const cards = summaryCards(card, teachers);
  return (
    <ul aria-label="Term summary" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-3.5" data-guide="results-summary" data-print-hide="1">
      {cards.map((item) => (
        <li key={item.label} title={item.tip || undefined} className={statCard}>
          <p className="text-[13px] font-bold text-tl-muted">{item.label}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="text-2xl font-extrabold tracking-[-0.6px] text-tl-ink">{item.value}</p>
            {item.pill}
          </div>
          {item.note ? <p className="mt-1 text-[13px] text-tl-muted">{item.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}
