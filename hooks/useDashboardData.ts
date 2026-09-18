"use client";

import { useMemo } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAttendanceKPIs } from "@/hooks/useAttendanceKPIs";
import { useNotifications } from "@/hooks/useNotifications";
import { usePublishedGradeCourses } from "@/hooks/usePublishedGradeCourses";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useResources } from "@/hooks/useResource";
import { useStudentCumulativeGrade } from "@/hooks/useStudentCumulativeGrade";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { useStudentKPIs } from "@/hooks/useStudentKPIs";
import { useTimetable } from "@/hooks/useTimetable";
import type { ActivityItem } from "@/components/dashboard/ProgressCards";
import { getTodayName, toPercentile, toTodaySchedule, toWeeklySummary } from "@/lib/dashboard/schedule";

/**
 * Every figure the dashboard renders, gathered in one place.
 *
 * All six reads run in parallel off the shared query cache — nothing here
 * waits on anything else, and each section reports its own loading and error
 * state so one slow endpoint never blanks the page.
 *
 * @returns The derived dashboard model.
 */
export function useDashboardData() {
  const { user } = useAuthContext();
  const identity = useStudentIdentity();

  const kpis = useStudentKPIs();
  const attendance = useAttendanceKPIs();
  const timetable = useTimetable();
  const resources = useResources();
  const published = usePublishedGradeCourses();
  const cumulative = useStudentCumulativeGrade();
  const notifications = useNotifications();
  const chat = useRealtimeChat();

  const todayName = getTodayName();
  const todaySchedule = useMemo(() => toTodaySchedule(timetable.subjects), [timetable.subjects]);
  const weeklySummary = useMemo(() => toWeeklySummary(timetable.subjects), [timetable.subjects]);

  const unreadMessages = chat.totalUnread;
  const gradeScore = Math.round(cumulative.cumulativeGrade?.percentage ?? kpis.kpiData?.gradeScore ?? 0);
  const attendanceRate = Math.round(attendance.attendanceData?.attendanceRate ?? kpis.kpiData?.attendanceRate ?? 0);
  const totalStudentsInClass = kpis.kpiData?.totalStudentsInClass ?? 0;
  // `position` is null until the school publishes the term's rankings.
  const classPosition = cumulative.cumulativeGrade?.position ?? kpis.kpiData?.classPosition ?? null;

  const recentResults = useMemo(
    () =>
      (published.courses ?? [])
        .filter((course) => course.currentAverage !== null && course.currentAverage !== undefined)
        .sort(
          (a, b) =>
            new Date(b.latestPublishedAssessment?.publishedAt ?? 0).getTime() -
            new Date(a.latestPublishedAssessment?.publishedAt ?? 0).getTime()
        )
        .slice(0, 3),
    [published.courses]
  );

  const recentResources = useMemo(
    () =>
      [...resources.resources]
        .sort(
          (a, b) =>
            new Date(b.uploadDate ?? b.createdAt ?? 0).getTime() - new Date(a.uploadDate ?? a.createdAt ?? 0).getTime()
        )
        .slice(0, 3),
    [resources.resources]
  );

  const recentActivity = useMemo<ActivityItem[]>(
    () =>
      [
        ...(notifications.notifications ?? []).slice(0, 4).map((item) => ({
          type: item.category,
          label: item.title || item.message || "New notification",
          time: new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          href: "/notifications",
        })),
        ...(unreadMessages > 0
          ? [
              {
                type: "messages",
                label: `You have ${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}`,
                time: "Now",
                href: "/messages",
              },
            ]
          : []),
      ].slice(0, 5),
    [notifications.notifications, unreadMessages]
  );

  const errors = [
    kpis.error ? `Dashboard metrics: ${kpis.error}` : null,
    attendance.error ? `Attendance: ${attendance.error}` : null,
    published.error ? `Results: ${published.error}` : null,
    cumulative.error ? `Academic progress: ${cumulative.error}` : null,
    notifications.error ? `Notifications: ${notifications.error}` : null,
    chat.error ? `Messages: ${chat.error}` : null,
  ].filter((message): message is string => Boolean(message));

  return {
    identity,
    errors,
    /** Only the KPI read blocks the first paint; the rest stream in. */
    isInitialLoading: kpis.isLoading && !kpis.kpiData,

    studentName: kpis.kpiData?.firstName || user?.firstName || "Student",
    schoolName: user?.schoolName ?? null,
    className: kpis.kpiData?.classInfo?.name || attendance.attendanceData?.classInfo?.name || identity.className || "Your class",
    currentTerm: kpis.kpiData?.currentTerm?.name || attendance.attendanceData?.termInfo?.name || "Current Term",

    kpis,
    attendance,
    timetable,
    resources,
    published,
    cumulative,
    notifications,
    chat,

    todayName,
    todaySchedule,
    weeklySummary,
    completedClasses: todaySchedule.filter((item) => item.status === "Completed").length,
    upcomingClasses: todaySchedule.filter((item) => item.status !== "Completed").length,
    unreadMessages,
    unreadUpdates: (notifications.counts?.unread ?? 0) + unreadMessages,
    publishedAssessmentCount:
      published.courses?.reduce((sum, course) => sum + (course.publishedAssessmentsCount || 0), 0) ?? 0,
    gradeScore,
    attendanceRate,
    totalStudentsInClass,
    classPosition,
    percentile: toPercentile(classPosition, totalStudentsInClass),
    recentResults,
    recentResources,
    recentActivity,

    /** Refetches every section that can fail. */
    refetchAll: () => {
      kpis.refetch();
      attendance.refetch();
      published.refetch();
      cumulative.refetch();
      void notifications.refetch();
    },
  };
}
