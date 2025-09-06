// lib/constants.ts
//export const API_BASE_URL = "https://talimbe-v2-li38.onrender.com";
export const API_BASE_URL = "http://localhost:5005";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
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
  CURRICULUM_BY_COURSE: `${API_BASE_URL}/curriculum/course/:courseId`,
  SUBJECTS_BY_SCHOOL: `${API_BASE_URL}/subjects-courses/by-school`,
  RESOURCES_BY_CLASS: `${API_BASE_URL}/resources/class/:classId`,
  GRADE_RECORDS: `${API_BASE_URL}/grade-records/student-cumulative-term-grade-records/:studentId/`,
} as const;
