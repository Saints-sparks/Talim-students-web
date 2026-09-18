"use client";

import { useQuery } from "@tanstack/react-query";
import { gradesService, type StudentKPIData } from "@/services/grades.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";

export type { StudentKPIData };

/**
 * Dashboard KPI tiles for the signed-in student. The endpoint always answers
 * for the school's current term — it takes no term parameter.
 *
 * @param studentId - Override the resolved student id (tests and previews).
 * @returns The KPI payload with its loading/error state and a refetch.
 */
export const useStudentKPIs = (studentId?: string) => {
  const { studentId: resolvedId, isReady } = useStudentIdentity();
  const targetStudentId = studentId ?? resolvedId;

  const query = useQuery({
    queryKey: queryKeys.student.kpis(targetStudentId ?? "anonymous"),
    enabled: Boolean(isReady && targetStudentId),
    staleTime: staleTimes.list,
    queryFn: () => gradesService.getStudentKPIs(targetStudentId as string),
  });

  return {
    kpiData: query.data ?? null,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load your performance summary.") : null,
    refetch: () => {
      void query.refetch();
    },
  };
};
