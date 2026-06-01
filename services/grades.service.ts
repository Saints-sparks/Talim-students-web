import { API_BASE_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

export interface AssessmentGradeRecord {
  _id?: string;
  assessmentId:
    | string
    | { _id: string; title?: string; name?: string; type?: string };
  actualScore?: number;
  score?: number;
  maxScore: number;
  assessmentName?: string;
  assessmentType?: string;
  weightPercentage?: number;
  gradeDate?: string;
  feedback?: string;
}

export interface CourseGradeRecord {
  _id?: string;
  courseId:
    | string
    | null
    | { _id: string; name?: string; code?: string; creditHours?: number };
  studentId?: string | object;
  termId?: string | { _id: string; name?: string };
  assessmentGradeRecords?: AssessmentGradeRecord[];
  assessments?: AssessmentGradeRecord[];
  courseName?: string;
  courseCode?: string;
  creditHours?: number;
  courseAverage?: number;
  letterGrade?: string;
  gradePoints?: number;
  status?: "completed" | "in_progress" | "not_started";
  percentage?: number;
  cumulativeScore?: number;
  gradeLevel?: string;
  maxScore?: number;
  isActive?: boolean;
}

export interface StudentCumulativeGrade {
  _id: string;
  termId: { _id: string; name: string } | string;
  totalScore: number;
  percentage: number;
  grade: string;
  position: number;
  remarks?: string;
  isActive: boolean;
}

export interface StudentKPIData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  userAvatar?: string;
  classInfo: {
    id: string;
    name: string;
  };
  subjectsEnrolled: number;
  gradeScore: number;
  attendanceRate?: number;
  attendancePercentage: number;
  currentTerm?: {
    id: string;
    name: string;
  };
  gradeLevel?: string;
  completedAssessments?: number;
  classPosition?: number;
  totalStudentsInClass?: number;
  additionalMetrics: {
    totalAssessments: number;
    completedAssessments: number;
    currentTerm: {
      id: string;
      name: string;
    };
    classRank: number;
    totalStudentsInClass: number;
  };
}

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
  gradeLevel?: string | null;
}

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

function extractArray<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === "object") {
    const p = json as { data?: T[] };
    if (Array.isArray(p.data)) return p.data;
  }
  return [];
}

async function apiFetch<T>(url: string, accessToken: string): Promise<T> {
  const res = await authFetch(url, {
    accessToken,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `HTTP ${res.status}`
    );
  }

  return res.json();
}

export const gradesService = {
  /** Dashboard KPI metrics for a student */
  getStudentKPIs: async (
    studentId: string,
    accessToken: string
  ): Promise<StudentKPIData> => {
    const json = await apiFetch<Partial<StudentKPIData>>(
      `${API_BASE_URL}/students/${studentId}/dashboard/kpis`,
      accessToken
    );

    const attendancePercentage =
      json.attendancePercentage ?? json.attendanceRate ?? 0;
    const currentTerm = json.currentTerm ?? json.additionalMetrics?.currentTerm ?? {
      id: "",
      name: "Unknown Term",
    };
    const completedAssessments =
      json.completedAssessments ?? json.additionalMetrics?.completedAssessments ?? 0;
    const classPosition =
      json.classPosition ?? json.additionalMetrics?.classRank ?? 0;
    const totalStudentsInClass =
      json.totalStudentsInClass ??
      json.additionalMetrics?.totalStudentsInClass ??
      0;

    return {
      ...json,
      studentId: json.studentId ?? studentId,
      firstName: json.firstName ?? "",
      lastName: json.lastName ?? "",
      email: json.email ?? "",
      classInfo: json.classInfo ?? { id: "", name: "" },
      subjectsEnrolled: json.subjectsEnrolled ?? 0,
      gradeScore: json.gradeScore ?? 0,
      attendancePercentage,
      currentTerm,
      completedAssessments,
      classPosition,
      totalStudentsInClass,
      additionalMetrics: {
        totalAssessments: json.additionalMetrics?.totalAssessments ?? completedAssessments,
        completedAssessments,
        currentTerm,
        classRank: classPosition,
        totalStudentsInClass,
      },
    };
  },

  /** All course grade records for the authenticated student in a given term */
  getCourseGradesByTerm: async (
    termId: string,
    accessToken: string
  ): Promise<CourseGradeRecord[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/course-grades/term/${termId}`,
      accessToken
    );
    return extractArray<CourseGradeRecord>(json);
  },

  /** All courses in the authenticated student's class with published result counts */
  getPublishedCoursesByTerm: async (
    termId: string,
    accessToken: string
  ): Promise<PublishedCourse[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/courses/term/${termId}`,
      accessToken
    );
    return extractArray<PublishedCourse>(json);
  },

  /** Published assessments for one course for the authenticated student */
  getPublishedAssessmentsForCourse: async (
    courseId: string,
    termId: string,
    accessToken: string
  ): Promise<PublishedAssessmentResult[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/courses/${courseId}/published-assessments/term/${termId}`,
      accessToken
    );
    return extractArray<PublishedAssessmentResult>(json);
  },

  /** Cumulative grade record for the authenticated student for a given term */
  getCumulativeGradeByTerm: async (
    termId: string,
    accessToken: string
  ): Promise<StudentCumulativeGrade | null> => {
    const json = await apiFetch<StudentCumulativeGrade | null>(
      `${API_BASE_URL}/grade-records/student/me/cumulative-grades/${termId}`,
      accessToken
    );
    return json;
  },

  /** All cumulative term grade records for the authenticated student */
  getAllCumulativeGrades: async (
    accessToken: string
  ): Promise<StudentCumulativeGrade[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/cumulative-grades`,
      accessToken
    );
    return extractArray<StudentCumulativeGrade>(json);
  },

  /** Assessment grade records for the authenticated student on one assessment */
  getAssessmentGrades: async (
    assessmentId: string,
    accessToken: string
  ): Promise<AssessmentGradeRecord[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/assessments/${assessmentId}`,
      accessToken
    );
    return extractArray<AssessmentGradeRecord>(json);
  },
};
