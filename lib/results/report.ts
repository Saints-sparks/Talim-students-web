/**
 * Pure helpers for the Results screen (B5 report card): the column totals,
 * the class-average comparison, the position movement note and the bits of
 * copy built from the answer. The columns, their maximum scores, the scale
 * and the pass mark always come from the API.
 */
import { formatPercent } from "@/lib/learner/format";
import type { Position, ReportCard } from "@/types/learner";

/**
 * The most a subject's total can be: the sum of the columns' maximum scores
 * (100 for 20 + 20 + 60, but whatever the school set).
 *
 * @param columns - B5 `columns`.
 * @returns Σ maxScore.
 */
export function maxTotal(columns: ReadonlyArray<{ maxScore: number }>): number {
  return columns.reduce((sum, column) => sum + column.maxScore, 0);
}

/**
 * Rounds to one decimal place.
 *
 * @param value - Any number.
 * @returns The number to 1 decimal.
 */
function oneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * How a subject's percent compares with the class average, as the sentence
 * under the subject's scores: "Class average is 72% — you are 12% above it.",
 * "… below it.", or "You are level with the class average (70%).". The
 * difference is |percent − classAverage| to one decimal.
 *
 * @param percent - The student's percent in the subject, or null.
 * @param classAverage - The class average percent, or null.
 * @returns The sentence, or null when either number is missing.
 */
export function compareWithAverage(percent: number | null | undefined, classAverage: number | null | undefined): string | null {
  if (percent === null || percent === undefined || classAverage === null || classAverage === undefined) return null;
  if (Number.isNaN(percent) || Number.isNaN(classAverage)) return null;
  const diff = oneDecimal(Math.abs(percent - classAverage));
  const average = formatPercent(classAverage);
  if (diff === 0) return `You are level with the class average (${average}).`;
  return `Class average is ${average} — you are ${diff}% ${percent > classAverage ? "above" : "below"} it.`;
}

/**
 * The note under the class position: how it moved since the last ranked term.
 *
 * @param position - This term's position, or null.
 * @param previous - The previous term's position, or null.
 * @returns "Up 2 places from last term", "Down 1 place from last term", "Same
 *   place as last term", "First ranked term", or "Not ranked yet".
 */
export function movementNote(position: Position | null | undefined, previous: Position | null | undefined): string {
  if (!position) return "Not ranked yet";
  if (!previous) return "First ranked term";
  const moved = previous.rank - position.rank;
  if (moved === 0) return "Same place as last term";
  const places = Math.abs(moved);
  return `${moved > 0 ? "Up" : "Down"} ${places} place${places === 1 ? "" : "s"} from last term`;
}

/**
 * The initials in the school's badge when it has no logo: the first letters
 * of up to three words ("Easy Sparks Education Center" → "ESE").
 *
 * @param name - The school's name.
 * @returns Up to three capitals.
 */
export function schoolInitials(name: string | null | undefined): string {
  const letters = String(name ?? "")
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join("");
  return letters || "?";
}

/**
 * The line under the Results heading: "First term, 2026/2027 session."
 *
 * @param card - B5's answer.
 * @returns The sentence.
 */
export function resultsSubtitle(card: Pick<ReportCard, "term" | "session">): string {
  const session = card.session ?? card.term.session;
  return session ? `${card.term.name}, ${session} session.` : `${card.term.name}.`;
}

/**
 * The school's contact line on the report card: "address · phone · email",
 * leaving out what is missing.
 *
 * @param school - B5 `school`.
 * @returns The line, or an empty string.
 */
export function schoolContactLine(school: Pick<ReportCard["school"], "address" | "phone" | "email">): string {
  return [school.address, school.phone, school.email].filter(Boolean).join(" · ");
}
