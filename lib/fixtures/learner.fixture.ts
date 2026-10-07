/**
 * Fixtures for the students redesign: one Jss1 A student at Easy Sparks
 * Education Center in the first week of first term, with the design's twelve
 * subjects, scores and timetable. Every builder takes a variant so the screens
 * (and their tests) can show the empty, weekend, holiday and partly published
 * states. Loaded only through `fixturesEnabled()` (dev) or by tests.
 */
import type { FixtureVariant } from "./flag";
import type {
  AuthSession,
  ComingUpItem,
  CourseRef,
  GradeBand,
  LearnerCourse,
  NotificationCounts,
  NotificationItem,
  PasswordPolicy,
  Period,
  ReportCard,
  ReportRow,
  RoomMediaKind,
  RoomMediaPage,
  SchoolContact,
  SchoolTerm,
  StudentAttendance,
  StudentFile,
  StudentFilesPage,
  StudentLesson,
  StudentSubjectDetail,
  StudentSubjects,
  StudentTimetable,
  StudentToday,
  SubjectSummary,
  TermRef,
  TodayLesson,
} from "@/types/learner";

/* ───────────────────────────── base data ───────────────────────────── */

/** The school's scale in the fixtures (the design's, not the API default). */
export const FIXTURE_SCALE: GradeBand[] = [
  { letter: "A", min: 75, remark: "Excellent" },
  { letter: "B", min: 65, remark: "Very good" },
  { letter: "C", min: 55, remark: "Good" },
  { letter: "D", min: 45, remark: "Fair" },
  { letter: "F", min: 0, remark: "Needs work" },
];

/** The pass mark in the fixtures. */
export const FIXTURE_PASS_MARK = 45;

export const FIXTURE_CLASS = { id: "class-jss1a", name: "Jss1 A" };

export const FIXTURE_TERM: TermRef = {
  id: "term-1",
  name: "First term",
  startDate: "2026-09-07",
  endDate: "2026-12-18",
  totalWeeks: 15,
  session: "2026/2027",
  isCurrent: true,
};

const PREVIOUS_TERM: TermRef = { id: "term-0", name: "Third term", startDate: "2026-04-20", endDate: "2026-07-24", totalWeeks: 14, session: "2025/2026", isCurrent: false };

/** The columns of the fixture report card (the API decides these; not 20/20/60 by rule). */
export const FIXTURE_COLUMNS = [
  { id: "as-ca1", name: "1st CA", maxScore: 20 },
  { id: "as-ca2", name: "2nd CA", maxScore: 20 },
  { id: "as-exam", name: "Exam", maxScore: 60 },
];

interface SubjectSeed {
  key: string;
  id: string;
  title: string;
  short: string;
  code: string;
  teacher: string;
  scores: [number, number, number];
  rank: number;
  classAverage: number;
}

/** The design's twelve subjects; ids chosen so each gets the design's colour. */
export const FIXTURE_SUBJECTS: SubjectSeed[] = [
  { key: "mth", id: "course-mth-18", title: "Advance Maths", short: "Maths", code: "MTH222", teacher: "Mr Seyi Tinubu", scores: [15, 10, 40], rank: 3, classAverage: 60 },
  { key: "eng", id: "course-eng-3", title: "English Language", short: "English", code: "ENG101", teacher: "Mrs Abike Dabiri", scores: [16, 15, 44], rank: 4, classAverage: 68 },
  { key: "chm", id: "course-chm-0", title: "Introduction to Chemistry", short: "Chem", code: "CHM101", teacher: "Mr Tunji Salias", scores: [14, 12, 36], rank: 6, classAverage: 64 },
  { key: "bio", id: "course-bio-3", title: "Biology", short: "Bio", code: "BIO101", teacher: "Mrs Ronke Adeyemi", scores: [17, 14, 45], rank: 2, classAverage: 66 },
  { key: "phy", id: "course-phy-9", title: "Physics", short: "Physics", code: "PHY101", teacher: "Mr Emeka Obi", scores: [12, 13, 38], rank: 9, classAverage: 65 },
  { key: "geo", id: "course-geo-8", title: "Geography", short: "Geo", code: "GEO101", teacher: "Miss Halima Bello", scores: [15, 16, 42], rank: 5, classAverage: 67 },
  { key: "civ", id: "course-civ-4", title: "Civic Education", short: "Civic", code: "CIV101", teacher: "Mr Saint Agbukor", scores: [18, 17, 48], rank: 1, classAverage: 71 },
  { key: "bus", id: "course-bus-3", title: "Business Studies", short: "Business", code: "BUS101", teacher: "Mrs Grace Eze", scores: [13, 12, 35], rank: 12, classAverage: 63 },
  { key: "agr", id: "course-agr-2", title: "Agricultural Science", short: "Agric", code: "AGR101", teacher: "Mr Yusuf Lawal", scores: [14, 15, 40], rank: 7, classAverage: 66 },
  { key: "cmp", id: "course-cmp-18", title: "Computer Studies", short: "Computer", code: "CMP101", teacher: "Miss Chidinma Okafor", scores: [16, 18, 50], rank: 1, classAverage: 72 },
  { key: "yor", id: "course-yor-4", title: "Yoruba Language", short: "Yoruba", code: "YOR101", teacher: "Mrs Folake Ojo", scores: [11, 12, 33], rank: 18, classAverage: 62 },
  { key: "art", id: "course-art-2", title: "Creative Arts", short: "Arts", code: "ART101", teacher: "Mr Dapo Ajayi", scores: [15, 14, 41], rank: 6, classAverage: 64 },
];

