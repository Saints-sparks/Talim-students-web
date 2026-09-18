"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { studentService } from "@/services/student.service";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";
import type { AcademicDetails } from "@/types/auth";

/** What the rest of the app needs out of the student's own profile. */
export interface StudentProfile {
  /** The student profile document id — what id-taking routes expect. */
  studentId: string | null;
  /** The class the student belongs to. */
  classId: string | null;
  /** Everything the API returned, for screens that show more. */
  details: AcademicDetails | null;
}

/**
 * The signed-in student's own profile: their student id and class id.
 *
 * Five screens used to fetch `/students/by-user/:userId` separately on every
 * mount; this is the one cached read they all share. The route resolves the
 * caller from the JWT and 404s for anyone else's id, so a student can only
 * ever load their own record.
 *
 * @returns The profile plus the query's loading/error state.
 */
export function useStudentProfile() {
  const { isAuthenticated } = useAuthContext();
  const identity = useStudentIdentity();
  const userId = identity.userId;

  const query = useQuery({
    queryKey: queryKeys.student.byUser(userId ?? "anonymous"),
    enabled: Boolean(isAuthenticated && userId),
    staleTime: staleTimes.reference,
    queryFn: async (): Promise<StudentProfile> => {
      const response = await studentService.getAcademicDetails(userId as string);
      const details = response?.data?.[0] ?? null;
      return {
        studentId: details?._id ?? null,
        classId: details?.classId ?? null,
        details,
      };
    },
  });

  return {
    profile: query.data ?? null,
    // The session already carries both ids; the fetched record is the fallback
    // for sessions minted before introspect started returning them.
    studentId: identity.studentId ?? query.data?.studentId ?? null,
    classId: identity.classId ?? query.data?.classId ?? null,
    details: query.data?.details ?? null,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load your student record.") : null,
    errorCode: query.error,
    refetch: query.refetch,
  };
}
