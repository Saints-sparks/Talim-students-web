import type { NotificationListResponse, RawNotification } from "@/services/notification.service";

/** Who sent a notification, as the API labels it. */
export type NotificationSource = "school" | "talim" | "system";

/**
 * The categories the API defines (`NotificationCategory` in
 * `notification.schema.ts`). There is deliberately no "assignment" category —
 * assignment-shaped notification types fall under `academics`.
 */
export type NotificationCategory =
  | "announcement"
  | "attendance"
  | "academics"
  | "grading"
  | "resources"
  | "messages"
  | "account"
  | "other";

/** One notification as the student screens render it. */
export type StudentNotification = {
  /** Endpoint-qualified id, unique across both feeds. */
  id: string;
  /** The raw document id, for the mark-as-read call. */
  rawId: string;
  source: NotificationSource;
  sourceLabel: string;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  unread: boolean;
  senderName: string;
  senderEmail?: string;
  attachments: string[];
  related: Array<{ label: string; href?: string }>;
  priority?: "low" | "medium" | "high";
  metadata?: Record<string, unknown>;
  /** Which feed it came from, so the right read endpoint is called. */
  endpoint: "announcement" | "notification";
};

/** Every category, in the order the tabs show them. */
export const CATEGORIES: NotificationCategory[] = [
  "announcement",
  "attendance",
  "academics",
  "grading",
  "resources",
  "messages",
  "account",
  "other",
];

/** Backend `NotificationType` → category. Checked before any text matching. */
const CATEGORY_BY_TYPE: Record<string, NotificationCategory> = {
  announcement: "announcement",
  attendance_alert: "attendance",
  result_published: "grading",
  grade_released: "grading",
  assessment_reminder: "academics",
  assignment_due: "academics",
  class_assigned: "academics",
  class_unassigned: "academics",
  course_assigned: "academics",
  course_unassigned: "academics",
  timetable_update: "academics",
  assignment_or_resource: "resources",
  chat_message: "messages",
  chat_message_reminder: "messages",
  security_alert: "account",
  login_alert: "account",
  fee_reminder: "other",
  fee_overdue: "other",
  payment_confirmed: "other",
  receipt_generated: "other",
  system_alert: "other",
  system_notice: "other",
  app_update: "other",
};

/**
 * The id of whichever shape the API used for a person reference.
 *
 * @param value - A user id, a populated user, or nothing.
 * @returns The id, or an empty string.
 */
export function idOf(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  const person = value as { userId?: string; _id?: string; id?: string };
  return person.userId ?? person._id ?? person.id ?? "";
}

/**
 * A display name for a person reference.
 *
 * @param person - A populated user, or nothing.
 * @param fallback - Used when no name can be built.
 * @returns The name to show.
 */
function personName(person: unknown, fallback: string): string {
  if (!person || typeof person !== "string") {
    const user = person as { name?: string; firstName?: string; lastName?: string; email?: string } | null;
    if (user?.name) return user.name;
    const full = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    if (full) return full;
    if (user?.email) return user.email;
  }
  return fallback;
}

/**
 * Whether a sender name is one of the API's placeholders.
 *
 * @param value - The name to judge.
 * @returns True when it carries no information.
 */
function isPlaceholderName(value?: string): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();
  return !normalized || normalized === "unknown sender" || normalized === "unknown";
}

/**
 * The best available sender name for one item.
 *
 * @param item - The raw notification.
 * @param fallback - Used when nothing better is present.
 * @returns The name to show.
 */
function senderNameOf(item: RawNotification, fallback: string): string {
  if (!isPlaceholderName(item.senderName)) return item.senderName as string;
  if (!isPlaceholderName(item.senderDisplay?.name)) return item.senderDisplay?.name as string;
  return personName(item.senderId ?? item.sender ?? item.createdBy, fallback);
}

/**
 * Whether the signed-in student has already read an item.
 *
 * @param item - The raw notification.
 * @param userId - The reader's user-account id.
 * @returns True when it should render as read.
 */