const CLASS_SIZE = 28;

const CURRICULUM: Record<string, string> = {
  mth: "Indices and standard form, simple equations, and an introduction to quadratic expressions. Bring your workbook to every lesson.",
  eng: "Comprehension, formal letter writing and the parts of speech. One reader per term.",
  chm: "States of matter, separation techniques and laboratory safety. Practicals begin in week four.",
  bio: "Living and non-living things, cell structure and the classification of plants.",
  phy: "Measurement, motion and simple machines, with weekly practical work.",
  geo: "Maps and map reading, the solar system and Nigeria's physical features.",
  civ: "Citizenship, national values and the rights of the child.",
  bus: "Trade, money and simple book-keeping for a small business.",
  agr: "Soil types, crop production and farm tools. School garden practicals on Fridays.",
  cmp: "Parts of a computer, file management and an introduction to spreadsheets.",
  yor: "Ìtàn àtẹnudẹnu, orthography and simple composition in Yoruba.",
  art: "Line, colour and form; still-life drawing and local craft traditions.",
};

const BY_KEY = new Map(FIXTURE_SUBJECTS.map((s) => [s.key, s]));
/** Each subject's `colourKey`: its place in the design's order, so it gets the design's colour. */
const COLOUR_KEY = new Map(FIXTURE_SUBJECTS.map((s, index) => [s.id, index]));
const BY_ID = new Map(FIXTURE_SUBJECTS.map((s) => [s.id, s]));

/**
 * A seed subject by its short key.
 *
 * @param key - "mth", "eng"…
 * @returns The seed.
 */
function seed(key: string): SubjectSeed {
  const found = BY_KEY.get(key);
  if (!found) throw new Error(`Unknown fixture subject ${key}`);
  return found;
}

/**
 * A seed's course reference.
 *
 * @param s - The seed.
 * @returns The course.
 */
function courseOf(s: SubjectSeed): CourseRef {
  return { id: s.id, code: s.code, title: s.title };
}

/**
 * A seed's course as B3/B4/B5/B7 send it: with its short name and colour.
 *
 * @param s - The seed.
 * @returns The course.
 */
function learnerCourseOf(s: SubjectSeed): LearnerCourse {
  return { id: s.id, code: s.code, title: s.title, short: s.short, colourKey: COLOUR_KEY.get(s.id) ?? 0 };
}

/**
 * A teacher reference for a seed.
 *
 * @param s - The seed.
 * @returns `{ id, name }`.
 */
function teacherOf(s: SubjectSeed) {
  return { id: `teacher-${s.key}`, name: s.teacher };
}

/**
 * Sum of the scores that are published.
 *
 * @param scores - Per column, null when not published.
 * @returns The sum, or null when none is published.
 */
function sumScores(scores: Array<number | null>): number | null {
  const present = scores.filter((v): v is number => v !== null);
  return present.length ? present.reduce((a, b) => a + b, 0) : null;
}

/**
 * Σ score / Σ maxScore over the published columns, ×100, to 1 decimal (A7).
 *
 * @param scores - Per column, null when not published.
 * @returns The percent, or null.
 */
function percentOf(scores: Array<number | null>): number | null {
  let got = 0;
  let max = 0;
  scores.forEach((value, index) => {
    if (value === null) return;
    got += value;
    max += FIXTURE_COLUMNS[index].maxScore;
  });
  return max ? Math.round((got / max) * 1000) / 10 : null;
}

/**
 * The letter for a percent on the fixture scale.
 *
 * @param percent - The percent, or null.
 * @returns The letter, or null.
 */
function letterFor(percent: number | null): string | null {
  if (percent === null) return null;
  return FIXTURE_SCALE.find((band) => percent >= band.min)?.letter ?? null;
}

/**
 * The published scores of a seed in a variant: all three, two (partial: the
 * exam is not out yet), or none (empty).
 *
 * @param s - The seed.
 * @param variant - The fixture variant.
 * @returns Scores per column.
 */
function scoresIn(s: SubjectSeed, variant: FixtureVariant): Array<number | null> {
  if (variant === "empty") return [null, null, null];
  if (variant === "partial") return [s.scores[0], s.scores[1], null];
  return [...s.scores];
}

/* ───────────────────────────── timetable ───────────────────────────── */

