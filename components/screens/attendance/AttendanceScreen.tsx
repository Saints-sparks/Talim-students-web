"use client";

import React, { useCallback, useMemo } from "react";
import { useAttendance, useSchoolTerms } from "@/hooks/learner/queries";
import { ScreenError, ScreenLoading } from "@/components/tl/states";
import { PageHeader } from "@/components/tl/bits";
import { card, pill, pillTone, statCard, type PillTone } from "@/components/tl/styles";
import { TermPicker, useTermParam } from "@/components/screens/results/TermPicker";
import { formatDate, formatPercent } from "@/lib/learner/format";
import { chosenTermId, currentTermId, termOptions, type TermOption } from "@/lib/results/terms";
import type { StudentAttendance } from "@/types/learner";

/** The widths of the stacked bar, in percent of the marked days. */
export interface AttendanceBar {
  present: number;
  late: number;
  missed: number;
  /** present + late + absent. */
  marked: number;
}

/**
 * The stacked bar's segments: present, late and missed days over every
 * marked day (present + late + absent). Leave and excused days are left out,
 * as they are from the rate.
 *
 * @param attendance - B6's answer.
 * @returns The three widths (0 each when nothing is marked).
 */
export function attendanceBar(attendance: Pick<StudentAttendance, "present" | "late" | "absent">): AttendanceBar {
  const marked = attendance.present + attendance.late + attendance.absent;
  if (marked <= 0) return { present: 0, late: 0, missed: 0, marked: 0 };
  const share = (count: number) => (count / marked) * 100;
  return { present: share(attendance.present), late: share(attendance.late), missed: share(attendance.absent), marked };
}

/**
 * "1 day" or "3 days".
 *
 * @param count - How many days.
 * @returns The phrase.
 */
function days(count: number): string {
  return `${count} day${count === 1 ? "" : "s"}`;
}

/**
 * The badge beside the rate: "On track", "Needs watching", or "Nothing to
 * show" before anything is marked.
 *
 * @param attendance - B6's answer.
 * @returns The text and its tone.
 */
export function attendanceBadge(attendance: Pick<StudentAttendance, "rate" | "band">): { label: string; tone: PillTone } {
  if (attendance.rate === null) return { label: "Nothing to show", tone: "muted" };
  return attendance.band === "watch" ? { label: "Needs watching", tone: "warning" } : { label: "On track", tone: "success" };
}

/** One of the four stat cards. */
export interface AttendanceStat {
  value: string;
  label: string;
  note: string;
  tip: string;
}

/**
 * The four stat cards: days present, missed, late and excused, each with its
 * share of the term's school days.
 *
 * @param attendance - B6's answer.
 * @returns The cards, in the design's order.
 */
export function attendanceStats(attendance: StudentAttendance): AttendanceStat[] {
  if (attendance.rate === null) {
    return [
      { value: String(attendance.present), label: "Days present", note: "Term has just started", tip: "Days you were marked present" },
      { value: String(attendance.absent), label: "Days missed", note: "", tip: "Days you were marked absent" },
      { value: String(attendance.late), label: "Late", note: "", tip: "Days you arrived late" },
      { value: String(attendance.onLeave), label: "Excused", note: "", tip: "Absences your school approved" },
    ];
  }
  const ofTerm = (count: number) => (attendance.schoolDays > 0 ? `${Math.round((count / attendance.schoolDays) * 100)}% of term` : "");
  return [
    { value: String(attendance.present), label: "Days present", note: ofTerm(attendance.present), tip: "Days you were marked present" },
    { value: String(attendance.absent), label: "Days missed", note: ofTerm(attendance.absent), tip: "Days you were marked absent" },
    { value: String(attendance.late), label: "Late", note: ofTerm(attendance.late), tip: "Days you arrived late" },
    {
      value: String(attendance.onLeave),
      label: "Excused",
      note: attendance.onLeave === 0 ? "None recorded" : ofTerm(attendance.onLeave),
      tip: "Absences your school approved",
    },
  ];
}

/** Props for {@link AttendanceView}. */
export interface AttendanceViewProps {
  /** B6's answer for the chosen term. */
  attendance: StudentAttendance;
  /** The term picker's options. */
  termOptions: TermOption[];
  /** The chosen term's id. */
  termId: string | undefined;
  /** Picks a term. */
  onTermChange: (termId: string) => void;
  /** True while another term loads over this one. */
  busy?: boolean;
}

const LEGEND = [
  { label: "Present", dot: "bg-tl-present" },
  { label: "Late", dot: "bg-tl-late" },
  { label: "Missed", dot: "bg-tl-missed" },
];

/**
 * The Attendance screen's content for one term: the rate and its badge, the
 * term and class, the present / late / missed bar, and four stat cards.
 *
 * @param props - See {@link AttendanceViewProps}.
 * @param props.attendance - The term's attendance.
 * @param props.termOptions - The picker's terms.
 * @param props.termId - The chosen term.
 * @param props.onTermChange - Picks a term.
 * @param props.busy - Whether another term is loading.
 * @returns The screen.
 */
