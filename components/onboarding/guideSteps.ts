"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  Filter,
  Info,
  LayoutGrid,
  Lightbulb,
  MessageSquareText,
  Search,
  Send,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";

export type GuideStep = {
  target: string;
  title: string;
  description: string;
  eyebrow?: string;
  icon?: ComponentType<{ className?: string }>;
};

export type GuideConfig = {
  id: string;
  pathMatchers: string[];
  exactOnly?: boolean;
  steps: GuideStep[];
};

export const guideConfigs: GuideConfig[] = [
  {
    id: "subjects",
    pathMatchers: ["/subjects"],
    exactOnly: true,
    steps: [
      {
        target: "subjects-header",
        eyebrow: "Learning map",
        title: "Subjects",
        description:
          "This page lists the courses attached to your class so you can open curriculum plans and learning content.",
        icon: BookOpen,
      },
      {
        target: "subjects-search",
        title: "Find a Course",
        description:
          "Search by course name or code when your class has many subjects to scan through.",
        icon: Search,
      },
      {
        target: "subjects-count",
        title: "Check Course Coverage",
        description:
          "The count confirms how many class courses are visible after your current search filter.",
        icon: LayoutGrid,
      },
      {
        target: "subjects-grid",
        title: "Open Curriculum",
        description:
          "Each subject card shows its code and description. Use View Curriculum to read the term plan for that course.",
        icon: FileText,
      },
    ],
  },
  {
    id: "curriculum",
    pathMatchers: ["/subjects/curriculum"],
    steps: [
      {
        target: "curriculum-header",
        eyebrow: "Course plan",
        title: "Curriculum Library",
        description:
          "This view shows the curriculum entries your teacher has published for the selected course and term.",
        icon: BookOpen,
      },
      {
        target: "curriculum-list",
        title: "Choose a Curriculum",
        description:
          "Open a curriculum card to read the lesson plan, teacher details, attachments, and update date.",
        icon: FileText,
      },
      {
        target: "curriculum-detail-actions",
        title: "Back or Download",
        description:
          "In a curriculum detail view, return to the list or download the visible curriculum as an image for offline review.",
        icon: Download,
      },
      {
        target: "curriculum-detail-content",
        title: "Read the Lesson Plan",
        description:
          "The detail card contains term metadata, teacher information, curriculum content, and any supporting attachments.",
        icon: Lightbulb,
      },
    ],
  },
  {
    id: "timetable",
    pathMatchers: ["/timetable"],
    exactOnly: true,
    steps: [
      {
        target: "timetable-header",
        eyebrow: "Weekly schedule",
        title: "Class Timetable",
        description:
          "Use this page to see when your class has each course during the school week.",
        icon: CalendarDays,
      },
      {
        target: "timetable-filters",
        title: "Filter the Week",
        description:
          "Switch between the full day, morning sessions, and afternoon sessions to focus the schedule.",
        icon: Filter,
      },
      {
        target: "timetable-actions",
        title: "Refresh or Export",
        description:
          "Refresh pulls the latest schedule, while Export downloads the currently filtered timetable as a CSV file.",
        icon: Download,
      },
      {
        target: "timetable-grid",
        title: "Read Time Slots",
        description:
          "Scheduled classes appear in navy blocks. Empty periods are marked as free so you can plan your day.",
        icon: LayoutGrid,
      },
      {
        target: "timetable-summary",
        title: "Weekly Summary",
        description:
          "The footer totals your scheduled classes and explains the visual difference between classes and free periods.",
        icon: Lightbulb,
      },
    ],
  },
  {
    id: "notifications",
    pathMatchers: ["/notifications"],
    exactOnly: true,
    steps: [
      {
        target: "notifications-header",
        eyebrow: "School updates",
        title: "Notifications",
        description:
          "Notifications collect school announcements, resources, results, attendance updates, messages, and account alerts.",
        icon: Bell,
      },
      {
        target: "notifications-tabs",
        title: "Filter by Category",
        description:
          "Use tabs to move between all updates, unread items, announcements, academics, resources, and results.",
        icon: Filter,
      },
      {
        target: "notifications-search-sort",
        title: "Search and Sort",
        description:
          "Search by title, sender, or message text, then sort by newest, oldest, or unread first.",
        icon: Search,
      },
      {
        target: "notifications-list",
        title: "Select an Update",
        description:
          "Choose a notification from the list to read its full message, source, attachments, and related links.",
        icon: MessageSquareText,
      },
      {
        target: "notifications-detail",
        title: "Read Details",
        description:
          "The detail panel shows status, sender, message body, attachments, and the option to mark the update as read.",
        icon: Info,
      },
    ],
  },
  {
    id: "messages",
    pathMatchers: ["/messages"],
    exactOnly: true,
    steps: [
      {
        target: "messages-shell",
        eyebrow: "Class communication",
        title: "Messages",
        description:
          "Messages keep your class and direct conversations in one place with live updates when connected.",
        icon: MessageSquareText,
      },
      {
        target: "messages-search-filter",
        title: "Find Conversations",
        description:
          "Search by conversation name or filter between all chats, class chats, and group chats.",
        icon: Search,
      },
      {
        target: "messages-list",
        title: "Open a Thread",
        description:
          "Select a room to view messages, unread counts, online status, and the latest activity.",
        icon: UsersRound,
      },
      {
        target: "messages-chat-header",
        title: "Conversation Details",
        description:
          "The chat header shows participants and opens the group information modal when you select the conversation name.",
        icon: Info,
      },
      {
        target: "messages-body",
        title: "Read and Reply",
        description:
          "Messages are grouped by date. Use message options for reply actions when a message menu is available.",
        icon: MessageSquareText,
      },
      {
        target: "messages-input",
        title: "Send a Message",
        description:
          "Type your message, press Enter or the send button, and use the attachment button when files are supported.",
        icon: Send,
      },
      {
        target: "messages-group-info-modal",
        title: "Group Information",
        description:
          "When open, this shows the group picture, description and members, and the photos, videos, documents and links in the loaded messages.",
        icon: UsersRound,
      },
    ],
  },
];

export function findGuideConfig(pathname: string) {
  return guideConfigs
    .filter((config) =>
      config.pathMatchers.some(
        (matcher) =>
          pathname === matcher ||
          (!config.exactOnly && pathname.startsWith(matcher))
      )
    )
    .sort((a, b) => {
      const longestA = Math.max(...a.pathMatchers.map((matcher) => matcher.length));
      const longestB = Math.max(...b.pathMatchers.map((matcher) => matcher.length));
      return longestB - longestA;
    })[0];
}
