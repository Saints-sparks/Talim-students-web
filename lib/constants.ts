// lib/constants.ts
// The API origin comes from the environment so each deployment (local, preview,
// production) points at its own backend. Next.js inlines NEXT_PUBLIC_* at build
// time, so a missing value fails the build here rather than at runtime.
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!configuredApiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local for local development, or set it in the deployment's environment variables."
  );
}

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
export const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  INTROSPECT: `${API_BASE_URL}/auth/introspect`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  STUDENTS_BY_USER: `${API_BASE_URL}/students/by-user/:userId`,
  ATTENDANCE_DASHBOARD: `${API_BASE_URL}/attendance/dashboard/:studentId`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  TIMETABLE_BY_CLASS: `${API_BASE_URL}/timetable/class/:classId`,
  COURSES_BY_SCHOOL: `${API_BASE_URL}/subjects-courses/courses/school`,
  COURSES_BY_CLASS: `${API_BASE_URL}/subjects-courses/courses/class/:classId`,
  CURRICULUM_BASE: `${API_BASE_URL}/curriculum`,
  // The API has no `/curriculum/course/:id` route — filtering is by query.
  CURRICULUM_BY_COURSE_TERM: `${API_BASE_URL}/curriculum/by-course-term`,
  SUBJECTS_BY_SCHOOL: `${API_BASE_URL}/subjects-courses/by-school`,
  RESOURCES_BY_CLASS: `${API_BASE_URL}/resources/class/:classId`,
  CLASS_BY_ID: `${API_BASE_URL}/classes/:classId`,
  CURRENT_TERM: `${API_BASE_URL}/academic-year-term/term/current`,
} as const;
