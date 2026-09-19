import { BookOpen, Clock, MapPin, Users } from "lucide-react";
import { entriesForSlot, type TimetableByDay, type TimetableEntry } from "@/lib/timetable";

function ClassBlock({ entry }: { entry: TimetableEntry }) {
  return (
    <div className="bg-gradient-to-br from-[#003366] to-[#004080] text-white rounded-xl p-3 md:p-4 hover:from-[#002244] hover:to-[#003366] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-blue-200" />
          <div className="font-semibold text-xs md:text-sm">{entry.course}</div>
        </div>
        <Clock className="w-3 h-3 text-blue-200" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
        <div className="text-xs text-blue-100 font-medium">{entry.subject}</div>
      </div>

      <div className="flex items-center gap-2">
        <Users className="w-3 h-3 text-blue-200" />
        <div className="text-xs text-blue-200">{entry.class}</div>
      </div>

      <div className="mt-2 pt-2 border-t border-blue-400/30">
        <div className="text-xs text-blue-200 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="hidden md:inline">{entry.time}</span>
        </div>
      </div>
    </div>
  );
}

function FreeBlock() {
  return (
    <div className="h-20 md:h-24 bg-gray-50 dark:bg-[#E8EEF6] rounded-xl border-2 border-dashed border-gray-300 dark:border-[#8EA4C1] flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-white transition-all duration-200">
      <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 dark:bg-[#1B2A44] rounded-full flex items-center justify-center mb-1">
        <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-slate-300" />
      </div>
      <span className="text-gray-600 dark:text-[#334155] text-xs font-medium">Free</span>
    </div>
  );
}

/**
 * The desktop layout: one row per time slot, one column per weekday. It
 * scrolls sideways inside its own container rather than widening the page.
 *
 * @param props - Component props.
 * @param props.days - The weekday columns.
 * @param props.slots - The time-slot rows.
 * @param props.byDay - The periods grouped by weekday.
 * @returns The table element.
 */
export function TimetableTable({
  days,
  slots,
  byDay,
}: {
  days: readonly string[];
  slots: readonly string[];
  byDay: TimetableByDay;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-[#1B2A44] border-b-2 border-gray-200 dark:border-[#30435F]">
            <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-slate-200 min-w-[140px] border-r border-gray-300 dark:border-[#30435F]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600 dark:text-slate-300" />
                Time Slot
              </div>
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-slate-200 border-r border-gray-200 dark:border-[#30435F]"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{day}</span>
                  <div className="w-8 h-1 bg-[#003366] dark:bg-blue-300 rounded-full"></div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, index) => (
            <tr
              key={slot}
              className={`border-b border-gray-100 dark:border-[#253651] ${
                index % 2 === 0 ? "bg-white dark:bg-[#111C31]" : "bg-gray-50 dark:bg-[#16243B]"
              } hover:bg-blue-50/30 dark:hover:bg-[#1D3150] transition-colors`}
            >
              <td className="px-4 py-6 font-semibold text-gray-700 dark:text-slate-200 border-r-2 border-gray-200 dark:border-[#30435F] bg-gray-50/50 dark:bg-[#202B3D]">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="text-sm font-bold text-[#003366] dark:text-blue-200">{slot}</div>
                  <div className="w-16 h-px bg-gray-300 dark:bg-slate-500"></div>
                  <div className="text-xs text-gray-500 dark:text-slate-300">Slot {index + 1}</div>
                </div>
              </td>
              {days.map((day) => {
                const entries = entriesForSlot(byDay[day] ?? [], slot);
                return (
                  <td
                    key={`${day}-${slot}`}
                    className="px-2 md:px-4 py-4 md:py-6 border-r border-gray-200 dark:border-[#30435F]"
                  >
                    {entries.length > 0 ? (
                      <div className="space-y-2">
                        {entries.map((entry, entryIndex) => (
                          <ClassBlock key={`${entry.time}-${entry.course}-${entryIndex}`} entry={entry} />
                        ))}
                      </div>
                    ) : (
                      <FreeBlock />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
