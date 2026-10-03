"use client";

import { Suspense } from "react";
import ResultsScreen from "@/components/screens/results/ResultsScreen";
import { ScreenLoading } from "@/components/tl/states";

/**
 * Results (`/results`): the term's report card, printable, for the term in
 * `?term=` (the current one by default). Suspense is needed because the
 * screen reads the address with `useSearchParams`.
 *
 * @returns The Results screen.
 */
export default function ResultsPage() {
  return (
    <Suspense fallback={<ScreenLoading label="Loading your results" />}>
      <ResultsScreen />
    </Suspense>
  );
}
