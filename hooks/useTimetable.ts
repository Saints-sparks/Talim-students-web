// hooks/useTimetable.ts
"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { timetableService } from "@/services/timetable.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";
import type { Timetable, TimetableEntry } from "@/types/auth";

/** One period on the student's timetable, ready to position on a grid. */
export interface TimetableSubject {
  name: string;
  day: string;
  /** Decimal hours, e.g. 9.68 for 09:41. */
  start: number;
  /** Decimal hours, e.g. 10.63 for 10:38. */
  end: number;
  /** Formatted range, e.g. "09:41 AM - 10:38 AM". */
  timeString: string;
  className?: string;
  teacherName?: string;
  course?: string;
  subject?: string;
  startTime?: string;
  endTime?: string;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

/**
 * Converts a "09:41 AM" clock time into decimal hours.
 *
 * @param time - The clock time as the API formats it.
 * @returns Hours as a decimal, or 0 when the string is unparseable.
 */
export function parseTimeToDecimal(time: string): number {
  const match = time?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (match[3].toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (match[3].toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours + minutes / 60;
}

/**
 * Zero-pads a clock time so periods line up in the UI.
 *
 * @param time - The clock time as the API formats it.
 * @returns The padded time, or the input when it is unparseable.
 */
export function formatTime(time: string): string {
  const match = time?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time;
  return `${match[1].padStart(2, "0")}:${match[2]} ${match[3]}`;
}

/**
 * Flattens the API's weekday-keyed timetable into a positionable list.
 *
 * @param timetable - The payload from `/timetable/class/:classId`.
 * @returns One entry per period, Monday to Friday.
 */
export function toTimetableSubjects(timetable: Timetable | null | undefined): TimetableSubject[] {
  if (!timetable) return [];
  const subjects: TimetableSubject[] = [];

  for (const day of WEEKDAYS) {
    const entries = (timetable[day] ?? []) as Array<TimetableEntry & { teacherName?: string }>;
    for (const entry of entries) {
      subjects.push({
        name: entry.subject,
        day,
        start: parseTimeToDecimal(entry.startTIme),
        end: parseTimeToDecimal(entry.endTime),
        timeString: `${formatTime(entry.startTIme)} - ${formatTime(entry.endTime)}`,
        className: entry.class,
        teacherName: entry.teacherName,
        course: entry.course,
        subject: entry.subject,
        startTime: entry.startTIme,
        endTime: entry.endTime,
      });
    }
  }

  return subjects;
}

/**
 * The signed-in student's weekly timetable.
 *
 * @returns The periods with their query state.
 */
export const useTimetable = () => {
  const { classId, isReady } = useStudentIdentity();

  const query = useQuery({
    queryKey: queryKeys.timetable.byClass(classId ?? "unknown"),
    enabled: Boolean(isReady && classId),
    staleTime: staleTimes.reference,
    queryFn: () => timetableService.getTimetableByClass(classId as string),
  });

  const subjects = useMemo(() => toTimetableSubjects(query.data), [query.data]);

  return {
    subjects,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load your timetable.") : null,
    refetch: () => {
      void query.refetch();
    },
  };
};
