import type { TimetableSubject } from "@/hooks/useTimetable";
import { ApiError } from "@/lib/apiError";
import { DAYS, parseTimeToMinutes } from "@/lib/dashboard/schedule";

/** One period on the weekly grid, in the shape the cards and table render. */
export interface TimetableEntry {
  /** Zero-padded range, e.g. "09:00 AM - 10:00 AM". */
  time: string;
  startTime?: string;
  endTime: string;
  course: string;
  subject: string;
  class: string;
}

/** The week's periods keyed by weekday name. */
export type TimetableByDay = Record<string, TimetableEntry[]>;

/** The rows of the desktop grid, in the 12-hour format the API uses. */
export const TIME_SLOTS = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
] as const;

/** A named slice of {@link TIME_SLOTS} the student can narrow the grid to. */
export interface TimeRange {
  id: string;
  label: string;
  /** Index of the first slot shown. */
  start: number;
  /** Index of the last slot shown (inclusive). */
  end: number;
}

/** The filters offered above the grid. */
export const TIME_RANGES: readonly TimeRange[] = [
  { id: "full", label: "Full Day (8:00 - 17:00)", start: 0, end: TIME_SLOTS.length - 1 },
  { id: "morning", label: "Morning (8:00 - 13:00)", start: 0, end: 4 },
  { id: "afternoon", label: "Afternoon (13:00 - 17:00)", start: 4, end: TIME_SLOTS.length - 1 },
];

/** Every student shares one class, so periods carry no per-student class name. */
const CLASS_LABEL = "Student Class";

/**
 * Groups the flat period list by weekday, earliest period first.
 *
 * @param subjects - Periods from `useTimetable`.
 * @returns Periods keyed by day; days with no periods are absent.
 */
export function groupSubjectsByDay(subjects: readonly TimetableSubject[]): TimetableByDay {
  const byDay: TimetableByDay = {};
  const ordered = [...subjects].sort((a, b) => a.start - b.start);

  for (const subject of ordered) {
    const [startTime, endTime = ""] = subject.timeString.split(" - ");
    (byDay[subject.day] ??= []).push({
      time: subject.timeString,
      startTime,
      endTime,
      course: subject.name,
      subject: subject.name,
      class: CLASS_LABEL,
    });
  }
  return byDay;
}

/**
 * The periods that belong in one row of the grid. A period belongs to a row
 * when its written range matches it, or when it starts inside the row — so a
 * 09:41 start still lands in the 09:00 row instead of vanishing from the grid.
 *
 * @param entries - One day's periods.
 * @param slot - A row label from {@link TIME_SLOTS}.
 * @returns Every matching period; empty when the row is free.
 */
export function entriesForSlot(entries: readonly TimetableEntry[], slot: string): TimetableEntry[] {
  const [slotStart, slotEnd = ""] = slot.split(" - ");
  const from = parseTimeToMinutes(slotStart);
  const to = parseTimeToMinutes(slotEnd);

  return entries.filter((entry) => {
    if (entry.time === slot || `${entry.startTime ?? ""} - ${entry.endTime}` === slot) return true;
    if (!entry.startTime) return false;
    const start = parseTimeToMinutes(entry.startTime);
    return start >= from && start < to;
  });
}

/**
 * Keeps the periods that fall in any of the given rows, in their original order.
 *
 * @param entries - One day's periods.
 * @param slots - The rows still on screen.
 * @returns The periods that show up in at least one of those rows.
 */
export function filterEntriesBySlots(entries: readonly TimetableEntry[], slots: readonly string[]): TimetableEntry[] {
  return entries.filter((entry) => slots.some((slot) => entriesForSlot([entry], slot).length > 0));
}

/**
 * How many periods the week holds.
 *
 * @param byDay - The grouped timetable.
 * @returns The total across all days.
 */
export function countClasses(byDay: TimetableByDay): number {
  return Object.values(byDay).reduce((total, entries) => total + entries.length, 0);
}

/**
 * Quotes one CSV field, doubling any quote inside it.
 *
 * @param value - The raw text.
 * @returns The field, safe to join with commas.
 */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * The timetable as CSV: one row per period, plus a "Free Period" row for each
 * empty slot, in the same order as the grid.
 *
 * @param byDay - The grouped timetable.
 * @param days - The days to include, in order.
 * @param slots - The rows to include, in order.
 * @returns The CSV text, header first, newline-terminated.
 */
export function buildTimetableCsv(
  byDay: TimetableByDay,
  days: readonly string[] = DAYS,
  slots: readonly string[] = TIME_SLOTS
): string {
  const lines = ["Day,Time Slot,Course,Subject,Class"];
  for (const day of days) {
    for (const slot of slots) {
      const entries = entriesForSlot(byDay[day] ?? [], slot);
      if (entries.length === 0) {
        lines.push([day, csvField(slot), csvField("Free Period"), csvField(""), csvField("")].join(","));
        continue;
      }
      for (const entry of entries) {
        lines.push(
          [day, csvField(slot), csvField(entry.course), csvField(entry.subject), csvField(entry.class)].join(",")
        );
      }
    }
  }
  return `${lines.join("\n")}\n`;
}

/**
 * Starts a browser download of a text file.
 *
 * @param filename - The name the file is saved as.
 * @param content - The file body.
 * @param mimeType - The content type of the file.
 */
export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** How a failed timetable load is presented. */
export type TimetableErrorKind = "network" | "server" | "unknown";

/**
 * Chooses the error presentation from `error.code`, never from message text.
 *
 * @param error - Whatever the timetable query threw.
 * @returns `network` when the device or route is unreachable, `server` when the
 * API failed, otherwise `unknown`.
 */
export function timetableErrorKind(error: unknown): TimetableErrorKind {
  if (!(error instanceof ApiError)) return "unknown";
  if (error.code === "NETWORK_OFFLINE" || error.code === "SERVICE_UNAVAILABLE" || error.code === "REQUEST_TIMEOUT") {
    return "network";
  }
  if (error.code === "INTERNAL_ERROR" || error.status >= 500) return "server";
  return "unknown";
}
