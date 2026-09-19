"use client";

import { useQuery } from "@tanstack/react-query";
import { gradesService, type PublishedCourse } from "@/services/grades.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";

export type { PublishedCourse };

/**
 * Every course in the signed-in student's class for the current term, with how
 * many results have been published for each. The route resolves the student
 * from the JWT, so no id is sent.
 *
 * @returns The courses, the term they cover, and the query state. `errorCause`
 * is the thrown value, for branching on `error.code`.
 */
export const usePublishedGradeCourses = () => {
  const { termId, isReady } = useStudentIdentity();

  const query = useQuery({
    queryKey: queryKeys.grades.courses(termId ?? "none"),
    enabled: Boolean(isReady && termId),
    staleTime: staleTimes.list,
    queryFn: () => gradesService.getPublishedCoursesByTerm(termId as string),
  });

  return {
    courses: query.data ?? null,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    isFetching: query.isFetching,
    error: query.error ? getErrorMessage(query.error, "We couldn't load your subjects.") : null,
    errorCause: query.error ?? null,
    refetch: () => {
      void query.refetch();
    },
    termId,
  };
};
