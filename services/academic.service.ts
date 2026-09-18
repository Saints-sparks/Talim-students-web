// services/academic.service.ts
import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";

/** An academic term, as the academic-year-term routes return it. */
export interface Term {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  academicYearId?: string;
  schoolId?: string;
  isCurrent?: boolean;
}

export const academicService = {
  /**
   * The school's current term. `/auth/introspect` already puts the current
   * term's id on the session, so call this only when the term's name or dates
   * are needed too.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The term marked current for the caller's school.
   * @throws {ApiError} `NOT_FOUND` when no term is marked current.
   */
  getCurrentTerm: (accessToken?: string): Promise<Term> =>
    api.get<Term>(API_ENDPOINTS.CURRENT_TERM, { accessToken }),
};
