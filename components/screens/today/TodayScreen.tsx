"use client";

import React from "react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToday } from "@/hooks/learner/queries";
import { ScreenError, ScreenLoading } from "@/components/tl/states";
import { PageHeader } from "@/components/tl/bits";
import { card, cardTitle, textLink } from "@/components/tl/styles";
import { formatLongDate, formatPercent, greetingLine, ordinal } from "@/lib/learner/format";
import type { StudentToday } from "@/types/learner";
import { GlanceChart, GlanceTiles } from "./GlanceCard";
import { RestOfToday, UpNextCard } from "./LessonCards";
import { ComingUpCard, NewSinceCard } from "./FeedCards";
import { SchoolDayNotice } from "./SchoolDayNotice";

/** Props for {@link TodayView}. */
export interface TodayViewProps {
  /** B1's answer. */
  today: StudentToday;
  /** The student's first name, for the greeting. */
  firstName?: string | null;
}

/**
 * The Today screen's content for one B1 answer: greeting, the day's notice
 * (weekend, holiday, early close), the term at a glance, up next and the rest
 * of the day, coming up, and what is new since the last sign-in.
 *
 * @param props - See {@link TodayViewProps}.
 * @param props.today - The data.
 * @param props.firstName - The student's first name.
 * @returns The screen.
 */
export function TodayView({ today, firstName }: TodayViewProps) {
  const greeting = greetingLine(today.greeting, firstName);

  const subjectCount = today.subjectTotals.length;
  const termName = today.term?.name ? today.term.name.toLowerCase() : "this term";
  const average = today.glance.average;

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader
        title={greeting}
        subtitle={[formatLongDate(today.date), today.class?.name].filter(Boolean).join(" · ")}
        guide="today-header"
      />

      <SchoolDayNotice today={today} />

      <section aria-labelledby="glance-title" className={card} data-guide="today-glance" title="How you are doing this term, subject by subject">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="glance-title" className={cardTitle}>
              Your term at a glance
            </h2>
            <p className="mt-1 text-sm text-tl-muted">
              Scores across your {subjectCount} subject{subjectCount === 1 ? "" : "s"} · {termName}
            </p>
          </div>
          <Link href="/results" className={textLink} title="Open your full result sheet">
            Full result sheet →
          </Link>
        </div>
        <GlanceTiles today={today} />
        <GlanceChart totals={today.subjectTotals} passMark={today.passMark} />
        <p className="mt-3.5 text-[13px] text-tl-muted">
          Term average {formatPercent(average)} · pass mark {today.passMark}%
          {today.glance.position ? ` · ${ordinal(today.glance.position.rank)} of ${today.glance.position.of}` : ""}
        </p>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4" data-guide="today-lessons">
        <UpNextCard today={today} />
        <RestOfToday today={today} />
      </div>

      <ComingUpCard items={today.comingUp} />
      <NewSinceCard feed={today.feed} now={today.now} />
    </div>
  );
}

/**
 * The Today screen (`/dashboard`): one `GET /students/me/today` call (B1)
 * instead of the eight the old dashboard made.
 *
 * @returns The screen with its loading and error states.
 */
export default function TodayScreen() {
  const { user } = useAuthContext();
  const { data, isLoading, error, refetch } = useToday();

  if (isLoading) return <ScreenLoading label="Loading your day" blocks={4} />;
  if (error || !data) return <ScreenError message={error ?? "We couldn't load today. Please try again."} onRetry={refetch} />;
  return <TodayView today={data} firstName={user?.firstName} />;
}
