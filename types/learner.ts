/**
 * The students portal's view of the learner API (portals contract Part B,
 * B1–B7 and B10–B12, plus the round-4 account and inbox routes).
 *
 * Every type here is an alias of the generated contract (`types/api.d.ts`,
 * synced from talimBE-V2 with `npm run types:api`), so a backend change shows
 * up in `npm run typecheck`. Write a type by hand only where the generated one
 * is looser than what the API actually sends, and say why ("HAND-WRITTEN: …").
 */
import type { Schema } from "./apiContract";

/* ───────────────────────────── shared pieces ───────────────────────────── */

/** `YYYY-MM-DD`, a calendar day at the school. */
export type CalendarDay = string;

/** An ISO-8601 instant. */
export type Instant = string;

/** A reference with an id and a display name. */
export type IdName = Schema<"IdNameDto">;

/** A lesson's course: `{ id, code, title }`. */
export type CourseRef = Schema<"LessonCourseDto">;

/** A course on B3/B4/B5/B7: also its short name and colour (`colourKey`). */
export type LearnerCourse = Schema<"LearnerCourseDto">;

/** A term with its dates, week count, session and whether it is current. */
export type TermRef = Schema<"LearnerTermDto">;

/** Rank in the class; ties share a rank (standard competition ranking). */
export type Position = Schema<"PositionDto">;

/** One band of the school's grade scale (§16). */
export type GradeBand = Schema<"GradeBandDto">;

/** A bell-schedule period (§4). */
export type Period = Schema<"PeriodDto">;

/** B1 `schoolDay`. */
export type SchoolDay = Schema<"SchoolDayDto">;

/** Why today is not a school day. */
export type NotSchoolDayReason = NonNullable<SchoolDay["reason"]>;

/** The part of the day at the school, for the greeting. */
export type Greeting = Schema<"LearnerTodayDto">["greeting"];

/** The week's scheme-of-work topic of a lesson. */
export type LessonTopic = Schema<"LessonTopicDto">;

/** A timetabled lesson (B2), with its teacher, short name and `colourKey`. */
export type StudentLesson = Schema<"StudentLessonDto">;

/**
 * Where a notification's button goes (round-4 §30 `metadata.target`); v1.5's
 * support target is `{ page: "support", ticketId }`.
 */
export type NotificationTarget = Schema<"NotificationTargetDto">;

/**
 * The categories the notification API files items under (B11 adds payments
 * and leave; v1.5 adds `support`, ticket replies and status changes).
 */
export type NotificationCategory = Schema<"FeedItemDto">["category"];

/** B1 `feed` item. */
export type NotificationItem = Schema<"FeedItemDto">;

/* ───────────────────────────── B1 Today ───────────────────────────── */

/** A lesson today, with where it stands now. */
export type TodayLesson = Schema<"TodayStudentLessonDto">;

/** One bar of the "term at a glance" chart. */
export type SubjectTotal = Schema<"SubjectTotalDto">;

/** One row of "Coming up". */
export type ComingUpItem = Schema<"ComingUpDto">;

/** `GET /students/me/today` (B1). */
export type StudentToday = Schema<"LearnerTodayDto">;

/* ───────────────────────────── B2 Timetable ───────────────────────────── */

/** One school day of the week. */
export type TimetableDay = Schema<"WeekDayDto">;

/** `GET /students/me/timetable?weekStart=` (B2). */
export type StudentTimetable = Schema<"LearnerTimetableDto">;

/* ───────────────────────────── B3 / B4 Subjects ───────────────────────────── */

/** One card on Subjects (B3). */
export type SubjectSummary = Schema<"LearnerSubjectDto">;

/** `GET /students/me/subjects?termId=` (B3). */
export type StudentSubjects = Schema<"LearnerSubjectsDto">;

/** One assessment of a subject; `score` is null until published. */
export type SubjectAssessment = Schema<"SubjectAssessmentDto">;

/** `GET /students/me/subjects/:courseId?termId=` (B4). */
export type StudentSubjectDetail = Schema<"LearnerSubjectDetailDto">;

