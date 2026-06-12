"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  MessageSquare,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  STUDENT_ONBOARDING_STEPS,
  useStudentOnboarding,
} from "@/contexts/OnboardingContext";
import { useAttendanceKPIs } from "@/hooks/useAttendanceKPIs";
import { usePublishedGradeCourses } from "@/hooks/usePublishedGradeCourses";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useResources } from "@/hooks/useResource";
import { useStudentCumulativeGrade } from "@/hooks/useStudentCumulativeGrade";
import { useStudentKPIs } from "@/hooks/useStudentKPIs";
import { useAcademicDetails } from "@/hooks/useAcademicDetails";
import { useNotifications } from "@/hooks/useNotifications";
import { TimetableSubject, useTimetable } from "@/hooks/useTimetable";
import { useTheme } from "@/providers/theme-provider";

type StatusTone = "primary" | "success" | "warning" | "error" | "muted" | "purple";
type ScheduleStatus = "Completed" | "In Progress" | "Upcoming";

type TodayClass = TimetableSubject & {
  status: ScheduleStatus;
  startLabel: string;
  endLabel: string;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function withAlpha(hex: string, alphaHex: string) {
  if (!hex.startsWith("#") || hex.length !== 7) return hex;
  return `${hex}${alphaHex}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function parseTimeToMinutes(timeString?: string) {
  if (!timeString) return 0;
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toLowerCase();

  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function formatTimeLabel(timeString?: string) {
  if (!timeString) return "--:--";
  const trimmed = timeString.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return trimmed;
  return `${match[1].padStart(2, "0")}:${match[2]}${match[3] ? ` ${match[3].toUpperCase()}` : ""}`;
}

function splitTimeRange(timeString?: string) {
  const [start, end] = (timeString || "").split(" - ");
  return {
    start: formatTimeLabel(start),
    end: formatTimeLabel(end),
  };
}

function getScheduleStatus(item: TimetableSubject): ScheduleStatus {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = item.startTime
    ? parseTimeToMinutes(item.startTime)
    : Math.round((item.start || 0) * 60);
  const endMinutes = item.endTime
    ? parseTimeToMinutes(item.endTime)
    : Math.round((item.end || 0) * 60);

  if (currentMinutes > endMinutes) return "Completed";
  if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
    return "In Progress";
  }
  return "Upcoming";
}

function getTermName(value?: string | { name?: string } | null) {
  if (!value) return "Current Term";
  if (typeof value === "string") return value;
  return value.name || "Current Term";
}

function formatNumber(value?: number | null, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return `0${suffix}`;
  return `${Math.round(value)}${suffix}`;
}

function useDashboardStyles() {
  const { colors, isDark } = useTheme();
  const card: CSSProperties = {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
    boxShadow: isDark
      ? "0 18px 42px rgba(0, 0, 0, 0.18)"
      : "0 18px 42px rgba(16, 24, 40, 0.04)",
  };

  return {
    colors,
    isDark,
    card,
    page: {
      backgroundColor: colors.bg,
      color: colors.text,
    } as CSSProperties,
    subtleCard: {
      backgroundColor: colors.surfaceAlt,
      borderColor: colors.borderLight,
    } as CSSProperties,
    primaryText: isDark ? colors.text : colors.surface,
  };
}

function toneStyles(tone: StatusTone, styles: ReturnType<typeof useDashboardStyles>) {
  const color =
    tone === "success"
      ? styles.colors.success
      : tone === "warning"
        ? styles.colors.warning
        : tone === "error"
          ? styles.colors.error
          : tone === "purple"
            ? styles.colors.purple
            : tone === "muted"
              ? styles.colors.textTertiary
              : styles.colors.primary;

  return {
    color,
    backgroundColor: withAlpha(color, styles.isDark ? "22" : "12"),
  };
}

function EmptyState({
  icon,
  title,
  description,
  action,
  styles,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  return (
    <div className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center" style={styles.subtleCard}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" style={toneStyles("primary", styles)}>
        {icon}
      </div>
      <p className="text-sm font-bold" style={{ color: styles.colors.text }}>
        {title}
      </p>
      <p className="mt-1 max-w-xs text-xs" style={{ color: styles.colors.textTertiary }}>
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function SkeletonBlock({
  className,
  styles,
}: {
  className?: string;
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl ${className || ""}`}
      style={{ backgroundColor: styles.colors.surfaceAlt }}
    />
  );
}

