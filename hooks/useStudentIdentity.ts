"use client";

import { useAuthContext } from "@/contexts/AuthContext";

/** The ids every student screen needs, straight off the introspected session. */
export interface StudentIdentity {
  /** The user-account id (`/students/by-user/:userId`). */
  userId: string | null;
  /** The student profile id, which id-taking routes expect. */
  studentId: string | null;
  /** The class the student belongs to. */
  classId: string | null;
  /** Human-readable class name, when the session carries one. */
  className: string | null;
  /** The school's current term, or `null` when no term is marked current. */
  termId: string | null;
  /** True once the session has finished loading. */
  isReady: boolean;
}

/**
 * The signed-in student's ids, with no request of its own.
 *
 * `/auth/introspect` already returns `studentId`, `classId`, `className` and
 * the school's current `termId`, so screens read them from here instead of
 * re-fetching the student record. Fall back to {@link useStudentProfile} only
 * when the full academic record (guardian, grade level) is needed.
 *
 * @returns The ids and whether the session has settled.
 */
export function useStudentIdentity(): StudentIdentity {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  const asString = (value: unknown): string | null =>
    typeof value === "string" && value.length > 0 ? value : null;

  return {
    userId: asString(user?.userId) ?? asString(user?.id),
    studentId: asString(user?.studentId),
    classId: asString(user?.classId),
    className: asString(user?.className),
    termId: asString(user?.termId),
    isReady: !isLoading && isAuthenticated,
  };
}
