"use client";

import { AlertCircle, BarChart3, Calendar, Download, RefreshCw } from "lucide-react";
import { HeroAction } from "@/components/dashboard/primitives";
import { type DashboardStyles, withAlpha } from "@/components/dashboard/styles";
import { getGreeting } from "@/lib/dashboard/schedule";

/**
 * A single banner naming the sections that failed, rather than replacing the
 * whole dashboard with an error — every other section still has its data.
 *
 * @param props - Component props.
 * @param props.errors - One sentence per failed section.
 * @param props.onRetry - Refetches the failed sections.
 * @param props.styles - Resolved dashboard styles.
 * @returns The banner, or nothing when everything loaded.
 */
export function DashboardErrorBanner({
  errors,
  onRetry,
  styles,
}: {
  errors: string[];
  onRetry: () => void;
  styles: DashboardStyles;
}) {
  if (!errors.length) return null;

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ ...styles.card, borderColor: withAlpha(styles.colors.warning, "55") }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5" style={{ color: styles.colors.warning }} />
        <div>
          <p className="text-sm font-bold" style={{ color: styles.colors.text }}>
            Some dashboard sections could not refresh.
          </p>
          <p className="text-sm" style={{ color: styles.colors.textSecondary }}>
            {errors.slice(0, 2).join(" • ")}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold"
        style={{ backgroundColor: styles.colors.primary, color: styles.primaryText }}
      >
        <RefreshCw className="h-4 w-4" /> Refresh
      </button>
    </div>
  );
}

/**
 * The greeting, school name, current term and the three main shortcuts.
 *
 * @param props - Component props.
 * @param props.studentName - The student's first name.
 * @param props.schoolName - The school's name, or `null` when unknown.
 * @param props.currentTerm - The term the figures cover.
 * @param props.styles - Resolved dashboard styles.
 * @returns The hero section.
 */
export default function DashboardHero({
  studentName,
  schoolName,
  currentTerm,
  styles,
}: {
  studentName: string;
  schoolName: string | null;
  currentTerm: string;
  styles: DashboardStyles;
}) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: styles.colors.text }}>
          {getGreeting()}, <span style={{ color: styles.colors.primary }}>{studentName}</span>! 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: styles.colors.textSecondary }}>
          {schoolName ? (
            <>
              Here&apos;s what&apos;s happening at{" "}
              <span className="font-semibold" style={{ color: styles.colors.text }}>
                {schoolName}
              </span>{" "}
              today.
            </>
          ) : (
            <>Here&apos;s what&apos;s happening today.</>
          )}
        </p>
        <div
          className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold"
          style={{
            backgroundColor: withAlpha(styles.colors.success, "12"),
            borderColor: withAlpha(styles.colors.success, "22"),
            color: styles.colors.success,
          }}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: styles.colors.success }} />
          {currentTerm}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:flex sm:overflow-x-auto sm:pb-1 lg:pb-0">
        <HeroAction href="/timetable" label="View Timetable" icon={<Calendar className="h-4 w-4" />} styles={styles} />
        <HeroAction href="/results" label="View Results" icon={<BarChart3 className="h-4 w-4" />} styles={styles} />
        <HeroAction
          href="/resources"
          label="Download Resource"
          icon={<Download className="h-4 w-4" />}
          primary
          styles={styles}
        />
      </div>
    </section>
  );
}
