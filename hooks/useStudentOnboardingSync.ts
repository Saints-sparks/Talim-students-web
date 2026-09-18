"use client";

import { useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { notificationService } from "@/services/notification.service";
import { studentService } from "@/services/student.service";
import { ResourceServices } from "@/services/resource.service";
import { timetableService } from "@/services/timetable.service";
import type { AcademicResponse } from "@/types/auth";

const hasItems = (value: any): boolean => {
  if (!value) return false;
  // Paginated response: { data: [], meta: { total } }
  if (typeof value?.meta?.total === "number") return value.meta.total > 0;
  if (typeof value?.total === "number") return value.total > 0;
  // Plain array
  if (Array.isArray(value)) return value.length > 0;
  // Day-keyed timetable object: { Monday: [], Tuesday: [], ... }
  if (typeof value === "object") {
    return Object.values(value).some(
      (v) => Array.isArray(v) && (v as any[]).length > 0
    );
  }
  return false;
};

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
    if (notifResults.some((r) => r.status === "fulfilled" && hasItems((r as PromiseFulfilledResult<any>).value))) {
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

      if (resourceResult.status === "fulfilled" && hasItems((resourceResult as PromiseFulfilledResult<any>).value)) {
        markStepComplete("download-resource");
      }
      if (timetableResult.status === "fulfilled" && hasItems((timetableResult as PromiseFulfilledResult<any>).value)) {
        markStepComplete("view-timetable");
      }
    }
  }, [user, accessToken, markStepComplete]);

  return { syncProgress };
}
