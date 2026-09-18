"use client";

import { Bell, BookOpen, Calendar, CheckCircle2, FileText, Users } from "lucide-react";
import Layout from "@/components/Layout";
import DashboardHero, { DashboardErrorBanner } from "@/components/dashboard/DashboardHero";
import QuickLinks from "@/components/dashboard/QuickLinks";
import SetupProgressCard from "@/components/dashboard/SetupProgressCard";
import { DashboardSkeleton, KpiCard } from "@/components/dashboard/primitives";
import { TodayScheduleCard, WeeklySummaryCard } from "@/components/dashboard/ScheduleCards";
import {
  AcademicProgressCard,
  AttendanceSummaryCard,
  RecentActivityCard,
  ResourcesCard,
} from "@/components/dashboard/ProgressCards";
import { useDashboardStyles } from "@/components/dashboard/styles";
import { useDashboardData } from "@/hooks/useDashboardData";

/**
 * The student's home screen: a greeting, six KPI tiles, and one card per area
 * of the app. Every figure comes from {@link useDashboardData}; each section
 * owns its loading, empty and error state so a slow read never blanks the page.
 *
 * @returns The dashboard page.
 */
export default function DashboardPage() {
  const styles = useDashboardStyles();
  const data = useDashboardData();

  if (data.isInitialLoading) return <DashboardSkeleton styles={styles} />;

  return (
    <Layout>
      <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8" style={styles.page}>
        <div className="mx-auto max-w-[1280px] space-y-5">
          <DashboardErrorBanner errors={data.errors} onRetry={data.refetchAll} styles={styles} />

          <DashboardHero
            studentName={data.studentName}
            schoolName={data.schoolName}
            currentTerm={data.currentTerm}
            styles={styles}
          />

          <SetupProgressCard styles={styles} />

          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard
              icon={<Calendar className="h-5 w-5" />}
              label="Today's Classes"
              value={data.todaySchedule.length}
              subtext={`${data.completedClasses} completed • ${data.upcomingClasses} upcoming`}
              href="/timetable"
              loading={data.timetable.isLoading}
              styles={styles}
            />
            <KpiCard
              icon={<BookOpen className="h-5 w-5" />}
              label="Subjects Enrolled"
              value={data.kpis.kpiData?.subjectsEnrolled ?? 0}
              subtext="Across this term"
              href="/subjects"
              tone="purple"
              loading={data.kpis.isLoading}
              styles={styles}
            />
            <KpiCard
              icon={<Users className="h-5 w-5" />}
              label="Grade Score"
              value={`${data.gradeScore}%`}
              subtext="Cumulative average"
              href="/results"
              loading={data.kpis.isLoading || data.cumulative.isLoading}
              styles={styles}
            />
            <KpiCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="Attendance Rate"
              value={`${data.attendanceRate}%`}
              subtext="This term"
              href="/attendance"
              tone="success"
              loading={data.attendance.isLoading}
              styles={styles}
            />
            <KpiCard
              icon={<FileText className="h-5 w-5" />}
              label="Published Assessments"
              value={data.publishedAssessmentCount}
              subtext="Results available"
              href="/results"
              tone="purple"
              loading={data.published.isLoading}
              styles={styles}
            />
            <KpiCard
              icon={<Bell className="h-5 w-5" />}
              label="Unread Updates"
              value={data.unreadUpdates}
              subtext="Notifications & messages"
              href="/notifications"
              tone="error"
              loading={data.notifications.loading || data.chat.isLoading}
              styles={styles}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <TodayScheduleCard
              schedule={data.todaySchedule}
              className={data.className}
              isLoading={data.timetable.isLoading}
              styles={styles}
            />
            <WeeklySummaryCard
              summary={data.weeklySummary}
              totalClasses={data.timetable.subjects.length}
              todayName={data.todayName}
              isLoading={data.timetable.isLoading}
              styles={styles}
            />
            <AcademicProgressCard
              gradeScore={data.gradeScore}
              classPosition={data.classPosition}
              totalStudentsInClass={data.totalStudentsInClass}
              percentile={data.percentile}
              recentResults={data.recentResults}
              className={data.className}
              isLoading={data.cumulative.isLoading || data.published.isLoading}
              styles={styles}
            />
            <AttendanceSummaryCard
              attendance={data.attendance.attendanceData}
              attendanceRate={data.attendanceRate}
              isLoading={data.attendance.isLoading}
              styles={styles}
            />
            <ResourcesCard
              resources={data.resources.resources}
              recentCount={data.recentResources.length}
              subjectCount={data.kpis.kpiData?.subjectsEnrolled ?? data.published.courses?.length ?? 0}
              isLoading={data.resources.isLoading}
              styles={styles}
            />
            <RecentActivityCard
              items={data.recentActivity}
              isLoading={data.notifications.loading}
              styles={styles}
            />
          </section>

          <QuickLinks styles={styles} />
        </div>
      </main>
    </Layout>
  );
}