/** The bell schedule: seven lessons and a lunch break, 08:00 to 16:00. */
export const FIXTURE_PERIODS: Period[] = [
  { key: "p1", label: "Period 1", startTime: "08:00", endTime: "09:00", isBreak: false },
  { key: "p2", label: "Period 2", startTime: "09:00", endTime: "10:00", isBreak: false },
  { key: "p3", label: "Period 3", startTime: "10:00", endTime: "11:00", isBreak: false },
  { key: "p4", label: "Period 4", startTime: "11:00", endTime: "12:00", isBreak: false },
  { key: "brk", label: "Break", startTime: "12:00", endTime: "13:00", isBreak: true },
  { key: "p5", label: "Period 5", startTime: "13:00", endTime: "14:00", isBreak: false },
  { key: "p6", label: "Period 6", startTime: "14:00", endTime: "15:00", isBreak: false },
  { key: "p7", label: "Period 7", startTime: "15:00", endTime: "16:00", isBreak: false },
];

/** The design's week grid: rows are periods (without the break), columns Monday–Friday. */
const GRID: string[][] = [
  ["mth", "eng", "bio", "phy", "cmp"],
  ["chm", "mth", "eng", "civ", "bus"],
  ["eng", "phy", "mth", "geo", "art"],
  ["bio", "geo", "cmp", "agr", "agr"],
  ["civ", "yor", "chm", "mth", "phy"],
  ["cmp", "art", "bus", "yor", "geo"],
  ["bio", "chm", "agr", "art", "eng"],
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/** The Monday the fixtures treat as this week. */
export const FIXTURE_WEEK_START = "2026-09-14";

/**
 * Adds days to a calendar day.
 *
 * @param day - `YYYY-MM-DD`.
 * @param n - Days to add.
 * @returns The new day.
 */
function plusDays(day: string, n: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + n);
  return date.toISOString().slice(0, 10);
}

/**
 * Snaps any day to its week's Monday.
 *
 * @param day - `YYYY-MM-DD`.
 * @returns That week's Monday.
 */
function mondayOf(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  const offset = (date.getUTCDay() + 6) % 7;
  return plusDays(day, -offset);
}

/**
 * One lesson of the grid.
 *
 * @param key - The subject key.
 * @param dayIndex - 0 for Monday.
 * @param date - The lesson's day.
 * @param period - The period it fills.
 * @returns The lesson.
 */
function lessonFor(key: string, dayIndex: number, date: string, period: Period): StudentLesson {
  const s = seed(key);
  return {
    id: `lesson-${date}-${period.key}`,
    date,
    day: WEEKDAYS[dayIndex],
    periodKey: period.key,
    startTime: period.startTime,
    endTime: period.endTime,
    course: courseOf(s),
    courseShort: s.short,
    subject: { id: `subject-${s.key}`, name: s.title },
    class: FIXTURE_CLASS,
    classRoomId: "room-class",
    room: null,
    teacher: teacherOf(s),
    topic: { week: 2, topic: CURRICULUM[s.key].split(",")[0], objectives: "", taughtAt: null },
    cancelled: null,
    colourKey: COLOUR_KEY.get(s.id) ?? 0,
    offSchedule: false,
  };
}

/**
 * The lessons of one week, from the grid.
 *
 * @param monday - The week's Monday.
 * @param skip - Days (indexes) to leave out, such as a holiday.
 * @returns The lessons in day then time order.
 */
function weekLessons(monday: string, skip: ReadonlySet<number> = new Set()): StudentLesson[] {
  const teaching = FIXTURE_PERIODS.filter((p) => !p.isBreak);
  const lessons: StudentLesson[] = [];
  for (let d = 0; d < 5; d++) {
    if (skip.has(d)) continue;
    const date = plusDays(monday, d);
    teaching.forEach((period, row) => lessons.push(lessonFor(GRID[row][d], d, date, period)));
  }
  return lessons;
}

/**
 * B2 `GET /students/me/timetable?weekStart=`.
 *
 * @param variant - "holiday" makes Wednesday a public holiday; "empty" has no lessons.
 * @param weekStart - Any day of the week to show; the fixture week by default.
 * @returns The week.
 */
