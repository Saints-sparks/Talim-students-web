"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCheck,
  Download,
  FileText,
  Filter,
  Info,
  LayoutGrid,
  LifeBuoy,
  ListChecks,
  MessageSquareText,
  Printer,
  Search,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";

/** One spotlight step: the `data-guide` element it points at and what it says. */
export type GuideStep = {
  target: string;
  title: string;
  description: string;
  eyebrow?: string;
  icon?: ComponentType<{ className?: string }>;
};

/** The guide of one page: where it applies and its steps. */
export type GuideConfig = {
  /** Remembered per student; the "-r1" ids belong to the redesigned screens, so they show once more. */
  id: string;
  pathMatchers: string[];
  exactOnly?: boolean;
  steps: GuideStep[];
};

/**
 * The page guides of the redesigned portal (the floating "Guide" button). Each
 * opens by itself the first time a student visits the page; steps whose
 * element is not on screen (an empty state, a narrow window) are skipped.
 * Targets are the `data-guide` attributes the screens set.
 */
export const guideConfigs: GuideConfig[] = [
  {
    id: "today-r1",
    pathMatchers: ["/dashboard"],
    exactOnly: true,
    steps: [
      { target: "today-header", eyebrow: "Start here", title: "Today", description: "Your day at school: the date, your class, and anything unusual about today such as a holiday or an early close.", icon: Sparkles },
      { target: "today-glance", title: "Your term at a glance", description: "Your term average, position, attendance and unread messages, then one bar per subject. Tap a tile to open its page.", icon: BarChart3 },
      { target: "today-lessons", title: "Up next and the rest of today", description: "The lesson starting next with its teacher, then the rest of the day. Open a subject for its scores and files.", icon: CalendarDays },
      { target: "today-coming-up", title: "Coming up", description: "Assessments your teachers have set for the next three weeks, and school events.", icon: ListChecks },
      { target: "today-new", title: "New since you last signed in", description: "Files, results and messages you haven't seen yet. All updates opens the full list.", icon: Bell },
    ],
  },
  {
    id: "timetable-r1",
    pathMatchers: ["/timetable"],
    steps: [
      { target: "timetable-header", eyebrow: "Your week", title: "Timetable", description: "Every lesson of the week, as your school set it.", icon: CalendarDays },
      { target: "timetable-week-nav", title: "Move between weeks", description: "See last week or next week, and come back to this week.", icon: CalendarDays },
      { target: "timetable-filters", title: "Narrow it down", description: "Show one day only, or just the morning or the afternoon. Export saves the week as a PDF.", icon: Filter },
      { target: "timetable-grid", title: "Open a lesson's subject", description: "Each lesson shows the subject and teacher. Tap it for the subject's scores, plan and files.", icon: BookOpen },
      { target: "timetable-legend", title: "Subject colours", description: "Each subject keeps the same colour everywhere in the portal.", icon: LayoutGrid },
    ],
  },
  {
    id: "subjects-r1",
    pathMatchers: ["/subjects"],
    exactOnly: true,
    steps: [
      { target: "subjects-header", eyebrow: "Learning", title: "Subjects", description: "Every subject you take this term, with your total so far.", icon: BookOpen },
      { target: "subjects-grid", title: "Open a subject", description: "Each card shows your score, your position and how much of the term's scores are out. Open one for the details.", icon: LayoutGrid },
    ],
  },
  {
    id: "subject-detail-r1",
    pathMatchers: ["/subjects/"],
    steps: [
      { target: "subject-header", eyebrow: "Subject", title: "One subject", description: "The subject's teacher and term.", icon: BookOpen },
      { target: "subject-message", title: "Message this subject", description: "Opens the subject's group chat with your teacher and classmates. The first time, the group is created for you.", icon: MessageSquareText },
      { target: "subject-scores", title: "Your scores", description: "Each assessment out of its maximum, and the total with its grade and your position. Scores appear once your teacher publishes them.", icon: BarChart3 },
      { target: "subject-scheme", title: "What you're covering", description: "This week's topic and the plan for the term.", icon: FileText },
      { target: "subject-files", title: "Files", description: "What your teacher shared for this subject. Download opens the file.", icon: Download },
    ],
  },
  {
    id: "files-r1",
    pathMatchers: ["/files"],
    steps: [
      { target: "files-header", eyebrow: "Learning", title: "Files", description: "Everything your teachers shared with your class.", icon: FileText },
      { target: "files-search", title: "Search", description: "Find a file by its name or its subject.", icon: Search },
      { target: "files-filter", title: "One subject at a time", description: "Show only one subject's files.", icon: Filter },
      { target: "files-download-all", title: "Download all", description: "Saves every file in the list as one zip.", icon: Download },
      { target: "files-list", title: "Download one", description: "Download opens a single file.", icon: Download },
    ],
  },
  {
    id: "results-r1",
    pathMatchers: ["/results"],
    steps: [
      { target: "results-header", eyebrow: "Progress", title: "Results", description: "Your report card for the term, once your school publishes it.", icon: BarChart3 },
      { target: "results-term", title: "Pick a term", description: "Look back at an earlier term's results.", icon: CalendarDays },
      { target: "results-summary", title: "The term in four numbers", description: "Your average, position, strongest subject and the one that needs attention.", icon: Sparkles },
      { target: "results-report-card", title: "Your report card", description: "Every subject's scores, grade and position, your teacher's comment and attendance. Print it or save it as a PDF.", icon: Printer },
      { target: "results-subjects", title: "Subject by subject", description: "Pick a subject to see its scores against the class average.", icon: ListChecks },
    ],
  },
  {
    id: "attendance-r1",
    pathMatchers: ["/attendance"],
    steps: [
      { target: "attendance-header", eyebrow: "Progress", title: "Attendance", description: "The days your school marked you present, late or absent.", icon: CheckCheck },
      { target: "attendance-term", title: "Pick a term", description: "Compare with an earlier term.", icon: CalendarDays },
      { target: "attendance-rate", title: "Your rate", description: "Days present or late out of the days marked. Approved leave is left out.", icon: BarChart3 },
      { target: "attendance-stats", title: "The numbers", description: "Present, missed, late and excused days this term.", icon: ListChecks },
    ],
  },
  {
    id: "messages-r1",
    pathMatchers: ["/messages"],
    steps: [
      { target: "messages-list", eyebrow: "Community", title: "Your groups", description: "Your class group and a group for each subject. Students message in groups only.", icon: UsersRound },
      { target: "messages-search", title: "Find a group", description: "Search your groups by name.", icon: Search },
      { target: "messages-thread", title: "The conversation", description: "Read and send messages, photos, files and voice notes in the open group.", icon: MessageSquareText },
      { target: "messages-info", title: "Group info", description: "Members, and the images, videos, links and documents shared in the group.", icon: Info },
    ],
  },
  {
    id: "updates-r1",
    pathMatchers: ["/updates"],
    steps: [
      { target: "updates-header", eyebrow: "Community", title: "Updates", description: "Announcements from your school and alerts from Talim.", icon: Bell },
      { target: "updates-filters", title: "Filter", description: "Show only unread updates, assessments, files, results or school news.", icon: Filter },
      { target: "updates-mark-all", title: "Mark all as read", description: "Clears every unread marker at once.", icon: CheckCheck },
      { target: "updates-list", title: "Open an update", description: "Choose one to read it in full.", icon: ListChecks },
      { target: "updates-detail", title: "Take me there", description: "The button under an update opens what it is about.", icon: Sparkles },
    ],
  },
  {
    id: "settings-r1",
    pathMatchers: ["/settings"],
    steps: [
      { target: "settings-tabs", eyebrow: "Account", title: "Settings", description: "Your profile, alerts, messages, help, security, theme and app details.", icon: Settings },
      { target: "settings-panel", title: "Make it yours", description: "Choose what reaches you, change your photo or password, and replay the portal tour under Help.", icon: Sparkles },
      {
        target: "settings-support",
        title: "Your support tickets",
        description: "Ask your school or Talim support, and follow the replies here. Reopen a ticket within 7 days of it being resolved, or close it when you're done.",
        icon: LifeBuoy,
      },
    ],
  },
];

/**
 * The guide for a path: the matching config with the longest matcher.
 *
 * @param pathname - The current path.
 * @returns The guide, or undefined when the page has none.
 */
export function findGuideConfig(pathname: string) {
  return guideConfigs
    .filter((config) => config.pathMatchers.some((matcher) => pathname === matcher || (!config.exactOnly && pathname.startsWith(matcher))))
    .sort((a, b) => {
      const longestA = Math.max(...a.pathMatchers.map((matcher) => matcher.length));
      const longestB = Math.max(...b.pathMatchers.map((matcher) => matcher.length));
      return longestB - longestA;
    })[0];
}
