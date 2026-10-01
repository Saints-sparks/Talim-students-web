"use client";

import React from "react";
import Link from "next/link";
import { focusRing } from "@/components/tl/styles";
import { formatTimeRange, formatWeekday, formatWeekdayDay } from "@/lib/learner/format";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import { shortClock, slotKey } from "@/lib/timetable-week/grid";
import type { Period, StudentLesson, TimetableDay } from "@/types/learner";

/** Props for {@link WeekGrid}. */
export interface WeekGridProps {
  /** The days to show as columns (already filtered). */
  days: TimetableDay[];
  /** The periods to show as rows (already narrowed). */
  periods: Period[];
  /** The week's lessons by `${date}|${periodKey}` (see `indexLessons`). */
  lessons: Map<string, StudentLesson[]>;
  /** What the table is, for screen readers ("Week 2 · Mon 14 Sep – Fri 18 Sep"). */
  caption: string;
}

/**
 * The hover text of a lesson: "Advance Maths · Mr Seyi Tinubu · Monday 08:00 – 09:00".
 *
 * @param lesson - The lesson.
 * @returns The text.
 */
export function lessonTip(lesson: StudentLesson): string {
  const when = `${lesson.day || formatWeekday(lesson.date)} ${formatTimeRange(lesson.startTime, lesson.endTime)}`;
  const parts = [lesson.course.title, lesson.teacher?.name, when];
  if (lesson.cancelled) parts.push(`Cancelled: ${lesson.cancelled.reason}`);
  return parts.filter(Boolean).join(" · ");
}

/**
 * One lesson in a cell: the subject's short name and the teacher on the
 * subject's tint with a 4px edge in its colour, linking to the subject. A
 * cancelled lesson is greyed and struck through, with the reason.
 *
 * @param props - Component props.
 * @param props.lesson - The lesson.
 * @returns The link.
 */
function LessonLink({ lesson }: { lesson: StudentLesson }) {
  const cancelled = Boolean(lesson.cancelled);
  const tone = cancelled ? "border-tl-control bg-tl-subtle" : "border-subj-solid bg-subj-tint";
  return (
    <Link
      href={`/subjects/${encodeURIComponent(lesson.course.id)}`}
      title={lessonTip(lesson)}
      className={`${subjectToneClass(lesson.course.id)} flex min-h-[74px] flex-col justify-center gap-1 rounded-[13px] border-l-4 p-3 transition-[filter] hover:brightness-[0.97] ${tone} ${focusRing}`}
    >
      <span className={`text-[15px] font-extrabold leading-tight ${cancelled ? "text-tl-faint line-through" : "text-subj-ink"}`}>{lesson.courseShort || lesson.course.title}</span>
      {lesson.teacher ? <span className={`text-xs leading-snug ${cancelled ? "text-tl-faint" : "text-subj-ink"}`}>{lesson.teacher.name}</span> : null}
      {lesson.cancelled ? <span className="text-xs font-bold text-tl-danger">Cancelled · {lesson.cancelled.reason}</span> : null}
    </Link>
  );
}

/**
 * One body cell: the lessons in that slot, a striped "Break", a note that the
 * school has closed early, or an empty slot.
 *
 * @param props - Component props.
 * @param props.day - The column's day.
 * @param props.period - The row's period.
 * @param props.lessons - The lessons in this slot.
 * @returns The cell.
 */
