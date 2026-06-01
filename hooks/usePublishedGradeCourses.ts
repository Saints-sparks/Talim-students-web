import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { gradesService, PublishedCourse } from "@/services/grades.service";

function classifyError(err: unknown): string {
  if (!(err instanceof Error)) return "Failed to fetch published courses";
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

export const usePublishedGradeCourses = () => {
  const [courses, setCourses] = useState<PublishedCourse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, accessToken } = useAuthContext();

  const fetchCourses = useCallback(async () => {
    if (!accessToken) {
      setError("No access token available");
      setIsLoading(false);
      return;
    }

    const termId = user?.termId;
    if (!termId) {
      setError("Term ID not available");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await gradesService.getPublishedCoursesByTerm(termId, accessToken);
      setCourses(data);
    } catch (err) {
      setError(classifyError(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user?.termId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, isLoading, error, refetch: fetchCourses, termId: user?.termId };
};
