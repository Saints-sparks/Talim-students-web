"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys } from "@/lib/queryKeys";

/** Fired by RealtimeAlerts for every socket `notification` event. */
const NOTIFICATION_EVENT = "talim:notification";

/**
 * Unread notification counts (`GET /notifications/counts`) for the bell and
 * the Updates badge: one small request, shared by every component that shows
 * a count, instead of loading the whole inbox on every page. A live
 * notification refreshes it.
 *
 * @returns The unread total (0 while loading) and the counts per category.
 */
export function useNotificationCounts() {
  const { userId, isReady } = useStudentIdentity();
  const queryClient = useQueryClient();
  const key = queryKeys.notifications.counts(userId ?? "anonymous");

  const query = useQuery({
    queryKey: key,
    enabled: Boolean(isReady && userId),
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
    queryFn: () => accountService.getNotificationCounts(),
  });

  useEffect(() => {
    if (!userId) return undefined;
    const onRealtime = () => void queryClient.invalidateQueries({ queryKey: key });
    window.addEventListener(NOTIFICATION_EVENT, onRealtime);
    return () => window.removeEventListener(NOTIFICATION_EVENT, onRealtime);
    // The key is derived from userId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, userId]);

  return { unread: query.data?.unread ?? 0, byCategory: query.data?.byCategory ?? {}, isLoading: query.isPending };
}
