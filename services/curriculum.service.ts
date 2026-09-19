import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import type { CurriculumByCourseTermBody } from "@/types/apiPayloads";

// services/curriculum.service.ts
/** A course taught to a class, as the curriculum endpoints return it. */
export interface Course {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  subjectId?: {
    _id: string;
    name: string;
    code: string;
  };
  teacherId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  classId?: {
    _id: string;
    name: string;
    level: string;
  };
  createdAt: string;
  updatedAt: string;
}

/** A subject offered by the school. */
export interface Subject {
  _id: string;
  name: string;
  code: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

/** One term's curriculum document for a course. */
export interface Curriculum {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    courseCode: string;
  };
  term: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  content: string;
  attachments: string[];
  teacherId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

/** The enriched curriculum document `POST /curriculum/by-course-term` returns. */
export interface CurriculumDetail {
  _id: string;
  course: {
    _id: string;
    courseCode?: string;
    title?: string;
    description?: string;
    className?: string | null;
    schoolName?: string | null;
    teacherName?: string | null;
  };
  term: {
    _id: string;
    name?: string;
    startDate?: string;
    endDate?: string;
  };
  content: string;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const curriculumService = {
  /**
   * Every course the school offers.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The school's courses.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getCourses: (accessToken?: string): Promise<Course[]> =>
    api.get<Course[]>(API_ENDPOINTS.COURSES_BY_SCHOOL, { accessToken }),

  /**
   * The courses taught to one class.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param classId - The class to list courses for.
   * @returns The class's courses.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getCoursesByClass: (accessToken: string | undefined, classId: string): Promise<Course[]> =>
    api.get<Course[]>(API_ENDPOINTS.COURSES_BY_CLASS.replace(":classId", classId), { accessToken }),

  /**
   * Every subject the school offers.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The school's subjects.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getSubjects: (accessToken?: string): Promise<Subject[]> =>
    api.get<Subject[]>(API_ENDPOINTS.SUBJECTS_BY_SCHOOL, { accessToken }),

  /**
   * The curriculum documents published for one course.
   *
   * The API has no `/curriculum/course/:id` route — that path 404s. Courses
   * are filtered with `?course=`, which the list endpoint accepts.
   *
   * @param courseId - The course to load.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns One entry per term.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getCurriculumByCourse: (courseId: string, accessToken?: string): Promise<Curriculum[]> =>
    api.get<Curriculum[]>(`${API_ENDPOINTS.CURRICULUM_BASE}?course=${encodeURIComponent(courseId)}`, {
      accessToken,
    }),

  /**
   * The curriculum for one course in one term — the enriched view the
   * curriculum screen renders (course title, class, school and teacher names).
   *
   * @param courseId - The course to load.
   * @param termId - The term to load.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The matching documents, or an empty array when there are none.
   * @throws {ApiError} `VALIDATION_FAILED` when either id is missing.
   */
  getCurriculumByCourseAndTerm: (
    courseId: string,
    termId: string,
    accessToken?: string
  ): Promise<CurriculumDetail[]> => {
    const body: CurriculumByCourseTermBody = { courseId, termId };
    return api.post<CurriculumDetail[]>(API_ENDPOINTS.CURRICULUM_BY_COURSE_TERM, body, { accessToken });
  },

  /**
   * One curriculum document.
   *
   * @param curriculumId - The document to load.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The curriculum document.
   * @throws {ApiError} `NOT_FOUND` when it does not exist.
   */
  getCurriculumById: (curriculumId: string, accessToken?: string): Promise<Curriculum> =>
    api.get<Curriculum>(`${API_ENDPOINTS.CURRICULUM_BASE}/${curriculumId}`, { accessToken }),

  /**
   * Every curriculum document in the school.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns All curriculum documents.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getAllCurricula: (accessToken?: string): Promise<Curriculum[]> =>
    api.get<Curriculum[]>(API_ENDPOINTS.CURRICULUM_BASE, { accessToken }),
};