export function makeTimetable(variant: FixtureVariant = "normal", weekStart: string = FIXTURE_WEEK_START): StudentTimetable {
  const monday = mondayOf(weekStart);
  const isCurrent = monday === FIXTURE_WEEK_START;
  const holidayIndex = variant === "holiday" ? 2 : -1;
  const termStart = FIXTURE_TERM.startDate as string;
  const weekNumber = Math.floor((Date.parse(monday) - Date.parse(mondayOf(termStart))) / (7 * 86_400_000)) + 1;
  const inTerm = weekNumber >= 1 && weekNumber <= (FIXTURE_TERM.totalWeeks ?? 15);
  return {
    timezone: "Africa/Lagos",
    now: "2026-09-14T07:40:00.000Z",
    today: "2026-09-14",
    term: FIXTURE_TERM,
    week: {
      number: inTerm ? weekNumber : null,
      start: monday,
      end: plusDays(monday, 4),
      isCurrent,
      prevStart: plusDays(monday, -7),
      nextStart: plusDays(monday, 7),
      inTerm,
    },
    days: WEEKDAYS.map((day, index) => ({
      date: plusDays(monday, index),
      day,
      isToday: plusDays(monday, index) === "2026-09-14",
      holiday: index === holidayIndex ? { title: "Founders' Day" } : null,
      endsEarlyAt: null,
      events: [],
    })),
    periods: FIXTURE_PERIODS,
    periodsSource: "school",
    lessons: variant === "empty" || !inTerm ? [] : weekLessons(monday, holidayIndex >= 0 ? new Set([holidayIndex]) : undefined),
    subjects: FIXTURE_SUBJECTS.map((s) => ({ courseId: s.id, title: s.title, short: s.short, colourKey: COLOUR_KEY.get(s.id) ?? 0, teacher: teacherOf(s) })),
  };
}

/* ───────────────────────────── today ───────────────────────────── */

const COMING_UP: ComingUpItem[] = [
  { kind: "assessment", id: "as-mth-ca1", title: "Advance Maths — 1st CA", courseTitle: "Advance Maths", date: "2026-09-17", daysAway: 3 },
  { kind: "assessment", id: "as-chm-prac", title: "Chemistry practical write-up", courseTitle: "Introduction to Chemistry", date: "2026-09-21", daysAway: 7 },
  { kind: "assessment", id: "as-cmp-proj", title: "Computer Studies project", courseTitle: "Computer Studies", date: "2026-09-25", daysAway: 11 },
  { kind: "event", id: "ev-exams", title: "First term exam week begins", courseTitle: null, date: "2026-10-05", daysAway: 21 },
];

/**
 * The "New since you last signed in" feed.
 *
 * @returns Three unread notifications.
 */
export function makeFeed(): NotificationItem[] {
  return [
    { id: "n-file", title: "New file in Computer Studies", message: "Spreadsheet practice file · Miss Chidinma Okafor", category: "resources", createdAt: "2026-09-14T07:10:00.000Z", isRead: false, senderName: "Miss Chidinma Okafor", target: { page: "resources", courseId: seed("cmp").id }, actionLabel: "Open Files" },
    { id: "n-result", title: "Results published", message: "Civic Education · 1st CA, 2nd CA and Exam", category: "grading", createdAt: "2026-09-13T15:00:00.000Z", isRead: false, senderName: "Easy Sparks Education Center", target: { page: "results" }, actionLabel: "Open Results" },
    { id: "n-msg", title: "5 unread messages", message: "Jss1 A class chat", category: "messages", createdAt: "2026-09-11T16:52:00.000Z", isRead: false, senderName: "Mr Saint Agbukor", target: { page: "messages", roomId: "room-class" }, actionLabel: "Open Messages" },
  ];
}

/**
 * The mean of the subject percents (A7's term percent).
 *
 * @param percents - One per subject, null when nothing is published.
 * @returns The mean to 1 decimal, or null.
 */
function meanPercent(percents: Array<number | null>): number | null {
  const present = percents.filter((v): v is number => v !== null);
  if (!present.length) return null;
  return Math.round((present.reduce((a, b) => a + b, 0) / present.length) * 10) / 10;
}

/**
 * B1 `GET /students/me/today`.
 *
 * @param variant - "weekend", "holiday", "empty" (no scores, nothing marked) or "partial".
 * @returns Today.
 */
export function makeToday(variant: FixtureVariant = "normal"): StudentToday {
  const weekend = variant === "weekend";
  const holiday = variant === "holiday";
  const date = weekend ? "2026-09-19" : "2026-09-14";
  const percents = FIXTURE_SUBJECTS.map((s) => percentOf(scoresIn(s, variant)));
  const average = meanPercent(percents);
  const monday = weekLessons(FIXTURE_WEEK_START).filter((l) => l.date === "2026-09-14");
  const lessons: TodayLesson[] =
    weekend || holiday
      ? []
      : monday.map((lesson, index) => ({
          ...lesson,
          state: index === 0 ? "now" : "later",
          minutesLeft: index === 0 ? 20 : null,
        }));
  const empty = variant === "empty";
  return {
    date,
    day: weekend ? "Saturday" : "Monday",
    now: weekend ? "2026-09-19T09:00:00.000Z" : "2026-09-14T07:40:00.000Z",
    timezone: "Africa/Lagos",
    greeting: "morning",
    class: FIXTURE_CLASS,
    term: FIXTURE_TERM,
    weekNumber: 2,
    schoolDay: weekend
      ? { isSchoolDay: false, reason: "weekend", holidayTitle: null, endsEarlyAt: null }
      : holiday
        ? { isSchoolDay: false, reason: "holiday", holidayTitle: "Founders' Day", endsEarlyAt: null }
        : { isSchoolDay: true, reason: null, holidayTitle: null, endsEarlyAt: null },
    periods: FIXTURE_PERIODS,
    lessons,
    nowLessonId: lessons[0]?.id ?? null,
    nextLessonId: lessons[1]?.id ?? null,
    glance: {
      average,
      grade: letterFor(average),
      position: empty ? null : { rank: 5, of: CLASS_SIZE },
      movement: empty ? null : 2,
      attendance: empty ? { rate: null, present: 0, schoolDays: 0 } : { rate: 94, present: 46, schoolDays: 50 },
      unread: empty ? { count: 0, topRoom: null } : { count: 5, topRoom: { id: "room-class", name: "Jss1 A" } },
    },
    subjectTotals: FIXTURE_SUBJECTS.map((s, index) => ({
      courseId: s.id,
      title: s.title,
      short: s.short,
      colourKey: COLOUR_KEY.get(s.id) ?? 0,
      percent: percents[index],
      classAverage: empty ? null : s.classAverage,
    })),
    passMark: FIXTURE_PASS_MARK,
    comingUp: empty ? [] : COMING_UP,
    feed: empty ? [] : makeFeed(),
    counts: empty ? { unreadNotifications: 0, unreadMessages: 0 } : { unreadNotifications: 2, unreadMessages: 5 },
  };
}

