/**
 * The route-level loading state, shown while a screen's code or data is on its
 * way. Matches the sign-in spinner so navigation never flashes an empty page.
 *
 * @returns The loading screen.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0B1224]">
      <div className="text-center" role="status" aria-live="polite">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#003366] dark:border-blue-300" />
        <p className="mt-4 text-gray-600 dark:text-slate-200">Loading…</p>
      </div>
    </div>
  );
}
