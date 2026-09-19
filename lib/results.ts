import type { PublishedCourse } from "@/services/grades.service";

/**
 * Tailwind classes for a grade-letter badge, light and dark.
 *
 * @param grade - The letter the API returned, e.g. "B+".
 * @returns Background and text classes; a neutral grey for an unknown grade.
 */
export function gradeBadgeClass(grade?: string | null): string {
  const g = (grade || "").toUpperCase();
  if (g === "A+" || g === "A") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (g === "B+" || g === "B") return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (g === "C+" || g === "C") return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  if (g === "D+" || g === "D") return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";
  if (g === "E") return "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300";
  if (g === "F") return "bg-red-200 text-red-800 dark:bg-red-900/60 dark:text-red-200";
  return "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300";
}

/**
 * The colour of a score bar. Bands follow the grade boundaries the school
 * uses: 80, 70, 60 and 45.
 *
 * @param pct - The score as a percentage.
 * @returns A Tailwind background class.
 */
export function progressColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 70) return "bg-blue-500";
  if (pct >= 60) return "bg-amber-400";
  if (pct >= 45) return "bg-orange-500";
  return "bg-red-500";
}

/**
 * Keeps a percentage inside what a bar can draw.
 *
 * @param pct - Any number the API sent.
 * @returns The value limited to 0-100; 0 for a non-number.
 */
export function clampPercent(pct: number): number {
  if (!Number.isFinite(pct)) return 0;
  return Math.min(100, Math.max(0, pct));
}

/**
 * Formats a percentage for display.
 *
 * @param value - The percentage, or nothing when there is no grade yet.
 * @param digits - Decimal places to keep.
 * @returns e.g. "72.5%", or "-" when there is no value.
 */
export function formatPercent(value: number | null | undefined, digits = 1): string {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(digits)}%` : "-";
}

/** The counts shown on the summary tiles. */
export interface CourseSummary {
  courseCount: number;
  coursesWithResults: number;
  publishedAssessments: number;
}

/**
 * Totals the class's courses for the summary tiles.
 *
 * @param courses - The courses the API returned for the term.
 * @returns How many courses there are, how many have a published result, and
 * how many results are published in all.
 */
export function summariseCourses(courses: readonly PublishedCourse[]): CourseSummary {
  return {
    courseCount: courses.length,
    coursesWithResults: courses.filter((course) => course.publishedAssessmentsCount > 0).length,
    publishedAssessments: courses.reduce((sum, course) => sum + course.publishedAssessmentsCount, 0),
  };
}

/**
 * Decides which course's results are open. The id must be one the API listed
 * for this student, so a stale or forged id can never reach a request: it falls
 * back to the first course.
 *
 * @param courses - The courses the API returned for the term.
 * @param requestedId - The course the student clicked, if any.
 * @returns The id to load, or `null` when the class has no courses.
 */
export function resolveSelectedCourseId(
  courses: readonly PublishedCourse[],
  requestedId: string | null
): string | null {
  if (requestedId && courses.some((course) => course._id === requestedId)) return requestedId;
  return courses[0]?._id ?? null;
}

/**
 * The "score/max = average" line for a course, once it has a grade record.
 *
 * @param course - A course from the term list.
 * @returns e.g. "45/60 = 75.0%", or `null` when no total exists yet.
 */
export function formatCourseTotal(course: Pick<PublishedCourse, "cumulativeScore" | "maxScore" | "currentAverage">): string | null {
  if (course.cumulativeScore == null || course.maxScore == null) return null;
  return `${course.cumulativeScore}/${course.maxScore} = ${formatPercent(course.currentAverage)}`;
}
