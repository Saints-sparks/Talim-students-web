/**
 * Where a notification's button goes. Producers set `metadata.target`
 * (round-4 §30) with a `page` and optional ids; this maps it onto the
 * students app's routes. Pages the app does not have fall back to Updates.
 */
import type { NotificationCategory, NotificationTarget } from "@/types/learner";

/**
 * A target as a notification carries it. HAND-WRITTEN wider `page`: the API's
 * list (`NotificationTargetDto`) is fixed now, but notifications stored before
 * it, and raw `metadata.target`, may name older pages ("today", "files"…).
 */
export type StoredTarget = Omit<NotificationTarget, "page"> & { page: string };

/**
 * The app route for a notification target.
 *
 * @param target - The producer's target, or null.
 * @param metadata - The notification's metadata: a results notice names its
 *   term there (`metadata.termId`) rather than in the target.
 * @returns The path to open, or null when there is nowhere better than Updates.
 */
export function targetHref(target: StoredTarget | null | undefined, metadata?: Record<string, unknown> | null): string | null {
  if (!target?.page) return null;
  const termId = target.termId ?? (typeof metadata?.termId === "string" ? metadata.termId : undefined);
  switch (target.page) {
    case "today":
    case "dashboard":
      return "/dashboard";
    case "timetable":
      return "/timetable";
    case "subjects":
      return target.courseId ? `/subjects/${encodeURIComponent(target.courseId)}` : "/subjects";
    case "resources":
    case "files":
      return target.courseId ? `/files?course=${encodeURIComponent(target.courseId)}` : "/files";
    case "results":
    case "grading":
      return termId ? `/results?term=${encodeURIComponent(termId)}` : "/results";
    case "attendance":
      return "/attendance";
    case "messages":
      return target.roomId ? `/messages?room=${encodeURIComponent(target.roomId)}` : "/messages";
    case "settings":
      return "/settings";
    case "announcements":
    case "notifications":
      return "/updates";
    default:
      return null;
  }
}

/** The tag the design shows on an update, by category. */
const CATEGORY_TAG: Partial<Record<NotificationCategory, string>> = {
  academics: "Assessments",
  resources: "Files",
  grading: "Results",
  announcement: "School",
  attendance: "Attendance",
  messages: "Messages",
  account: "Account",
};

/**
 * The tag on an update ("Assessments", "Files", "Results", "School").
 *
 * @param category - The notification's category.
 * @returns The tag text.
 */
export function categoryTag(category: string): string {
  return CATEGORY_TAG[category as NotificationCategory] ?? "Talim";
}

/**
 * The button label when the producer did not set `actionLabel`.
 *
 * @param href - Where the button goes.
 * @returns "Open Files", "Open Results"…
 */
export function defaultActionLabel(href: string): string {
  const path = href.split("?")[0];
  const names: Record<string, string> = {
    "/dashboard": "See coming up",
    "/timetable": "Open Timetable",
    "/subjects": "Open Subjects",
    "/files": "Open Files",
    "/results": "Open Results",
    "/attendance": "Open Attendance",
    "/messages": "Open Messages",
    "/settings": "Open Settings",
    "/updates": "Open Updates",
  };
  if (path.startsWith("/subjects/")) return "Open the subject";
  return names[path] ?? "Open";
}
