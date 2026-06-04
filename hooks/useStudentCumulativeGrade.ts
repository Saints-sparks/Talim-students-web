import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { gradesService, StudentCumulativeGrade } from "@/services/grades.service";

function classifyError(err: unknown): string {
  if (!(err instanceof Error)) return "Failed to fetch cumulative grade";
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

export const useStudentCumulativeGrade = () => {
  const [cumulativeGrade, setCumulativeGrade] = useState<StudentCumulativeGrade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, accessToken } = useAuthContext();

  const fetchGrade = useCallback(async () => {
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
      const data = await gradesService.getCumulativeGradeByTerm(termId, accessToken);
      setCumulativeGrade(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : "";
      const isNotFound =
        msg.includes("not found") || msg.includes("404") || msg.includes("no cumulative");
      if (isNotFound) {
        setCumulativeGrade(null);
      } else {
        setError(classifyError(err));
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user?.termId]);

  useEffect(() => {
    fetchGrade();
  }, [fetchGrade]);

  return { cumulativeGrade, isLoading, error, refetch: fetchGrade };
};
