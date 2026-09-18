import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";

/**
 * The student grading contract (`/grade-records/student/me/*`).
 *
 * Every route here resolves the student from the JWT — nothing takes a student
 * id — so a student can only ever read their own records. Three response
 * conventions coexist upstream and are normalised here:
 *
 * - bare array: `courses/term/:id`, `courses/:id/published-assessments/term/:id`,
 *   `assessments/:id`
 * - flat page `{ data, total, page, limit, totalPages }`: `course-grades/term/:id`,
 *   `cumulative-grades`
 * - single object or literal `null`: `cumulative-grades/:termId`
 *
 * See the report in the Track 4 hardening notes for how this differs from the
 * parents app's `/parent/results/:studentId/*` view models.
 */

/** A page of records as the student grading routes return it (flat, not `{data,meta}`). */
export interface PaginatedGradeResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** One raw assessment grade record, exactly as the API stores it. */
export interface AssessmentGradeRecord {
  _id?: string;
  assessmentId: string | { _id: string; title?: string; name?: string; type?: string };
  courseId?: string | { _id: string; name?: string; title?: string };
  /** The mark the teacher recorded. The API returns no percentage or grade here. */
  actualScore?: number;
  maxScore: number;
  recordedBy?: string;
  gradeDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** One course grade record for the student in a term. */
export interface CourseGradeRecord {
  _id?: string;
  courseId: string | null | { _id: string; name?: string; title?: string; code?: string; creditHours?: number };
  studentId?: string | object;
  termId?: string | { _id: string; name?: string };
  classId?: string | { _id: string; name?: string };
  /** Only the assessments that have been published to the student. */
  assessmentGradeRecords?: AssessmentGradeRecord[];
  /** Sum of published scores. */
  cumulativeScore?: number;
  /** Sum of the published assessments' maximum marks. */
  maxScore?: number;
  percentage?: number;
  gradeLevel?: string;
  schoolId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** The student's overall record for one term. */
export interface StudentCumulativeGrade {
  _id: string;
  termId: { _id: string; name: string } | string;
  classId?: { _id: string; name?: string } | string;
  studentId?: string;
  courseGradeRecords?: Array<CourseGradeRecord | string>;
  totalScore: number;
  percentage: number;
  grade: string;
  remarks?: string;
  /**
   * Class rank. The API returns `null` until the school publishes the term's
   * positions, so never render this without checking for `null` first.
   */
  position: number | null;
  /** True once the school has published the term result. */
  isPublished?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Dashboard KPI tiles for one student (`StudentDashboardKpiDto`). */
export interface StudentKPIData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  userAvatar?: string;
  classInfo: { id: string; name: string };
  subjectsEnrolled: number;
  gradeScore: number;
  attendanceRate: number;
  currentTerm?: { id: string; name: string };
  gradeLevel?: string;
  completedAssessments: number;
  classPosition: number;
  totalStudentsInClass: number;
}

/** A course in the student's class, with how much of it has been published. */
export interface PublishedCourse {
  _id: string;
  name: string;
  code?: string;
  teacher?: string;
  publishedAssessmentsCount: number;
  latestPublishedAssessment?: {
    publicationId: string;
    assessment: {
      _id: string;
      name: string;
      assessmentType?: string;
      startDate?: string;
      endDate?: string;
    };
    publishedAt?: string;
    kpis?: Record<string, unknown>;
  } | null;
  currentAverage?: number | null;
  /** `null` until a course grade record exists for the term. */
  gradeLevel?: string | null;
  cumulativeScore?: number | null;
  maxScore?: number | null;
  coursePosition?: number | null;
}

/** One published assessment result, already enriched by the API. */
export interface PublishedAssessmentResult {
  publicationId: string;
  assessment: {
    _id: string;
    name: string;
    assessmentType?: string;
    startDate?: string;
    endDate?: string;
  };
  publishedAt?: string;
  score: number;
  maxScore: number;
  percentage: number;
  gradeLevel: string;
  classAverage?: number | null;
  highestScore?: number | null;
  lowestScore?: number | null;
  comparison?: string;
}

/**
 * Reads the list out of whichever convention a route used — a bare array, or a
 * flat page under `data`.
 *
 * @typeParam T - The element type.
 * @param payload - The parsed response body.
 * @returns The records, or an empty array when there are none.
 */
function toArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const page = payload as { data?: unknown };
    if (Array.isArray(page.data)) return page.data as T[];
  }
  return [];
}

const BASE = `${API_BASE_URL}/grade-records/student/me`;

