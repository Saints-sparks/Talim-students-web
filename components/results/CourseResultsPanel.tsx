import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState, Skeleton } from "@/components/StateComponents";
import { AssessmentRow } from "@/components/results/AssessmentRow";
import { formatPercent, gradeBadgeClass } from "@/lib/results";
import type { PublishedAssessmentResult, PublishedCourse } from "@/services/grades.service";

/**
 * The right-hand column: the open course's published results in one of four
 * states — failed (worded from `error.code`), loading, empty, or the list plus
 * the course total.
 *
 * @param props - Component props.
 * @param props.course - The open course.
 * @param props.assessments - Its published results.
 * @param props.isLoading - True while they load.
 * @param props.error - The thrown value if the read failed.
 * @param props.onRetry - Reloads the results.
 * @returns The panel.
 */
export function CourseResultsPanel({
  course,
  assessments,
  isLoading,
  error,
  onRetry,
}: {
  course: PublishedCourse | null;
  assessments: readonly PublishedAssessmentResult[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#030E18] dark:text-white">
            {course?.name || "Course Results"}
          </h2>
          <p className="text-xs text-[#AAAAAA] dark:text-slate-400 mt-0.5">
            {course?.publishedAssessmentsCount ?? 0} published assessments
          </p>
        </div>
        {course?.gradeLevel && (
          <span className={`text-sm font-bold px-3 py-1 rounded-lg ${gradeBadgeClass(course.gradeLevel)}`}>
            {course.gradeLevel}
          </span>
        )}
      </div>

      {error ? (
        <ErrorState error={error} title="Course Results Unavailable" onRetry={onRetry} />
      ) : isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading course results">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <Card className="border border-[#F0F0F0] shadow-none rounded-2xl dark:border-[#30435F] dark:bg-[#1B2A44]">
          <CardContent className="py-14 text-center">
            <FileText className="w-10 h-10 text-gray-300 dark:text-slate-500 mx-auto mb-3" />
            <p className="text-[#6F6F6F] dark:text-slate-200 font-medium text-sm">No published assessments yet</p>
            <p className="text-xs text-[#AAAAAA] dark:text-slate-400 mt-1">
              Published results for this course will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assessments.map((item) => (
            <AssessmentRow key={item.publicationId} item={item} />
          ))}
          {course?.cumulativeScore != null && course.maxScore != null && (
            <div className="rounded-2xl border border-[#003366]/20 bg-[#003366]/5 px-4 py-3 flex items-center justify-between text-sm dark:border-blue-300/30 dark:bg-blue-300/10">
              <span className="font-semibold text-[#003366] dark:text-blue-200">
                Course total: {course.cumulativeScore}/{course.maxScore} = {formatPercent(course.currentAverage)}
                {course.gradeLevel ? ` (${course.gradeLevel})` : ""}
              </span>
              {course.coursePosition != null && (
                <span className="text-xs font-medium text-[#6F6F6F] bg-white border border-[#F0F0F0] rounded-lg px-2 py-1 dark:text-slate-200 dark:bg-[#1B2A44] dark:border-[#30435F]">
                  #{course.coursePosition} in class
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
