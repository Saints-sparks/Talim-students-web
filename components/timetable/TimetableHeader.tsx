import { Calendar, ChevronLeft, Download, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TIME_RANGES } from "@/lib/timetable";

const OUTLINE_BUTTON =
  "flex items-center gap-2 border-[#003366] text-[#003366] dark:border-blue-400 dark:text-blue-200 hover:bg-[#003366] hover:text-white dark:hover:bg-blue-700 transition-all duration-200 shadow-sm";

interface TimetableHeaderProps {
  rangeId: string;
  onRangeChange: (id: string) => void;
  isCardView: boolean;
  onToggleCardView: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExport: () => void;
  exportDisabled: boolean;
}

/**
 * The title bar above the grid: time-of-day filter, card/table switch on
 * phones, refresh and CSV export.
 *
 * @param props - Component props.
 * @param props.rangeId - The selected time range.
 * @param props.onRangeChange - Called with the id of the range picked.
 * @param props.isCardView - Whether the phone card layout is active.
 * @param props.onToggleCardView - Switches between card and table layouts.
 * @param props.onRefresh - Refetches the timetable.
 * @param props.isRefreshing - True while a request is in flight.
 * @param props.onExport - Downloads the visible timetable as CSV.
 * @param props.exportDisabled - True when there is nothing to export.
 * @returns The header element.
 */
export function TimetableHeader({
  rangeId,
  onRangeChange,
  isCardView,
  onToggleCardView,
  onRefresh,
  isRefreshing,
  onExport,
  exportDisabled,
}: TimetableHeaderProps) {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl border border-[#D7E1ED] bg-white p-4 shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44] md:p-6 lg:flex-row lg:items-center lg:justify-between"
      data-guide="timetable-header"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Weekly Timetable</h2>
          <p className="text-gray-600 dark:text-slate-300 flex items-center gap-2 text-sm md:text-base">
            <Users className="w-4 h-4" />
            Your class schedule for the week
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2" data-guide="timetable-filters">
          <label htmlFor="timetable-range" className="text-sm font-medium text-gray-700 dark:text-slate-200">
            Time:
          </label>
          <select
            id="timetable-range"
            value={rangeId}
            onChange={(event) => onRangeChange(event.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-[#30435F] rounded-md bg-white dark:bg-[#0F1B2F] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-400 transition-all"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3" data-guide="timetable-actions">
          <Button onClick={onToggleCardView} variant="outline" size="sm" className={`md:hidden ${OUTLINE_BUTTON}`}>
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCardView ? "rotate-180" : ""}`} />
            <span>{isCardView ? "Table View" : "Card View"}</span>
          </Button>

          <Button onClick={onRefresh} variant="outline" size="sm" disabled={isRefreshing} className={OUTLINE_BUTTON}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>

          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            disabled={exportDisabled}
            className="flex items-center gap-2 border-green-500 text-green-700 dark:text-green-300 hover:bg-green-600 hover:text-white transition-all duration-200 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
