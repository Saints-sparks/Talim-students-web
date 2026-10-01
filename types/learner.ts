/**
 * Hand-written types for the students redesign, from
 * `talimBE-V2/docs/redesign-portals-students-parents.md` (Part B: B1–B7,
 * B10–B12) and the round-4 contract it builds on
 * (`redesign-teachers-round4-inbox-settings.md`: §29 media, §30 counts and
 * read-all, §34 sessions and password policy, §35 support tickets, §36 school
 * contact).
 *
 * TODO(contract): the backend is being built in parallel. Once it ships, run
 * `npm run types:api` and replace these with the generated
 * `ResponseBody<…>` aliases from `types/apiContract.ts`; the field names below
 * are the contract's, so the swap should be mechanical. Fields the contract
 * does not name but the screens need are marked "ASSUMED" — they are listed
 * in the redesign report as gaps for the backend.
 */

/* ───────────────────────────── shared pieces ───────────────────────────── */

/** `YYYY-MM-DD`, a calendar day at the school. */
export type CalendarDay = string;

/** An ISO-8601 instant. */
export type Instant = string;

/** A reference with an id and a display name. */
export interface IdName {
  id: string;
  name: string;
}

/** A course reference. */
export interface CourseRef {
  id: string;
  code: string;
  title: string;
}

/** A term reference; the dates and week count come with the richer variants. */
export interface TermRef {
  id: string;
  name: string;
  startDate?: CalendarDay;
  endDate?: CalendarDay;
  totalWeeks?: number;
  /** ASSUMED on B6/B3: the session label ("2026/2027"), as B5 has `session`. */
  session?: string | null;
}

/** Rank in the class; ties share a rank (standard competition ranking). */
export interface Position {
  rank: number;
  of: number;
}

/** One band of the school's grade scale (§16): letters and minimum percents. */
export interface GradeBand {
  letter: string;
  min: number;
  remark: string | null;
}

/** A bell-schedule period (§4). */
export interface Period {
  key: string;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

/** Why today is not a school day. */
export type NotSchoolDayReason = "weekend" | "holiday" | "no_term";

/** B1 `schoolDay`. */
export interface SchoolDay {
  isSchoolDay: boolean;
  reason: NotSchoolDayReason | null;
  holidayTitle: string | null;
  endsEarlyAt: string | null;
}

/** The part of the day at the school, for the greeting. */
export type Greeting = "morning" | "afternoon" | "evening";

/** The week's scheme-of-work topic of a lesson. */
export interface LessonTopic {
  week: number;
  topic: string;
  objectives: string;
  taughtAt: Instant | null;
}

/**
 * B: `StudentLesson` — the teachers' `Lesson` without `isClassTeacher` and
 * `studentCount`, plus `teacher` and `courseShort`.
 */
export interface StudentLesson {
  id: string;
  date: CalendarDay;
  day: string;
  periodKey: string | null;
  startTime: string;
  endTime: string;
  course: CourseRef;
  courseShort: string;
  subject: IdName | null;
  class: IdName;
  classRoomId: string | null;
  room: string | null;
  teacher: IdName | null;
  topic: LessonTopic | null;
  cancelled: { reason: string } | null;
}

/** Where a notification's button goes (§30 `metadata.target`). */
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

/** The categories the notification API files items under (B11 adds payments and leave). */
export type NotificationCategory =
  | "announcement"
  | "attendance"
  | "academics"
  | "grading"
  | "resources"
  | "messages"
  | "account"
  | "payments"
  | "leave"
  | "other";

/**
 * B1 `feed` item. ASSUMED shape: the contract says `NotificationItem[]`
 * without spelling it out; these are the fields `GET /notifications` items
 * carry today, normalised.
 */
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  createdAt: Instant;
  isRead: boolean;
  senderName: string | null;
  target: NotificationTarget | null;
  actionLabel: string | null;
}

/* ───────────────────────────── B1 Today ───────────────────────────── */

/** A lesson today, with where it stands now. */
export interface TodayLesson extends StudentLesson {
  state: "done" | "now" | "later";
  minutesLeft: number | null;
}

/** One bar of the "term at a glance" chart. */
export interface SubjectTotal {
  courseId: string;
  title: string;
  short: string;
  percent: number | null;
  classAverage: number | null;
}

/** One row of "Coming up". */
export interface ComingUpItem {
  kind: "assessment" | "event";
  id: string;
  title: string;
  courseTitle: string | null;
  date: CalendarDay;
  daysAway: number;
}

