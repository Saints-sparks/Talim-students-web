"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWeekTimetable } from "@/hooks/learner/queries";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { ScreenError, ScreenLoading, EmptyNote } from "@/components/tl/states";
import { PageHeader, SubjectDot } from "@/components/tl/bits";
import { cardFrame, card, primaryButton } from "@/components/tl/styles";
import { hrefWithParam } from "@/lib/results/url";
import {
  hoursWindows,
  indexLessons,
  parseWeekParam,
  teachersByCourse,
  timetableSubtitle,
  weekLabel,
  type HoursWindowId,
} from "@/lib/timetable-week/grid";
import type { StudentTimetable } from "@/types/learner";
import { WeekGrid } from "./WeekGrid";
import { WeekFilters, WeekNav } from "./WeekToolbar";

/** Props for {@link TimetableView}. */
export interface TimetableViewProps {
  /** B2's answer for the week on screen. */
  timetable: StudentTimetable;
  /** True while another week loads over this one. */
  busy?: boolean;
  /** Called with the Monday to show, or null for this week. */
  onWeekChange: (weekStart: string | null) => void;
}

/**
 * The subject chips under the grid: a dot and the short name, with the full
 * name and the teacher on hover.
 *
 * @param props - Component props.
 * @param props.timetable - B2's answer.
 * @returns The legend.
 */
function SubjectLegend({ timetable }: { timetable: StudentTimetable }) {
  const teachers = useMemo(() => teachersByCourse(timetable.lessons), [timetable.lessons]);
  return (
    <div className="flex flex-col gap-2.5" data-guide="timetable-legend">
      <ul aria-label="Subjects" className="flex flex-wrap items-center gap-2">
        {timetable.subjects.map((subject) => {
          const teacher = teachers.get(subject.courseId);
          return (
            <li
              key={subject.courseId}
              title={teacher ? `${subject.title} · ${teacher}` : subject.title}
              className="flex items-center gap-[7px] rounded-full border border-tl-line bg-tl-surface px-3 py-[7px] text-[13px] font-bold text-tl-body"
            >
              <SubjectDot toneKey={subject.colourKey} />
              {subject.short || subject.title}
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-tl-muted" data-print-hide="1">
        Changes made by your school show up here automatically.
      </p>
    </div>
  );
}

/**
 * A week without lessons (outside the term, or nothing set yet), with a way
 * back to the current week.
 *
 * @param props - Component props.
 * @param props.timetable - B2's answer.
 * @param props.onWeekChange - Changes the week.
 * @returns The card.
 */
function EmptyWeek({ timetable, onWeekChange }: Pick<TimetableViewProps, "timetable" | "onWeekChange">) {
  const { week } = timetable;
  const reason = !week.inTerm
    ? "This week is outside the term, so there is nothing on your timetable."
    : "Your school hasn't put any lessons on this week.";
  return (
    <section className={card} aria-label="Lessons" data-guide="timetable-grid">
      <EmptyNote
        title="No lessons this week"
        action={
          week.isCurrent ? null : (
            <button type="button" className={primaryButton} onClick={() => onWeekChange(null)}>
              Back to this week
            </button>
          )
        }
      >
        {reason}
      </EmptyNote>
    </section>
  );
}

/**
 * The Timetable screen's content for one B2 week: heading, week controls,
 * the day and hours filters, the grid and the subject legend.
 *
 * @param props - See {@link TimetableViewProps}.
 * @param props.timetable - The week.
 * @param props.busy - Whether another week is loading.
 * @param props.onWeekChange - Changes the week.
 * @returns The screen.
 */
export function TimetableView({ timetable, busy = false, onWeekChange }: TimetableViewProps) {
  const [day, setDay] = useState("all");
  const [hours, setHours] = useState<HoursWindowId>("full");

  const lessonIndex = useMemo(() => indexLessons(timetable.lessons, timetable.periods), [timetable.lessons, timetable.periods]);
  const windows = useMemo(() => hoursWindows(timetable.periods), [timetable.periods]);
  const shownWindow = windows.find((w) => w.id === hours) ?? windows[0];
  const shownDays = useMemo(() => {
    const only = timetable.days.filter((d) => d.day === day);
    return only.length ? only : timetable.days;
  }, [timetable.days, day]);
  const dayValue = timetable.days.some((d) => d.day === day) ? day : "all";
  // The API's week runs Monday to Sunday; the label ends on the last school day shown.
  const lastDay = timetable.days[timetable.days.length - 1]?.date;
  const week = useMemo(() => ({ ...timetable.week, end: lastDay ?? timetable.week.end }), [timetable.week, lastDay]);
  const label = weekLabel(week);
  const hasLessons = timetable.lessons.length > 0;

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader title="Timetable" subtitle={timetableSubtitle(timetable.subjects.length, timetable.periods)} guide="timetable-header" />
      <p className="hidden text-[15px] font-bold print:block">{label}</p>

      <WeekNav week={week} busy={busy} onWeekChange={onWeekChange} />

      {hasLessons ? (
        <>
          <WeekFilters
            days={timetable.days}
            day={dayValue}
            onDayChange={setDay}
            windows={windows}
            hours={shownWindow.id}
            onHoursChange={setHours}
          />
          <section
            aria-label={`Lessons, ${label}`}
            aria-busy={busy}
            data-guide="timetable-grid"
            className={`${cardFrame} overflow-x-auto transition-opacity print:overflow-visible ${busy ? "opacity-60" : ""}`}
          >
            <WeekGrid days={shownDays} periods={shownWindow.periods} lessons={lessonIndex} caption={`Your timetable, ${label}`} />
          </section>
          <SubjectLegend timetable={timetable} />
        </>
      ) : (
        <div aria-busy={busy} className={busy ? "opacity-60" : ""}>
          <EmptyWeek timetable={timetable} onWeekChange={onWeekChange} />
        </div>
      )}
    </div>
  );
}

/**
 * The Timetable screen (`/timetable`): one B2 call per week. The week lives
 * in the address (`?week=YYYY-MM-DD`); the week on screen stays while the
 * next one loads. Viewing a week with lessons ticks the "view your
 * timetable" onboarding step. Uses `useSearchParams`, so its page wraps it in
 * Suspense.
 *
 * @returns The screen with its loading and error states.
 */
export default function TimetableScreen() {
  const router = useRouter();
  const pathname = usePathname() || "/timetable";
  const searchParams = useSearchParams();
  const weekParam = parseWeekParam(searchParams?.get("week"));
  const { data, isLoading, isFetching, error, refetch } = useWeekTimetable(weekParam);
  const { markStepComplete } = useStudentOnboarding();

  const hasLessons = Boolean(data?.lessons.length);
  useEffect(() => {
    if (hasLessons) markStepComplete("view-timetable");
  }, [hasLessons, markStepComplete]);

  const onWeekChange = useCallback(
    (weekStart: string | null) => router.replace(hrefWithParam(pathname, searchParams, "week", weekStart), { scroll: false }),
    [router, pathname, searchParams]
  );

  if (isLoading) return <ScreenLoading label="Loading your timetable" blocks={3} />;
  if (error || !data) return <ScreenError message={error ?? "We couldn't load your timetable. Please try again."} onRetry={refetch} />;
  return <TimetableView timetable={data} busy={isFetching} onWeekChange={onWeekChange} />;
}
