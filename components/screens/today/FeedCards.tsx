"use client";

import React from "react";
import Link from "next/link";
import { card, cardTitle, focusRing, pill, pillTone, textLink } from "@/components/tl/styles";
import { daysAwayLabel, monthDayParts, relativeWhen } from "@/lib/learner/format";
import { targetHref } from "@/lib/learner/targets";
import type { ComingUpItem, NotificationItem } from "@/types/learner";

/**
 * The tag colour of a "Coming up" row: amber within a week, blue the next
 * week, grey after that (the design's tags).
 *
 * @param daysAway - Whole days from today.
 * @returns A pill tone class.
 */
function comingUpTone(daysAway: number): string {
  if (daysAway < 7) return pillTone.warning;
  if (daysAway < 14) return pillTone.info;
  return pillTone.muted;
}

/**
 * "Coming up": the student's unpublished assessments due within 21 days and
 * the school's calendar events (B1 `comingUp`).
 *
 * @param props - Component props.
 * @param props.items - The rows, soonest first.
 * @returns The card.
 */
export function ComingUpCard({ items }: { items: ComingUpItem[] }) {
  return (
    <section aria-labelledby="comingup-title" className={card} data-guide="today-coming-up">
      <h2 id="comingup-title" className={cardTitle}>
        Coming up
      </h2>
      <p className="mt-1 text-sm text-tl-muted">Assessments and deadlines your teachers have set</p>
      {items.length ? (
        <ul className="mt-4 flex flex-col gap-2.5">
          {items.map((item) => {
            const { month, day } = monthDayParts(item.date);
            return (
              <li key={`${item.kind}-${item.id}`} className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-tl-line-soft p-3.5">
                <div aria-hidden className="w-[50px] shrink-0 rounded-[13px] bg-tl-select py-2 text-center text-tl-brand">
                  <div className="text-[11px] font-extrabold tracking-[0.04em]">{month}</div>
                  <div className="text-[19px] font-extrabold leading-[1.1]">{day}</div>
                </div>
                <div className="min-w-[150px] flex-1">
                  <p className="text-base font-bold">{item.title}</p>
                  <p className="mt-[3px] text-sm text-tl-muted">
                    <span className="sr-only">Due {month} {day}. </span>
                    {item.kind === "event" ? "School calendar" : item.courseTitle ?? "Assessment"}
                  </p>
                </div>
                <span className={`${pill} ${comingUpTone(item.daysAway)} px-3 py-1.5 font-bold`}>{daysAwayLabel(item.daysAway)}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="pb-0.5 pt-[18px] text-[15px] text-tl-muted">Nothing due yet. New assessments will show up here.</p>
      )}
    </section>
  );
}

/**
 * "New since you last signed in": the unread notifications (B1 `feed`), each
 * a link to where its button would go, and "All updates →".
 *
 * @param props - Component props.
 * @param props.feed - Up to five unread notifications.
 * @param props.now - The school's "now", for "Today" / "Yesterday".
 * @returns The card.
 */
export function NewSinceCard({ feed, now }: { feed: NotificationItem[]; now: string }) {
  return (
    <section aria-labelledby="newsince-title" className={card} data-guide="today-new" title="Files, results and messages added since your last sign-in">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="newsince-title" className="text-base font-extrabold tracking-[-0.2px]">
          New since you last signed in
        </h2>
        <Link href="/updates" className={textLink} title="See all announcements and alerts">
          All updates →
        </Link>
      </div>
      {feed.length ? (
        <ul className="mt-1.5 flex flex-col">
          {feed.map((row) => (
            <li key={row.id} className="border-t border-tl-line-soft">
              <Link href={targetHref(row.target, row.metadata) ?? "/updates"} className={`flex items-start gap-3 py-3.5 hover:bg-tl-subtle ${focusRing}`}>
                <span aria-hidden className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-tl-link" />
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold">{row.title}</span>
                  <span className="mt-[3px] block text-sm text-tl-muted">{row.message}</span>
                </span>
                <span className="whitespace-nowrap text-[13px] text-tl-faint">{relativeWhen(row.createdAt, now)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-1.5 flex items-start gap-3 border-t border-tl-line-soft py-3.5">
          <span aria-hidden className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-tl-control" />
          <div>
            <p className="text-base font-bold">Nothing new yet</p>
            <p className="mt-[3px] text-sm text-tl-muted">New files, results and messages land here first.</p>
          </div>
        </div>
      )}
    </section>
  );
}
