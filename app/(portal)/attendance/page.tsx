"use client";

import { Suspense } from "react";
import AttendanceScreen from "@/components/screens/attendance/AttendanceScreen";
import { ScreenLoading } from "@/components/tl/states";

/**
 * Attendance (`/attendance`): the term's rate and marked days, for the term
 * in `?term=` (the current one by default). Suspense is needed because the
 * screen reads the address with `useSearchParams`.
 *
 * @returns The Attendance screen.
 */
export default function AttendancePage() {
  return (
    <Suspense fallback={<ScreenLoading label="Loading your attendance" />}>
      <AttendanceScreen />
    </Suspense>
  );
}
