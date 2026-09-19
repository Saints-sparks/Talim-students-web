"use client";

import { useQuery } from "@tanstack/react-query";
import { gradesService, type StudentCumulativeGrade } from "@/services/grades.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { ApiError, getErrorMessage } from "@/lib/apiError";

export type { StudentCumulativeGrade };

/**
 * The signed-in student's overall record for the current term.
 *
 * The API answers `null` — not an error — while the school has not calculated
 * the term yet, and nulls `position` until positions are published, so both
 * are normal states rather than failures.
 *
 * @returns The record (or `null`) with its query state. `errorCause` is the
 * thrown value, for branching on `error.code`.
 */
export const useStudentCumulativeGrade = () => {
  const { termId, isReady } = useStudentIdentity();

  const query = useQuery({
    queryKey: queryKeys.grades.cumulativeByTerm(termId ?? "none"),
    enabled: Boolean(isReady && termId),
    staleTime: staleTimes.list,
    queryFn: () => gradesService.getCumulativeGradeByTerm(termId as string),
  });

  // A missing record is expected before end-of-term calculations run.
  const isMissing = query.error instanceof ApiError && query.error.code === "NOT_FOUND";

  return {
    cumulativeGrade: query.data ?? null,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    isFetching: query.isFetching,
    error:
      query.error && !isMissing
        ? getErrorMessage(query.error, "We couldn't load your term result.")
        : null,
    errorCause: query.error && !isMissing ? query.error : null,
    refetch: () => {
      void query.refetch();
    },
  };
};
