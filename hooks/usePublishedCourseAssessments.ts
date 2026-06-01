import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  gradesService,
  PublishedAssessmentResult,
} from "@/services/grades.service";

function classifyError(err: unknown): string {
  if (!(err instanceof Error)) return "Failed to fetch published assessments";
  const m = err.message;
  if (m.includes("fetch") || m.includes("network") || m.includes("Failed to fetch"))
    return "Unable to connect to the server. Please check your internet connection.";
  if (m.includes("401") || m.toLowerCase().includes("unauthorized"))
    return "Your session has expired. Please log in again.";
  if (m.includes("403"))
    return "You don't have permission to access this data.";
  if (m.includes("500") || m.toLowerCase().includes("server"))
    return "Server error. Please try again later.";
  return m;
}

export const usePublishedCourseAssessments = (
  courseId: string | null,
  termId?: string
) => {
  const [assessments, setAssessments] = useState<PublishedAssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuthContext();

  const fetchAssessments = useCallback(async () => {
    if (!courseId || !termId || !accessToken) {
      setAssessments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await gradesService.getPublishedAssessmentsForCourse(
        courseId,
        termId,
        accessToken
      );
      setAssessments(data);
    } catch (err) {
      setError(classifyError(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, courseId, termId]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return { assessments, isLoading, error, refetch: fetchAssessments };
};
