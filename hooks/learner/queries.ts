"use client";

/**
 * One cached query per learner screen (portals contract Part B). Each screen
 * makes one aggregate request; nothing here loops over items. Keys are scoped
 * to the signed-in user so signing out drops them all.
 */
import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { learnerService } from "@/services/learner.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { messageForError } from "@/lib/errorMessages";

/** What every screen hook hands its page. */
export interface ScreenQuery<T> {
  /** The data, once loaded (kept while a new term or week loads). */
  data: T | undefined;
  /** True only for the first load (no data yet). */
  isLoading: boolean;
  /** True while a newer version is being fetched over shown data. */
  isFetching: boolean;
  /** A sentence to show when the load failed, else null. */
  error: string | null;
  /** Loads again. */
  refetch: () => void;
}

/**
 * Turns a TanStack query into the shape the screens read.
 *
 * @param query - The query result.
 * @param fallback - The message when the error has none of its own.
 * @returns The screen state.
 */
export function toScreenQuery<T>(query: UseQueryResult<T>, fallback: string): ScreenQuery<T> {
  return {
    data: query.data,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    isFetching: query.isFetching,
    error: query.error && !query.data ? messageForError(query.error, fallback) : null,
    refetch: () => void query.refetch(),
  };
}

/**
 * The signed-in user's id and whether the session is ready, for keys.
 *
 * @returns The scope id ("anonymous" while signed out) and readiness.
 */
function useScope(): { scope: string; ready: boolean } {
  const { userId, isReady } = useStudentIdentity();
  return { scope: userId ?? "anonymous", ready: Boolean(isReady && userId) };
}

/**
 * B1 Today. Refreshes every minute so "now" and "up next" move along.
 *
 * @returns The Today screen's state.
 */
export function useToday() {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.today(scope),
    enabled: ready,
    staleTime: 60_000,
    refetchInterval: 60_000,
    queryFn: () => learnerService.getToday(),
  });
  return toScreenQuery(query, "We couldn't load today. Please try again.");
}

/**
 * B2 one week of the timetable. The previous week stays on screen while the
 * next one loads.
 *
 * @param weekStart - Any day of the week; undefined for the current week.
 * @returns The Timetable screen's state.
 */
export function useWeekTimetable(weekStart?: string) {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.timetable(scope, weekStart),
    enabled: ready,
    staleTime: staleTimes.reference,
    placeholderData: keepPreviousData,
    queryFn: () => learnerService.getTimetable(weekStart),
  });
  return toScreenQuery(query, "We couldn't load your timetable. Please try again.");
}

/**
 * B3 every subject with this term's scores.
 *
 * @param termId - The term; undefined for the current one.
 * @returns The Subjects screen's state.
 */
export function useSubjects(termId?: string) {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.subjects(scope, termId),
    enabled: ready,
    staleTime: staleTimes.list,
    placeholderData: keepPreviousData,
    queryFn: () => learnerService.getSubjects(termId),
  });
  return toScreenQuery(query, "We couldn't load your subjects. Please try again.");
}

/**
 * B4 one subject.
 *
 * @param courseId - The course; nothing loads without one.
 * @param termId - The term; undefined for the current one.
 * @returns The Subject detail screen's state.
 */
export function useSubjectDetail(courseId: string | undefined, termId?: string) {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.subject(scope, courseId ?? "", termId),
    enabled: ready && Boolean(courseId),
    staleTime: staleTimes.list,
    queryFn: () => learnerService.getSubject(courseId as string, termId),
  });
  return toScreenQuery(query, "We couldn't load this subject. Please try again.");
}

/**
 * B5 the report card for a term.
 *
 * @param termId - The term; undefined for the current one.
 * @returns The Results screen's state.
 */
export function useReportCard(termId?: string) {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.reportCard(scope, termId),
    enabled: ready,
    staleTime: staleTimes.list,
    placeholderData: keepPreviousData,
    queryFn: () => learnerService.getReportCard(termId),
  });
  return toScreenQuery(query, "We couldn't load your results. Please try again.");
}

/**
 * B5 the terms with results, for the Results and Attendance term pickers.
 *
 * @returns The terms' state.
 */
export function useReportTerms() {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.reportTerms(scope),
    enabled: ready,
    staleTime: staleTimes.reference,
    queryFn: () => learnerService.getReportTerms(),
  });
  return toScreenQuery(query, "We couldn't load the list of terms.");
}

/**
 * B6 a term's attendance.
 *
 * @param termId - The term; undefined for the current one.
 * @returns The Attendance screen's state.
 */
export function useAttendance(termId?: string) {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.attendance(scope, termId),
    enabled: ready,
    staleTime: staleTimes.list,
    placeholderData: keepPreviousData,
    queryFn: () => learnerService.getAttendance(termId),
  });
  return toScreenQuery(query, "We couldn't load your attendance. Please try again.");
}

/** Filters of the Files list. */
export interface FileFilters {
  courseId?: string;
  q?: string;
  page?: number;
  limit?: number;
}

/**
 * B7 one page of files. The search text should be debounced by the caller so
 * typing does not send a request per key.
 *
 * @param filters - Subject, search text and page.
 * @returns The Files screen's state.
 */
export function useFiles(filters: FileFilters) {
  const { scope, ready } = useScope();
  const params = { courseId: filters.courseId || undefined, q: filters.q?.trim() || undefined, page: filters.page ?? 1, limit: filters.limit ?? 20 };
  const query = useQuery({
    queryKey: queryKeys.learner.files(scope, params),
    enabled: ready,
    staleTime: staleTimes.list,
    placeholderData: keepPreviousData,
    queryFn: () => learnerService.getFiles(params),
  });
  return toScreenQuery(query, "We couldn't load your files. Please try again.");
}

/**
 * B12 the school office's contact details (for the contact sheet).
 *
 * @param enabled - Load only once the sheet is opened.
 * @returns The contact's state.
 */
export function useSchoolContact(enabled = true) {
  const { scope, ready } = useScope();
  const query = useQuery({
    queryKey: queryKeys.learner.school(scope),
    enabled: ready && enabled,
    staleTime: staleTimes.reference,
    queryFn: () => learnerService.getSchoolContact(),
  });
  return toScreenQuery(query, "We couldn't load the school's contact details.");
}
