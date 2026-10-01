/**
 * The sidebar's groups, from the design: Today; Learning (Timetable,
 * Subjects, Files); Progress (Results, Attendance); Community (Messages,
 * Updates). Each item's `tip` is the design's hover text.
 */

/** Which badge an item carries. */
export type NavBadge = "messages" | "updates";

/** One sidebar link. */
export interface NavItem {
  href: string;
  label: string;
  tip: string;
  badge?: NavBadge;
  /** Other paths that light this item up (Subjects for a subject's page). */
  matches?: string[];
  /** The guide/test hook. */
  id: string;
}

/** A titled group of links (the first has no title). */
export interface NavGroup {
  title: string | null;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  { title: null, items: [{ id: "today", href: "/dashboard", label: "Today", tip: "What is new and what is coming up" }] },
  {
    title: "Learning",
    items: [
      { id: "timetable", href: "/timetable", label: "Timetable", tip: "Your week, lesson by lesson" },
      { id: "subjects", href: "/subjects", label: "Subjects", tip: "Every subject, its curriculum and your scores", matches: ["/subjects/"] },
      { id: "files", href: "/files", label: "Files", tip: "Everything your teachers shared" },
    ],
  },
  {
    title: "Progress",
    items: [
      { id: "results", href: "/results", label: "Results", tip: "Report card, grades and position" },
      { id: "attendance", href: "/attendance", label: "Attendance", tip: "Days marked present, late or missed" },
    ],
  },
  {
    title: "Community",
    items: [
      { id: "messages", href: "/messages", label: "Messages", tip: "Class and subject group chats", badge: "messages" },
      { id: "updates", href: "/updates", label: "Updates", tip: "Announcements and alerts", badge: "updates" },
    ],
  },
];

/**
 * Whether a sidebar item is the current page.
 *
 * @param item - The item.
 * @param pathname - The current path.
 * @returns True when the item should show as active.
 */
export function isActiveItem(item: Pick<NavItem, "href" | "matches">, pathname: string): boolean {
  if (pathname === item.href) return true;
  return (item.matches ?? []).some((prefix) => pathname.startsWith(prefix));
}
