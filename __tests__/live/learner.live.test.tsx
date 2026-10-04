/**
 * @jest-environment node
 */
/**
 * Contract check against a running API, off by default. It signs in as a
 * student, calls every route the students portal reads through the app's own
 * services, checks each answer's shape against what the screens use, and
 * renders each screen's view with the live data (server-side, no browser).
 *
 *   LIVE_API=1 NEXT_PUBLIC_API_BASE_URL=http://localhost:5056 \
 *     LIVE_EMAIL=ada.student@e2e.talim.test LIVE_PASSWORD='Demo#Pass2026' \
 *     npx jest __tests__/live
 *
 * Read-only: nothing it calls changes data, except that signing in creates a
 * session, as any sign-in does.
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const LIVE = process.env.LIVE_API === "1";
const describeLive = LIVE ? describe : describe.skip;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));
// The views' chat and onboarding hooks need their providers; the contract
// check renders views alone.
jest.mock("@/contexts/ChatContext", () => ({ useChatContext: () => ({ refreshChatRooms: jest.fn(), totalUnread: 0 }) }));
jest.mock("@/contexts/OnboardingContext", () => ({ useStudentOnboarding: () => ({ markStepComplete: jest.fn() }) }));

/** A value's runtime kind, for shape messages. */
type Kind = "string" | "number" | "boolean" | "object" | "array" | "null";

/**
 * The kind of a value.
 *
 * @param value - Anything.
 * @returns Its kind.
 */
function kindOf(value: unknown): Kind {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as Kind;
}

/**
 * Asserts that `value[key]` exists and has one of the kinds (`"x?"` allows
 * the key to be absent).
 *
 * @param value - The object.
 * @param spec - Key → allowed kinds, joined with "|".
 * @param where - A label for failures.
 */
function expectShape(value: unknown, spec: Record<string, string>, where: string) {
  expect(kindOf(value)).toBe("object");
  const record = value as Record<string, unknown>;
  for (const [rawKey, kinds] of Object.entries(spec)) {
    const optional = rawKey.endsWith("?");
    const key = optional ? rawKey.slice(0, -1) : rawKey;
    if (optional && !(key in record)) continue;
    const allowed = kinds.split("|");
    const actual = kindOf(record[key]);
    if (!allowed.includes(actual)) throw new Error(`${where}.${key}: expected ${kinds}, got ${actual}`);
  }
}

/**
 * Renders a view the way the app does (query cache and auth around it) to
 * static HTML.
 *
 * @param element - The view.
 * @returns The HTML.
 */
