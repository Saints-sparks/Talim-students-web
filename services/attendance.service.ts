import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import type { AttendanceDashboard } from "@/types/auth";

/** Attendance KPI tiles for one student over a term. */
export interface AttendanceKPIData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  userAvatar?: string;
  classInfo: {
    id: string;
    name: string;
  };
  attendanceRate: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  termInfo?: {
    id: string;
    name: string;
  };
}

/** Whether a class's register has been taken on a given day. */
export interface ClassAttendanceStatus {
  classId: string;
  className: string;
  date: string;
  totalStudents: number;
  attendanceMarked: number;
  attendanceNotMarked: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  students: Array<{
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    userAvatar?: string;
    attendanceMarked: boolean;
    attendanceStatus?: "Present" | "Absent" | "Late" | "Excused";
    recordedBy?: {
      id: string;
      name: string;
    };
    recordedAt?: string;
  }>;
}

// services/attendance.service.ts
export const attendanceService = {
  /**
   * The signed-in student's attendance dashboard.
   *
   * @param studentId - The student profile id (the route scopes to the caller).
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns Totals and the day-by-day record list.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getDashboard: (studentId: string, accessToken?: string): Promise<AttendanceDashboard> =>
    api.get<AttendanceDashboard>(`${API_BASE_URL}/attendance/dashboard/${studentId}`, { accessToken }),

  /**
   * Attendance KPI tiles for one student.
   *
   * @param studentId - The student profile id.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns Rate, day counts and the term the figures cover.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getAttendanceKPIs: (studentId: string, accessToken?: string): Promise<AttendanceKPIData> =>
    api.get<AttendanceKPIData>(`${API_BASE_URL}/attendance/student/${studentId}/kpis`, { accessToken }),

  /**
   * Whether the student's class register has been taken for a date.
   *
   * @param classId - The class the student belongs to.
   * @param date - ISO date (`YYYY-MM-DD`) to check.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The class's marking status for that day.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getClassAttendanceStatus: (classId: string, date: string, accessToken?: string): Promise<ClassAttendanceStatus> =>
    api.get<ClassAttendanceStatus>(
      `${API_BASE_URL}/attendance/class/${classId}/status?date=${encodeURIComponent(date)}`,
      { accessToken }
    ),
};