/* ───────────────────────────── subjects ───────────────────────────── */

/**
 * One B3 card.
 *
 * @param s - The seed.
 * @param variant - The fixture variant.
 * @returns The card.
 */
function summaryOf(s: SubjectSeed, variant: FixtureVariant): SubjectSummary {
  const scores = scoresIn(s, variant);
  const percent = percentOf(scores);
  return {
    course: learnerCourseOf(s),
    subject: { id: `subject-${s.key}`, name: s.title },
    teacher: teacherOf(s),
    // Yoruba's subject group has never been opened, so it has no room yet.
    roomId: s.key === "yor" ? null : `room-${s.key}`,
    total: sumScores(scores),
    percent,
    grade: letterFor(percent),
    position: variant === "empty" ? null : { rank: s.rank, of: CLASS_SIZE },
    classAverage: variant === "empty" ? null : s.classAverage,
    complete: variant === "normal",
    currentTopic: { week: 2, topic: CURRICULUM[s.key].split(",")[0] },
    resourceCount: FILES.filter((f) => f.course.id === s.id).length,
  };
}

/**
 * B3 `GET /students/me/subjects?termId=`.
 *
 * @param variant - "empty" has no published scores, "partial" lacks the exam.
 * @returns The subjects.
 */
export function makeSubjects(variant: FixtureVariant = "normal"): StudentSubjects {
  return { term: FIXTURE_TERM, scale: FIXTURE_SCALE, passMark: FIXTURE_PASS_MARK, subjects: FIXTURE_SUBJECTS.map((s) => summaryOf(s, variant)) };
}

/**
 * B4 `GET /students/me/subjects/:courseId?termId=`.
 *
 * @param courseId - The course.
 * @param variant - "partial" lacks the exam; "empty" has no scores and no files.
 * @returns The detail, or null for an unknown course (the API's 404).
 */
export function makeSubjectDetail(courseId: string, variant: FixtureVariant = "normal"): StudentSubjectDetail | null {
  const s = BY_ID.get(courseId);
  if (!s) return null;
  const scores = scoresIn(s, variant);
  const percent = percentOf(scores);
  const weeks = Array.from({ length: 6 }, (_, i) => ({
    week: i + 1,
    topic: i === 1 ? CURRICULUM[s.key].split(",")[0] : `${s.short} — week ${i + 1} topic`,
    objectives: i === 1 ? CURRICULUM[s.key] : "",
    taughtAt: i < 1 ? "2026-09-08T09:00:00.000Z" : null,
  }));
  return {
    course: learnerCourseOf(s),
    term: FIXTURE_TERM,
    scale: FIXTURE_SCALE,
    passMark: FIXTURE_PASS_MARK,
    teacher: teacherOf(s),
    roomId: s.key === "yor" ? null : `room-${s.key}`,
    assessments: FIXTURE_COLUMNS.map((column, index) => ({
      id: column.id,
      name: column.name,
      maxScore: column.maxScore,
      score: scores[index],
      classAverage: variant === "empty" ? null : Math.round(column.maxScore * (s.classAverage / 100) * 10) / 10,
    })),
    total: sumScores(scores),
    percent,
    grade: letterFor(percent),
    position: variant === "empty" ? null : { rank: s.rank, of: CLASS_SIZE },
    classAverage: variant === "empty" ? null : s.classAverage,
    scheme: { currentWeek: 2, weeks },
    legacyCurriculum: { content: CURRICULUM[s.key], updatedAt: "2026-05-12T10:00:00.000Z", attachments: [] },
    resources: variant === "empty" ? [] : FILES.filter((f) => f.course.id === s.id),
  };
}

