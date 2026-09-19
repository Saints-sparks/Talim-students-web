import { BarChart3, BookOpen, CheckCircle2, Trophy } from "lucide-react";
import { Skeleton } from "@/components/StateComponents";
import { StatCard } from "@/components/results/StatCard";
import { formatPercent, type CourseSummary } from "@/lib/results";
import type { StudentCumulativeGrade } from "@/services/grades.service";

/**
 * The four tiles above the courses. The term record loads separately from the
 * course list, so its two tiles show a placeholder rather than holding the
 * whole page back.
 *
 * @param props - Component props.
 * @param props.summary - Course and assessment counts.
 * @param props.cumulativeGrade - The term record, or `null` until the school calculates it.
 * @param props.isCumulativeLoading - True while the term record is loading.
 * @param props.hasCumulativeError - True when the term record could not be read.
 * @returns The tile grid.
 */
export function ResultsSummary({
  summary,
  cumulativeGrade,
  isCumulativeLoading,
  hasCumulativeError,
}: {
  summary: CourseSummary;
  cumulativeGrade: StudentCumulativeGrade | null;
  isCumulativeLoading: boolean;
  hasCumulativeError: boolean;
}) {
  const pending = <Skeleton className="h-7 w-16 rounded-lg" />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon={<BarChart3 className="w-5 h-5" />}
        value={isCumulativeLoading ? pending : formatPercent(cumulativeGrade?.percentage)}
        label="Grade Score"
        sub={hasCumulativeError ? "Unavailable" : "Published"}
      />
      <StatCard
        icon={<Trophy className="w-5 h-5" />}
        value={isCumulativeLoading ? pending : cumulativeGrade?.position != null ? `#${cumulativeGrade.position}` : "-"}
        label="Class Position"
        sub={hasCumulativeError ? "Unavailable" : "This term"}
      />
      <StatCard
        icon={<BookOpen className="w-5 h-5" />}
        value={summary.courseCount || "-"}
        label="Courses"
        sub={`${summary.coursesWithResults} with results`}
      />
      <StatCard
        icon={<CheckCircle2 className="w-5 h-5" />}
        value={summary.publishedAssessments || "-"}
        label="Assessments"
        sub="Published"
      />
    </div>
  );
}
