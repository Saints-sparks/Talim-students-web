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

  const { user, accessToken, isLoading: authLoading } = useAuthContext();

  const fetchGrade = useCallback(async () => {
    // Auth is still initialising — stay in loading state, do not set errors
    if (authLoading) return;

    if (!accessToken || !user?.termId) {
      // Auth finished but no valid session — stop loading without an error
      setIsLoading(false);
      return;
    }

    const termId = user.termId as string;

    setIsLoading(true);
    setError(null);

    try {
      const data = await gradesService.getCumulativeGradeByTerm(termId, accessToken);
      setCumulativeGrade(data);
    } catch (err) {
      // A missing cumulative record is normal — student hasn't had end-of-term
      // calculations run yet. Treat it as null, not an error.
      const msg = err instanceof Error ? err.message.toLowerCase() : "";
      const isNotFound =
        msg.includes("not found") || msg.includes("404") || msg.includes("no cumulative");
      if (!isNotFound) {
        setError(classifyError(err));
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user?.termId, authLoading]);

  useEffect(() => {
    fetchGrade();
  }, [fetchGrade]);

  return { cumulativeGrade, isLoading, error, refetch: fetchGrade };
};
