"use client";

import { useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { notificationService } from "@/services/notification.service";
import { studentService } from "@/services/student.service";
import { ResourceServices } from "@/services/resource.service";
import { timetableService } from "@/services/timetable.service";
import type { AcademicResponse } from "@/types/auth";

/**
 * Whether a response carries at least one item, across the three shapes the
 * onboarding-sync checks use: a paginated `{data,meta}` or `{data,total}`
 * page, a bare array, or a day-keyed timetable object.
 *
 * @param value - The parsed response body.
 * @returns True when it holds anything.
 */
function hasItems(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;

  const meta = record.meta as Record<string, unknown> | undefined;
  if (typeof meta?.total === "number") return meta.total > 0;
  if (typeof record.total === "number") return record.total > 0;
  if (Array.isArray(value)) return value.length > 0;

  return Object.values(record).some((entry) => Array.isArray(entry) && entry.length > 0);
}

/**
 *
 */
export function useStudentOnboardingSync() {
  const { user, accessToken } = useAuthContext();
  const { markStepComplete } = useStudentOnboarding();

  const syncProgress = useCallback(async () => {
    if (!user || !accessToken) return;
    const userId = user.userId || user.id;
    if (!userId) return;

    // student-profile: user object always carries name when profile is set
    if (user.firstName && user.lastName) {
      markStepComplete("student-profile");
    }

    // view-notifications: check both notifications and announcements
    const notifResults = await Promise.allSettled([
      notificationService.getNotifications(accessToken, {
        recipientId: userId,
        page: 1,
        limit: 1,
      }),
      notificationService.getAnnouncements(accessToken, userId, 1, 1),
    ]);
    if (
      notifResults.some((result) => result.status === "fulfilled" && hasItems(result.value))
    ) {
      markStepComplete("view-notifications");
    }

    // download-resource + view-timetable require the student's classId
    let classId: string | null = null;
    try {
      const academic = (await studentService.getAcademicDetails(userId, accessToken)) as AcademicResponse;
      classId = academic?.data?.[0]?.classId ?? null;
    } catch {
      // if we can't get classId, skip these two checks
    }

    if (classId) {
      const [resourceResult, timetableResult] = await Promise.allSettled([
        ResourceServices.getResourceDetails(classId, accessToken),
        timetableService.getTimetableByClass(classId, accessToken),
      ]);

      if (resourceResult.status === "fulfilled" && hasItems(resourceResult.value)) {
        markStepComplete("download-resource");
      }
      if (timetableResult.status === "fulfilled" && hasItems(timetableResult.value)) {
        markStepComplete("view-timetable");
      }
    }
  }, [user, accessToken, markStepComplete]);

  return { syncProgress };
}
