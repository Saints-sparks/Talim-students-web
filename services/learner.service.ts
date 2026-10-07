/**
 * The learner-view API for the signed-in student (portals contract Part B):
 * one aggregate call per screen. In a dev build with
 * `NEXT_PUBLIC_USE_FIXTURES=true` every call answers from
 * `lib/fixtures/learner.fixture.ts` instead (see `lib/fixtures/flag.ts`).
 */
import { API_BASE_URL } from "@/lib/constants";
import { api, authFetch } from "@/lib/authFetch";
import { ApiError } from "@/lib/apiError";
import { fixturesEnabled, fixtureVariant } from "@/lib/fixtures/flag";
import type {
  LearnerPreferences,
  ReportCard,
  ResourceViewResult,
  SchoolTerm,
  SchoolContact,
  StudentAttendance,
  StudentFilesPage,
  StudentSubjectDetail,
  StudentSubjects,
  StudentTimetable,
  StudentToday,
  UpdateLearnerPreferences,
} from "@/types/learner";
import type { ChatRoomView } from "@/types/chat";
import type { Schema } from "@/types/apiContract";

const ME = `${API_BASE_URL}/students/me`;

/** A term as `GET /academic-year-term/term/school` sends it. */
type RawSchoolTerm = Schema<"SchoolTermDto">;

/**
 * The school's terms as the pickers read them: the id however the API spelled
 * it, and newest first (the API lists them oldest first).
 *
 * @param raw - The answer's `terms`.
 * @returns The terms, newest first, without ones lacking an id.
 */
export function toSchoolTerms(raw: readonly RawSchoolTerm[]): SchoolTerm[] {
  const terms: SchoolTerm[] = [];
  for (const term of raw) {
    const id = term.id ?? term._id;
    if (!id) continue;
    terms.push({
      id,
      name: term.name ?? "Term",
      session: term.session ?? null,
      startDate: term.startDate ?? "",
      endDate: term.endDate ?? "",
      isCurrent: Boolean(term.isCurrent),
      academicYearId: term.academicYearId,
    });
  }
  return terms.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/**
 * Builds a query string from defined, non-empty values. A list (e.g. the
 * tickets' `status`) goes as one comma-separated parameter (`status=open,closed`).
 *
 * @param params - The values to send; `undefined`, `null`, `""` and empty lists are skipped.
 * @returns `?a=b…`, or an empty string.
 */
export function toQuery(params: Record<string, string | number | readonly string[] | null | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const part = Array.isArray(value) ? value.join(",") : value === undefined || value === null ? "" : String(value);
    if (part === "") continue;
    search.set(key, part);
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

/**
 * Lazily loads the fixture module (dev only; never bundled into production
 * code paths because the caller is behind `fixturesEnabled()`).
 *
 * @returns The fixture builders.
 */
async function fixtures() {
  return import("@/lib/fixtures/learner.fixture");
}

/**
 * Waits a moment, so fixture loads still show the loading state in dev.
 *
 * @returns After ~150 ms.
 */
function fixtureDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, process.env.NODE_ENV === "test" ? 0 : 150));
}

