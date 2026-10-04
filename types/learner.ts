/**
 * The students portal's view of the learner API (portals contract Part B,
 * B1–B7 and B10–B12, plus the round-4 account and inbox routes).
 *
 * Every type here is an alias of the generated contract (`types/api.d.ts`,
 * synced from talimBE-V2 with `npm run types:api`), so a backend change shows
 * up in `npm run typecheck`. A type is written by hand only where the
 * generated one is looser than what the API actually sends; each of those
 * says why ("HAND-WRITTEN: …"). Re-check them when the backend's Swagger
 * improves.
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
 * Where a notification's button goes (round-4 §30 `metadata.target`).
 * HAND-WRITTEN: Swagger types `target` as `Record<string, unknown>`.
 */
export interface NotificationTarget {
  page: string;
  classId?: string;
  courseId?: string;
  assessmentId?: string;
  roomId?: string;
  week?: number;
  date?: string;
  termId?: string;
}

/**
 * The categories the notification API files items under (B11 adds payments
 * and leave). HAND-WRITTEN: Swagger types the feed's `category` as `string`
 * (the counts DTO lists the same ten keys).
 */
export type NotificationCategory = keyof Schema<"InboxCountsByCategoryDto">;

/**
 * B1 `feed` item: the API's names, with `target` and `category` narrowed
 * (see {@link NotificationTarget} and {@link NotificationCategory}).
 */
export type NotificationItem = Omit<Schema<"FeedItemDto">, "target" | "category"> & {
  target: NotificationTarget | null;
  category: NotificationCategory | string;
};

/* ───────────────────────────── B1 Today ───────────────────────────── */

/** A lesson today, with where it stands now. */
export type TodayLesson = Schema<"TodayStudentLessonDto">;

/** One bar of the "term at a glance" chart. */
export type SubjectTotal = Schema<"SubjectTotalDto">;

/** One row of "Coming up". */
export type ComingUpItem = Schema<"ComingUpDto">;

/** `GET /students/me/today` (B1), with the feed's items narrowed. */
export type StudentToday = Omit<Schema<"LearnerTodayDto">, "feed"> & { feed: NotificationItem[] };

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
 * One subject row of the report card.
 * HAND-WRITTEN `scores`: Swagger says `number[] | null`; the API sends one
 * entry per column, `null` where that score is not published.
 */
export type ReportRow = Omit<Schema<"ReportRowDto">, "scores"> & { scores: Array<number | null> };

/** Whether the term's results are out. */
export type ReportStatus = Schema<"ReportCardDto">["status"];

/** `GET /students/me/report-card?termId=` (B5), with {@link ReportRow}. */
export type ReportCard = Omit<Schema<"ReportCardDto">, "rows"> & { rows: ReportRow[] };

/** `GET /students/me/report-card/terms` (B5). */
export type ReportTerm = Schema<"ReportTermDto">;

/**
 * One term of `GET /academic-year-term/term/school` (`.terms`), which every
 * term picker reads. HAND-WRITTEN: Swagger types the answer inline with every
 * field optional; the API sends all of these.
 */
export interface SchoolTerm {
  id: string;
  name: string;
  session: string | null;
  /** ISO instant at midnight UTC ("2026-09-01T00:00:00.000Z"). */
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  academicYearId?: string;
}

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

/**
 * `GET /auth/password-policy` (§34, public).
 * HAND-WRITTEN: Swagger has `PasswordPolicyDto` as an empty object.
 */
export interface PasswordPolicy {
  minLength: number;
  maxLength?: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
  /** The characters the symbol rule accepts. */
  symbols?: string;
  historyCount: number;
}

/**
 * `GET /auth/sessions` item (§34).
 * HAND-WRITTEN: Swagger's `SessionDto` lists only device, browser, os and ip.
 */
export interface AuthSession {
  id: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  ip: string | null;
  lastUsedAt: Instant;
  createdAt: Instant;
  current: boolean;
}

/**
 * `DELETE /auth/sessions/:id` and `POST /auth/sessions/revoke-others` (§34).
 * HAND-WRITTEN: Swagger has both DTOs as empty objects.
 */
export interface RevokeSessionResult {
  id: string;
  revoked: boolean;
  current: boolean;
}

/** See {@link RevokeSessionResult}. */
export interface RevokeOthersResult {
  revoked: number;
}

/** `SUPPORT_AREAS` (§35 + B12). */
export type SupportArea = Schema<"CreateSupportTicketDto">["area"];

/** `POST /support/tickets` body (§35). */
export type SupportTicketBody = Schema<"CreateSupportTicketDto">;

/** `POST /support/tickets` answer (§35). */
export type SupportTicketResult = Schema<"SupportTicketCreatedDto">;
