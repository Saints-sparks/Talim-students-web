/**
 * Pure helpers for the Updates screen: the filter chips (B11's student map),
 * which items a chip shows, and where an update's button goes.
 */
import { defaultActionLabel, targetHref } from "@/lib/learner/targets";
import type { NotificationCounts, StudentNotification } from "@/lib/notifications/normalize";
import type { NotificationTarget } from "@/types/learner";

/** A filter chip: everything, unread, or one category. */
export type UpdateFilter = "all" | "unread" | "academics" | "resources" | "grading" | "announcement";

/** The chips in the design's order (Assessments → academics, Files → resources, Results → grading, School → announcement). */
export const UPDATE_FILTERS: ReadonlyArray<{ key: UpdateFilter; label: string; tip: string }> = [
  { key: "all", label: "All", tip: "Show everything" },
  { key: "unread", label: "Unread", tip: "Only what you have not opened" },
  { key: "academics", label: "Assessments", tip: "Show assessments" },
  { key: "resources", label: "Files", tip: "Show files" },
  { key: "grading", label: "Results", tip: "Show results" },
  { key: "announcement", label: "School", tip: "Show school announcements" },
];

/**
 * Whether an update belongs under a chip.
 *
 * @param item - The update.
 * @param filter - The chip.
 * @returns True when the chip shows it.
 */
export function matchesFilter(item: StudentNotification, filter: UpdateFilter): boolean {
  if (filter === "all") return true;
  if (filter === "unread") return item.unread;
  return item.category === filter;
}

/**
 * How many updates sit under each chip, from the loaded list's counts.
 *
 * @param counts - `countByCategory` of the loaded list.
 * @returns One number per chip.
 */
export function chipCounts(counts: NotificationCounts): Record<UpdateFilter, number> {
  return {
    all: counts.all,
    unread: counts.unread,
    academics: counts.academics,
    resources: counts.resources,
    grading: counts.grading,
    announcement: counts.announcement,
  };
}

/**
 * The producer's target (round-4 §30 `metadata.target`), when it is usable.
 *
 * @param metadata - The update's metadata.
 * @returns The target, or null.
 */
export function targetOf(metadata: Record<string, unknown> | undefined): NotificationTarget | null {
  const target = metadata?.target;
  if (!target || typeof target !== "object") return null;
  const page = (target as { page?: unknown }).page;
  return typeof page === "string" && page ? (target as NotificationTarget) : null;
}

/**
 * The detail's button: where it goes and what it says (the producer's
 * `actionLabel`, else a label for the page).
 *
 * @param item - The update.
 * @returns The link, or null when the update points nowhere in the app.
 */
export function actionFor(item: StudentNotification): { href: string; label: string } | null {
  const href = targetHref(targetOf(item.metadata));
  if (!href) return null;
  const label = item.metadata?.actionLabel;
  return { href, label: typeof label === "string" && label.trim() ? label : defaultActionLabel(href) };
}

/**
 * A readable name for an attachment URL: its file name, else "Attachment N".
 *
 * @param url - The attachment's URL.
 * @param index - Its position, for the fallback.
 * @returns The name.
 */
export function attachmentName(url: string, index: number): string {
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    if (last) return decodeURIComponent(last);
  } catch {
    // Not an absolute URL: fall through.
  }
  return `Attachment ${index + 1}`;
}