function HeroAction({
  href,
  label,
  icon,
  primary,
  styles,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  primary?: boolean;
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="flex min-h-[86px] min-w-[112px] flex-col items-center justify-center gap-2 rounded-2xl border px-3 text-center text-xs font-bold transition-transform hover:-translate-y-0.5 sm:min-h-12 sm:min-w-[180px] sm:flex-row sm:px-5 sm:text-sm"
      style={{
        backgroundColor: primary ? styles.colors.primary : styles.colors.surface,
        borderColor: primary ? styles.colors.primary : styles.colors.border,
        color: primary ? styles.primaryText : styles.colors.primary,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function SetupProgressCard({
  styles,
}: {
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  const router = useRouter();
  const onboarding = useStudentOnboarding();
  const setupSteps = STUDENT_ONBOARDING_STEPS.map((step) => ({
    label: step.label,
    done: onboarding.isStepComplete(step.id),
  }));
  const progressPercent = onboarding.isHydrated ? onboarding.progressPercent : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="rounded-2xl border p-4 sm:p-5" style={styles.card}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <svg className="-rotate-90" height="80" width="80">
              <circle cx="40" cy="40" r={radius} stroke={styles.colors.borderLight} strokeWidth="8" fill="none" />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={styles.colors.primary}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progressPercent / 100) * circumference}
              />
            </svg>
            <span className="absolute text-xs font-bold" style={{ color: styles.colors.success }}>
              {progressPercent}%
            </span>
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: styles.colors.text }}>
              Complete Your Setup
            </h2>
            <p className="mt-1 max-w-sm text-sm" style={{ color: styles.colors.textSecondary }}>
              You&apos;re almost there! Complete the remaining steps to unlock all features.
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4 lg:max-w-2xl">
          {setupSteps.map((item, index) => (
            <div key={item.label} className="relative flex flex-col items-center gap-2 text-center">
              {index > 0 ? (
                <span
                  className="absolute left-[-50%] top-4 hidden h-px w-full md:block"
                  style={{ backgroundColor: item.done ? styles.colors.success : styles.colors.borderLight }}
                />
              ) : null}
              <span
                className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: item.done ? styles.colors.success : styles.colors.border,
                  backgroundColor: item.done ? styles.colors.success : styles.colors.surface,
                  color: item.done ? styles.primaryText : styles.colors.textSecondary,
                }}
              >
                {item.done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </span>
              <span className="text-xs font-bold" style={{ color: styles.colors.textSecondary }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push("/onboarding/setup")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold"
          style={{
            borderColor: styles.colors.border,
            color: styles.colors.primary,
            backgroundColor: styles.colors.surfaceAlt,
          }}
        >
          Continue Setup <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function KpiCard({
  icon,
  label,
  value,
  subtext,
  href,
  tone = "primary",
  delta,
  loading,
  styles,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subtext: string;
  href: string;
  tone?: StatusTone;
  delta?: string;
  loading?: boolean;
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="group rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5 sm:p-5"
      style={styles.card}
    >
      {loading ? (
        <div className="space-y-4">
          <SkeletonBlock className="h-11 w-11" styles={styles} />
          <SkeletonBlock className="h-8 w-20" styles={styles} />
          <SkeletonBlock className="h-4 w-28" styles={styles} />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={toneStyles(tone, styles)}>
              {icon}
            </span>
            {delta ? (
              <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={toneStyles(delta.startsWith("-") ? "error" : "success", styles)}>
                ↗ {delta}
              </span>
            ) : null}
          </div>
          <p className="mt-4 text-3xl font-extrabold leading-tight" style={{ color: styles.colors.text }}>
            {value}
          </p>
          <p className="mt-1 text-sm font-bold" style={{ color: styles.colors.text }}>
            {label}
          </p>
          <p className="mt-1 min-h-4 text-xs" style={{ color: styles.colors.textTertiary }}>
            {subtext}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold" style={{ color: styles.colors.primary }}>
            View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </>
      )}
    </button>
  );
}

function SectionCard({
  title,
  action,
  children,
  styles,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  return (
    <section className="rounded-2xl border p-4 sm:p-5" style={styles.card}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold" style={{ color: styles.colors.text }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function TextAction({
  href,
  label,
  styles,
}: {
  href: string;
  label: string;
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="inline-flex items-center gap-1 text-xs font-bold"
      style={{ color: styles.colors.primary }}
    >
      {label} <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}

function StatusBadge({
  status,
  styles,
}: {
  status: ScheduleStatus;
  styles: ReturnType<typeof useDashboardStyles>;
}) {
  const tone: StatusTone =
    status === "Completed" ? "success" : status === "In Progress" ? "primary" : "warning";

  return (
    <span className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold" style={toneStyles(tone, styles)}>
      {status}
    </span>
  );
}

function CircularProgress({
  value,
  label,
  styles,
  tone = "success",
}: {
  value: number;
  label: string;
  styles: ReturnType<typeof useDashboardStyles>;
  tone?: StatusTone;
}) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const color = toneStyles(tone, styles).color as string;

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg className="-rotate-90" height="128" width="128">
        <circle cx="64" cy="64" r={radius} stroke={styles.colors.borderLight} strokeWidth="12" fill="none" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-extrabold" style={{ color: styles.colors.text }}>
          {value}%
        </p>
        <p className="text-[11px] font-medium" style={{ color: styles.colors.textTertiary }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function DashboardSkeleton({ styles }: { styles: ReturnType<typeof useDashboardStyles> }) {
  return (
    <Layout>
      <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8" style={styles.page}>
        <div className="mx-auto max-w-[1280px] space-y-5">
          <SkeletonBlock className="h-24 w-full" styles={styles} />
          <SkeletonBlock className="h-24 w-full" styles={styles} />
          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-44 w-full" styles={styles} />
            ))}
          </section>
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-72 w-full" styles={styles} />
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const styles = useDashboardStyles();
  const { user } = useAuthContext();
  const { academicData } = useAcademicDetails();
  const academicDetails = academicData as any;
  const schoolInfo = user?.schoolId as any;
  const studentProfileId = user?.studentId || academicDetails?._id;

  const { kpiData, isLoading: kpiLoading, error: kpiError, refetch: refetchKpis } =
    useStudentKPIs(studentProfileId);
  const kpiAny = kpiData as any;
  const {
    attendanceData,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useAttendanceKPIs(studentProfileId);
  const { subjects: timetableSubjects, isLoading: timetableLoading } = useTimetable({
    silent: true,
  });
  const { resources, isLoading: resourcesLoading } = useResources();
  const {
    courses: publishedCourses,
    isLoading: publishedCoursesLoading,
    error: publishedCoursesError,
  } = usePublishedGradeCourses();
  const {
    cumulativeGrade,
    isLoading: cumulativeLoading,
    error: cumulativeError,
  } = useStudentCumulativeGrade();
  const {
    notifications,
    counts: notificationCounts,
    loading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();
  const { chatRooms, isLoading: chatLoading, error: chatError } = useRealtimeChat();

  const todayName = getTodayName();
  const todaySchedule = useMemo<TodayClass[]>(
    () =>
      timetableSubjects
        .filter((item) => item.day === todayName)
        .map((item) => {
          const labels = splitTimeRange(item.timeString);
          return {
            ...item,
            status: getScheduleStatus(item),
            startLabel: labels.start,
            endLabel: labels.end,
          };
        })
        .sort((a, b) => a.start - b.start),
    [timetableSubjects, todayName],
  );

  const weeklySummary = useMemo(
    () =>
      DAYS.map((day) => ({
        day,
        shortDay: day.slice(0, 3),
        count: timetableSubjects.filter((item) => item.day === day).length,
      })),
    [timetableSubjects],
  );

  const completedClasses = todaySchedule.filter((item) => item.status === "Completed").length;
  const inProgressClasses = todaySchedule.filter((item) => item.status === "In Progress").length;
  const upcomingClasses = todaySchedule.filter((item) => item.status === "Upcoming").length;
  const unreadMessages = chatRooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);
  const unreadUpdates = (notificationCounts?.unread || 0) + unreadMessages;
  const publishedAssessmentCount =
    publishedCourses?.reduce((sum, course) => sum + (course.publishedAssessmentsCount || 0), 0) || 0;
  const gradeScore = Math.round(
    cumulativeGrade?.percentage ?? kpiData?.gradeScore ?? 0,
  );
  const attendanceRate = Math.round(
    attendanceData?.attendanceRate ?? kpiData?.attendancePercentage ?? 0,
  );
  const totalStudentsInClass =
    kpiAny?.totalStudentsInClass || kpiData?.additionalMetrics?.totalStudentsInClass || 0;
  const classPosition =
    cumulativeGrade?.position || kpiAny?.classPosition || kpiData?.additionalMetrics?.classRank || 0;
  const percentile =
    classPosition && totalStudentsInClass
      ? Math.max(1, Math.round(((totalStudentsInClass - classPosition + 1) / totalStudentsInClass) * 100))
      : gradeScore;
  const currentTerm =
    (cumulativeGrade?.termId ? getTermName(cumulativeGrade.termId) : "") ||
    kpiAny?.currentTerm?.name ||
    kpiData?.additionalMetrics?.currentTerm?.name ||
    attendanceData?.termInfo?.name ||
    "Current Term";
  const schoolName =
    user?.schoolName ||
    (schoolInfo && typeof schoolInfo === "object" ? schoolInfo.name : "") ||
    "Easy Sparks Education Center";
  const studentName = kpiData?.firstName || user?.firstName || "Student";
  const className =
    kpiData?.classInfo?.name ||
    attendanceData?.classInfo?.name ||
    academicDetails?.classDetails?.name ||
    "Your Class";
  const recentResults = (publishedCourses || [])
    .filter((course) => course.currentAverage !== null && course.currentAverage !== undefined)
    .sort((a, b) => {
      const aTime = new Date(a.latestPublishedAssessment?.publishedAt || 0).getTime();
      const bTime = new Date(b.latestPublishedAssessment?.publishedAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 3);
  const recentResources = [...resources]
    .sort((a: any, b: any) => new Date(b.uploadDate || b.createdAt || 0).getTime() - new Date(a.uploadDate || a.createdAt || 0).getTime())
    .slice(0, 3);
  const recentActivity = [
    ...(notifications || []).slice(0, 4).map((item) => ({
      type: item.category,
      label: item.title || item.message || "New notification",
      time: new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      href: "/notifications",
    })),
    ...(unreadMessages > 0
      ? [
          {
            type: "messages",
            label: `You have ${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}`,
            time: "Now",
            href: "/messages",
          },
        ]
      : []),
  ].slice(0, 5);

  const errors = [
    kpiError ? `Dashboard metrics: ${kpiError}` : null,
    attendanceError ? `Attendance: ${attendanceError}` : null,
    publishedCoursesError ? `Results: ${publishedCoursesError}` : null,
    cumulativeError ? `Academic progress: ${cumulativeError}` : null,
    notificationsError ? `Notifications: ${notificationsError}` : null,
    chatError ? `Messages: ${chatError}` : null,
  ].filter(Boolean) as string[];
  const primaryLoading = kpiLoading && !kpiData;

  if (primaryLoading) return <DashboardSkeleton styles={styles} />;

  return (
    <Layout>
      <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8" style={styles.page}>
        <div className="mx-auto max-w-[1280px] space-y-5">
          {errors.length ? (
            <div
              className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              style={{
                ...styles.card,
                borderColor: withAlpha(styles.colors.warning, "55"),
              }}
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
                onClick={refetchKpis}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold"
                style={{
                  backgroundColor: styles.colors.primary,
                  color: styles.primaryText,
                }}
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          ) : null}

          <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: styles.colors.text }}>
                {getGreeting()}, <span style={{ color: styles.colors.primary }}>{studentName}</span>! 👋
              </h1>
              <p className="mt-1 text-sm" style={{ color: styles.colors.textSecondary }}>
                Here&apos;s what&apos;s happening at{" "}
                <span className="font-semibold" style={{ color: styles.colors.text }}>
                  {schoolName}
                </span>{" "}
                today.
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
              <HeroAction
                href="/timetable"
                label="View Timetable"
                icon={<Calendar className="h-4 w-4" />}
                styles={styles}
              />
              <HeroAction
                href="/results"
                label="View Results"
                icon={<BarChart3 className="h-4 w-4" />}
                styles={styles}
              />
              <HeroAction
                href="/resources"
                label="Download Resource"
                icon={<Download className="h-4 w-4" />}
                primary
                styles={styles}
              />
            </div>
          </section>

          <SetupProgressCard styles={styles} />

          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard
              icon={<Calendar className="h-5 w-5" />}
              label="Today's Classes"
              value={todaySchedule.length}
              subtext={`${completedClasses} completed • ${upcomingClasses + inProgressClasses} upcoming`}
              href="/timetable"
              delta="+0.0%"
              loading={timetableLoading}
              styles={styles}
            />
            <KpiCard
              icon={<BookOpen className="h-5 w-5" />}
              label="Subjects Enrolled"
              value={kpiData?.subjectsEnrolled || 0}
              subtext="Across this term"
              href="/subjects"
              tone="purple"
              delta="+0.0%"
              loading={kpiLoading}
              styles={styles}
            />
            <KpiCard
              icon={<Users className="h-5 w-5" />}
              label="Grade Score"
              value={`${gradeScore}%`}
              subtext="Cumulative average"
              href="/results"
              tone="primary"
              delta="+5.2%"
              loading={kpiLoading || cumulativeLoading}
              styles={styles}
            />
            <KpiCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="Attendance Rate"
              value={`${attendanceRate}%`}
              subtext="This term"
              href="/attendance"
              tone="success"
              delta="+4.1%"
              loading={attendanceLoading}
              styles={styles}
            />
            <KpiCard
              icon={<FileText className="h-5 w-5" />}
              label="Published Assessments"
              value={publishedAssessmentCount}
              subtext="Results available"
              href="/results"
              tone="purple"
              delta={`+${publishedAssessmentCount}`}
              loading={publishedCoursesLoading}
              styles={styles}
            />
            <KpiCard
              icon={<Bell className="h-5 w-5" />}
              label="Unread Updates"
              value={unreadUpdates}
              subtext="Notifications & messages"
              href="/notifications"
              tone="error"
              delta={unreadUpdates ? `+${unreadUpdates}` : "+0"}
              loading={notificationsLoading || chatLoading}
              styles={styles}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SectionCard
              title="Today's Schedule"
              action={<TextAction href="/timetable" label="View full schedule" styles={styles} />}
              styles={styles}
            >
              {timetableLoading ? (
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((item) => (
                    <SkeletonBlock key={item} className="h-14 w-full" styles={styles} />
                  ))}
                </div>
              ) : todaySchedule.length > 0 ? (
                <div className="space-y-3">
                  {todaySchedule.slice(0, 4).map((item, index) => (
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
                          {item.className || className} • {item.teacherName || "Teacher"}
                        </p>
                      </div>
                      <StatusBadge status={item.status} styles={styles} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Calendar className="h-7 w-7" />}
                  title="No classes scheduled today."
                  description="Your timetable is empty for today. Check the weekly view for upcoming classes."
                  action={<TextAction href="/timetable" label="Open timetable" styles={styles} />}
                  styles={styles}
                />
              )}
            </SectionCard>

            <SectionCard
              title="Weekly Timetable Summary"
              action={<TextAction href="/timetable" label="View full timetable" styles={styles} />}
              styles={styles}
            >
              {timetableLoading ? (
                <SkeletonBlock className="h-44 w-full" styles={styles} />
              ) : timetableSubjects.length > 0 ? (
                <div>
                  <div className="grid grid-cols-5 gap-2">
                    {weeklySummary.map((item) => (
                      <div
                        key={item.day}
                        className="rounded-xl border p-3 text-center"
                        style={{
                          borderColor: item.day === todayName ? styles.colors.primary : styles.colors.borderLight,
                          backgroundColor: item.day === todayName ? withAlpha(styles.colors.primary, "10") : styles.colors.surfaceAlt,
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
                      {timetableSubjects.length} classes
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<Clock className="h-7 w-7" />}
                  title="No timetable assigned yet"
                  description="Your weekly classes will appear here when the school publishes a timetable."
                  action={<TextAction href="/timetable" label="View timetable" styles={styles} />}
                  styles={styles}
                />
              )}
            </SectionCard>

            <SectionCard
              title="Academic Progress"
              action={<TextAction href="/results" label="View results" styles={styles} />}
              styles={styles}
            >
              {cumulativeLoading || publishedCoursesLoading ? (
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
                          {classPosition ? `${classPosition}` : "-"}
                          {totalStudentsInClass ? (
                            <span className="text-sm" style={{ color: styles.colors.textTertiary }}>
                              {" "}
                              / {totalStudentsInClass}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: styles.colors.textTertiary }}>
                          Percentile
                        </p>
                        <p className="mt-1 text-2xl font-extrabold" style={{ color: styles.colors.text }}>
                          {percentile}%
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
                                  index === 0
                                    ? styles.colors.primary
                                    : index === 1
                                      ? styles.colors.error
                                      : styles.colors.warning,
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
                              {Math.round(course.currentAverage || 0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
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

            <SectionCard
              title="Attendance Summary"
              action={<TextAction href="/attendance" label="View attendance" styles={styles} />}
              styles={styles}
            >
              {attendanceLoading ? (
                <SkeletonBlock className="h-56 w-full" styles={styles} />
              ) : attendanceData ? (
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
                  <CircularProgress value={attendanceRate} label="Attendance Rate" tone="success" styles={styles} />
                  <div className="w-full max-w-sm space-y-4">
                    {[
                      { label: "Present Days", value: attendanceData.presentDays, tone: "success" as StatusTone },
                      { label: "Absent Days", value: attendanceData.absentDays, tone: "warning" as StatusTone },
                      { label: "Total School Days", value: attendanceData.totalDays, tone: "muted" as StatusTone },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: toneStyles(item.tone, styles).color }} />
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
                <EmptyState
                  icon={<CheckCircle2 className="h-7 w-7" />}
                  title="No attendance data yet"
                  description="Attendance records will show after your school marks attendance."
                  action={<TextAction href="/attendance" label="Open attendance" styles={styles} />}
                  styles={styles}
                />
              )}
            </SectionCard>

            <SectionCard
              title="Resources & Curriculum"
              action={<TextAction href="/resources" label="Open resources" styles={styles} />}
              styles={styles}
            >
              {resourcesLoading ? (
                <SkeletonBlock className="h-56 w-full" styles={styles} />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => router.push("/resources")}
                      className="rounded-xl border px-3 py-2 text-xs font-bold"
                      style={{ borderColor: styles.colors.border, color: styles.colors.primary, backgroundColor: styles.colors.surfaceAlt }}
                    >
                      Open resources <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/subjects")}
                      className="rounded-xl border px-3 py-2 text-xs font-bold"
                      style={{ borderColor: styles.colors.border, color: styles.colors.primary, backgroundColor: styles.colors.surface }}
                    >
                      View subjects <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                    </button>
                  </div>
                  {[
                    { label: "New Resources", value: recentResources.length, icon: FolderOpen, tone: "primary" as StatusTone },
                    { label: "Subjects with Curriculum", value: kpiData?.subjectsEnrolled || publishedCourses?.length || 0, icon: BookOpen, tone: "purple" as StatusTone },
                    { label: "Recently Shared", value: resources.length, icon: Download, tone: "success" as StatusTone },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 border-b py-2 last:border-b-0" style={{ borderColor: styles.colors.borderLight }}>
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

            <SectionCard
              title="Recent Activity"
              action={<TextAction href="/notifications" label="View all" styles={styles} />}
              styles={styles}
            >
              {notificationsLoading ? (
                <SkeletonBlock className="h-56 w-full" styles={styles} />
              ) : recentActivity.length ? (
                <div className="space-y-3">
                  {recentActivity.map((item, index) => {
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
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl" style={toneStyles(index % 2 ? "purple" : "primary", styles)}>
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
                <EmptyState
                  icon={<Bell className="h-7 w-7" />}
                  title="No recent activity"
                  description="Announcements, result updates, resources, and messages will appear here."
                  action={<TextAction href="/notifications" label="Open notifications" styles={styles} />}
                  styles={styles}
                />
              )}
            </SectionCard>
          </section>

          <section className="rounded-2xl border p-5" style={styles.card}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-bold" style={{ color: styles.colors.text }}>
                Quick Links
              </h2>
              <span className="hidden text-xs sm:inline" style={{ color: styles.colors.textTertiary }}>
                Learning shortcuts
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {[
                { label: "Subjects", sub: "View subjects", icon: GraduationCap, href: "/subjects" },
                { label: "Resources", sub: "Browse resources", icon: FolderOpen, href: "/resources" },
                { label: "Timetable", sub: "View schedule", icon: Calendar, href: "/timetable" },
                { label: "Attendance", sub: "My attendance", icon: CheckCircle2, href: "/attendance" },
                { label: "Results", sub: "View results", icon: BarChart3, href: "/results" },
                { label: "Messages", sub: "Open inbox", icon: MessageSquare, href: "/messages" },
                { label: "Notifications", sub: "View all", icon: Bell, href: "/notifications" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className="group flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: styles.colors.borderLight, backgroundColor: styles.colors.surface }}
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: withAlpha(styles.colors.primary, "12"),
                        color: styles.colors.primary,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold" style={{ color: styles.colors.text }}>
                      {item.label}
                    </span>
                    <span className="hidden text-xs sm:block" style={{ color: styles.colors.textTertiary }}>
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