/* ───────────────────────────── report card ───────────────────────────── */

/**
 * B5 `GET /students/me/report-card?termId=`.
 *
 * @param variant - "partial" (exam not out, no remarks), "empty" (status none), else published.
 * @param termId - The term asked for; the previous term is always published.
 * @returns The report card.
 */
export function makeReportCard(variant: FixtureVariant = "normal", termId: string = FIXTURE_TERM.id): ReportCard {
  const effective: FixtureVariant = termId === PREVIOUS_TERM.id ? "normal" : variant;
  const term = termId === PREVIOUS_TERM.id ? PREVIOUS_TERM : FIXTURE_TERM;
  const none = effective === "empty";
  const rows: ReportRow[] = none
    ? []
    : FIXTURE_SUBJECTS.map((s) => {
        const scores = scoresIn(s, effective);
        const percent = percentOf(scores);
        return {
          course: learnerCourseOf(s),
          teacher: teacherOf(s),
          scores,
          total: sumScores(scores),
          percent,
          grade: letterFor(percent),
          position: { rank: s.rank, of: CLASS_SIZE },
          classAverage: s.classAverage,
        };
      });
  const percents = rows.map((r) => r.percent);
  const overallPercent = meanPercent(percents);
  const sorted = rows.filter((r) => r.percent !== null).sort((a, b) => (b.percent as number) - (a.percent as number));
  const highlight = (row: ReportRow | undefined) =>
    row ? { courseId: row.course.id, title: row.course.title, short: row.course.short, colourKey: row.course.colourKey, percent: row.percent as number, position: row.position } : null;
  return {
    status: none ? "none" : effective === "partial" ? "partial" : "published",
    issuedAt: none ? null : "2026-09-14T08:00:00.000Z",
    school: {
      name: "Easy Sparks Education Center",
      logoUrl: null,
      address: "14 Ikorodu Road, Lagos",
      phone: "+234 907 578 3540",
      email: "office@easysparks.edu.ng",
    },
    student: { name: "Musa Adele", admissionNumber: "TAL/2026/JS1/0148", class: FIXTURE_CLASS },
    term,
    session: term.session ?? null,
    nextTermStart: "2027-01-11",
    columns: FIXTURE_COLUMNS,
    rows,
    overall: {
      percent: overallPercent,
      grade: letterFor(overallPercent),
      position: none ? null : { rank: 5, of: CLASS_SIZE },
      previousPosition: none || term.id === PREVIOUS_TERM.id ? null : { rank: 7, of: CLASS_SIZE },
    },
    strongest: highlight(sorted[0]),
    weakest: highlight(sorted[sorted.length - 1]),
    scale: FIXTURE_SCALE,
    passMark: FIXTURE_PASS_MARK,
    attendance: none ? { schoolDays: 50, present: 0, late: 0, absent: 0, excused: 0 } : { schoolDays: 50, present: 46, late: 1, absent: 3, excused: 0 },
    remarks:
      effective === "normal"
        ? {
            classTeacher:
              "Musa has settled well into Jss1 A and is strongest in Computer Studies and Civic Education. Steady work on Yoruba Language and Business Studies would lift his average further next term.",
            principal: "A good start to the session. Keep it up.",
            classTeacherName: "Mr Saint Agbukor",
          }
        : null,
    acknowledgedAt: null,
  };
}

/**
 * `GET /academic-year-term/term/school` as `learnerService.getSchoolTerms`
 * hands it on: the school's terms, newest first.
 *
 * @returns The terms.
 */
export function makeSchoolTerms(): SchoolTerm[] {
  return [
    { id: FIXTURE_TERM.id, name: FIXTURE_TERM.name, session: FIXTURE_TERM.session, startDate: "2026-09-07T00:00:00.000Z", endDate: "2026-12-18T00:00:00.000Z", isCurrent: true, academicYearId: "year-2026" },
    { id: PREVIOUS_TERM.id, name: PREVIOUS_TERM.name, session: PREVIOUS_TERM.session, startDate: "2026-04-20T00:00:00.000Z", endDate: "2026-07-24T00:00:00.000Z", isCurrent: false, academicYearId: "year-2025" },
  ];
}

/* ───────────────────────────── attendance ───────────────────────────── */

/**
 * B6 `GET /students/me/attendance?termId=`.
 *
 * @param variant - "empty" has nothing marked yet.
 * @param termId - The term asked for.
 * @returns The term's attendance.
 */
export function makeAttendance(variant: FixtureVariant = "normal", termId: string = FIXTURE_TERM.id): StudentAttendance {
  const term = termId === PREVIOUS_TERM.id ? PREVIOUS_TERM : FIXTURE_TERM;
  if (variant === "empty" && term.id === FIXTURE_TERM.id) {
    return { term, class: FIXTURE_CLASS, schoolDays: 0, present: 0, late: 0, absent: 0, onLeave: 0, rate: null, band: "on_track" };
  }
  if (term.id === PREVIOUS_TERM.id) {
    return { term, class: FIXTURE_CLASS, schoolDays: 62, present: 52, late: 3, absent: 6, onLeave: 1, rate: 90.2, band: "watch" };
  }
  return { term, class: FIXTURE_CLASS, schoolDays: 50, present: 46, late: 1, absent: 3, onLeave: 0, rate: 94, band: "on_track" };
}

