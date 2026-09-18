// services/class.service.ts
import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";

/** One course as the class endpoint embeds it. */
export interface ClassCourse {
  _id: string;
  title: string;
  description?: string;
  courseCode?: string;
  teacherId?: string | { _id: string; firstName?: string; lastName?: string; email?: string };
  subjectId?: string | { _id: string; name?: string; code?: string };
  classId?: string | { _id: string; name?: string; level?: string };
}

/** A class and the courses taught to it. */
export interface ClassData {
  _id: string;
  name: string;
  schoolId?: string;
  classTeacherId?: string;
  courses: ClassCourse[];
}

export const classService = {
  /**
   * One class with its courses. The API scopes this to the caller's school.
   *
   * @param classId - The class the signed-in student belongs to.
   * @param options - `signal` to abort when the screen unmounts.
   * @param options.signal - Abort signal for the request.
   * @returns The class and its courses.
   * @throws {ApiError} `NOT_FOUND` when the class is not in the caller's school.
   */
  getClassById: (classId: string, options: { signal?: AbortSignal } = {}): Promise<ClassData> =>
    api.get<ClassData>(API_ENDPOINTS.CLASS_BY_ID.replace(":classId", classId), { signal: options.signal }),
};
