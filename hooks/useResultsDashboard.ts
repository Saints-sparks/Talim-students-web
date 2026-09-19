"use client";

import { useCallback, useMemo, useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { usePublishedCourseAssessments } from "@/hooks/usePublishedCourseAssessments";
import { usePublishedGradeCourses } from "@/hooks/usePublishedGradeCourses";
import { useStudentCumulativeGrade } from "@/hooks/useStudentCumulativeGrade";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys } from "@/lib/queryKeys";
import { resolveSelectedCourseId, summariseCourses } from "@/lib/results";
import type { PublishedCourse } from "@/services/grades.service";

const NO_COURSES: PublishedCourse[] = [];

/**
 * Everything the Results screen needs: the class's courses, the term record,
 * the open course's published results, and one refresh that reloads them all.
 *
 * Every read goes to `/grade-records/student/me/*`, which resolves the student
 * from the session, so no student id exists on the client side of these calls.
 * The open course is always one the API listed for this student.
 *
 * @returns The data, the open course and its results, and the load states.
 */
export function useResultsDashboard() {
  const queryClient = useQueryClient();
  const identity = useStudentIdentity();
  const [requestedCourseId, setRequestedCourseId] = useState<string | null>(null);

  const coursesQuery = usePublishedGradeCourses();
  const cumulative = useStudentCumulativeGrade();
  const courses = coursesQuery.courses ?? NO_COURSES;

  const selectedCourseId = useMemo(
    () => resolveSelectedCourseId(courses, requestedCourseId),
    [courses, requestedCourseId]
  );
  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );
  const assessments = usePublishedCourseAssessments(selectedCourseId, coursesQuery.termId);
  const summary = useMemo(() => summariseCourses(courses), [courses]);

  /** Marks every cached result stale and reloads the ones on screen. */
  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.grades.all });
  }, [queryClient]);
  const isRefreshing = useIsFetching({ queryKey: queryKeys.grades.all }) > 0;

  return {
    courses,
    summary,
    selectedCourse,
    selectedCourseId,
    selectCourse: setRequestedCourseId,
    cumulative,
    assessments,
    /** The session is still settling, or the course list is on its first load. */
    isLoading: !identity.isReady || coursesQuery.isLoading,
    /** The school has not marked a current term, so there is nothing to ask for. */
    hasNoTerm: identity.isReady && !coursesQuery.termId,
    coursesError: coursesQuery.errorCause,
    isRefreshing,
    refresh,
  };
}
