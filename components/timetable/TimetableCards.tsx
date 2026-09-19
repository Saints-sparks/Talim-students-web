import { BookOpen, Calendar, Clock, Users } from "lucide-react";
import type { TimetableByDay } from "@/lib/timetable";

/**
 * The phone layout: one card per weekday listing that day's periods.
 *
 * @param props - Component props.
 * @param props.days - The weekdays to list.
 * @param props.byDay - The periods grouped by weekday.
 * @returns The card list.
 */
export function TimetableCards({ days, byDay }: { days: readonly string[]; byDay: TimetableByDay }) {
  return (
    <div className="p-4 space-y-4">
      {days.map((day) => {
        const entries = byDay[day] ?? [];

        return (
          <div key={day} className="bg-gray-50 dark:bg-[#1B2A44] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#003366] rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#003366] dark:text-blue-200">{day}</h3>
              <div className="flex-1 h-px bg-[#003366]/20 dark:bg-blue-300/30"></div>
              <span className="text-sm text-gray-600 dark:text-slate-300">
                {entries.length} {entries.length === 1 ? "class" : "classes"}
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-slate-300">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-slate-400" />
                <p>No classes scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div
                    key={`${entry.time}-${entry.course}-${index}`}
                    className="bg-white dark:bg-[#111C31] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-[#30435F]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#003366] dark:text-blue-300" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{entry.course}</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-300">{entry.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-[#003366] dark:text-blue-200">{entry.time}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </div>
                    </div>

                    {entry.class && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                        <Users className="w-4 h-4" />
                        <span>{entry.class}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
