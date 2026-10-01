/**
 * Grade-scale helpers. The scale and the pass mark always come from the API
 * (`scale`, `passMark` on B1/B3/B5); nothing here assumes 70/60/50 or a fixed
 * set of letters.
 */
import type { GradeBand } from "@/types/learner";

/** The colour a grade is drawn in. */
export type GradeTone = "success" | "info" | "warning" | "danger" | "muted";

/**
 * Sorts a scale highest band first (the API already does; this keeps a
 * hand-edited fixture or an unsorted answer safe).
 *
 * @param scale - The school's bands.
 * @returns A new array, highest `min` first.
 */
export function sortScale(scale: readonly GradeBand[]): GradeBand[] {
  return [...scale].sort((a, b) => b.min - a.min);
}

/**
 * The band a percentage falls in.
 *
 * @param percent - The percentage, or null.
 * @param scale - The school's bands.
 * @returns The band, or null for a null percentage or an empty scale.
 */
export function bandFor(percent: number | null | undefined, scale: readonly GradeBand[]): GradeBand | null {
  if (percent === null || percent === undefined || Number.isNaN(percent)) return null;
  for (const band of sortScale(scale)) {
    if (percent >= band.min) return band;
  }
  return null;
}

/**
 * The colour of a letter: the top band green, the next blue, then amber, and
 * anything under the pass mark red. Works for any number of bands.
 *
 * @param letter - The letter the API gave, or null.
 * @param scale - The school's bands.
 * @param passMark - The pass mark, in percent.
 * @returns The tone.
 */
export function gradeTone(letter: string | null | undefined, scale: readonly GradeBand[], passMark: number): GradeTone {
  if (!letter) return "muted";
  const sorted = sortScale(scale);
  const index = sorted.findIndex((band) => band.letter.toLowerCase() === letter.toLowerCase());
  if (index < 0) return "muted";
  if (sorted[index].min < passMark) return "danger";
  if (index === 0) return "success";
  if (index === 1) return "info";
  return "warning";
}

/**
 * The range a band covers, as the report card prints it ("70 – 100%").
 *
 * @param scale - The school's bands.
 * @returns One `{ letter, range, remark }` per band, highest first.
 */
export function scaleRows(scale: readonly GradeBand[]): Array<{ letter: string; range: string; remark: string | null }> {
  const sorted = sortScale(scale);
  return sorted.map((band, index) => {
    const upper = index === 0 ? 100 : sorted[index - 1].min - 1;
    return { letter: band.letter, range: `${band.min} – ${Math.max(band.min, upper)}%`, remark: band.remark ?? null };
  });
}
