// hooks/useAcademicDetails.ts
"use client";

import { useStudentProfile } from "@/hooks/useStudentProfile";
import type { AcademicDetails } from "@/types/auth";

/**
 * The signed-in student's academic record — class, grade level and guardian
 * contact. A thin view over {@link useStudentProfile}, which holds the one
 * cached copy of `/students/by-user/:userId`.
 *
 * @returns The record, its loading/error state and a refresh function.
 */
export const useAcademicDetails = (): {
  academicData: AcademicDetails | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
} => {
  const { details, isLoading, error, refetch } = useStudentProfile();

  return {
    academicData: details,
    loading: isLoading,
    error,
    refresh: () => {
      void refetch();
    },
  };
};
