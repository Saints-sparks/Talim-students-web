"use client";

import { Suspense } from "react";
import FilesScreen from "@/components/screens/files/FilesScreen";
import { ScreenLoading } from "@/components/tl/states";

/**
 * Files (`/files`): everything the student's teachers shared. The screen
 * reads `?course=&q=` with `useSearchParams`, so it sits in a Suspense
 * boundary.
 *
 * @returns The Files screen.
 */
export default function FilesPage() {
  return (
    <Suspense fallback={<ScreenLoading label="Loading your files" blocks={2} />}>
      <FilesScreen />
    </Suspense>
  );
}
