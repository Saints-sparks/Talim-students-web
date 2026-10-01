"use client";

import React from "react";
import Link from "next/link";
import { focusRing, tile } from "@/components/tl/styles";
import { formatPercent, ordinal } from "@/lib/learner/format";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import type { StudentToday, SubjectTotal } from "@/types/learner";

/** One glance tile's content. */
interface GlanceTile {
  label: string;
  value: string;
  note: string;
  href: string;
  tip: string;
}

/**
 * The four glance tiles from B1's `glance`, with the design's empty wording
 * when nothing is published or marked yet.
 *
 * @param today - B1's answer.
 * @returns The tiles in order.
 */
export function glanceTiles(today: StudentToday): GlanceTile[] {
  const { glance, subjectTotals, class: klass } = today;
  const subjects = subjectTotals.length;
  const attendance = glance.attendance;
  const unread = glance.unread;
  return [
    {
      label: "Term average",
      value: formatPercent(glance.average),
      note: glance.average === null ? "No scores yet" : `Grade ${glance.grade ?? "—"} across ${subjects} subject${subjects === 1 ? "" : "s"}`,
      href: "/results",
      tip: glance.average === null ? "Your average appears once teachers publish scores" : `Average of your ${subjects} subject totals`,
    },
    {
      label: "Class position",
      value: glance.position ? ordinal(glance.position.rank) : "—",
      note: glance.position ? `of ${glance.position.of} in ${klass?.name ?? "your class"}` : "Not ranked yet",
      href: "/results",
      tip: `Where you stand in ${klass?.name ?? "your class"}`,
    },
    {
      label: "Attendance",
      value: formatPercent(attendance.rate),
      note: attendance.rate === null ? "Not marked yet" : `${attendance.present} of ${attendance.schoolDays} days`,
      href: "/attendance",
      tip: "Days your school marked you present",
    },
    {
      label: "Unread messages",
      value: String(unread.count),
      note: unread.count === 0 ? "Nothing waiting" : unread.topRoom ? `In ${unread.topRoom.name}` : "Across your groups",
      href: unread.topRoom ? `/messages?room=${encodeURIComponent(unread.topRoom.id)}` : "/messages",
      tip: "Messages you have not opened",
    },
  ];
}

/**
 * The four tiles under "Your term at a glance"; each is a link to its page.
 *
 * @param props - Component props.
 * @param props.today - B1's answer.
 * @returns The tile grid.
 */
export function GlanceTiles({ today }: { today: StudentToday }) {
  return (
    <ul className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {glanceTiles(today).map((t) => (
        <li key={t.label}>
          <Link href={t.href} title={t.tip} className={`${tile} block h-full hover:border-tl-control ${focusRing}`}>
            <span className="block text-[13px] font-bold text-tl-muted">{t.label}</span>
            <span className="mt-1.5 block text-[clamp(24px,3vw,29px)] font-extrabold tracking-[-0.5px] text-tl-ink">{t.value}</span>
            <span className="mt-[3px] block text-[13px] text-tl-faint">{t.note}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The bar chart of each subject's total (B1 `subjectTotals`), in the
 * subject's colour, with a dashed line at the pass mark. Screen readers get
 * the list of subjects and percentages instead of the bars.
 *
 * @param props - Component props.
 * @param props.totals - One per subject.
 * @param props.passMark - The school's pass mark, in percent.
 * @returns The chart.
 */
export function GlanceChart({ totals, passMark }: { totals: SubjectTotal[]; passMark: number }) {
  if (!totals.length) return null;
  return (
    <figure className="mt-[22px]">
      <figcaption className="sr-only">Your total in each subject, out of 100%</figcaption>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-tl-faint/60"
          // Bars are drawn at 92% of the 144px plot (150px less its top padding).
          style={{ bottom: `${(Math.min(100, Math.max(0, passMark)) * 0.92 * 144) / 150}%` }}
        />
        <ul className="flex h-[150px] items-end gap-[clamp(4px,1vw,10px)] border-b border-tl-line-soft pt-1.5">
          {totals.map((s) => {
            const pct = s.percent ?? 0;
            const tip = s.percent === null ? `${s.title} — no score yet` : `${s.title} — ${formatPercent(s.percent)}${s.classAverage !== null ? ` · class average ${formatPercent(s.classAverage)}` : ""}`;
            return (
              <li key={s.courseId} title={tip} className={`${subjectToneClass(s.courseId)} flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5`}>
                <span className="sr-only">{tip}</span>
                <span aria-hidden className="text-[11px] font-extrabold text-tl-muted">
                  {s.percent === null ? "" : Math.round(s.percent)}
                </span>
                <span
                  aria-hidden
                  className="w-full max-w-[46px] rounded-t-lg bg-subj-solid"
                  style={{ height: `${s.percent === null ? 2 : Math.max(2, Math.round(pct * 0.92))}%` }}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div aria-hidden className="mt-2 flex gap-[clamp(4px,1vw,10px)]">
        {totals.map((s) => (
          <span key={s.courseId} className="min-w-0 flex-1 truncate text-center text-[11px] font-bold uppercase tracking-[0.04em] text-tl-faint">
            {s.short.slice(0, 4)}
          </span>
        ))}
      </div>
    </figure>
  );
}
