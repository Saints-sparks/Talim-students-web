"use client";

import React, { useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fieldControl, ghostButton, rowButton } from "@/components/tl/styles";
import { weekLabel, type HoursWindow, type HoursWindowId } from "@/lib/timetable-week/grid";
import type { StudentTimetable, TimetableDay } from "@/types/learner";

/** Props for {@link WeekNav}. */
export interface WeekNavProps {
  /** B2 `week`. */
  week: StudentTimetable["week"];
  /** True while another week loads over this one. */
  busy?: boolean;
  /** Called with the Monday to show, or null for this week. */
  onWeekChange: (weekStart: string | null) => void;
}

/**
 * Previous week / This week / Next week, and the week being shown ("Week 2 ·
 * Mon 14 Sep – Fri 18 Sep"), read out when it changes. "This week" is
 * pressed (and does nothing) while the current week is on screen.
 *
 * @param props - See {@link WeekNavProps}.
 * @param props.week - The week on screen.
 * @param props.busy - Whether the next week is loading.
 * @param props.onWeekChange - Changes the week.
 * @returns The week controls.
 */
export function WeekNav({ week, busy, onWeekChange }: WeekNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5" data-guide="timetable-week-nav" data-print-hide="1">
      <div role="group" aria-label="Choose the week" className="flex flex-wrap items-center gap-2">
        <button type="button" className={rowButton} onClick={() => onWeekChange(week.prevStart)} title="Show the week before">
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
          Previous week
        </button>
        <button
          type="button"
          className={rowButton}
          aria-pressed={week.isCurrent}
          disabled={week.isCurrent}
          onClick={() => onWeekChange(null)}
          title="Back to the current week"
        >
          This week
        </button>
        <button type="button" className={rowButton} onClick={() => onWeekChange(week.nextStart)} title="Show the week after">
          Next week
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
        </button>
      </div>
      <p className="text-[15px] font-bold text-tl-ink" aria-live="polite" aria-atomic="true">
        {weekLabel(week)}
        {busy ? <span className="ml-2 text-sm font-semibold text-tl-muted">Loading…</span> : null}
      </p>
    </div>
  );
}

/** Props for {@link WeekFilters}. */
export interface WeekFiltersProps {
  /** The week's days, for the day select. */
  days: TimetableDay[];
  /** The chosen day's name ("Monday"), or "all". */
  day: string;
  /** Called with the new day's name, or "all". */
  onDayChange: (day: string) => void;
  /** The hours windows the schedule allows. */
  windows: HoursWindow[];
  /** The chosen window. */
  hours: HoursWindowId;
  /** Called with the new window. */
  onHoursChange: (hours: HoursWindowId) => void;
}

/**
 * "Show one day only", "Narrow the hours shown" and Export (print or save
 * the week as a PDF). Hidden when printing.
 *
 * @param props - See {@link WeekFiltersProps}.
 * @param props.days - The days to offer.
 * @param props.day - The chosen day.
 * @param props.onDayChange - Changes the day.
 * @param props.windows - The hours to offer.
 * @param props.hours - The chosen hours.
 * @param props.onHoursChange - Changes the hours.
 * @returns The toolbar.
 */
export function WeekFilters({ days, day, onDayChange, windows, hours, onHoursChange }: WeekFiltersProps) {
  const dayId = useId();
  const hoursId = useId();
  return (
    <div className="flex flex-wrap items-center gap-2.5" data-guide="timetable-filters" data-print-hide="1">
      <label htmlFor={dayId} className="sr-only">
        Show one day only
      </label>
      <select id={dayId} title="Show one day only" value={day} onChange={(event) => onDayChange(event.target.value)} className={`${fieldControl} w-auto`}>
        <option value="all">All days</option>
        {days.map((d) => (
          <option key={d.date} value={d.day}>
            {d.day}
          </option>
        ))}
      </select>
      <label htmlFor={hoursId} className="sr-only">
        Narrow the hours shown
      </label>
      <select
        id={hoursId}
        title="Narrow the hours shown"
        value={hours}
        onChange={(event) => onHoursChange(event.target.value as HoursWindowId)}
        className={`${fieldControl} w-auto`}
      >
        {windows.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="flex-1" />
      <button type="button" className={ghostButton} title="Save the week as a PDF" onClick={() => window.print()}>
        Export<span className="sr-only"> the week as a PDF</span>
      </button>
    </div>
  );
}
