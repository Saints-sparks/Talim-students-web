"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Bell, BarChart3, BookOpen, CheckCircle2, Download, FolderOpen, MessageSquare, Trophy } from "lucide-react";
import {
  CircularProgress,
  SectionCard,
  SectionEmptyState,
  SkeletonBlock,
  TextAction,
} from "@/components/dashboard/primitives";
import { type DashboardStyles, type StatusTone, toneStyles } from "@/components/dashboard/styles";
import type { PublishedCourse } from "@/services/grades.service";
import type { AttendanceKPIData } from "@/services/attendance.service";
import type { Resource } from "@/services/resource.service";

/**
 * Grade score, class position and the most recent published course averages.
 *
 * @param props - Component props.
 * @param props.gradeScore - Cumulative average as a percentage.
 * @param props.classPosition - Rank in class, or `null` until published.
 * @param props.totalStudentsInClass - Class size, or 0 when unknown.
 * @param props.percentile - Percentile, or `null` when it cannot be worked out.
 * @param props.recentResults - The newest published courses.
 * @param props.className - The student's class name.
 * @param props.isLoading - Whether results are still loading.
 * @param props.styles - Resolved dashboard styles.
 * @returns The section element.
 */
export function AcademicProgressCard({
  gradeScore,
  classPosition,
  totalStudentsInClass,
  percentile,
  recentResults,
  className,
  isLoading,
  styles,
}: {
  gradeScore: number;
  classPosition: number | null;
  totalStudentsInClass: number;
  percentile: number | null;
  recentResults: PublishedCourse[];
  className: string;
  isLoading: boolean;
  styles: DashboardStyles;
}) {
  return (
    <SectionCard
      title="Academic Progress"
      action={<TextAction href="/results" label="View results" styles={styles} />}
      styles={styles}
    >
      {isLoading ? (
        <SkeletonBlock className="h-64 w-full" styles={styles} />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <CircularProgress value={gradeScore} label="Grade Score" tone="primary" styles={styles} />
            <div className="grid flex-1 grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold" style={{ color: styles.colors.textTertiary }}>
                  Class Position
                </p>
                <p className="mt-1 text-2xl font-extrabold" style={{ color: styles.colors.text }}>
                  {classPosition ? `${classPosition}` : "—"}
                  {classPosition && totalStudentsInClass ? (
                    <span className="text-sm" style={{ color: styles.colors.textTertiary }}>
                      {" "}
                      / {totalStudentsInClass}
                    </span>
                  ) : null}
                </p>
                {!classPosition ? (
                  <p className="mt-1 text-xs" style={{ color: styles.colors.textTertiary }}>
                    Published at the end of term
                  </p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: styles.colors.textTertiary }}>
                  Percentile
                </p>
                <p className="mt-1 text-2xl font-extrabold" style={{ color: styles.colors.text }}>
                  {percentile === null ? "—" : `${percentile}%`}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold" style={{ color: styles.colors.textSecondary }}>
              Top Recent Results
            </p>
            {recentResults.length ? (
              <div className="space-y-3">
                {recentResults.map((course, index) => (
                  <div key={course._id} className="flex items-center gap-3">
                    <span
                      className="h-8 w-1 rounded-full"
                      style={{
                        backgroundColor:
                          index === 0 ? styles.colors.primary : index === 1 ? styles.colors.error : styles.colors.warning,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold" style={{ color: styles.colors.text }}>
                        {course.name}
                      </p>
                      <p className="text-xs" style={{ color: styles.colors.textTertiary }}>
                        {className}
                      </p>
                    </div>
                    <span className="text-sm font-extrabold" style={{ color: styles.colors.text }}>
                      {Math.round(course.currentAverage ?? 0)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <SectionEmptyState
                icon={<Trophy className="h-7 w-7" />}
                title="No published results yet"
                description="Published course results will appear here once available."
                action={<TextAction href="/results" label="Open results" styles={styles} />}
                styles={styles}
              />
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

/**
 * Attendance rate with the day counts behind it.
 *
 * @param props - Component props.
 * @param props.attendance - The attendance KPI payload, or `null`.
 * @param props.attendanceRate - The rounded rate to show in the ring.
 * @param props.isLoading - Whether attendance is still loading.
 * @param props.styles - Resolved dashboard styles.
 * @returns The section element.
 */
export function AttendanceSummaryCard({
  attendance,
  attendanceRate,
  isLoading,
  styles,
}: {
  attendance: AttendanceKPIData | null;
  attendanceRate: number;
  isLoading: boolean;
  styles: DashboardStyles;
}) {
  return (
    <SectionCard
      title="Attendance Summary"
      action={<TextAction href="/attendance" label="View attendance" styles={styles} />}
      styles={styles}
    >
      {isLoading ? (
        <SkeletonBlock className="h-56 w-full" styles={styles} />
      ) : attendance ? (
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
          <CircularProgress value={attendanceRate} label="Attendance Rate" tone="success" styles={styles} />
          <div className="w-full max-w-sm space-y-4">
            {[
              { label: "Present Days", value: attendance.presentDays, tone: "success" as StatusTone },
              { label: "Absent Days", value: attendance.absentDays, tone: "warning" as StatusTone },
              { label: "Total School Days", value: attendance.totalDays, tone: "muted" as StatusTone },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: toneStyles(item.tone, styles).color }}
                />
                <span className="flex-1 text-sm font-bold" style={{ color: styles.colors.textSecondary }}>
                  {item.label}
                </span>
                <span className="text-sm font-extrabold" style={{ color: styles.colors.text }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <SectionEmptyState
          icon={<CheckCircle2 className="h-7 w-7" />}
          title="No attendance data yet"
          description="Attendance records will show after your school marks attendance."
          action={<TextAction href="/attendance" label="Open attendance" styles={styles} />}
          styles={styles}
        />
      )}
    </SectionCard>
  );
}

/**
 * Shortcuts into resources and subjects, with the counts behind each.
 *
 * @param props - Component props.
 * @param props.resources - Every resource shared with the class.
 * @param props.recentCount - How many were shared recently.
 * @param props.subjectCount - How many subjects have curriculum.
 * @param props.isLoading - Whether resources are still loading.
 * @param props.styles - Resolved dashboard styles.
 * @returns The section element.
 */
export function ResourcesCard({
  resources,
  recentCount,
  subjectCount,
  isLoading,
  styles,
}: {
  resources: Resource[];
  recentCount: number;
  subjectCount: number;
  isLoading: boolean;
  styles: DashboardStyles;
}) {
  const router = useRouter();

  return (
    <SectionCard
      title="Resources & Curriculum"
      action={<TextAction href="/resources" label="Open resources" styles={styles} />}
      styles={styles}
    >
      {isLoading ? (
        <SkeletonBlock className="h-56 w-full" styles={styles} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/resources")}
              className="rounded-xl border px-3 py-2 text-xs font-bold"
              style={{
                borderColor: styles.colors.border,
                color: styles.colors.primary,
                backgroundColor: styles.colors.surfaceAlt,
              }}
            >
              Open resources <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/subjects")}
              className="rounded-xl border px-3 py-2 text-xs font-bold"
              style={{
                borderColor: styles.colors.border,
                color: styles.colors.primary,
                backgroundColor: styles.colors.surface,
              }}
            >
              View subjects <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </button>
          </div>
          {[
            { label: "New Resources", value: recentCount, icon: FolderOpen, tone: "primary" as StatusTone },
            { label: "Subjects with Curriculum", value: subjectCount, icon: BookOpen, tone: "purple" as StatusTone },
            { label: "Shared with your class", value: resources.length, icon: Download, tone: "success" as StatusTone },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 border-b py-2 last:border-b-0"
                style={{ borderColor: styles.colors.borderLight }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={toneStyles(item.tone, styles)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-bold" style={{ color: styles.colors.textSecondary }}>
                  {item.label}
                </span>
                <span className="text-sm font-extrabold" style={{ color: styles.colors.text }}>
                  {item.value}
                </span>
              </div>
            );
          })}
          {!resources.length ? (
            <p className="text-xs" style={{ color: styles.colors.textTertiary }}>
              No resources have been shared with your class yet.
            </p>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}

/** One line on the recent-activity feed. */
export interface ActivityItem {
  type: string;
  label: string;
  time: string;
  href: string;
}

/**
 * The most recent notifications and unread messages.
 *
 * @param props - Component props.
 * @param props.items - The activity lines, newest first.
 * @param props.isLoading - Whether notifications are still loading.
 * @param props.styles - Resolved dashboard styles.
 * @returns The section element.
 */
export function RecentActivityCard({
  items,
  isLoading,
  styles,
}: {
  items: ActivityItem[];
  isLoading: boolean;
  styles: DashboardStyles;
}) {
  const router = useRouter();

  return (
    <SectionCard
      title="Recent Activity"
      action={<TextAction href="/notifications" label="View all" styles={styles} />}
      styles={styles}
    >
      {isLoading ? (
        <SkeletonBlock className="h-56 w-full" styles={styles} />
      ) : items.length ? (
        <div className="space-y-3">
          {items.map((item, index) => {
            const Icon =
              item.type === "messages"
                ? MessageSquare
                : item.type === "resources"
                  ? FolderOpen
                  : item.type === "grading" || item.type === "academics"
                    ? BarChart3
                    : Bell;
            return (
              <button
                key={`${item.label}-${index}`}
                type="button"
                onClick={() => router.push(item.href)}
                className="flex w-full items-center gap-3 border-b py-2 text-left last:border-b-0"
                style={{ borderColor: styles.colors.borderLight }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={toneStyles(index % 2 ? "purple" : "primary", styles)}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold" style={{ color: styles.colors.textSecondary }}>
                  {item.label}
                </span>
                <span className="shrink-0 text-xs" style={{ color: styles.colors.textTertiary }}>
                  {item.time}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <SectionEmptyState
          icon={<Bell className="h-7 w-7" />}
          title="No recent activity"
          description="Announcements, result updates, resources, and messages will appear here."
          action={<TextAction href="/notifications" label="Open notifications" styles={styles} />}
          styles={styles}
        />
      )}
    </SectionCard>
  );
}
