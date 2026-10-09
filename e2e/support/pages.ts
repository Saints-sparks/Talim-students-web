/**
 * Every screen in the student sidebar (components/shell/nav.ts) and Settings,
 * with its heading and text only the loaded screen shows (seeded data, or the
 * empty state when the seed leaves the screen empty).
 */
export interface ScreenSpec {
  path: string;
  /** The h1. */
  heading: RegExp;
  /** Seeded data or the screen's empty state. */
  content: RegExp;
  /** File name for screenshots and reports. */
  slug: string;
}

export const STUDENT_SCREENS: readonly ScreenSpec[] = [
  { path: "/dashboard", heading: /(Good (morning|afternoon|evening)|Hello), Ada/, content: /(Good (morning|afternoon|evening)|Hello), Ada/, slug: "today" },
  { path: "/timetable", heading: /^Timetable$/, content: /Mathematics|No lessons this week/, slug: "timetable" },
  { path: "/subjects", heading: /^Subjects$/, content: /Mathematics/, slug: "subjects" },
  // Students-only and students-and-parents files of Mathematics 5A.
  { path: "/files", heading: /^Files$/, content: /Fractions worksheet/, slug: "files" },
  // The published Third Term 2025/2026 report card.
  { path: "/results", heading: /^Results$/, content: /Third Term|Mathematics/, slug: "results" },
  { path: "/attendance", heading: /^Attendance$/, content: /present|No attendance/i, slug: "attendance" },
  // The Mathematics 5A subject group the seed opens.
  { path: "/messages", heading: /^Messages$/, content: /Mathematics|Class/, slug: "messages" },
  { path: "/updates", heading: /^Updates$/, content: /published|Welcome to Greenfield|caught up/i, slug: "updates" },
  { path: "/settings", heading: /^Settings$/, content: /ada\.student@e2e\.talim\.test|Ada Student/, slug: "settings" },
];