/* ───────────────────────────── files ───────────────────────────── */

const FILES: StudentFile[] = [
  { id: "res-mth-1", name: "Indices worksheet", course: learnerCourseOf(seed("mth")), teacher: teacherOf(seed("mth")), kind: "pdf", sizeBytes: 482_000, mimeType: "application/pdf", createdAt: "2026-05-12T10:00:00.000Z", week: 2, termId: "term-1", downloadUrl: "https://res.cloudinary.com/talim/raw/upload/indices.pdf" },
  { id: "res-eng-1", name: "Formal letter template", course: learnerCourseOf(seed("eng")), teacher: teacherOf(seed("eng")), kind: "doc", sizeBytes: 36_000, mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", createdAt: "2026-09-09T10:00:00.000Z", week: 1, termId: "term-1", downloadUrl: "https://res.cloudinary.com/talim/raw/upload/letter.docx" },
  { id: "res-bio-1", name: "Cell structure diagram", course: learnerCourseOf(seed("bio")), teacher: teacherOf(seed("bio")), kind: "pdf", sizeBytes: 1_250_000, mimeType: "application/pdf", createdAt: "2026-09-08T10:00:00.000Z", week: 1, termId: "term-1", downloadUrl: "https://res.cloudinary.com/talim/raw/upload/cell.pdf" },
  { id: "res-cmp-1", name: "Spreadsheet practice file", course: learnerCourseOf(seed("cmp")), teacher: teacherOf(seed("cmp")), kind: "doc", sizeBytes: 88_000, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", createdAt: "2026-09-11T10:00:00.000Z", week: 2, termId: "term-1", downloadUrl: "https://res.cloudinary.com/talim/raw/upload/practice.xlsx" },
  { id: "res-phy-1", name: "Simple machines (video)", course: learnerCourseOf(seed("phy")), teacher: teacherOf(seed("phy")), kind: "video", sizeBytes: 24_500_000, mimeType: "video/mp4", createdAt: "2026-09-10T10:00:00.000Z", week: 2, termId: "term-1", downloadUrl: "https://res.cloudinary.com/talim/video/upload/machines.mp4" },
  { id: "res-geo-1", name: "Map reading slides", course: learnerCourseOf(seed("geo")), teacher: teacherOf(seed("geo")), kind: "slides", sizeBytes: 3_400_000, mimeType: "application/vnd.ms-powerpoint", createdAt: "2026-09-07T10:00:00.000Z", week: 1, termId: "term-1", downloadUrl: "https://res.cloudinary.com/talim/raw/upload/maps.pptx" },
];

/**
 * B7 `GET /students/me/files?courseId=&q=&page=&limit=`, newest first.
 *
 * @param variant - "empty" has no files.
 * @param params - The filters and page.
 * @param params.courseId - Only this course's files.
 * @param params.q - Matches the file or subject name, ignoring case.
 * @param params.page - 1-based page.
 * @param params.limit - Page size.
 * @returns The page.
 */
export function makeFiles(
  variant: FixtureVariant = "normal",
  params: { courseId?: string; q?: string; page?: number; limit?: number } = {}
): StudentFilesPage {
  const needle = params.q?.trim().toLowerCase() ?? "";
  const all = variant === "empty" ? [] : [...FILES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const filtered = all.filter(
    (f) =>
      (!params.courseId || f.course.id === params.courseId) &&
      (!needle || f.name.toLowerCase().includes(needle) || f.course.title.toLowerCase().includes(needle))
  );
  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  return {
    data: filtered.slice((page - 1) * limit, page * limit),
    meta: { total: filtered.length, page, limit, lastPage: Math.max(1, Math.ceil(filtered.length / limit)) },
  };
}

/* ───────────────────────────── account, school, media ───────────────────────────── */

/**
 * B12 `GET /students/me/school`.
 *
 * @returns The school office's contact.
 */
export function makeSchoolContact(): SchoolContact {
  return {
    name: "Easy Sparks Education Center",
    phone: "+234 907 578 3540",
    email: "office@easysparks.edu.ng",
    address: "14 Ikorodu Road, Lagos",
    officeHours: { start: "08:00", end: "16:00" },
  };
}

/**
 * §34 `GET /auth/password-policy`.
 *
 * @returns The policy.
 */
export function makePasswordPolicy(): PasswordPolicy {
  return { minLength: 8, maxLength: 128, requireUppercase: true, requireLowercase: true, requireNumber: true, requireSymbol: true, symbols: "!@#$%^&*()-_=+[]{};:,.?/", historyCount: 1 };
}

/**
 * §34 `GET /auth/sessions`.
 *
 * @returns Two sessions, this browser first.
 */
export function makeSessions(): AuthSession[] {
  return [
    { id: "sess-this", device: "Mac", browser: "Chrome", os: "macOS", ip: "102.89.1.10", lastUsedAt: "2026-09-14T07:40:00.000Z", createdAt: "2026-09-14T07:00:00.000Z", current: true },
    { id: "sess-phone", device: "iPhone", browser: "Talim app", os: "iOS", ip: "102.89.3.44", lastUsedAt: "2026-09-12T18:10:00.000Z", createdAt: "2026-09-12T18:00:00.000Z", current: false },
  ];
}

/**
 * §29/B10 `GET /chat/rooms/:roomId/media?kind=`.
 *
 * @param kind - Which tab.
 * @returns One page of that kind.
 */
export function makeRoomMedia(kind: RoomMediaKind): RoomMediaPage {
  const sender = { id: "teacher-cmp", name: "Miss Chidinma Okafor" };
  const items: RoomMediaPage["items"] =
    kind === "document"
      ? [{ messageId: "m-doc", kind, url: "https://res.cloudinary.com/talim/raw/upload/practice.xlsx", name: "practice.xlsx", mimeType: null, size: 88_000, sentAt: "2026-09-11T09:30:00.000Z", sender }]
      : kind === "link"
        ? [{ messageId: "m-link", kind, url: "https://www.bbc.co.uk/bitesize", name: null, mimeType: null, size: null, sentAt: "2026-09-10T09:30:00.000Z", sender }]
        : kind === "video"
          ? [{ messageId: "m-vid", kind, url: "https://res.cloudinary.com/talim/video/upload/machines.mp4", name: "machines.mp4", mimeType: "video/mp4", size: 24_500_000, sentAt: "2026-09-10T11:00:00.000Z", sender }]
          : [];
  return { items, nextCursor: null, counts: { image: 0, video: 1, document: 1, link: 1 } };
}

/**
 * §30 `GET /notifications/counts`.
 *
 * @param variant - "empty" has nothing.
 * @returns The counts.
 */
export function makeNotificationCounts(variant: FixtureVariant = "normal"): NotificationCounts {
  const zero = { all: 0, unread: 0 };
  const byCategory = {
    announcement: zero,
    attendance: zero,
    academics: zero,
    grading: zero,
    resources: zero,
    messages: zero,
    account: zero,
    payments: zero,
    leave: zero,
    support: zero,
    other: zero,
  };
  if (variant === "empty") return { all: 0, unread: 0, byCategory };
  return {
    all: 4,
    unread: 2,
    byCategory: {
      ...byCategory,
      academics: { all: 2, unread: 1 },
      resources: { all: 1, unread: 1 },
      grading: { all: 1, unread: 0 },
    },
  };
}

/**
 * The raw rows of `GET /notifications` for the Updates screen, the one feed
 * (A10): the design's assessment, file and results items, and the school
 * announcement as its per-recipient row (`type: "announcement"`,
 * `metadata.announcementId`), already read.
 *
 * @param variant - "empty" has none.
 * @returns The raw items.
 */
export function makeRawNotifications(variant: FixtureVariant = "normal") {
  if (variant === "empty") return [];
  return [
    { _id: "nf-assess", title: "New assessment: 1st CA", message: "Advance Maths 1st CA holds on Thursday 17 September, in class. Revise indices and standard form.", type: "assessment_reminder", category: "academics", source: "school", senderName: "Easy Sparks Education Center", isRead: false, createdAt: "2026-09-14T07:00:00.000Z", metadata: { target: { page: "today" }, actionLabel: "See coming up" } },
    { _id: "nf-file", title: "New file in Computer Studies", message: "Miss Chidinma Okafor shared the spreadsheet practice file with Jss1 A.", type: "assignment_or_resource", category: "resources", source: "school", senderName: "Miss Chidinma Okafor", isRead: false, createdAt: "2026-09-14T07:10:00.000Z", metadata: { target: { page: "resources", courseId: seed("cmp").id }, actionLabel: "Open Files" } },
    { _id: "nf-result", title: "Results published for Civic Education", message: "1st CA, 2nd CA and Exam scores are now visible. You placed 1st in the class.", type: "result_published", category: "grading", source: "school", senderName: "Easy Sparks Education Center", isRead: true, createdAt: "2026-09-13T15:00:00.000Z", metadata: { target: { page: "results" }, actionLabel: "Open Results" } },
    { _id: "nf-assembly", title: "Assembly moves to 8:15", message: "Tomorrow's assembly starts fifteen minutes later. Games kit for the whole day.", type: "announcement", category: "announcement", source: "school", senderName: "Mr Saint Agbukor", isRead: true, createdAt: "2026-09-11T16:40:00.000Z", metadata: { announcementId: "an-assembly", target: { page: "messages", roomId: "room-class" }, actionLabel: "Open Messages" } },
  ];
}
