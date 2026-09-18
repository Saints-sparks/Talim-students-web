"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { notificationService } from "@/services/notification.service";

// Fired by RealtimeAlerts for every socket `notification` event.
export const NOTIFICATION_EVENT = "talim:notification";

/**
 *
 */
export type NotificationSource = "school" | "talim" | "system";

/**
 *
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

/**
 *
 */
export type StudentNotification = {
  id: string;
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
  metadata?: Record<string, any>;
  endpoint: "announcement" | "notification";
};

const getUserId = (user: any): string => {
  if (!user) return "";
  return user.userId || user._id || user.id || "";
};

const getNotificationItems = (payload: any): any[] => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.announcements)) return payload.announcements;
  if (Array.isArray(payload)) return payload;
  return [];
};

const getPersonName = (person: any, fallback = "System Notification") => {
  if (!person) return fallback;
  if (typeof person === "string") return fallback;
  if (person.name) return person.name;
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ");
  return name || person.email || fallback;
};

const isMissingSenderName = (value?: string) => {
  const normalized = String(value || "").trim().toLowerCase();
  return !normalized || normalized === "unknown sender" || normalized === "unknown";
};

const getSenderName = (item: any, sender: any, fallback = "System Notification") =>
  !isMissingSenderName(item.senderName)
    ? item.senderName
    : !isMissingSenderName(item.senderDisplay?.name)
      ? item.senderDisplay.name
      : getPersonName(sender, fallback);

const getSenderEmail = (item: any, sender: any) =>
  item.senderEmail || item.senderDisplay?.email || sender?.email;

const hasReadByUser = (readBy: any, userId: string) => {
  if (!Array.isArray(readBy)) return false;
  return readBy.some((reader: any) => getUserId(reader) === userId);
};

