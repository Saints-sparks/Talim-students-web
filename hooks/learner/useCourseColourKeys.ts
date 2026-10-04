"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys } from "@/lib/queryKeys";
import type { StudentSubjects, StudentToday } from "@/types/learner";

/**
 * Course id → the API's `colourKey`, read from the Subjects (B3) or Today (B1)
 * answers already in the cache, for payloads that carry a course id but no
 * colour (chat rooms). Never sends a request; empty until either screen has
 * loaded once, and callers then fall back to hashing the id.
 *
 * @returns The map.
 */
export function useCourseColourKeys(): Map<string, number> {
  const { userId } = useStudentIdentity();
  const scope = userId ?? "anonymous";
  const subjects = useQuery<StudentSubjects>({ queryKey: queryKeys.learner.subjects(scope), enabled: false });
  const today = useQuery<StudentToday>({ queryKey: queryKeys.learner.today(scope), enabled: false });
  return useMemo(() => {
    const keys = new Map<string, number>();
    for (const total of today.data?.subjectTotals ?? []) keys.set(total.courseId, total.colourKey);
    for (const subject of subjects.data?.subjects ?? []) keys.set(subject.course.id, subject.course.colourKey);
    return keys;
  }, [subjects.data, today.data]);
}
