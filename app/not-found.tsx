import Link from "next/link";
import { Compass } from "lucide-react";

/**
 * The 404 screen. Students reach it from a stale link or a mistyped address.
 *
 * @returns The not-found screen.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-[#0B1224]">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-[#30435F]">
          <Compass className="h-6 w-6 text-gray-400 dark:text-slate-400" />
        </div>
        <h1 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Page not found</h1>
        <p className="mb-6 text-gray-600 dark:text-slate-300">
          That page doesn&apos;t exist, or it has moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-[#003366] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#002244]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
