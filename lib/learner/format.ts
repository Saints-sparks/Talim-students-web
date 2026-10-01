/**
 * Formatting for the learner screens. Dates from the API come as school-local
 * calendar days (`YYYY-MM-DD`) or ISO instants; calendar days are formatted in
 * UTC so they never shift a day in the viewer's timezone. Month and weekday
 * names are spelled out here rather than taken from Intl, whose short month
 * ("Sept") differs between ICU versions.
 */
import type { Greeting, Position } from "@/types/learner";

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * A calendar day or an instant as a `Date`. Calendar days become UTC midnight.
 *
 * @param value - `YYYY-MM-DD` or an ISO instant.
 * @returns The date, or null when it cannot be read.
 */
export function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = DAY_RE.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * The calendar day of an instant or day string, as `YYYY-MM-DD` (UTC).
 *
 * @param value - A day or an instant.
 * @returns The day, or an empty string.
 */
export function dayKey(value: string | null | undefined): string {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

/**
 * "Monday, 14 September 2026".
 *
 * @param value - A day or an instant.
 * @returns The text, or an empty string.
 */
export function formatLongDate(value: string | null | undefined): string {
  const date = toDate(value);
  return date ? `${WEEKDAYS[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}` : "";
}

/**
 * "Mon, 14 Sep 2026" (the top bar).
 *
 * @param value - A day or an instant.
 * @returns The text, or an empty string.
 */
export function formatShortDate(value: string | null | undefined): string {
  const date = toDate(value);
  return date ? `${WEEKDAYS_SHORT[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCFullYear()}` : "";
}

/**
 * "14 Sep".
 *
 * @param value - A day or an instant.
 * @returns The text, or an empty string.
 */
export function formatDayMonth(value: string | null | undefined): string {
  const date = toDate(value);
  return date ? `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]}` : "";
}

/**
 * "14 Sep 2026".
 *
 * @param value - A day or an instant.
 * @returns The text, or an empty string.
 */
export function formatDate(value: string | null | undefined): string {
  const date = toDate(value);
  return date ? `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCFullYear()}` : "";
}

/**
 * "14 September 2026" (the report card's issue date).
 *
 * @param value - A day or an instant.
 * @returns The text, or an empty string.
 */
export function formatLongDayMonthYear(value: string | null | undefined): string {
  const date = toDate(value);
  return date ? `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}` : "";
}

/**
 * The month badge of a "Coming up" row: "SEP" and "17".
 *
 * @param value - A day.
 * @returns The upper-case month and the day of the month.
 */
export function monthDayParts(value: string): { month: string; day: string } {
  const date = toDate(value);
  if (!date) return { month: "", day: "" };
  return { month: MONTHS_SHORT[date.getUTCMonth()].toUpperCase(), day: String(date.getUTCDate()).padStart(2, "0") };
}

/**
 * "Mon 14" (timetable column heads).
 *
 * @param value - A day.
 * @returns The text.
 */
export function formatWeekdayDay(value: string): string {
  const date = toDate(value);
  return date ? `${WEEKDAYS_SHORT[date.getUTCDay()]} ${date.getUTCDate()}` : "";
}

/**
 * "Monday".
 *
 * @param value - A day.
 * @returns The weekday's name.
 */
export function formatWeekday(value: string): string {
  const date = toDate(value);
  return date ? WEEKDAYS[date.getUTCDay()] : "";
}

/**
 * Adds whole days to a calendar day.
 *
 * @param day - `YYYY-MM-DD`.
 * @param days - How many days to add (negative to go back).
 * @returns The new day, `YYYY-MM-DD`.
 */
export function addDays(day: string, days: number): string {
  const date = toDate(day);
  if (!date) return day;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * "08:00 – 09:00".
 *
 * @param start - "HH:mm".
 * @param end - "HH:mm".
 * @returns The range.
 */
export function formatTimeRange(start: string, end: string): string {
  return `${start} – ${end}`;
}

/**
 * English ordinal: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st…
 *
 * @param value - A positive whole number.
 * @returns The ordinal.
 */
export function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

/**
 * "5th of 28", or a dash when the student is not ranked.
 *
 * @param position - The rank and the class size.
 * @returns The text.
 */
export function positionText(position: Position | null | undefined): string {
  return position ? `${ordinal(position.rank)} of ${position.of}` : "—";
}

/**
 * A percentage to one decimal at most ("71.5%", "70%"), or a dash.
 *
 * @param value - The percentage, or null.
 * @returns The text.
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${Math.round(value * 10) / 10}%`;
}

/**
 * A score out of its maximum ("15", or a dash when not published).
 *
 * @param value - The score, or null.
 * @returns The text.
 */
export function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return String(Math.round(value * 10) / 10);
}

const GREETING_TEXT: Record<Greeting, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
};

/**
 * "Good afternoon, Musa", from the API's greeting.
 *
 * @param greeting - The part of the day the API said it is at the school.
 * @param firstName - The student's first name, when known.
 * @returns The greeting line.
 */
export function greetingLine(greeting: Greeting, firstName?: string | null): string {
  const base = GREETING_TEXT[greeting] ?? "Hello";
  return firstName ? `${base}, ${firstName}` : base;
}

/**
 * The tag on a "Coming up" row from how many days away it is: "Today",
 * "Tomorrow", "In 3 days", "Next week", "2 weeks", "3 weeks".
 *
 * @param daysAway - Whole days from today (0 is today).
 * @returns The tag text.
 */
export function daysAwayLabel(daysAway: number): string {
  if (daysAway <= 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  if (daysAway < 7) return `In ${daysAway} days`;
  if (daysAway < 14) return "Next week";
  return `${Math.floor(daysAway / 7)} weeks`;
}

/**
 * When a notification arrived, relative to the school's "now": "Today",
 * "Yesterday", a weekday within the week, else "12 Sep".
 *
 * @param value - The instant it was created.
 * @param now - The reference instant (the API's `now`, else the clock).
 * @returns The short text.
 */
export function relativeWhen(value: string, now: string | Date = new Date()): string {
  const date = toDate(value);
  const reference = typeof now === "string" ? toDate(now) : now;
  if (!date || !reference) return "";
  const startOf = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const diffDays = Math.round((startOf(reference) - startOf(date)) / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return WEEKDAYS_SHORT[date.getUTCDay()];
  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]}`;
}

/**
 * A file size: "820 KB", "1.2 MB".
 *
 * @param bytes - The size, or null when unknown.
 * @returns The text, or an empty string.
 */
export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
}

/**
 * The initials of a name ("Musa Adele" → "MA").
 *
 * @param name - A person's or group's name.
 * @returns Up to two capitals.
 */
export function initialsOf(name: string | null | undefined): string {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