/* ───────────────────────────── B5 Report card ───────────────────────────── */

/** A subject's best or worst result on the report card (flat). */
export type ReportHighlight = Schema<"ReportHighlightDto">;

/**
 * One subject row of the report card: `scores` has one entry per column,
 * `null` where that score is not published.
 */
export type ReportRow = Schema<"ReportRowDto">;

/** Whether the term's results are out. */
export type ReportStatus = Schema<"ReportCardDto">["status"];

/** `GET /students/me/report-card?termId=` (B5). */
export type ReportCard = Schema<"ReportCardDto">;

/** `GET /students/me/report-card/terms` (B5). */
export type ReportTerm = Schema<"ReportTermDto">;

/**
 * One term of `GET /academic-year-term/term/school` (`.terms`) as every term
 * picker reads it (`toSchoolTerms` drops `_id` and `schoolId`).
 * `startDate`/`endDate` are ISO instants at midnight UTC ("2026-09-01T00:00:00.000Z").
 */
export type SchoolTerm = Omit<Schema<"SchoolTermDto">, "_id" | "schoolId">;

/* ───────────────────────────── B6 Attendance ───────────────────────────── */

/** A day's mark. */
export type AttendanceDayStatus = Schema<"AttendanceDayDto">["status"];

/** `GET /students/me/attendance?termId=&month=` (B6). */
export type StudentAttendance = Schema<"LearnerAttendanceDto">;

/* ───────────────────────────── B7 Files ───────────────────────────── */

/** What kind of file a resource is (§24). */
export type ResourceKind = Schema<"LearnerFileDto">["kind"];

/** One file shared with the student (B7; also B4 `resources`). */
export type StudentFile = Schema<"LearnerFileDto">;

/** Pagination `meta`, kept by the strict envelope unwrap. */
export type PageMeta = Schema<"LearnerPageMetaDto">;

/** A paginated list. */
export interface Paged<T> {
  data: T[];
  meta: PageMeta;
}

/** `GET /students/me/files?courseId=&q=&page=&limit=` (B7). */
export type StudentFilesPage = Schema<"LearnerFilesPageDto">;

/** `POST /resources/:id/view` (§24). */
export type ResourceViewResult = Schema<"ResourceViewResultDto">;

/* ───────────────────────────── B10 Messages ───────────────────────────── */

/** The media tabs of a group's info (B10 adds `video`). */
export type RoomMediaKind = Schema<"ChatMediaItemDto">["kind"];

/** `GET /chat/rooms/:roomId/media?kind=` (§29 + B10). */
export type RoomMediaPage = Schema<"ChatMediaPageDto">;

/* ───────────────────────────── B11 Notifications ───────────────────────────── */

/** `GET /notifications/counts` (§30). */
export type NotificationCounts = Schema<"InboxCountsDto">;

/** `PATCH /notifications/read-all` (§30). */
export type ReadAllResult = Schema<"ReadAllResponseDto">;

/* ───────────────────────────── B12, account, preferences ───────────────────────────── */

/** `GET /students/me/school` (B12, the §36 shape). */
export type SchoolContact = Schema<"SchoolContactDto">;

/** `GET`/`PATCH /students/me/preferences` (the tour flag). */
export type LearnerPreferences = Schema<"LearnerPreferencesDto">;

/** `PATCH /students/me/preferences` body. */
export type UpdateLearnerPreferences = Schema<"UpdateLearnerPreferencesDto">;

/** `GET /auth/password-policy` (§34, public). */
export type PasswordPolicy = Schema<"PasswordPolicyDto">;

/** `GET /auth/sessions` item (§34). */
export type AuthSession = Schema<"SessionDto">;

/** `DELETE /auth/sessions/:id` (§34). */
export type RevokeSessionResult = Schema<"RevokeSessionDto">;

/** `POST /auth/sessions/revoke-others` (§34). */
export type RevokeOthersResult = Schema<"RevokeOthersDto">;