function SlotCell({ day, period, lessons }: { day: TimetableDay; period: Period; lessons: StudentLesson[] | undefined }) {
  const tint = day.isToday ? "bg-tl-select/40" : "";
  if (period.isBreak) {
    return (
      <td className={`p-[5px] align-top ${tint}`}>
        <div className="tl-break-stripes flex min-h-[74px] items-center justify-center rounded-[13px] p-3" title="Lunch and free play">
          <span className="text-[13px] font-extrabold uppercase tracking-[0.05em] text-tl-faint">Break</span>
        </div>
      </td>
    );
  }
  if (lessons?.length) {
    return (
      <td className={`p-[5px] align-top ${tint}`}>
        <div className="flex flex-col gap-1.5">
          {lessons.map((lesson) => (
            <LessonLink key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </td>
    );
  }
  const closed = Boolean(day.endsEarlyAt && period.startTime >= day.endsEarlyAt);
  return (
    <td className={`p-[5px] align-top ${tint}`}>
      <div className="flex min-h-[74px] items-center justify-center rounded-[13px] border border-dashed border-tl-line p-3 text-[13px] text-tl-faint">
        {closed ? "School closed" : <span className="sr-only">No lesson</span>}
      </div>
    </td>
  );
}

/**
 * The column heading of a day: "Mon 14", with "Today", the holiday or the
 * early close under it.
 *
 * @param props - Component props.
 * @param props.day - The day.
 * @returns The header cell.
 */
function DayHeader({ day }: { day: TimetableDay }) {
  return (
    <th scope="col" className={`px-3 py-3.5 text-left align-bottom text-[15px] font-extrabold text-tl-ink ${day.isToday ? "bg-tl-select/40" : ""}`}>
      <span className="flex flex-wrap items-center gap-2">
        {formatWeekdayDay(day.date)}
        {day.isToday ? <span className="rounded-full bg-tl-select px-2 py-0.5 text-xs font-extrabold text-tl-brand">Today</span> : null}
      </span>
      {day.endsEarlyAt ? <span className="mt-0.5 block text-xs font-bold text-tl-warning">School ends at {shortClock(day.endsEarlyAt)}</span> : null}
      {day.events.length ? <span className="mt-0.5 block text-xs font-semibold text-tl-muted">{day.events.map((event) => event.title).join(" · ")}</span> : null}
    </th>
  );
}

/**
 * The week as a real table: one column per day (today tinted), one row per
 * period with its times, the break striped, and a holiday written once down
 * its whole column instead of cells. Scrolls sideways on narrow screens and
 * prints flat.
 *
 * @param props - See {@link WeekGridProps}.
 * @param props.days - The columns.
 * @param props.periods - The rows.
 * @param props.lessons - The lesson index.
 * @param props.caption - The table's caption.
 * @returns The table.
 */
export function WeekGrid({ days, periods, lessons, caption }: WeekGridProps) {
  return (
    <table className="w-full min-w-[1000px] table-fixed border-collapse print:min-w-0">
      <caption className="sr-only">{caption}</caption>
      <colgroup>
        <col className="w-[112px]" />
        {days.map((day) => (
          <col key={day.date} />
        ))}
      </colgroup>
      <thead>
        <tr className="border-b border-tl-line-soft">
          <th scope="col" className="px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-[0.05em] text-tl-faint">
            Time
          </th>
          {days.map((day) => (
            <DayHeader key={day.date} day={day} />
          ))}
        </tr>
      </thead>
      <tbody>
        {periods.map((period, rowIndex) => (
          <tr key={period.key}>
            <th scope="row" className="px-4 py-3.5 text-left align-top text-[13px] font-bold text-tl-muted">
              {formatTimeRange(period.startTime, period.endTime)}
              <span className="sr-only">, {period.label}</span>
            </th>
            {days.map((day) => {
              if (day.holiday) {
                if (rowIndex > 0) return null;
                return (
                  <td key={day.date} rowSpan={periods.length} className="p-[5px] align-middle">
                    <div className="flex h-full min-h-[200px] items-center justify-center rounded-[13px] bg-tl-subtle p-4 text-center">
                      <p className="text-[15px] font-extrabold text-tl-ink">{day.holiday.title} — no school</p>
                    </div>
                  </td>
                );
              }
              return <SlotCell key={day.date} day={day} period={period} lessons={lessons.get(slotKey(day.date, period.key))} />;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
