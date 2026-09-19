import { RefreshCw } from "lucide-react";

/**
 * The page title and the refresh control.
 *
 * @param props - Component props.
 * @param props.onRefresh - Reloads every result on screen.
 * @param props.isRefreshing - True while any result request is in flight.
 * @returns The header row.
 */
export function ResultsHeader({ onRefresh, isRefreshing }: { onRefresh: () => void; isRefreshing: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-[#030E18] dark:text-white">Results</h1>
        <p className="text-sm text-[#AAAAAA] dark:text-slate-400 mt-0.5">Academic performance overview</p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#003366] bg-white border border-[#F0F0F0] rounded-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0 dark:text-blue-200 dark:bg-[#1B2A44] dark:border-[#30435F] dark:hover:bg-[#243853]"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}