export function AttendanceView({ attendance, termOptions: options, termId, onTermChange, busy = false }: AttendanceViewProps) {
  const empty = attendance.rate === null;
  const bar = attendanceBar(attendance);
  const badge = attendanceBadge(attendance);
  const stats = attendanceStats(attendance);
  const attended = attendance.present + attendance.late;
  const { term } = attendance;
  // The API answers `term: null` when the school has no current term.
  const termDates = !term ? "No current term" : term.startDate && term.endDate ? `${formatDate(term.startDate)} – ${formatDate(term.endDate)}` : term.name;
  const barLabel = empty
    ? "No days marked yet"
    : `Present ${days(attendance.present)}, late ${days(attendance.late)}, missed ${days(attendance.absent)}`;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Attendance"
        subtitle="The days your school marked you present."
        guide="attendance-header"
        actions={<TermPicker options={options} value={termId} onChange={onTermChange} guide="attendance-term" busy={busy} />}
      />

      <div aria-busy={busy} className={`flex flex-col gap-4 transition-opacity ${busy ? "opacity-60" : ""}`}>
        <section aria-labelledby="att-rate-title" className={`${card} flex flex-col gap-5`} data-guide="attendance-rate">
          <h2 id="att-rate-title" className="sr-only">
            Attendance rate, {term?.name ?? "this term"}
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-[clamp(34px,5vw,46px)] font-extrabold leading-none tracking-[-1.4px] text-tl-ink">{formatPercent(attendance.rate)}</p>
              <p className="mt-2 text-[15px] text-tl-muted">
                {empty ? "Your school hasn't marked attendance yet." : `${attended} of ${attendance.schoolDays} school days this term`}
              </p>
            </div>
            <span className={`${pill} px-4 py-2.5 text-sm font-bold ${pillTone[badge.tone]}`}>{badge.label}</span>
            <p className="min-w-[180px] flex-1 text-right text-sm text-tl-muted">
              Term: {termDates}
              <br />
              Class: {attendance.class.name}
            </p>
          </div>
          <div
            role="img"
            aria-label={barLabel}
            title="Present, late and missed days this term"
            className="flex h-3.5 w-full overflow-hidden rounded-full bg-tl-track"
          >
            {bar.marked > 0 ? (
              <>
                <span className="h-full bg-tl-present" style={{ width: `${bar.present}%` }} />
                <span className="h-full bg-tl-late" style={{ width: `${bar.late}%` }} />
                <span className="h-full bg-tl-missed" style={{ width: `${bar.missed}%` }} />
              </>
            ) : null}
          </div>
          <ul className="flex flex-wrap gap-5 text-sm text-tl-muted" aria-label="Key">
            {LEGEND.map((item) => (
              <li key={item.label} className="flex items-center gap-[7px]">
                <span aria-hidden className={`h-[9px] w-[9px] rounded-[5px] ${item.dot}`} />
                {item.label}
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-tl-muted">Approved leave and excused days are left out of the rate.</p>
        </section>

        <ul aria-label="This term in numbers" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-3.5" data-guide="attendance-stats">
          {stats.map((stat) => (
            <li key={stat.label} title={stat.tip} className={statCard}>
              <p className="text-[28px] font-extrabold tracking-[-0.8px] text-tl-ink">{stat.value}</p>
              <p className="mt-1.5 text-[15px] font-bold text-tl-ink">{stat.label}</p>
              {stat.note ? <p className="mt-[3px] text-[13px] text-tl-muted">{stat.note}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * The Attendance screen (`/attendance`): one B6 call for the chosen term
 * (`?term=`, the current term by default) and the school's terms for the
 * picker. Uses `useSearchParams`, so its page wraps it in Suspense.
 *
 * @returns The screen with its loading and error states.
 */
export default function AttendanceScreen() {
  const { termParam, setTerm } = useTermParam("/attendance");
  const { data, isLoading, isFetching, error, refetch } = useAttendance(termParam);
  const terms = useSchoolTerms();

  const options = useMemo(() => termOptions(terms.data, data?.term), [terms.data, data?.term]);
  const currentId = currentTermId(terms.data);
  // The current term needs no ?term= (the API answers for it by default).
  const onTermChange = useCallback((termId: string) => setTerm(termId === currentId ? null : termId), [setTerm, currentId]);

  if (isLoading) return <ScreenLoading label="Loading your attendance" blocks={2} />;
  if (error || !data) return <ScreenError message={error ?? "We couldn't load your attendance. Please try again."} onRetry={refetch} />;
  return (
    <AttendanceView
      attendance={data}
      termOptions={options}
      termId={chosenTermId(termParam, terms.data, data.term?.id)}
      onTermChange={onTermChange}
      busy={isFetching}
    />
  );
}
