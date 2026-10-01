"use client";

import { Suspense } from "react";
import TimetableScreen from "@/components/screens/timetable/TimetableScreen";
import { ScreenLoading } from "@/components/tl/states";

/**
 * Timetable (`/timetable`): the class's week, one week at a time
 * (`?week=YYYY-MM-DD`). Suspense is needed because the screen reads the
 * address with `useSearchParams`.
 *
 * @returns The Timetable screen.
 */
export default function TimetablePage() {
  return (
    <Suspense fallback={<ScreenLoading label="Loading your timetable" />}>
      <TimetableScreen />
    </Suspense>
  );
}