const getTextBlob = (item: any) =>
  [
    item?.type,
    item?.title,
    item?.message,
    item?.content,
    item?.metadata?.category,
    item?.metadata?.module,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const CATEGORIES: NotificationCategory[] = [
  "announcement",
  "attendance",
  "academics",
  "grading",
  "resources",
  "messages",
  "account",
  "other",
];

// Backend NotificationType → category. Checked before any text matching.
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

const hasWord = (text: string, words: string[]) =>
  words.some((word) => new RegExp(`\\b${word}`, "i").test(text));

const inferCategory = (item: any, fallback: NotificationCategory) => {
  const explicit = String(item?.category || item?.metadata?.category || "").toLowerCase();
  if (CATEGORIES.includes(explicit as NotificationCategory)) {
    return explicit as NotificationCategory;
  }

  const type = String(item?.type || "").toLowerCase();
  if (CATEGORY_BY_TYPE[type]) return CATEGORY_BY_TYPE[type];

  // Unknown or missing type: fall back to whole-word matching over the text.
  const text = `${type} ${getTextBlob(item)}`;
  if (hasWord(text, ["attendance", "absence", "absent", "late\\b"])) return "attendance";
  if (hasWord(text, ["grade", "grading", "result", "report card"])) return "grading";
  if (hasWord(text, ["assessment", "assignment", "curriculum", "academic"])) return "academics";
  if (hasWord(text, ["resource", "material", "pdf", "e-library"])) return "resources";
  if (hasWord(text, ["chat", "message"])) return "messages";
  if (hasWord(text, ["account", "password", "login", "security"])) return "account";
  if (hasWord(text, ["announcement"])) return "announcement";

  return fallback;
};

const toAttachments = (item: any) => {
  const attachments = [
    ...(Array.isArray(item?.attachments) ? item.attachments : []),
    ...(item?.attachment ? [item.attachment] : []),
  ];
  return attachments.filter(Boolean);
};

const buildRelated = (item: any) => {
  const metadata = item?.metadata || {};
  const related: Array<{ label: string; href?: string }> = [];

  if (metadata.className) related.push({ label: metadata.className });
  if (metadata.courseName) related.push({ label: metadata.courseName });
  if (metadata.resourceTitle) related.push({ label: metadata.resourceTitle, href: metadata.resourceUrl });
  if (metadata.assignmentTitle) related.push({ label: metadata.assignmentTitle, href: metadata.assignmentUrl });
  if (metadata.href || metadata.url) {
    related.push({ label: "Open related item", href: metadata.href || metadata.url });
  }

  return related;
};

const normalizeAnnouncement = (item: any, userId: string): StudentNotification => {
  const sender = item.senderId || item.createdBy;
  const schoolName =
    item.schoolName ||
    item.school?.name ||
    item.schoolId?.name ||
    item.metadata?.schoolName ||
    "School Admin";
  const createdAt = item.publishedAt || item.createdAt || item.scheduledFor || new Date().toISOString();
  const isRead =
    typeof item.isRead === "boolean" ? item.isRead : hasReadByUser(item.readBy, userId);

  return {
    id: `announcement:${item._id || item.id}`,
    rawId: item._id || item.id,
    source: item.source || "school",
    sourceLabel: item.sourceLabel || "School Announcement",
    category: inferCategory(item, "announcement"),
    title: item.title || "School announcement",
    message: item.message || item.content || "No message provided.",
    createdAt,
    unread: !isRead,
    senderName: getSenderName(item, sender, schoolName),
    senderEmail: getSenderEmail(item, sender),
    attachments: toAttachments(item),
    related: buildRelated(item),
    priority: item.priority,
    metadata: item.metadata,
    endpoint: "announcement",
  };
};

const normalizeSystemNotification = (item: any, userId: string): StudentNotification => {
  const sender = item.senderId || item.sender || item.createdBy;
  const isRead =
    typeof item.isRead === "boolean"
      ? item.isRead
      : typeof item.read === "boolean"
        ? item.read
        : hasReadByUser(item.readBy, userId);
  const source = item.source || item.metadata?.source;
  const normalizedSource: NotificationSource =
    source === "school" ? "school" : source === "talim" ? "talim" : "system";
  const senderFallback =
    normalizedSource === "talim"
      ? "Talim Admin"
      : normalizedSource === "school"
        ? "School Admin"
        : "System Notification";

  return {
    id: `notification:${item._id || item.id}`,
    rawId: item._id || item.id,
    source: normalizedSource,
    sourceLabel:
      item.sourceLabel ||
      (normalizedSource === "talim"
        ? "Talim Alert"
        : normalizedSource === "school"
          ? "School Notification"
          : "System Notification"),
    category: inferCategory(item, "other"),
    title: item.title || "Notification",
    message: item.message || item.body || item.content || "No message provided.",
    createdAt: item.createdAt || new Date().toISOString(),
    unread: !isRead,
    senderName: getSenderName(item, sender, senderFallback),
    senderEmail: getSenderEmail(item, sender),
    attachments: toAttachments(item),
    related: buildRelated(item),
    priority: item.priority,
    metadata: item.metadata,
    endpoint: "notification",
  };
};

const sortByNewest = (items: StudentNotification[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const isSchoolAnnouncementNotification = (item: any) => {
  const source = item.source || item.metadata?.source;
  const category = item.category || item.metadata?.category;
  const type = String(item.type || "").toLowerCase();
  return (
    source === "school" &&
    (category === "announcement" ||
      type.includes("announcement") ||
      Boolean(item.metadata?.announcementId))
  );
};

/**
 *
 */
export const useNotifications = () => {
  const { accessToken, isAuthenticated, user } = useAuthContext();
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = getUserId(user);
  const cacheKey = userId ? `student-notifications:${userId}` : "";

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      setNotifications([]);
      setError("You need to sign in to view notifications.");
      setLoading(false);
      return;
    }

    if (!userId) {
      setNotifications([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cachedNotifications = cacheKey ? localStorage.getItem(cacheKey) : null;
      if (cachedNotifications) {
        setNotifications(JSON.parse(cachedNotifications));
      }

      const [announcementsResponse, notificationsResponse] = await Promise.allSettled([
        notificationService.getAnnouncements(accessToken, userId, 1, 50),
        notificationService.getNotifications(accessToken, {
          recipientId: userId,
          page: 1,
          limit: 50,
        }),
      ]);

      const normalized: StudentNotification[] = [];

      if (announcementsResponse.status === "fulfilled") {
        normalized.push(
          ...getNotificationItems(announcementsResponse.value).map((item) =>
            normalizeAnnouncement(item, userId),
          ),
        );
      }

      if (notificationsResponse.status === "fulfilled") {
        normalized.push(
          ...getNotificationItems(notificationsResponse.value)
            .filter((item) => !isSchoolAnnouncementNotification(item))
            .map((item) => normalizeSystemNotification(item, userId)),
        );
      }

      if (announcementsResponse.status === "rejected" && notificationsResponse.status === "rejected") {
        throw new Error("Failed to load notifications.");
      }

      const nextNotifications = sortByNewest(normalized);
      setNotifications(nextNotifications);
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(nextNotifications));
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, cacheKey, isAuthenticated, userId]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000 * 60 * 5);

    // A realtime notification arrived: refresh the list and the bell count.
    let refetchTimer: ReturnType<typeof setTimeout> | undefined;
    const onRealtimeNotification = () => {
      clearTimeout(refetchTimer);
      refetchTimer = setTimeout(fetchNotifications, 500);
    };
    window.addEventListener(NOTIFICATION_EVENT, onRealtimeNotification);

    return () => {
      clearInterval(interval);
      clearTimeout(refetchTimer);
      window.removeEventListener(NOTIFICATION_EVENT, onRealtimeNotification);
    };
  }, [fetchNotifications]);

  const persistNotifications = useCallback(
    (nextNotifications: StudentNotification[]) => {
      setNotifications(nextNotifications);
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(nextNotifications));
      }
    },
    [cacheKey],
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const target = notifications.find((notification) => notification.id === notificationId);
      if (!target || !target.unread || !userId || !accessToken) return;

      const nextNotifications = notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, unread: false } : notification,
      );
      persistNotifications(nextNotifications);

      try {
        if (target.endpoint === "announcement") {
          await notificationService.markAnnouncementAsRead(accessToken, target.rawId, userId);
        } else {
          await notificationService.markNotificationAsRead(accessToken, target.rawId, userId);
        }
        await fetchNotifications();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        persistNotifications(notifications);
        setError("Failed to mark notification as read. Please try again.");
      }
    },
    [accessToken, fetchNotifications, notifications, persistNotifications, userId],
  );

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((notification) => notification.unread);
    if (!unreadNotifications.length || !userId || !accessToken) return;

    persistNotifications(notifications.map((notification) => ({ ...notification, unread: false })));

    const results = await Promise.allSettled(
      unreadNotifications.map((notification) =>
        notification.endpoint === "announcement"
          ? notificationService.markAnnouncementAsRead(accessToken, notification.rawId, userId)
          : notificationService.markNotificationAsRead(accessToken, notification.rawId, userId),
      ),
    );

    if (results.some((result) => result.status === "rejected")) {
      persistNotifications(notifications);
      setError("Some notifications could not be marked as read. Please try again.");
      return;
    }

    await fetchNotifications();
  }, [accessToken, fetchNotifications, notifications, persistNotifications, userId]);

  const counts = useMemo(() => {
    return notifications.reduce(
      (acc, notification) => {
        acc.all += 1;
        if (notification.unread) acc.unread += 1;
        acc[notification.category] = (acc[notification.category] || 0) + 1;
        return acc;
      },
      {
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
      } as Record<NotificationCategory | "all" | "unread", number>,
    );
  }, [notifications]);

  return {
    notifications,
    loading,
    error,
    counts,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