/** `GET /students/me/today` (B1). */
export interface StudentToday {
  date: CalendarDay;
  day: string;
  now: Instant;
  timezone: string;
  greeting: Greeting;
  class: IdName;
  term: TermRef | null;
  weekNumber: number | null;
  schoolDay: SchoolDay;
  periods: Period[];
  lessons: TodayLesson[];
  nowLessonId: string | null;
  nextLessonId: string | null;
  glance: {
    average: number | null;
    grade: string | null;
    position: Position | null;
    /** Rank change against the previous published term (positive = moved up). */
    movement: number | null;
    attendance: { rate: number | null; present: number; schoolDays: number };
    unread: { count: number; topRoom: IdName | null };
  };
  subjectTotals: SubjectTotal[];
  passMark: number;
  comingUp: ComingUpItem[];
  /** The last five unread notifications ("New since you last signed in"). */
  feed: NotificationItem[];
  counts: { unreadNotifications: number; unreadMessages: number };
}

/* ───────────────────────────── B2 Timetable ───────────────────────────── */

/** One school day of the week. */
export interface TimetableDay {
  date: CalendarDay;
  day: string;
  isToday: boolean;
  holiday: { title: string } | null;
  endsEarlyAt: string | null;
  events: Array<{ id: string; title: string; type: string }>;
}

/** `GET /students/me/timetable?weekStart=` (B2). */
export interface StudentTimetable {
  timezone: string;
  now: Instant;
  today: CalendarDay;
  term: TermRef | null;
  week: {
    number: number | null;
    start: CalendarDay;
    end: CalendarDay;
    isCurrent: boolean;
    prevStart: CalendarDay;
    nextStart: CalendarDay;
    inTerm: boolean;
  };
  days: TimetableDay[];
  periods: Period[];
  periodsSource: "school" | "derived";
  lessons: StudentLesson[];
  subjects: Array<{ courseId: string; title: string; short: string; colourKey: string }>;
}

/* ───────────────────────────── B3 / B4 Subjects ───────────────────────────── */

/** One card on Subjects (B3). */
export interface SubjectSummary {
  course: CourseRef;
  subject: IdName | null;
  teacher: IdName | null;
  /** The subject group chat; null until it is first opened (B10). */
  roomId: string | null;
  total: number | null;
  percent: number | null;
  grade: string | null;
  position: Position | null;
  classAverage: number | null;
  /** Every assessment of the term has a published score. */
  complete: boolean;
  currentTopic: { week: number; topic: string } | null;
  resourceCount: number;
}

/** `GET /students/me/subjects?termId=` (B3). */
export interface StudentSubjects {
  term: TermRef;
  scale: GradeBand[];
  passMark: number;
  subjects: SubjectSummary[];
}

/** One assessment of a subject; `score` is null until published. */
export interface SubjectAssessment {
  id: string;
  name: string;
  maxScore: number;
  score: number | null;
  classAverage: number | null;
}

/** `GET /students/me/subjects/:courseId?termId=` (B4). */
export interface StudentSubjectDetail {
  course: CourseRef;
  /** ASSUMED: the term the detail is for (the heading says "First term"). */
  term?: TermRef | null;
  /** ASSUMED: the scale and pass mark, to colour the grade like B3 does. */
  scale?: GradeBand[];
  passMark?: number;
  teacher: IdName | null;
  roomId: string | null;
  assessments: SubjectAssessment[];
  total: number | null;
  percent: number | null;
  grade: string | null;
  position: Position | null;
  /** ASSUMED: the class average of the course percent (B3 has it). */
  classAverage?: number | null;
  scheme: {
    currentWeek: number | null;
    weeks: LessonTopic[];
  };
  legacyCurriculum: { content: string; updatedAt: Instant; attachments: string[] } | null;
  resources: StudentFile[];
}

/* ───────────────────────────── B5 Report card ───────────────────────────── */

/** A subject's best or worst result on the report card. ASSUMED shape. */
export interface ReportHighlight {
  courseId: string;
  title: string;
  short?: string;
  percent: number;
  position: Position | null;
}

/** One subject row of the report card; `scores` follow `columns`. */
export interface ReportRow {
  course: CourseRef & { short?: string };
  /** ASSUMED: the teacher, for the per-subject panel's subtitle. */
  teacher?: IdName | null;
  scores: Array<number | null>;
  total: number | null;
  percent: number | null;
  grade: string | null;
  position: Position | null;
  classAverage: number | null;
}

/** Whether the term's results are out. */
export type ReportStatus = "none" | "partial" | "published";