export const gradesService = {
  /**
   * Dashboard KPI tiles for a student.
   *
   * @param studentId - The student profile id; the API checks the caller owns it.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The KPI payload, with numeric fields defaulted to 0.
   * @throws {ApiError} `NOT_FOUND` when the id is not the caller's.
   */
  getStudentKPIs: async (studentId: string, accessToken?: string): Promise<StudentKPIData> => {
    const json = await api.get<Partial<StudentKPIData>>(
      `${API_BASE_URL}/students/${studentId}/dashboard/kpis`,
      { accessToken }
    );

    return {
      studentId: json.studentId ?? studentId,
      firstName: json.firstName ?? "",
      lastName: json.lastName ?? "",
      email: json.email ?? "",
      userAvatar: json.userAvatar,
      classInfo: json.classInfo ?? { id: "", name: "" },
      subjectsEnrolled: json.subjectsEnrolled ?? 0,
      gradeScore: json.gradeScore ?? 0,
      attendanceRate: json.attendanceRate ?? 0,
      currentTerm: json.currentTerm,
      gradeLevel: json.gradeLevel,
      completedAssessments: json.completedAssessments ?? 0,
      classPosition: json.classPosition ?? 0,
      totalStudentsInClass: json.totalStudentsInClass ?? 0,
    };
  },

  /**
   * The student's course grade records for a term. The API pages this one (50
   * per page by default) and returns a flat `{ data, total, … }` page.
   *
   * @param termId - The term to read.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param params - `page` (1-based) and `limit` (max 1000).
   * @returns The page of records.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getCourseGradesByTerm: async (
    termId: string,
    accessToken?: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedGradeResponse<CourseGradeRecord>> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const suffix = query.toString() ? `?${query}` : "";

    const json = await api.get<PaginatedGradeResponse<CourseGradeRecord> | CourseGradeRecord[]>(
      `${BASE}/course-grades/term/${termId}${suffix}`,
      { accessToken }
    );
    const data = toArray<CourseGradeRecord>(json);
    const page = json && !Array.isArray(json) ? json : null;
    return {
      data,
      total: page?.total ?? data.length,
      page: page?.page ?? params.page ?? 1,
      limit: page?.limit ?? params.limit ?? data.length,
      totalPages: page?.totalPages ?? 1,
    };
  },

  /**
   * Every course in the student's class for a term, with its published count.
   *
   * @param termId - The term to read.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The courses, newest publication first.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getPublishedCoursesByTerm: async (termId: string, accessToken?: string): Promise<PublishedCourse[]> =>
    toArray<PublishedCourse>(await api.get<PublishedCourse[]>(`${BASE}/courses/term/${termId}`, { accessToken })),

  /**
   * The student's published results for one course in a term.
   *
   * @param courseId - The course to read.
   * @param termId - The term to read.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns One entry per published assessment the student sat.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getPublishedAssessmentsForCourse: async (
    courseId: string,
    termId: string,
    accessToken?: string
  ): Promise<PublishedAssessmentResult[]> =>
    toArray<PublishedAssessmentResult>(
      await api.get<PublishedAssessmentResult[]>(
        `${BASE}/courses/${courseId}/published-assessments/term/${termId}`,
        { accessToken }
      )
    ),

  /**
   * The student's overall record for one term. The API answers `null` — not a
   * 404 — while the school has not calculated it yet.
   *
   * @param termId - The term to read.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The record, or `null` when there is none yet.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getCumulativeGradeByTerm: (termId: string, accessToken?: string): Promise<StudentCumulativeGrade | null> =>
    api.get<StudentCumulativeGrade | null>(`${BASE}/cumulative-grades/${termId}`, { accessToken }),

  /**
   * Every term record the student has, newest first.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param params - `page` (1-based) and `limit` (max 1000).
   * @returns The page of term records.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getAllCumulativeGrades: async (
    accessToken?: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<StudentCumulativeGrade[]> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const suffix = query.toString() ? `?${query}` : "";
    return toArray<StudentCumulativeGrade>(
      await api.get<PaginatedGradeResponse<StudentCumulativeGrade>>(`${BASE}/cumulative-grades${suffix}`, {
        accessToken,
      })
    );
  },

  /**
   * The student's raw records for one assessment. These are unenriched
   * documents: no percentage, no grade letter, no assessment name — derive
   * those from `actualScore` / `maxScore`, or use
   * `getPublishedAssessmentsForCourse`, which the API enriches.
   *
   * @param assessmentId - The assessment to read.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The records, or an empty array while the result is unpublished.
   * @throws {ApiError} `NOT_FOUND` when the id is not a valid ObjectId.
   */
  getAssessmentGrades: async (assessmentId: string, accessToken?: string): Promise<AssessmentGradeRecord[]> =>
    toArray<AssessmentGradeRecord>(
      await api.get<AssessmentGradeRecord[]>(`${BASE}/assessments/${assessmentId}`, { accessToken })
    ),
};
