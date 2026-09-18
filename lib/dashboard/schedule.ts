import type { TimetableSubject } from "@/hooks/useTimetable";

/** Where a class sits relative to the current time. */
export type ScheduleStatus = "Completed" | "In Progress" | "Upcoming";

/** A timetable period on today's list, with its labels resolved. */
export type TodayClass = TimetableSubject & {
  status: ScheduleStatus;
  startLabel: string;
  endLabel: string;
};

/** The weekdays the timetable covers. */
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

/**
 * The time-of-day greeting.
 *
 * @param now - The moment to greet for; defaults to right now.
 * @returns "Good morning", "Good afternoon" or "Good evening".
 */
export function getGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Today's weekday name, matching the keys the timetable API uses.
 *
 * @param now - The day to name; defaults to today.
 * @returns e.g. "Tuesday".
 */
export function getTodayName(now: Date = new Date()): string {
  return now.toLocaleDateString("en-US", { weekday: "long" });
}

/**
 * Converts a "09:41 AM" (or "14:05") clock time to minutes past midnight.
 *
 * @param timeString - The clock time to read.
 * @returns Minutes past midnight, or 0 when unparseable.
 */
export function parseTimeToMinutes(timeString?: string): number {
  if (!timeString) return 0;
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toLowerCase();
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Zero-pads a clock time for display.
 *
 * @param timeString - The clock time to format.
 * @returns e.g. "09:41 AM", or "--:--" when there is nothing to show.
 */
export function formatTimeLabel(timeString?: string): string {
  if (!timeString) return "--:--";
  const trimmed = timeString.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return trimmed;
  return `${match[1].padStart(2, "0")}:${match[2]}${match[3] ? ` ${match[3].toUpperCase()}` : ""}`;
}

/**
 * Splits a "09:00 AM - 10:00 AM" range into its two formatted ends.
 *
 * @param timeString - The range to split.
 * @returns The start and end labels.
 */
export function splitTimeRange(timeString?: string): { start: string; end: string } {
  const [start, end] = (timeString ?? "").split(" - ");
  return { start: formatTimeLabel(start), end: formatTimeLabel(end) };
}

/**
 * Whether a period has finished, is running, or is still to come.
 *
 * @param item - The timetable period.
 * @param now - The moment to compare against; defaults to right now.
 * @returns The period's status.
 */
export function getScheduleStatus(item: TimetableSubject, now: Date = new Date()): ScheduleStatus {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = item.startTime ? parseTimeToMinutes(item.startTime) : Math.round((item.start || 0) * 60);
  const endMinutes = item.endTime ? parseTimeToMinutes(item.endTime) : Math.round((item.end || 0) * 60);

  if (currentMinutes > endMinutes) return "Completed";
  if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) return "In Progress";
  return "Upcoming";
}

/**
 * Today's classes in order, each with its status and labels.
 *
 * @param subjects - Every period on the timetable.
 * @param now - The moment to resolve "today" and statuses against.
 * @returns Today's periods, earliest first.
 */
export function toTodaySchedule(subjects: TimetableSubject[], now: Date = new Date()): TodayClass[] {
  const today = getTodayName(now);
  return subjects
    .filter((item) => item.day === today)
    .map((item) => {
      const labels = splitTimeRange(item.timeString);
      return { ...item, status: getScheduleStatus(item, now), startLabel: labels.start, endLabel: labels.end };
    })
    .sort((a, b) => a.start - b.start);
}

/**
 * How many classes fall on each weekday.
 *
 * @param subjects - Every period on the timetable.
 * @returns One entry per weekday, Monday first.
 */
export function toWeeklySummary(subjects: TimetableSubject[]): Array<{ day: string; shortDay: string; count: number }> {
  return DAYS.map((day) => ({
    day,
    shortDay: day.slice(0, 3),
    count: subjects.filter((item) => item.day === day).length,
  }));
}

/**
 * The name of a term, whichever shape the API returned it in.
 *
 * @param value - A term id, a populated term, or nothing.
 * @returns The term's name, or "Current Term".
 */
export function getTermName(value?: string | { name?: string } | null): string {
  if (!value) return "Current Term";
  if (typeof value === "string") return "Current Term";
  return value.name || "Current Term";
}

/**
 * The student's percentile in their class, when both figures are known.
 *
 * @param position - The student's rank, 1 being top.
 * @param total - How many students are in the class.
 * @returns The percentile, or `null` when it cannot be worked out.
 */
export function toPercentile(position: number | null | undefined, total: number | null | undefined): number | null {
  if (!position || !total) return null;
  return Math.max(1, Math.round(((total - position + 1) / total) * 100));
}
