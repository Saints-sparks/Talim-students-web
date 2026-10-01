/**
 * Pure helpers for the Timetable screen (B2): the lesson lookup the grid reads
 * from, the morning / afternoon windows of the bell schedule, and the week's
 * labels. Nothing here touches React or the clock.
 */
import { formatDayMonth, formatWeekdayDay } from "@/lib/learner/format";
import type { Period, StudentLesson, StudentTimetable } from "@/types/learner";

/** The hours the grid can be narrowed to. */
export type HoursWindowId = "full" | "morning" | "afternoon";

/** One option of the "Narrow the hours shown" select. */
export interface HoursWindow {
  id: HoursWindowId;
  /** "Morning (8:00 – 12:00)". */
  label: string;
  /** The rows (periods, breaks included) the window shows. */
  periods: Period[];
}

/**
 * The lookup key of a grid cell.
 *
 * @param date - The day, `YYYY-MM-DD`.
 * @param periodKey - The period's key.
 * @returns `${date}|${periodKey}`.
 */
export function slotKey(date: string, periodKey: string): string {
  return `${date}|${periodKey}`;
}

/**
 * Indexes the week's lessons by day and period in one pass, so each grid cell
 * is a Map lookup. A lesson without a `periodKey` is placed by matching its
 * start time to a period; one that matches no period is left out.
 *
 * @param lessons - B2 `lessons`.
 * @param periods - B2 `periods`.
 * @returns The lessons of each `${date}|${periodKey}` (usually one).
 */
export function indexLessons(lessons: readonly StudentLesson[], periods: readonly Period[]): Map<string, StudentLesson[]> {
  const keyByStart = new Map<string, string>();
  for (const period of periods) {
    if (!keyByStart.has(period.startTime)) keyByStart.set(period.startTime, period.key);
  }
  const index = new Map<string, StudentLesson[]>();
  for (const lesson of lessons) {
    const periodKey = lesson.periodKey ?? keyByStart.get(lesson.startTime);
    if (!periodKey) continue;
    const key = slotKey(lesson.date, periodKey);
    const list = index.get(key);
    if (list) list.push(lesson);
    else index.set(key, [lesson]);
  }
  return index;
}

/**
 * A clock time without the hour's leading zero, as the design writes it in
 * sentences ("08:00" → "8:00", "13:30" stays).
 *
 * @param time - "HH:mm".
 * @returns The shorter time.
 */
export function shortClock(time: string): string {
  return time.replace(/^0(\d)/, "$1");
}

/**
 * The windows the hours filter offers: the full day, and when the schedule
 * has a break, the morning (the periods before the first break) and the
 * afternoon (the periods after it). Labels carry the real times.
 *
 * @param periods - B2 `periods`, in time order.
 * @returns "full" first, then "morning" and "afternoon" when they exist.
 */
export function hoursWindows(periods: readonly Period[]): HoursWindow[] {
  if (!periods.length) return [{ id: "full", label: "Full day", periods: [] }];
  const range = (rows: readonly Period[]) => `${shortClock(rows[0].startTime)} – ${shortClock(rows[rows.length - 1].endTime)}`;
  const windows: HoursWindow[] = [{ id: "full", label: `Full day (${range(periods)})`, periods: [...periods] }];
  const firstBreak = periods.findIndex((period) => period.isBreak);
  if (firstBreak < 0) return windows;
  const morning = periods.slice(0, firstBreak);
  const afternoon = periods.slice(firstBreak + 1);
  if (morning.length) windows.push({ id: "morning", label: `Morning (${range(morning)})`, periods: morning });
  if (afternoon.length) windows.push({ id: "afternoon", label: `Afternoon (${range(afternoon)})`, periods: afternoon });
  return windows;
}

/**
 * "Mon 14 Sep".
 *
 * @param day - `YYYY-MM-DD`.
 * @returns The weekday, the day and the short month.
 */
export function weekdayDayMonth(day: string): string {
  const [, month = ""] = formatDayMonth(day).split(" ");
  return `${formatWeekdayDay(day)} ${month}`.trim();
}

/**
 * The week's label: "Week 2 · Mon 14 Sep – Fri 18 Sep", or only the dates
 * when the week is outside the term.
 *
 * @param week - B2 `week`.
 * @returns The label.
 */
export function weekLabel(week: Pick<StudentTimetable["week"], "number" | "start" | "end">): string {
  const dates = `${weekdayDayMonth(week.start)} – ${weekdayDayMonth(week.end)}`;
  return week.number ? `Week ${week.number} · ${dates}` : dates;
}

/**
 * The line under the heading: "Your 12 subjects across the week, 8:00 to
 * 16:00. Set by your school."
 *
 * @param subjectCount - How many subjects the class takes.
 * @param periods - The bell schedule, in time order.
 * @returns The sentence.
 */
export function timetableSubtitle(subjectCount: number, periods: readonly Period[]): string {
  const subjects = `Your ${subjectCount} subject${subjectCount === 1 ? "" : "s"} across the week`;
  if (!periods.length) return `${subjects}. Set by your school.`;
  return `${subjects}, ${shortClock(periods[0].startTime)} to ${shortClock(periods[periods.length - 1].endTime)}. Set by your school.`;
}

/**
 * The teacher of each course this week, from the lessons (B2's `subjects`
 * carry no teacher), for the legend's hover text.
 *
 * @param lessons - B2 `lessons`.
 * @returns Course id → teacher name, first lesson wins.
 */
export function teachersByCourse(lessons: readonly StudentLesson[]): Map<string, string> {
  const teachers = new Map<string, string>();
  for (const lesson of lessons) {
    if (lesson.teacher && !teachers.has(lesson.course.id)) teachers.set(lesson.course.id, lesson.teacher.name);
  }
  return teachers;
}

/**
 * Reads a `?week=` value: a calendar day, or nothing.
 *
 * @param value - The raw search parameter.
 * @returns The day, or undefined for the current week.
 */
export function parseWeekParam(value: string | null | undefined): string | undefined {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}