/** `GET /students/me/report-card?termId=` (B5). */
export interface ReportCard {
  status: ReportStatus;
  issuedAt: Instant | null;
  school: { name: string; logoUrl: string | null; address: string | null; phone: string | null; email: string | null };
  student: { name: string; admissionNumber: string | null; class: IdName };
  term: TermRef;
  session: string | null;
  nextTermStart: CalendarDay | null;
  columns: Array<{ id: string; name: string; maxScore: number }>;
  rows: ReportRow[];
  overall: { percent: number | null; grade: string | null; position: Position | null; previousPosition: Position | null };
  strongest: ReportHighlight | null;
  weakest: ReportHighlight | null;
  scale: GradeBand[];
  passMark: number;
  attendance: { schoolDays: number; present: number; late: number; absent: number; excused: number };
  remarks: { classTeacher: string | null; principal: string | null; classTeacherName: string | null } | null;
  acknowledgedAt: Instant | null;
}

/** `GET /students/me/report-card/terms` (B5). */
export interface ReportTerm {
  id: string;
  name: string;
  session: string | null;
  status: ReportStatus;
  /** ASSUMED: marks the school's current term, so pickers can default to it. */
  isCurrent?: boolean;
}

/* ───────────────────────────── B6 Attendance ───────────────────────────── */

/** A day's mark. */
export type AttendanceDayStatus = "present" | "late" | "absent" | "on_leave" | "unmarked" | "holiday" | "weekend";

/** `GET /students/me/attendance?termId=` (B6). */
export interface StudentAttendance {
  term: TermRef;
  class: IdName;
  schoolDays: number;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  /** (present + late) / (present + late + absent), percent; null before any mark. */
  rate: number | null;
  band: "on_track" | "watch";
  days?: Array<{ date: CalendarDay; status: AttendanceDayStatus }>;
}

/* ───────────────────────────── B7 Files ───────────────────────────── */

/** What kind of file a resource is (§24). */
export type ResourceKind = "pdf" | "slides" | "video" | "doc" | "image" | "other";

/** One file shared with the student (B7; also B4 `resources`). */
export interface StudentFile {
  id: string;
  name: string;
  course: CourseRef;
  teacher: IdName | null;
  kind: ResourceKind;
  sizeBytes: number | null;
  mimeType: string | null;
  createdAt: Instant;
  week: number | null;
  /** ASSUMED: the downloadable URL (the Resource's first `files` entry, or `image`). */
  url: string | null;
}

/** Pagination `meta`, kept by the strict envelope unwrap. */
export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/** A paginated list. */
export interface Paged<T> {
  data: T[];
  meta: PageMeta;
}

/** `GET /students/me/files?courseId=&q=&page=&limit=` (B7). */
export type StudentFilesPage = Paged<StudentFile>;

/** `POST /resources/:id/view` (§24). */
export interface ResourceViewResult {
  counted: boolean;
  viewCount: number;
}

/* ───────────────────────────── B10 Messages ───────────────────────────── */

/** The media tabs of a group's info (B10 adds `video`). */
export type RoomMediaKind = "image" | "video" | "document" | "link";

/** `GET /chat/rooms/:roomId/media?kind=` (§29 + B10). */
export interface RoomMediaPage {
  items: Array<{
    messageId: string;
    kind: RoomMediaKind;
    url: string;
    name: string | null;
    mimeType: string | null;
    size: number | null;
    sentAt: Instant;
    sender: IdName;
  }>;
  nextCursor: string | null;
  counts: Partial<Record<RoomMediaKind, number>>;
}

/* ───────────────────────────── B11 Notifications ───────────────────────────── */

/** `GET /notifications/counts` (§30). */
export interface NotificationCounts {
  all: number;
  unread: number;
  byCategory: Partial<Record<NotificationCategory, { all: number; unread: number }>>;
}

/** `PATCH /notifications/read-all` (§30). */
export interface ReadAllResult {
  updated: number;
  message?: string;
}

/* ───────────────────────────── B12 School, account ───────────────────────────── */

/** `GET /students/me/school` (B12, the §36 shape). */
export interface SchoolContact {
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  officeHours: { start: string; end: string } | null;
}

/** `GET /auth/password-policy` (§34, public). */
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

/** `GET /auth/sessions` item (§34). */
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

/** `SUPPORT_AREAS` (§35 + B12). */
export type SupportArea = "grading" | "attendance" | "timetable" | "messages" | "signing_in" | "payments" | "results" | "other";

/** `POST /support/tickets` body (§35). */
export interface SupportTicketBody {
  area: SupportArea;
  description: string;
  attachmentUrl?: string;
  context?: { path: string; appVersion: string; userAgent: string };
}

/** `POST /support/tickets` answer (§35). */
export interface SupportTicketResult {
  reference: string;
  createdAt: Instant;
}
