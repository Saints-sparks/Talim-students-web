/**
 * Chat kit — turning message text into text and link segments.
 *
 * Pure, so the same rule is testable and portable (the mobile app carries a
 * copy). Only `http(s)://` and `www.` are linked; trailing punctuation
 * ("see https://x.com/a.") stays outside the link.
 */

export type TextSegment =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi;
const TRAILING_PUNCTUATION = /[),.;:!?\]]+$/;

export function linkify(text: string | null | undefined): TextSegment[] {
  if (!text) return [];
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    const raw = match[0];
    const shown = raw.replace(TRAILING_PUNCTUATION, "");
    if (!shown) continue;

    if (start > cursor) {
      segments.push({ type: "text", text: text.slice(cursor, start) });
    }
    segments.push({
      type: "link",
      text: shown,
      href: /^www\./i.test(shown) ? `https://${shown}` : shown,
    });
    cursor = start + shown.length;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", text: text.slice(cursor) });
  }
  return segments;
}
