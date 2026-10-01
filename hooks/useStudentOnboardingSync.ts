"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboarding, type StudentOnboardingStepId } from "@/contexts/OnboardingContext";
import { accountService } from "@/services/account.service";
import { learnerService } from "@/services/learner.service";
import { queryKeys, staleTimes } from "@/lib/queryKeys";

/** The page of files the Files screen opens on; the same key, so the cache is shared. */
const FIRST_FILES_PAGE = { page: 1, limit: 20 } as const;

/** User ids already synced in this tab, so a remount never repeats the checks. */
const syncedUsers = new Set<string>();

/**
 * Forgets which students were synced (tests, and a sign-out in the same tab).
 */
export function resetOnboardingSync(): void {
  syncedUsers.clear();
}

/**
 * Ticks the setup steps the student has already done, once per sign-in.
 *
 * It used to send five requests on every route change. Now it runs once per
 * student per tab, skips everything when the steps are all done, and reads
 * through the query cache with the screens' own keys (notification counts,
 * this week's timetable, the first page of files), so at most three requests
 * go out and the screens then open from the cache. The steps are also ticked
 * when the student visits Updates or Timetable, or opens a file.
 *
 * @returns `syncProgress`, which resolves when the checks are done.
 */
export function useStudentOnboardingSync() {
  const { user } = useAuthContext();
  const { markStepComplete, isStepComplete, isHydrated } = useStudentOnboarding();
  const queryClient = useQueryClient();

  const syncProgress = useCallback(async () => {
    const userId = (user?.userId || user?.id) as string | undefined;
    if (!user || !userId || !isHydrated || syncedUsers.has(userId)) return;
    syncedUsers.add(userId);

    if (user.firstName && user.lastName) markStepComplete("student-profile");

    const pending = (id: StudentOnboardingStepId) => !isStepComplete(id);
    const checks: Array<Promise<void>> = [];

    if (pending("view-notifications")) {
      checks.push(
        queryClient
          .fetchQuery({ queryKey: queryKeys.notifications.counts(userId), staleTime: 60_000, queryFn: () => accountService.getNotificationCounts() })
          .then((counts) => {
            if (counts.all > 0) markStepComplete("view-notifications");
          })
      );
    }
    if (pending("view-timetable")) {
      checks.push(
        queryClient
          .fetchQuery({ queryKey: queryKeys.learner.timetable(userId), staleTime: staleTimes.reference, queryFn: () => learnerService.getTimetable() })
          .then((week) => {
            if (week.lessons.length > 0) markStepComplete("view-timetable");
          })
      );
    }
    if (pending("download-resource")) {
      checks.push(
        queryClient
          .fetchQuery({ queryKey: queryKeys.learner.files(userId, FIRST_FILES_PAGE), staleTime: staleTimes.list, queryFn: () => learnerService.getFiles(FIRST_FILES_PAGE) })
          .then((page) => {
            if (page.meta.total > 0) markStepComplete("download-resource");
          })
      );
    }
    await Promise.allSettled(checks);
  }, [isHydrated, isStepComplete, markStepComplete, queryClient, user]);

  return { syncProgress };
}