function isReadBy(item: RawNotification, userId: string): boolean {
  if (typeof item.isRead === "boolean") return item.isRead;
  if (typeof item.read === "boolean") return item.read;
  if (!Array.isArray(item.readBy)) return false;
  return item.readBy.some((reader) => idOf(reader) === userId);
}

/**
 * Whole-word search over the text fields, for items with no usable `type`.
 *
 * @param text - The blob to search.
 * @param words - Patterns to look for.
 * @returns True when any matches.
 */
function hasWord(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}`, "i").test(text));
}

/**
 * The category an item belongs to: its own field, then its `type`, then the
 * text as a last resort.
 *
 * @param item - The raw notification.
 * @param fallback - Used when nothing matches.
 * @returns The resolved category.
 */
export function inferCategory(item: RawNotification, fallback: NotificationCategory): NotificationCategory {
  const explicit = String(item.category ?? item.metadata?.category ?? "").toLowerCase();
  if (CATEGORIES.includes(explicit as NotificationCategory)) return explicit as NotificationCategory;

  const type = String(item.type ?? "").toLowerCase();
  if (CATEGORY_BY_TYPE[type]) return CATEGORY_BY_TYPE[type];

  const text = [type, item.title, item.message, item.content, item.metadata?.category, item.metadata?.module]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (hasWord(text, ["attendance", "absence", "absent", "late\\b"])) return "attendance";
  if (hasWord(text, ["grade", "grading", "result", "report card"])) return "grading";
  if (hasWord(text, ["assessment", "curriculum", "academic"])) return "academics";
  if (hasWord(text, ["resource", "material", "pdf", "e-library"])) return "resources";
  if (hasWord(text, ["chat", "message"])) return "messages";
  if (hasWord(text, ["account", "password", "login", "security"])) return "account";
  if (hasWord(text, ["announcement"])) return "announcement";

  return fallback;
}

/**
 * Every attachment URL on an item, however the API spelled the field.
 *
 * @param item - The raw notification.
 * @returns The URLs, with blanks dropped.
 */
function attachmentsOf(item: RawNotification): string[] {
  return [...(Array.isArray(item.attachments) ? item.attachments : []), ...(item.attachment ? [item.attachment] : [])]
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

/**
 * The "related" chips under a notification.
 *
 * Only links that lead somewhere this app can open are kept — the metadata
 * also carries `assignmentTitle` / `assignmentUrl`, but the students app has
 * no assignments screen, so those chips would be dead ends.
 *
 * @param item - The raw notification.
 * @returns The chips to render.
 */
export function buildRelated(item: RawNotification): Array<{ label: string; href?: string }> {
  const metadata = (item.metadata ?? {}) as Record<string, unknown>;
  const related: Array<{ label: string; href?: string }> = [];
  const asString = (value: unknown) => (typeof value === "string" && value ? value : undefined);

  const className = asString(metadata.className);
  if (className) related.push({ label: className });

  const courseName = asString(metadata.courseName);
  if (courseName) related.push({ label: courseName });

  const resourceTitle = asString(metadata.resourceTitle);
  if (resourceTitle) related.push({ label: resourceTitle, href: asString(metadata.resourceUrl) });

  const href = asString(metadata.href) ?? asString(metadata.url);
  if (href) related.push({ label: "Open related item", href });

  return related;
}

/**
 * Normalises one school announcement.
 *
 * @param item - The raw announcement.
 * @param userId - The signed-in student's user-account id.
 * @returns The normalised notification.
 */
export function normalizeAnnouncement(item: RawNotification, userId: string): StudentNotification {
  const schoolName =
    item.schoolName ??
    item.school?.name ??
    (typeof item.schoolId === "object" ? item.schoolId?.name : undefined) ??
    (item.metadata?.schoolName as string | undefined) ??
    "School Admin";

  return {
    id: `announcement:${item._id ?? item.id}`,
    rawId: String(item._id ?? item.id ?? ""),
    source: (item.source as NotificationSource) ?? "school",
    sourceLabel: item.sourceLabel ?? "School Announcement",
    category: inferCategory(item, "announcement"),
    title: item.title || "School announcement",
    message: item.message || item.content || "No message provided.",
    createdAt: item.publishedAt ?? item.createdAt ?? item.scheduledFor ?? new Date().toISOString(),
    unread: !isReadBy(item, userId),
    senderName: senderNameOf(item, schoolName),
    senderEmail: item.senderEmail ?? item.senderDisplay?.email,
    attachments: attachmentsOf(item),
    related: buildRelated(item),
    priority: item.priority,
    metadata: item.metadata,
    endpoint: "announcement",
  };
}

/**
 * Normalises one system or school notification.
 *
 * @param item - The raw notification.
 * @param userId - The signed-in student's user-account id.
 * @returns The normalised notification.
 */
export function normalizeNotification(item: RawNotification, userId: string): StudentNotification {
  const rawSource = item.source ?? (item.metadata?.source as string | undefined);
  const source: NotificationSource = rawSource === "school" ? "school" : rawSource === "talim" ? "talim" : "system";
  const senderFallback =
    source === "talim" ? "Talim Admin" : source === "school" ? "School Admin" : "System Notification";

  return {
    id: `notification:${item._id ?? item.id}`,
    rawId: String(item._id ?? item.id ?? ""),
    source,
    sourceLabel:
      item.sourceLabel ??
      (source === "talim" ? "Talim Alert" : source === "school" ? "School Notification" : "System Notification"),
    category: inferCategory(item, "other"),
    title: item.title || "Notification",
    message: item.message || item.body || item.content || "No message provided.",
    createdAt: item.createdAt ?? new Date().toISOString(),
    unread: !isReadBy(item, userId),
    senderName: senderNameOf(item, senderFallback),
    senderEmail: item.senderEmail ?? item.senderDisplay?.email,
    attachments: attachmentsOf(item),
    related: buildRelated(item),
    priority: item.priority,
    metadata: item.metadata,
    endpoint: "notification",
  };
}

/**
 * The list out of whichever envelope a notification endpoint used.
 *
 * @param payload - The parsed response body.
 * @returns The raw items, or an empty array.
 */
export function itemsOf(payload: NotificationListResponse | RawNotification[] | null | undefined): RawNotification[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.announcements)) return payload.announcements;
  return [];
}

/**
 * Whether a notification is really an announcement the other feed already
 * carries, so it is not listed twice.
 *
 * @param item - The raw notification.
 * @returns True when it duplicates the announcements feed.
 */
export function isDuplicateAnnouncement(item: RawNotification): boolean {
  const source = item.source ?? (item.metadata?.source as string | undefined);
  const category = item.category ?? (item.metadata?.category as string | undefined);
  const type = String(item.type ?? "").toLowerCase();
  return (
    source === "school" &&
    (category === "announcement" || type.includes("announcement") || Boolean(item.metadata?.announcementId))
  );
}

/**
 * Sorts notifications newest first.
 *
 * @param items - The notifications to sort.
 * @returns A new sorted array.
 */
export function sortByNewest(items: StudentNotification[]): StudentNotification[] {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** How many notifications sit in each tab. */
export type NotificationCounts = Record<NotificationCategory | "all" | "unread", number>;

/**
 * Counts notifications per tab in one pass.
 *
 * @param items - The notifications to count.
 * @returns One count per tab.
 */
export function countByCategory(items: StudentNotification[]): NotificationCounts {
  const counts = {
    all: 0,
    unread: 0,
    announcement: 0,
    attendance: 0,
    academics: 0,
    grading: 0,
    resources: 0,
    messages: 0,
    account: 0,
    other: 0,
  } as NotificationCounts;

  for (const item of items) {
    counts.all += 1;
    if (item.unread) counts.unread += 1;
    counts[item.category] += 1;
  }
  return counts;
}
