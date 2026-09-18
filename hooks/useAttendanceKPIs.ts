"use client";

import { useQuery } from "@tanstack/react-query";
import { attendanceService, type AttendanceKPIData } from "@/services/attendance.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";

export type { AttendanceKPIData };

/**
 * Attendance KPI tiles for the signed-in student.
 *
 * @param studentId - Override the resolved student id (tests and previews).
 * @returns The KPI payload with its loading/error state and a refetch.
 */
export const useAttendanceKPIs = (studentId?: string) => {
  const { studentId: resolvedId, isReady } = useStudentIdentity();
  const targetStudentId = studentId ?? resolvedId;

  const query = useQuery({
    queryKey: queryKeys.attendance.kpis(targetStudentId ?? "anonymous"),
    enabled: Boolean(isReady && targetStudentId),
    staleTime: staleTimes.list,
    queryFn: () => attendanceService.getAttendanceKPIs(targetStudentId as string),
  });

  return {
    attendanceData: query.data ?? null,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load your attendance.") : null,
    refetch: () => {
      void query.refetch();
    },
  };
};
