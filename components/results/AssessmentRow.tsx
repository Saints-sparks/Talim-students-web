import { clampPercent, formatPercent, gradeBadgeClass, progressColor } from "@/lib/results";
import type { PublishedAssessmentResult } from "@/services/grades.service";

function Fact({ label, value, truncate }: { label: string; value: string | number; truncate?: boolean }) {
  return (
    <div>
      <div className="text-[#AAAAAA] dark:text-slate-400">{label}</div>
      <div className={`font-semibold text-[#030E18] dark:text-white ${truncate ? "truncate" : ""}`}>{value}</div>
    </div>
  );
}

/**
 * One published result: score, grade, a score bar and how the class did.
 *
 * @param props - Component props.
 * @param props.item - The result, already enriched by the API.
 * @returns The row.
 */
export function AssessmentRow({ item }: { item: PublishedAssessmentResult }) {
  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-4 dark:border-[#30435F] dark:bg-[#1B2A44]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-[#030E18] dark:text-white truncate">{item.assessment.name}</div>
          <div className="text-xs text-[#AAAAAA] dark:text-slate-400 mt-1 capitalize">
            {item.assessment.assessmentType || "Assessment"}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${gradeBadgeClass(item.gradeLevel)}`}>
            {item.gradeLevel}
          </span>
          <div className="text-right">
            <div className="text-sm font-bold text-[#030E18] dark:text-white">{formatPercent(item.percentage)}</div>
            <div className="text-xs text-[#AAAAAA] dark:text-slate-400">
              {item.score}/{item.maxScore}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-100 dark:bg-[#30435F] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor(item.percentage)}`}
            style={{ width: `${clampPercent(item.percentage)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
        <Fact label="Class avg" value={item.classAverage != null ? `${item.classAverage}%` : "-"} />
        <Fact label="Highest" value={item.highestScore ?? "-"} />
        <Fact label="Lowest" value={item.lowestScore ?? "-"} />
        <Fact label="Comparison" value={item.comparison || "-"} truncate />
      </div>
    </div>
  );
}
