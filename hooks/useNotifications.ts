"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { accountService } from "@/services/account.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";
import { countByCategory, itemsOf, normalizeNotification, sortByNewest, type StudentNotification } from "@/lib/notifications/normalize";

export type {
  NotificationCategory,
  NotificationCounts,
  NotificationSource,
  StudentNotification,
} from "@/lib/notifications/normalize";

/** Fired by RealtimeAlerts for every socket `notification` event. */
export const NOTIFICATION_EVENT = "talim:notification";

const PAGE_SIZE = 50;
const POLL_INTERVAL_MS = 5 * 60_000;

/**
 * The student's inbox, newest first: `GET /notifications`, the one feed
 * (A10) that holds school announcements and system notifications alike,
 * each row carrying its own read state. Marking one read, or all of them
 * (one `PATCH /notifications/read-all`), is optimistic and rolls back if the
 * write fails.
 *
 * @returns The notifications, per-tab counts, and the read actions.
 */
export const useNotifications = () => {
  const { userId, isReady } = useStudentIdentity();
  const queryClient = useQueryClient();
  const queryKey = queryKeys.notifications.list(userId ?? "anonymous", { limit: PAGE_SIZE });

  const query = useQuery({
    queryKey,
    enabled: Boolean(isReady && userId),
    staleTime: staleTimes.list,
    refetchInterval: POLL_INTERVAL_MS,
    queryFn: async (): Promise<StudentNotification[]> => {
      const id = userId as string;
      // One feed (A10): announcements reach each recipient as a notification
      // row that holds its read state, so `/notifications` is the whole inbox.
      const page = await notificationService.getNotifications(undefined, { page: 1, limit: PAGE_SIZE });
      return sortByNewest(itemsOf(page).map((item) => normalizeNotification(item, id)));
    },
  });

  const notifications = useMemo(() => query.data ?? [], [query.data]);

  // A realtime notification arrived: refresh the list and the bell count.
  useEffect(() => {
    if (!userId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onRealtime = () => {
      clearTimeout(timer);
      timer = setTimeout(() => void queryClient.invalidateQueries({ queryKey }), 500);
    };
    window.addEventListener(NOTIFICATION_EVENT, onRealtime);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(NOTIFICATION_EVENT, onRealtime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, userId]);

  const markRead = useMutation({
    // Opening one update marks its row; an announcement's row included (A10).
    mutationFn: async (targets: StudentNotification[]) => {
      await Promise.all(targets.map((target) => notificationService.markNotificationAsRead(undefined, target.rawId)));
    },
    onMutate: async (targets) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<StudentNotification[]>(queryKey);
      const ids = new Set(targets.map((target) => target.id));
      queryClient.setQueryData<StudentNotification[]>(queryKey, (current) =>
        (current ?? []).map((item) => (ids.has(item.id) ? { ...item, unread: false } : item))
      );
      return { previous };
    },
    onError: (error, _targets, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      logger.error("notifications", "Marking as read failed", error);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.counts(userId ?? "anonymous") });
    },
  });

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const target = notifications.find((item) => item.id === notificationId);
      if (!target?.unread || !userId) return;
      await markRead.mutateAsync([target]).catch(() => undefined);
    },
    [markRead, notifications, userId]
  );

  // One `PATCH /notifications/read-all` (it covers announcements too), never
  // one request per unread item. Optimistic, rolled back if the write fails.
  const markAll = useMutation({
    mutationFn: () => accountService.markAllNotificationsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<StudentNotification[]>(queryKey);
      queryClient.setQueryData<StudentNotification[]>(queryKey, (current) =>
        (current ?? []).map((item) => (item.unread ? { ...item, unread: false } : item))
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      logger.error("notifications", "Marking everything as read failed", error);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.counts(userId ?? "anonymous") });
    },
  });

  /**
   * Marks every notification and announcement read with one read-all call.
   *
   * @returns Resolves when the call settles (failures roll back and show `error`).
   */
  const markAllAsRead = useCallback(async () => {
    if (!userId || !notifications.some((item) => item.unread)) return;
    await markAll.mutateAsync().catch(() => undefined);
  }, [markAll, notifications, userId]);

  const counts = useMemo(() => countByCategory(notifications), [notifications]);

  return {
    notifications,
    loading: query.isPending && query.fetchStatus !== "idle",
    error: query.error
      ? messageForError(query.error, "We couldn't load your notifications.")
      : markRead.error
        ? messageForError(markRead.error, "That couldn't be marked as read.")
        : markAll.error
          ? messageForError(markAll.error, "We couldn't mark everything as read.")
          : null,
    counts,
    refetch: () => queryClient.invalidateQueries({ queryKey }),
    markAsRead,
    markAllAsRead,
    isMarkingAll: markAll.isPending,
  };
};
