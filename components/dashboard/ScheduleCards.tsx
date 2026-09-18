"use client";

import { Calendar, Clock } from "lucide-react";
import { SectionCard, SectionEmptyState, SkeletonBlock, StatusBadge, TextAction } from "@/components/dashboard/primitives";
import { type DashboardStyles, withAlpha } from "@/components/dashboard/styles";
import type { TodayClass } from "@/lib/dashboard/schedule";

/**
 * Today's classes, in order, with each period's status.
 *
 * @param props - Component props.
 * @param props.schedule - Today's periods.
 * @param props.className - The student's class, used when a period omits it.
 * @param props.isLoading - Whether the timetable is still loading.
 * @param props.styles - Resolved dashboard styles.
 * @returns The section element.
 */
export function TodayScheduleCard({
  schedule,
  className,
  isLoading,
  styles,
}: {
  schedule: TodayClass[];
  className: string;
  isLoading: boolean;
  styles: DashboardStyles;
}) {
  return (
    <SectionCard
      title="Today's Schedule"
      action={<TextAction href="/timetable" label="View full schedule" styles={styles} />}
      styles={styles}
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <SkeletonBlock key={item} className="h-14 w-full" styles={styles} />
          ))}
        </div>
      ) : schedule.length > 0 ? (
        <div className="space-y-3">
          {schedule.slice(0, 4).map((item, index) => (
            <div key={`${item.day}-${item.timeString}-${index}`} className="flex items-center gap-3">
              <div className="w-16 shrink-0 text-xs font-bold" style={{ color: styles.colors.textSecondary }}>
                <p>{item.startLabel}</p>
                <p className="font-medium" style={{ color: styles.colors.textTertiary }}>
                  {item.endLabel}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold" style={{ color: styles.colors.text }}>
                  {item.subject || item.name}
                </p>
                <p className="truncate text-xs" style={{ color: styles.colors.textTertiary }}>
                  {item.className || className}
                  {item.teacherName ? ` • ${item.teacherName}` : ""}
                </p>
              </div>
              <StatusBadge status={item.status} styles={styles} />
            </div>
          ))}
        </div>
      ) : (
        <SectionEmptyState
          icon={<Calendar className="h-7 w-7" />}
          title="No classes scheduled today."
          description="Your timetable is empty for today. Check the weekly view for upcoming classes."
          action={<TextAction href="/timetable" label="Open timetable" styles={styles} />}
          styles={styles}
        />
      )}
    </SectionCard>
  );
}

/**
 * How many classes fall on each weekday, with today highlighted.
 *
 * @param props - Component props.
 * @param props.summary - Per-weekday counts.
 * @param props.totalClasses - Classes across the whole week.
 * @param props.todayName - Today's weekday name.
 * @param props.isLoading - Whether the timetable is still loading.
 * @param props.styles - Resolved dashboard styles.
 * @returns The section element.
 */
export function WeeklySummaryCard({
  summary,
  totalClasses,
  todayName,
  isLoading,
  styles,
}: {
  summary: Array<{ day: string; shortDay: string; count: number }>;
  totalClasses: number;
  todayName: string;
  isLoading: boolean;
  styles: DashboardStyles;
}) {
  return (
    <SectionCard
      title="Weekly Timetable Summary"
      action={<TextAction href="/timetable" label="View full timetable" styles={styles} />}
      styles={styles}
    >
      {isLoading ? (
        <SkeletonBlock className="h-44 w-full" styles={styles} />
      ) : totalClasses > 0 ? (
        <div>
          <div className="grid grid-cols-5 gap-2">
            {summary.map((item) => (
              <div
                key={item.day}
                className="rounded-xl border p-3 text-center"
                style={{
                  borderColor: item.day === todayName ? styles.colors.primary : styles.colors.borderLight,
                  backgroundColor:
                    item.day === todayName ? withAlpha(styles.colors.primary, "10") : styles.colors.surfaceAlt,
                }}
              >
                <p className="text-xs font-bold" style={{ color: styles.colors.textSecondary }}>
                  {item.shortDay}
                </p>
                <p className="mt-2 text-2xl font-extrabold" style={{ color: styles.colors.text }}>
                  {item.count}
                </p>
                <p className="text-xs" style={{ color: styles.colors.textTertiary }}>
                  classes
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t pt-4" style={{ borderColor: styles.colors.borderLight }}>
            <p className="text-xs font-semibold" style={{ color: styles.colors.textTertiary }}>
              Total this week
            </p>
            <p className="mt-1 text-xl font-bold" style={{ color: styles.colors.text }}>
              {totalClasses} classes
            </p>
          </div>
        </div>
      ) : (
        <SectionEmptyState
          icon={<Clock className="h-7 w-7" />}
          title="No timetable assigned yet"
          description="Your weekly classes will appear here when the school publishes a timetable."
          action={<TextAction href="/timetable" label="View timetable" styles={styles} />}
          styles={styles}
        />
      )}
    </SectionCard>
  );
}
