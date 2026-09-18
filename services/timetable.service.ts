// services/timetable.service.ts
import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import type { Timetable } from "@/types/auth";

export const timetableService = {
  /**
   * The weekly timetable for one class.
   *
   * @param classId - The class the signed-in student belongs to.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns Periods grouped by weekday.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getTimetableByClass: (classId: string, accessToken?: string): Promise<Timetable> =>
    api.get<Timetable>(API_ENDPOINTS.TIMETABLE_BY_CLASS.replace(":classId", classId), { accessToken }),
};
