import { Monitor, Moon, Sun } from "lucide-react";
import type { ElementType } from "react";
import type { ChatPreferences } from "@/services/settings.service";
import type { NotificationPreferences } from "@/services/notification.service";

/** A notification category switch on the Notifications section. */
export interface NotificationCategory {
  field: keyof NotificationPreferences;
  label: string;
  description: string;
}

/** The categories a student can mute, each saved as its own preference field. */
export const NOTIFICATION_CATEGORIES = [
  { field: "announcementsEnabled", label: "School announcements", description: "Important messages from your school." },
  { field: "attendanceEnabled", label: "Attendance alerts", description: "Reminders and attendance updates." },
  { field: "resultsEnabled", label: "Result updates", description: "Notify when new results are published." },
  { field: "timetableEnabled", label: "Class & timetable", description: "Class schedule changes and reminders." },
  { field: "resourcesEnabled", label: "Resources", description: "New learning materials shared with your class." },
  { field: "messagesEnabled", label: "Messages", description: "Alerts for new chat messages." },
] as const satisfies readonly NotificationCategory[];

/** A messaging switch on the Messages section. */
export interface MessageSwitch {
  field: keyof ChatPreferences;
  label: string;
  description: string;
}

/** The messaging switches a student can change. */
export const MESSAGE_SWITCHES = [
  {
    field: "messageNotifications",
    label: "Message notifications",
    description: "Get alerted when someone messages you.",
  },
  {
    field: "allowTeacherMessages",
    label: "Allow teacher messages",
    description: "Let your teachers start a direct chat with you.",
  },
  { field: "readReceipts", label: "Read receipts", description: "Send read receipts when you view messages." },
] as const satisfies readonly MessageSwitch[];

/** One choice on the Appearance section. */
export interface ThemeOption {
  value: "light" | "dark" | "system";
  label: string;
  icon: ElementType;
  desc: string;
}

/** The three ways to theme the app. */
export const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun, desc: "Always use light mode" },
  { value: "dark", label: "Dark", icon: Moon, desc: "Always use dark mode" },
  { value: "system", label: "System", icon: Monitor, desc: "Follow device setting" },
];