export const learnerService = {
  /**
   * B1: everything the Today screen shows, in one call.
   *
   * @returns Today at the student's school.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getToday(): Promise<StudentToday> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeToday(fixtureVariant());
    }
    return api.get<StudentToday>(`${ME}/today`);
  },

  /**
   * B2: one week of the class timetable.
   *
   * @param weekStart - Any day of the week to show; omit for the current week.
   * @returns The week.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getTimetable(weekStart?: string): Promise<StudentTimetable> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeTimetable(fixtureVariant(), weekStart);
    }
    return api.get<StudentTimetable>(`${ME}/timetable${toQuery({ weekStart })}`);
  },

  /**
   * B3: every subject with this term's scores.
   *
   * @param termId - The term; omit for the current one.
   * @returns The subjects, scale and pass mark.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getSubjects(termId?: string): Promise<StudentSubjects> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeSubjects(fixtureVariant());
    }
    return api.get<StudentSubjects>(`${ME}/subjects${toQuery({ termId })}`);
  },

  /**
   * B4: one subject's scores, scheme of work and files.
   *
   * @param courseId - The course.
   * @param termId - The term; omit for the current one.
   * @returns The subject.
   * @throws {ApiError} `NOT_FOUND` for a course the student does not take.
   */
  async getSubject(courseId: string, termId?: string): Promise<StudentSubjectDetail> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      const detail = (await fixtures()).makeSubjectDetail(courseId, fixtureVariant());
      if (!detail) throw new ApiError("NOT_FOUND", "We couldn't find that subject.", 404);
      return detail;
    }
    return api.get<StudentSubjectDetail>(`${ME}/subjects/${encodeURIComponent(courseId)}${toQuery({ termId })}`);
  },

  /**
   * B5: the report card for a term.
   *
   * @param termId - The term; omit for the current one.
   * @returns The report card (status `none` before anything is published).
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getReportCard(termId?: string): Promise<ReportCard> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeReportCard(fixtureVariant(), termId);
    }
    return api.get<ReportCard>(`${ME}/report-card${toQuery({ termId })}`);
  },

  /**
   * The school's terms for the term pickers (`GET
   * /academic-year-term/term/school`; there is no `/students/me/terms`).
   *
   * @returns The terms, newest first.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getSchoolTerms(): Promise<SchoolTerm[]> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeSchoolTerms();
    }
    const body = await api.get<Schema<"SchoolTermsResponseDto">>(`${API_BASE_URL}/academic-year-term/term/school`);
    return toSchoolTerms(body?.terms ?? []);
  },

  /**
   * The student's portal preferences (the tour flag).
   *
   * @returns `{ guides: { tourCompletedAt } }`.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getPreferences(): Promise<LearnerPreferences> {
    if (fixturesEnabled()) return { guides: { tourCompletedAt: null } };
    return api.get<LearnerPreferences>(`${ME}/preferences`);
  },

  /**
   * Updates the student's portal preferences: `{ guides: { tourCompleted } }`
   * stamps (true) or clears (false) the tour's completion.
   *
   * @param body - The change.
   * @returns The preferences after the change.
   * @throws {ApiError} `VALIDATION_FAILED` for an unknown field.
   */
  async updatePreferences(body: UpdateLearnerPreferences): Promise<LearnerPreferences> {
    if (fixturesEnabled()) return { guides: { tourCompletedAt: body.guides?.tourCompleted ? new Date().toISOString() : null } };
    return api.patch<LearnerPreferences>(`${ME}/preferences`, body);
  },

  /**
   * B6: the term's attendance.
   *
   * @param termId - The term; omit for the current one.
   * @returns The counts and rate.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getAttendance(termId?: string): Promise<StudentAttendance> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeAttendance(fixtureVariant(), termId);
    }
    return api.get<StudentAttendance>(`${ME}/attendance${toQuery({ termId })}`);
  },

  /**
   * B7: one page of the files shared with the student.
   *
   * @param params - Filters and paging.
   * @param params.courseId - Only this subject's files.
   * @param params.q - Search text (file or subject name).
   * @param params.page - 1-based page.
   * @param params.limit - Page size.
   * @returns The page, with its pagination `meta`.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getFiles(params: { courseId?: string; q?: string; page?: number; limit?: number } = {}): Promise<StudentFilesPage> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeFiles(fixtureVariant(), params);
    }
    return api.get<StudentFilesPage>(`${ME}/files${toQuery(params)}`);
  },

  /**
   * B7 "Download all": the files as one zip, streamed by the API. Fetched with
   * the bearer token (a plain link would go without it) and handed back as a
   * blob for the page to save.
   *
   * @param courseId - Only this subject's files; omit for every file.
   * @returns The zip and the file name the server suggested.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async downloadFilesArchive(courseId?: string): Promise<{ blob: Blob; fileName: string }> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return { blob: new Blob(["Fixture archive"], { type: "application/zip" }), fileName: "talim-files.zip" };
    }
    const response = await authFetch(`${ME}/files/archive${toQuery({ courseId })}`, { headers: { Accept: "application/zip" } });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as Parameters<typeof ApiError.fromResponse>[1];
      throw ApiError.fromResponse(response, body);
    }
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
    return { blob: await response.blob(), fileName: match ? decodeURIComponent(match[1]) : "talim-files.zip" };
  },

  /**
   * §24: records that the student opened a file (idempotent on the server).
   *
   * @param resourceId - The resource.
   * @returns Whether this was the first view, and the unique-viewer count.
   * @throws {ApiError} `NOT_FOUND` for a file the student cannot see.
   */
  async recordFileView(resourceId: string): Promise<ResourceViewResult> {
    if (fixturesEnabled()) return { counted: false, viewCount: 1 };
    return api.post<ResourceViewResult>(`${API_BASE_URL}/resources/${encodeURIComponent(resourceId)}/view`);
  },

  /**
   * B10: the subject's group chat, created the first time anyone opens it.
   *
   * @param courseId - The course.
   * @returns The room, in the room-view shape.
   * @throws {ApiError} `FORBIDDEN` when the student does not take the course.
   */
  async openCourseGroup(courseId: string): Promise<ChatRoomView> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return { _id: `room-${courseId}`, type: "course_group", name: "Subject group", participants: [], lastMessage: null, unreadCount: 0, updatedAt: new Date().toISOString() };
    }
    return api.post<ChatRoomView>(`${API_BASE_URL}/chat/course-groups/${encodeURIComponent(courseId)}/open`);
  },

  /**
   * B12: the school office's contact details.
   *
   * @returns Name, phone, email, address and office hours.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getSchoolContact(): Promise<SchoolContact> {
    if (fixturesEnabled()) {
      await fixtureDelay();
      return (await fixtures()).makeSchoolContact();
    }
    return api.get<SchoolContact>(`${ME}/school`);
  },
};
