"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "@/components/CustomToast";
import type { TimetableSubject } from "@/hooks/useTimetable";
import { DAYS } from "@/lib/dashboard/schedule";
import { logger } from "@/lib/logger";
import {
  TIME_RANGES,
  TIME_SLOTS,
  buildTimetableCsv,
  countClasses,
  downloadTextFile,
  filterEntriesBySlots,
  groupSubjectsByDay,
  type TimetableByDay,
} from "@/lib/timetable";

/**
 * View state for the weekly timetable: which part of the day is shown, whether
 * it is a table or a list of cards, the periods grouped for rendering, and the
 * CSV export of exactly what is on screen.
 *
 * @param subjects - Periods from `useTimetable`.
 * @returns The filters, the grouped periods and the export action.
 */
export function useTimetableView(subjects: readonly TimetableSubject[]) {
  const [rangeId, setRangeId] = useState<string>(TIME_RANGES[0].id);
  const [isCardView, setIsCardView] = useState(false);

  const range = TIME_RANGES.find((option) => option.id === rangeId) ?? TIME_RANGES[0];
  const byDay = useMemo(() => groupSubjectsByDay(subjects), [subjects]);
  const totalClasses = useMemo(() => countClasses(byDay), [byDay]);
  const slots = useMemo(() => TIME_SLOTS.slice(range.start, range.end + 1), [range]);

  /** The card list follows the range filter; the full day keeps every period, even ones off the grid. */
  const cardsByDay = useMemo<TimetableByDay>(() => {
    if (range === TIME_RANGES[0]) return byDay;
    const filtered: TimetableByDay = {};
    for (const day of DAYS) filtered[day] = filterEntriesBySlots(byDay[day] ?? [], slots);
    return filtered;
  }, [byDay, range, slots]);

  const exportCsv = useCallback(() => {
    if (totalClasses === 0) {
      toast.error("No timetable data to export");
      return;
    }
    try {
      const stamp = new Date().toISOString().split("T")[0];
      downloadTextFile(`timetable_${stamp}.csv`, buildTimetableCsv(byDay, DAYS, slots), "text/csv;charset=utf-8;");
      toast.success("Timetable exported successfully!");
    } catch (error) {
      logger.error("timetable", "Exporting the timetable failed", error);
      toast.error("Failed to export timetable");
    }
  }, [byDay, slots, totalClasses]);

  return {
    days: DAYS,
    slots,
    byDay,
    cardsByDay,
    totalClasses,
    rangeId: range.id,
    setRangeId,
    isCardView,
    toggleCardView: () => setIsCardView((value) => !value),
    exportCsv,
  };
}
