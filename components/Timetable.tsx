"use client";

import React, { useEffect } from "react";
import { toast } from "@/components/CustomToast";
import { TimetableCards } from "@/components/timetable/TimetableCards";
import { TimetableHeader } from "@/components/timetable/TimetableHeader";
import { TimetableEmpty, TimetableError, TimetableLoading } from "@/components/timetable/TimetableStates";
import { TimetableSummary } from "@/components/timetable/TimetableSummary";
import { TimetableTable } from "@/components/timetable/TimetableTable";
import { useTimetable } from "@/hooks/useTimetable";
import { useTimetableView } from "@/hooks/useTimetableView";

/**
 * The student's weekly timetable. Owns the load/empty/error decision; the
 * grouping, filters and export live in `useTimetableView`, the rendering in
 * `components/timetable/*`.
 *
 * @returns The timetable screen.
 */
const Timetable: React.FC = () => {
  const { subjects, isLoading, isFetching, errorCause, refetch } = useTimetable();
  const view = useTimetableView(subjects);

  useEffect(() => {
    if (subjects.length > 0) {
      toast.success(`Timetable loaded successfully! Found ${subjects.length} classes.`);
    }
  }, [subjects]);

  const hasError = Boolean(errorCause) && subjects.length === 0;
  const isEmpty = !isLoading && !hasError && subjects.length === 0;

  return (
    <div className="space-y-6 p-4 md:p-0">
      <TimetableHeader
        rangeId={view.rangeId}
        onRangeChange={view.setRangeId}
        isCardView={view.isCardView}
        onToggleCardView={view.toggleCardView}
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
        onExport={view.exportCsv}
        exportDisabled={isLoading || hasError || isEmpty}
      />

      {isLoading ? (
        <TimetableLoading />
      ) : hasError ? (
        <TimetableError error={errorCause} onRetry={refetch} />
      ) : isEmpty ? (
        <TimetableEmpty onRefresh={refetch} />
      ) : (
        <div
          className="bg-white dark:bg-[#111C31] rounded-xl border border-[#D7E1ED] dark:border-[#30435F] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          data-guide="timetable-grid"
        >
          {view.isCardView ? (
            <TimetableCards days={view.days} byDay={view.cardsByDay} />
          ) : (
            <TimetableTable days={view.days} slots={view.slots} byDay={view.byDay} />
          )}
          <TimetableSummary totalClasses={view.totalClasses} />
        </div>
      )}
    </div>
  );
};

export default Timetable;
