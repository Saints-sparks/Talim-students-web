// hooks/useCurriculum.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { classService, type ClassData } from "@/services/class.service";
import { curriculumService, type Course, type CurriculumDetail } from "@/services/curriculum.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";

export type { Course, CurriculumDetail, ClassData };

/**
 * Normalises a course whose relations the API may return as bare ids.
 *
 * @param course - A course from the class endpoint.
 * @returns The same course with object-shaped relations.
 */
export function normaliseCourse(course: ClassData["courses"][number]): Course {
  const asObject = <T extends object>(value: unknown, fallback: T): T =>
    typeof value === "string" ? ({ _id: value, ...fallback } as T) : ((value as T) ?? undefined) ?? fallback;

  return {
    _id: course._id,
    title: course.title,
    description: course.description ?? "",
    courseCode: course.courseCode ?? "",
    subjectId: asObject(course.subjectId, { _id: "", name: "", code: "" }),
    teacherId: asObject(course.teacherId, { _id: "", firstName: "", lastName: "", email: "" }),
    classId: asObject(course.classId, { _id: "", name: "", level: "" }),
    createdAt: "",
    updatedAt: "",
  } as Course;
}

/**
 * The subject a course belongs to, for display.
 *
 * @param course - The course to label.
 * @returns The subject's name, or a neutral placeholder.
 */
export function subjectNameOf(course: Pick<Course, "subjectId">): string {
  return course.subjectId?.name || "Unknown Subject";
}

/**
 * The teacher who takes a course, for display.
 *
 * @param course - The course to label.
 * @returns The teacher's full name, or a neutral placeholder.
 */
export function teacherNameOf(course: Pick<Course, "teacherId">): string {
  const teacher = course.teacherId;
  const name = teacher ? `${teacher.firstName ?? ""} ${teacher.lastName ?? ""}`.trim() : "";
  return name || "Unknown Teacher";
}

/**
 * The courses taught to the signed-in student's class.
 *
 * @returns The class, its normalised courses, and the query state.
 */
export function useClassCourses() {
  const { classId, isReady } = useStudentIdentity();

  const query = useQuery({
    queryKey: queryKeys.curriculum.coursesByClass(classId ?? "unknown"),
    enabled: Boolean(isReady && classId),
    staleTime: staleTimes.reference,
    queryFn: ({ signal }) => classService.getClassById(classId as string, { signal }),
  });

  return {
    classId,
    classData: query.data ?? null,
    courses: (query.data?.courses ?? []).map(normaliseCourse),
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load your class.") : null,
    refetch: () => {
      void query.refetch();
    },
  };
}

/**
 * The curriculum for one course in one term.
 *
 * @param courseId - The course to read, or `null` while none is selected.
 * @param termId - The term to read.
 * @returns The curriculum documents with their query state.
 */
export function useCourseCurriculum(courseId: string | null, termId: string | null) {
  const query = useQuery({
    queryKey: [...queryKeys.curriculum.byCourse(courseId ?? "none"), termId ?? "none"],
    enabled: Boolean(courseId && termId),
    staleTime: staleTimes.reference,
    queryFn: () => curriculumService.getCurriculumByCourseAndTerm(courseId as string, termId as string),
  });

  return {
    curricula: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load this curriculum.") : null,
    refetch: () => {
      void query.refetch();
    },
  };
}
