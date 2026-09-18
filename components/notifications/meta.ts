import type React from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  Megaphone,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import type { NotificationCategory } from "@/lib/notifications/normalize";

/** Which tab a list is filtered to. */
export type TabKey = "all" | "unread" | NotificationCategory;

/** How the list is ordered. */
export type SortKey = "newest" | "oldest" | "unread";

/** The label, colours and glyph for one category, in both themes. */
export interface CategoryMeta {
  label: string;
  badgeClass: string;
  iconClass: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export const categoryMeta: Record<NotificationCategory, CategoryMeta> = {
  announcement: {
    label: "Announcement",
    badgeClass: "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800/50",
    iconClass: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
    Icon: Megaphone,
  },
  attendance: {
    label: "Attendance",
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/50",
    iconClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
    Icon: CalendarDays,
  },
  academics: {
    label: "Academics",
    badgeClass:
      "bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-900/30 dark:text-violet-200 dark:ring-violet-800/50",
    iconClass: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200",
    Icon: BookOpen,
  },
  grading: {
    label: "Results",
    badgeClass:
      "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/50",
    iconClass: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
    Icon: GraduationCap,
  },
  resources: {
    label: "Resources",
    badgeClass: "bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-200 dark:ring-cyan-800/50",
    iconClass: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200",
    Icon: FileText,
  },
  messages: {
    label: "Messages",
    badgeClass: "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-900/30 dark:text-sky-200 dark:ring-sky-800/50",
    iconClass: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200",
    Icon: MessageSquare,
  },
  account: {
    label: "Account",
    badgeClass:
      "bg-slate-50 text-slate-700 ring-slate-100 dark:bg-slate-700/40 dark:text-slate-200 dark:ring-slate-600/50",
    iconClass: "bg-slate-50 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200",
    Icon: ShieldCheck,
  },
  other: {
    label: "Others",
    badgeClass: "bg-gray-50 text-gray-700 ring-gray-100 dark:bg-slate-700/40 dark:text-slate-200 dark:ring-slate-600/50",
    iconClass: "bg-gray-50 text-gray-700 dark:bg-slate-700/40 dark:text-slate-200",
    Icon: Bell,
  },
};

/** The tabs across the top of the inbox. */
export const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "announcement", label: "Announcements" },
  { key: "academics", label: "Academics" },
  { key: "resources", label: "Resources" },
  { key: "grading", label: "Results" },
];

/**
 * The clock time of a notification, in the viewer's locale.
 *
 * @param dateString - An ISO timestamp.
 * @returns e.g. "14:05".
 */
export function formatTime(dateString: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(dateString));
}

/**
 * The day of a notification, as "Today", "Yesterday" or a date.
 *
 * @param dateString - An ISO timestamp.
 * @param now - The day to compare against; defaults to today.
 * @returns The label to show.
 */
export function formatDate(dateString: string, now: Date = new Date()): string {
  const date = new Date(dateString);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

/**
 * The label on the sort dropdown.
 *
 * @param sortKey - The active sort.
 * @returns Its human label.
 */
export function sortLabel(sortKey: SortKey): string {
  if (sortKey === "oldest") return "Oldest first";
  if (sortKey === "unread") return "Unread first";
  return "Newest first";
}
