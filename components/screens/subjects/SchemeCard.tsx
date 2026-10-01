"use client";

import React, { useMemo } from "react";
import { Check } from "lucide-react";
import { card, cardTitle, ghostButton } from "@/components/tl/styles";
import { formatDate } from "@/lib/learner/format";
import type { LessonTopic, StudentSubjectDetail } from "@/types/learner";

/**
 * The week the scheme is on, found once.
 *
 * @param weeks - The scheme's weeks.
 * @param currentWeek - The term's current week, or null.
 * @returns That week's row, or null.
 */
export function currentWeekOf(weeks: readonly LessonTopic[], currentWeek: number | null): LessonTopic | null {
  if (currentWeek === null) return null;
  return weeks.find((week) => week.week === currentWeek) ?? null;
}

/**
 * The visible label of a curriculum attachment link.
 *
 * @param index - Its position.
 * @param count - How many there are.
 * @returns "Download curriculum", or "Download curriculum (2 of 3)".
 */
function attachmentLabel(index: number, count: number): string {
  return count === 1 ? "Download curriculum" : `Download curriculum (${index + 1} of ${count})`;
}

/**
 * "What you're covering": this week's topic and objectives from the scheme of
 * work, a compact list of the term's weeks (ticked once taught), and the
 * older curriculum notes with their files when the subject has them.
 *
 * @param props - Component props.
 * @param props.detail - B4's answer.
 * @returns The card.
 */
export function SchemeCard({ detail }: { detail: StudentSubjectDetail }) {
  const { scheme, legacyCurriculum: legacy } = detail;
  const current = useMemo(() => currentWeekOf(scheme.weeks, scheme.currentWeek), [scheme.weeks, scheme.currentWeek]);
  const totalWeeks = detail.term?.totalWeeks;
  const hasWeeks = scheme.weeks.length > 0;
  const subtitle =
    hasWeeks && scheme.currentWeek !== null
      ? `Week ${scheme.currentWeek}${totalWeeks ? ` of ${totalWeeks}` : ""}`
      : legacy && !hasWeeks
        ? `Updated ${formatDate(legacy.updatedAt)}`
        : "This term's plan from your teacher";

  return (
    <section aria-labelledby="subject-scheme-title" className={card} data-guide="subject-scheme">
      <h2 id="subject-scheme-title" className={cardTitle}>
        What you&apos;re covering
      </h2>
      <p className="mt-1 text-sm text-tl-muted">{subtitle}</p>

      {!hasWeeks && !legacy ? <p className="mt-4 text-[15px] text-tl-muted">Your teacher hasn&apos;t added this term&apos;s plan yet.</p> : null}

      {current ? (
        <div className="mt-4 rounded-2xl border border-tl-line-soft bg-tl-subtle p-[18px]">
          <h3 className="text-base font-extrabold text-tl-ink">
            Week {current.week}: {current.topic}
          </h3>
          {current.objectives ? <p className="mt-1.5 whitespace-pre-line text-[15px] leading-[1.6] text-tl-body">{current.objectives}</p> : null}
        </div>
      ) : null}

      {hasWeeks ? (
        <ol aria-label="Weeks this term" className="mt-4 flex flex-col">
          {scheme.weeks.map((week) => {
            const isCurrent = week.week === scheme.currentWeek;
            return (
              <li key={week.week} className="flex items-center gap-3 border-t border-tl-line-soft py-2.5 first:border-t-0">
                <span className="w-[62px] shrink-0 text-[13px] font-bold text-tl-muted">Week {week.week}</span>
                <span className={`min-w-0 flex-1 text-sm ${isCurrent ? "font-bold text-tl-ink" : "text-tl-body"}`}>
                  {week.topic}
                  {isCurrent ? <span className="ml-2 rounded-full bg-tl-select px-2 py-0.5 text-xs font-extrabold text-tl-brand">This week</span> : null}
                </span>
                {week.taughtAt ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold text-tl-success">
                    <Check aria-hidden className="h-4 w-4" />
                    Taught
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      {legacy ? (
        <div className={hasWeeks ? "mt-5 border-t border-tl-line-soft pt-4" : "mt-4"}>
          <h3 className="text-[15px] font-extrabold text-tl-ink">Earlier notes</h3>
          {hasWeeks ? <p className="mt-0.5 text-[13px] text-tl-muted">Updated {formatDate(legacy.updatedAt)}</p> : null}
          {legacy.content ? (
            <p className="mt-3 whitespace-pre-line rounded-2xl border border-tl-line-soft bg-tl-subtle p-[18px] text-base leading-[1.6] text-tl-body">
              {legacy.content}
            </p>
          ) : null}
          {legacy.attachments.length ? (
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {legacy.attachments.map((url, index) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={ghostButton} title="Download the full scheme of work">
                    {attachmentLabel(index, legacy.attachments.length)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
