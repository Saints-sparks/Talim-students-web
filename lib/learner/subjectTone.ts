/**
 * Subject colours. The design gives each of a class's subjects one of twelve
 * colours (`.subj-0` … `.subj-11` in `app/globals.css`, each with an AA text
 * colour for both themes). The contract's only colour hint is B2's
 * `colourKey`, which the other routes do not carry, so every screen derives
 * the colour from the course id instead: the same subject is the same colour
 * on Today, Timetable, Subjects, Results and Files.
 */

/** How many subject tones the stylesheet defines. */
export const SUBJECT_TONE_COUNT = 12;

const cache = new Map<string, number>();

/**
 * FNV-1a hash of a string, as an unsigned 32-bit number. Fast, stable across
 * sessions and browsers, and spreads short ids well.
 *
 * @param value - The text to hash.
 * @returns The hash.
 */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * The tone index (0–11) of a subject.
 *
 * @param key - The course id (or any stable subject key).
 * @returns The index into the twelve tones.
 */
export function subjectToneIndex(key: string): number {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const index = hashString(key || "none") % SUBJECT_TONE_COUNT;
  cache.set(key, index);
  return index;
}

/**
 * The class that sets a subject's colour variables (`bg-subj-solid`,
 * `bg-subj-tint`, `text-subj-ink` then read them).
 *
 * @param key - The course id (or any stable subject key).
 * @returns `subj-N`.
 */
export function subjectToneClass(key: string): string {
  return `subj-${subjectToneIndex(key)}`;
}
