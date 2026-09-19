import { AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/StateComponents";
import { messageForError } from "@/lib/errorMessages";
import { timetableErrorKind, type TimetableErrorKind } from "@/lib/timetable";

const HEADING: Record<TimetableErrorKind, string> = {
  network: "🌐 Connection Error",
  server: "⚠️ Server Error",
  unknown: "❌ Something went wrong",
};

/**
 * The placeholder shown while the timetable is being fetched.
 *
 * @returns The loading card.
 */
export function TimetableLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-[#1B2A44] rounded-xl border border-[#D7E1ED] dark:border-[#30435F] shadow-sm"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-blue-100 dark:border-[#30435F] rounded-full"></div>
        <div className="w-20 h-20 border-4 border-[#003366] dark:border-blue-300 border-t-transparent dark:border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Loading Your Timetable</h3>
        <p className="text-gray-600 dark:text-slate-300 max-w-md">
          Please wait while we fetch your class schedule for this week...
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {[0, 0.1, 0.2].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-[#003366] dark:bg-blue-300 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The timetable request failed. The wording follows `error.code`, and Try Again
 * refetches instead of reloading the page.
 *
 * @param props - Component props.
 * @param props.error - The thrown value from the query.
 * @param props.onRetry - Refetches the timetable.
 * @returns The error card.
 */
export function TimetableError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const kind = timetableErrorKind(error);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-20 px-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/40 dark:to-[#1B2A44] rounded-xl border-2 border-red-200 dark:border-red-500/40 shadow-sm"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-300" />
      </div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-3">{HEADING[kind]}</h3>
        <p className="text-red-600 dark:text-red-200 max-w-md leading-relaxed">
          {messageForError(error, "We couldn't load your timetable.")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>

        {kind === "network" && (
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-900/30 dark:bg-transparent transition-all duration-200"
          >
            Reload Page
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * The request succeeded and the school has published no periods for the class.
 *
 * @param props - Component props.
 * @param props.onRefresh - Refetches the timetable.
 * @returns The empty card.
 */
export function TimetableEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      title="No Schedule Found"
      message="No classes scheduled for this week. Your timetable will appear here once your school publishes it."
      icon={<Calendar className="h-6 w-6 text-gray-400 dark:text-slate-400" />}
      actionText="Refresh"
      onAction={onRefresh}
    />
  );
}
