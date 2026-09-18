"use client";

import { useQuery } from "@tanstack/react-query";
import { gradesService, type PublishedAssessmentResult } from "@/services/grades.service";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";

export type { PublishedAssessmentResult };

/**
 * The signed-in student's published results for one course in a term. Each
 * entry already carries `percentage`, `gradeLevel` and the class comparison —
 * the API enriches these, so nothing is recomputed here.
 *
 * @param courseId - The course to read, or `null` while none is selected.
 * @param termId - The term to read.
 * @returns The results with their query state.
 */
export const usePublishedCourseAssessments = (courseId: string | null, termId?: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.grades.publishedAssessments(courseId ?? "none", termId ?? "none"),
    enabled: Boolean(courseId && termId),
    staleTime: staleTimes.list,
    queryFn: () => gradesService.getPublishedAssessmentsForCourse(courseId as string, termId as string),
  });

  return {
    assessments: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load these results.") : null,
    refetch: () => {
      void query.refetch();
    },
  };
};
