import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import type { AcademicResponse } from "@/types/auth";
import type { StudentKPIData } from "@/services/grades.service";

// services/student.service.ts
export const studentService = {
  /**
   * The student profile behind a user account — class, grade level and
   * guardian contact. The API scopes this to the caller.
   *
   * @param userId - The signed-in student's user-account id.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The paginated academic-details payload.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getAcademicDetails: (userId: string, accessToken?: string): Promise<AcademicResponse> =>
    api.get<AcademicResponse>(`${API_BASE_URL}/students/by-user/${userId}`, { accessToken }),

  /**
   * Dashboard KPI tiles for one student.
   *
   * @param studentId - The student profile id.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The KPI payload, always for the school's current term — the
   *   endpoint takes no term parameter and silently ignores `?termId=`.
   * @throws {ApiError} `NOT_FOUND` when the id is not the caller's.
   */
  getDashboardKPIs: (studentId: string, accessToken?: string): Promise<StudentKPIData> =>
    api.get<StudentKPIData>(`${API_BASE_URL}/students/${studentId}/dashboard/kpis`, { accessToken }),
};
