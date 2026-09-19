import { Calendar } from "lucide-react";

/**
 * The footer under the grid: the week's class count and the colour legend.
 *
 * @param props - Component props.
 * @param props.totalClasses - How many periods the week holds.
 * @returns The summary footer.
 */
export function TimetableSummary({ totalClasses }: { totalClasses: number }) {
  return (
    <div
      className="bg-gray-50 dark:bg-[#1B2A44] px-6 py-4 border-t-2 border-gray-200 dark:border-[#30435F]"
      data-guide="timetable-summary"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 text-gray-700 dark:text-slate-200">
          <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg text-[#003366] dark:text-blue-200">{totalClasses}</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">classes scheduled this week</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-[#003366] to-[#004080] rounded shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Scheduled Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#E8EEF6] dark:to-[#D7E1ED] rounded border border-gray-400 dark:border-[#8EA4C1]"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Free Period</span>
          </div>
        </div>
      </div>
    </div>
  );
}