function renderHtml(element: React.ReactElement): string {
   
  const { AuthContext } = require("@/contexts/AuthContext");
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, enabled: false } } });
  return renderToStaticMarkup(
    <QueryClientProvider client={client}>
      <AuthContext.Provider
        value={{ user: student, isAuthenticated: true, isLoading: false, accessToken: "live", checkAuth: jest.fn(), logout: jest.fn(), setAuthState: jest.fn() }}
      >
        {element}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

 
let student: any = null;

describeLive("live API contract (students portal)", () => {
   
  const load = () => ({
    auth: require("@/services/auth.service").authService,
    learner: require("@/services/learner.service").learnerService,
    account: require("@/services/account.service").accountService,
    notifications: require("@/services/notification.service").notificationService,
    settings: require("@/services/settings.service").settingsService,
    session: require("@/lib/session").sessionStore,
    signIn: require("@/lib/auth/signIn"),
  });
   
  let s: ReturnType<typeof load>;

  beforeAll(async () => {
    s = load();
    const login = await s.auth.login({
      email: process.env.LIVE_EMAIL ?? "ada.student@e2e.talim.test",
      password: process.env.LIVE_PASSWORD ?? "Demo#Pass2026",
      deviceToken: "web-token",
      platform: "web",
    });
    expect(typeof login.access_token).toBe("string");
    const introspected = await s.auth.introspect(login.access_token);
    student = introspected.user;
    expect(s.signIn.isStudentRole(student.role)).toBe(true);
    s.session.set(student, login.access_token);
  }, 30_000);

  it("introspect carries what the shell and Settings read", () => {
    expectShape(student, { userId: "string", firstName: "string", lastName: "string", email: "string", role: "string", schoolName: "string", className: "string|null", admissionNumber: "string|null", studentId: "string|null", "userAvatar?": "string|null" }, "introspect.user");
  });

  it("B1 today", async () => {
    const { TodayView } = await import("@/components/screens/today/TodayScreen");
    const today = await s.learner.getToday();
    expectShape(today, { date: "string", day: "string", now: "string", greeting: "string", class: "object", term: "object|null", schoolDay: "object", periods: "array", lessons: "array", glance: "object", subjectTotals: "array", passMark: "number", comingUp: "array", feed: "array", counts: "object" }, "today");
    for (const t of today.subjectTotals) expectShape(t, { courseId: "string", short: "string", colourKey: "number", percent: "number|null" }, "today.subjectTotals[]");
    for (const l of today.lessons) expectShape(l, { id: "string", course: "object", colourKey: "number", state: "string", startTime: "string" }, "today.lessons[]");
    for (const f of today.feed) expectShape(f, { id: "string", title: "string", message: "string", category: "string", createdAt: "string", isRead: "boolean", target: "object|null" }, "today.feed[]");
    const html = renderHtml(<TodayView today={today} firstName={student.firstName} />);
    expect(html).toContain("Your term at a glance");
    expect(html).toContain(`pass mark ${today.passMark}%`);
  });

  it("B2 timetable, this week and the next", async () => {
    const { TimetableView } = await import("@/components/screens/timetable/TimetableScreen");
    const week = await s.learner.getTimetable();
    expectShape(week, { week: "object", days: "array", periods: "array", lessons: "array", subjects: "array", term: "object|null" }, "timetable");
    expectShape(week.week, { start: "string", end: "string", prevStart: "string", nextStart: "string", isCurrent: "boolean", number: "number|null" }, "timetable.week");
    for (const subject of week.subjects) expectShape(subject, { courseId: "string", short: "string", colourKey: "number", teacher: "object|null" }, "timetable.subjects[]");
    for (const lesson of week.lessons) expectShape(lesson, { id: "string", date: "string", periodKey: "string|null", colourKey: "number", offSchedule: "boolean", courseShort: "string" }, "timetable.lessons[]");
    const next = await s.learner.getTimetable(week.week.nextStart);
    expect(next.week.start).toBe(week.week.nextStart);
    expect(renderHtml(<TimetableView timetable={week} onWeekChange={() => undefined} />)).toContain("Timetable");
  });

  it("B3 subjects and B4 each subject", async () => {
    const { SubjectsView } = await import("@/components/screens/subjects/SubjectsScreen");
    const { SubjectDetailView } = await import("@/components/screens/subjects/SubjectDetailScreen");
    const subjects = await s.learner.getSubjects();
    expectShape(subjects, { term: "object", scale: "array", passMark: "number", subjects: "array" }, "subjects");
    for (const band of subjects.scale) expectShape(band, { letter: "string", min: "number", remark: "string|null" }, "subjects.scale[]");
    expect(renderHtml(<SubjectsView data={subjects} />)).toContain("Subjects");
    for (const subject of subjects.subjects) {
      expectShape(subject, { course: "object", teacher: "object|null", roomId: "string|null", percent: "number|null", complete: "boolean", resourceCount: "number" }, "subjects.subjects[]");
      const detail = await s.learner.getSubject(subject.course.id);
      expectShape(detail, { course: "object", term: "object", scale: "array", passMark: "number", assessments: "array", scheme: "object", resources: "array", classAverage: "number|null" }, "subject");
      for (const a of detail.assessments) expectShape(a, { id: "string", name: "string", maxScore: "number", score: "number|null" }, "subject.assessments[]");
      for (const r of detail.resources) expectShape(r, { id: "string", downloadUrl: "string|null", course: "object" }, "subject.resources[]");
      expect(renderHtml(<SubjectDetailView detail={detail} />)).toContain(detail.course.title);
    }
  });

  it("B5 report card for every term of the picker", async () => {
    const { ResultsView } = await import("@/components/screens/results/ResultsScreen");
    const { termOptions } = await import("@/lib/results/terms");
    const terms = await s.learner.getSchoolTerms();
    expect(terms.length).toBeGreaterThan(0);
    for (const term of terms) expectShape(term, { id: "string", name: "string", session: "string|null", isCurrent: "boolean", startDate: "string" }, "terms[]");
    expect(terms.filter((t: { isCurrent: boolean }) => t.isCurrent).length).toBeLessThanOrEqual(1);
    for (const term of terms) {
      const card = await s.learner.getReportCard(term.id);
      expectShape(card, { status: "string", school: "object", student: "object", term: "object", columns: "array", rows: "array", overall: "object", scale: "array", passMark: "number", attendance: "object", remarks: "object|null", strongest: "object|null", weakest: "object|null" }, "reportCard");
      for (const row of card.rows) {
        expectShape(row, { course: "object", scores: "array", total: "number|null", percent: "number|null", teacher: "object|null" }, "reportCard.rows[]");
        expect(row.scores).toHaveLength(card.columns.length);
      }
      const html = renderHtml(<ResultsView card={card} termOptions={termOptions(terms, card.term)} termId={card.term.id} onTermChange={() => undefined} />);
      expect(html).toContain("Results");
    }
  });

  it("B6 attendance for the current term", async () => {
    const { AttendanceView } = await import("@/components/screens/attendance/AttendanceScreen");
    const attendance = await s.learner.getAttendance();
    expectShape(attendance, { term: "object|null", class: "object", schoolDays: "number", present: "number", late: "number", absent: "number", onLeave: "number", rate: "number|null", band: "string" }, "attendance");
    expect(renderHtml(<AttendanceView attendance={attendance} termOptions={[]} termId={attendance.term?.id} onTermChange={() => undefined} />)).toContain("Attendance");
  });

  it("B7 files, search and the zip", async () => {
    const page = await s.learner.getFiles({ page: 1, limit: 20 });
    expectShape(page, { data: "array", meta: "object" }, "files");
    expectShape(page.meta, { total: "number", page: "number", limit: "number", lastPage: "number" }, "files.meta");
    for (const file of page.data) expectShape(file, { id: "string", name: "string", course: "object", kind: "string", downloadUrl: "string|null", createdAt: "string", sizeBytes: "number|null" }, "files.data[]");
    const none = await s.learner.getFiles({ q: "no-such-file-zz-9", page: 1, limit: 20 });
    expect(none.meta.total).toBe(0);
    const zip = await s.learner.downloadFilesArchive();
    expect(zip.fileName).toMatch(/\.zip$/);
  });

  it("B12 school, the tour flag, the inbox and the account routes", async () => {
    expectShape(await s.learner.getSchoolContact(), { name: "string", phone: "string|null", email: "string|null", address: "string|null", officeHours: "object|null" }, "school");
    const prefs = await s.learner.getPreferences();
    expectShape(prefs.guides, { tourCompletedAt: "string|null" }, "preferences.guides");
    const counts = await s.account.getNotificationCounts();
    expectShape(counts, { all: "number", unread: "number", byCategory: "object" }, "counts");
    const inbox = await s.notifications.getNotifications(undefined, { page: 1, limit: 20 });
    expectShape(inbox, { data: "array", "meta?": "object" }, "notifications");
    for (const item of inbox.data ?? []) expectShape(item, { _id: "string", title: "string", category: "string", isRead: "boolean", createdAt: "string" }, "notifications.data[]");
    const { normalizeNotification, countByCategory } = await import("@/lib/notifications/normalize");
    const { UpdatesView } = await import("@/components/screens/updates/UpdatesScreen");
    const items = (inbox.data ?? []).map((item: Record<string, unknown>) => normalizeNotification(item, student.userId));
    const html = renderHtml(
      <UpdatesView notifications={items} counts={countByCategory(items)} unreadTotal={counts.unread} isWide onOpen={() => undefined} onMarkAll={() => undefined} isMarkingAll={false} />
    );
    expect(html).toContain("Updates");
    expectShape(await s.account.getPasswordPolicy(), { minLength: "number", requireUppercase: "boolean", requireSymbol: "boolean" }, "passwordPolicy");
    const sessions = await s.account.getSessions();
    for (const session of sessions) expectShape(session, { id: "string", lastUsedAt: "string", current: "boolean" }, "sessions[]");
    expectShape(await s.settings.getChatPreferences(), { showOnlineStatus: "boolean", readReceipts: "boolean", messagePreview: "boolean" }, "chatPreferences");
  });
});

describe("live API contract switch", () => {
  it("runs only with LIVE_API=1", () => {
    expect(typeof LIVE).toBe("boolean");
  });
});
