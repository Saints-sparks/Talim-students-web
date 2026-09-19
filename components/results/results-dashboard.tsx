"use client";

import { BookOpen, CalendarX } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/StateComponents";
import { CourseList } from "@/components/results/CourseList";
import { CourseResultsPanel } from "@/components/results/CourseResultsPanel";
import { ResultsHeader } from "@/components/results/ResultsHeader";
import { ResultsSkeleton } from "@/components/results/ResultsSkeleton";
import { ResultsSummary } from "@/components/results/ResultsSummary";
import { useResultsDashboard } from "@/hooks/useResultsDashboard";

/**
 * The student's published results. Reads only the signed-in student's own,
 * published records; this component decides between loading, failed, empty and
 * loaded, and leaves the data to `useResultsDashboard`.
 *
 * @returns The results screen.
 */
export default function ResultsDashboard() {
  const dashboard = useResultsDashboard();
  const { assessments, cumulative } = dashboard;

  return (
    <div className="min-h-full p-3 sm:p-5 lg:p-6 bg-[#F8F8F8] dark:bg-[#0B1224] space-y-5 sm:space-y-6">
      <ResultsHeader onRefresh={dashboard.refresh} isRefreshing={dashboard.isRefreshing} />

      {dashboard.isLoading ? (
        <ResultsSkeleton />
      ) : dashboard.coursesError ? (
        <ErrorState
          error={dashboard.coursesError}
          title="Academic Data Unavailable"
          onRetry={dashboard.refresh}
        />
      ) : dashboard.hasNoTerm ? (
        <EmptyState
          title="No Current Term"
          message="Results appear here once your school starts a term."
          icon={<CalendarX className="h-6 w-6 text-gray-400 dark:text-slate-400" />}
        />
      ) : dashboard.courses.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          message="Your class courses will appear here once your enrollment is ready."
          icon={<BookOpen className="h-6 w-6 text-gray-400 dark:text-slate-400" />}
          actionText="Refresh"
          onAction={dashboard.refresh}
        />
      ) : (
        <>
          <ResultsSummary
            summary={dashboard.summary}
            cumulativeGrade={cumulative.cumulativeGrade}
            isCumulativeLoading={cumulative.isLoading}
            hasCumulativeError={Boolean(cumulative.errorCause)}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <CourseList
              courses={dashboard.courses}
              selectedId={dashboard.selectedCourseId}
              onSelect={dashboard.selectCourse}
            />
            <CourseResultsPanel
              course={dashboard.selectedCourse}
              assessments={assessments.assessments}
              isLoading={assessments.isLoading}
              error={assessments.errorCause}
              onRetry={assessments.refetch}
            />
          </div>
        </>
      )}
    </div>
  );
}
