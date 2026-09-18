"use client";

import { ArrowLeft, BookOpen, Calendar, FileText, Paperclip, User } from "lucide-react";
import type { CurriculumDetail } from "@/services/curriculum.service";

/**
 * Strips HTML so a rich-text body can be previewed as plain text.
 *
 * @param html - The stored curriculum content.
 * @param length - How many characters to keep.
 * @returns A plain-text preview.
 */
export function toPreview(html: string | undefined, length = 120): string {
  const text = (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "No content available.";
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

/**
 * The back link and course heading above the list.
 *
 * @param props - Component props.
 * @param props.title - The course's title.
 * @param props.code - The course code, when known.
 * @param props.onBack - Returns to the subjects grid.
 * @returns The header element.
 */
export function CurriculumHeader({
  title,
  code,
  onBack,
}: {
  title: string;
  code: string | null;
  onBack: () => void;
}) {
  return (
    <div className="mb-8" data-guide="curriculum-header">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-[#6F6F6F] transition-colors hover:text-[#030E18] dark:text-slate-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Subjects</span>
      </button>
      <h1 className="mb-1 text-2xl font-bold text-[#030E18] dark:text-white">{title}</h1>
      <p className="text-sm text-[#6F6F6F] dark:text-slate-300">
        {code ? `Course Code: ${code}` : "Select a curriculum to read"}
      </p>
    </div>
  );
}

/**
 * The card grid of curriculum documents for a course.
 *
 * @param props - Component props.
 * @param props.curricula - The documents to list.
 * @param props.onOpen - Called with the document to read.
 * @returns The grid element.
 */
export function CurriculumGrid({
  curricula,
  onOpen,
}: {
  curricula: CurriculumDetail[];
  onOpen: (curriculum: CurriculumDetail) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" data-guide="curriculum-list">
      {curricula.map((curriculum) => (
        <button
          key={curriculum._id}
          type="button"
          onClick={() => onOpen(curriculum)}
          className="group rounded-xl border border-[#F0F0F0] bg-white p-5 text-left transition-all duration-200 hover:border-[#003366] hover:shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44] dark:hover:border-blue-400"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF2FB] dark:bg-[#1B3558]">
              <FileText className="h-5 w-5 text-[#003366] dark:text-blue-200" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[#030E18] transition-colors group-hover:text-[#003366] dark:text-white dark:group-hover:text-blue-200">
                {curriculum.course?.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6F6F6F] dark:text-slate-300">{curriculum.term?.name}</p>
            </div>
          </div>

          <p className="mb-4 line-clamp-2 text-xs text-[#6F6F6F] dark:text-slate-300">
            {toPreview(curriculum.content)}
          </p>

          <div className="flex items-center justify-between text-xs text-[#878787] dark:text-slate-400">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{curriculum.course?.teacherName?.trim() || "Not assigned"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{curriculum.updatedAt ? new Date(curriculum.updatedAt).toLocaleDateString() : "—"}</span>
            </div>
          </div>

          {curriculum.attachments?.length ? (
            <div className="mt-3 flex items-center gap-1 border-t border-[#F0F0F0] pt-3 text-xs text-[#003366] dark:border-[#30435F] dark:text-blue-300">
              <Paperclip className="h-3.5 w-3.5" />
              <span>
                {curriculum.attachments.length} attachment{curriculum.attachments.length > 1 ? "s" : ""}
              </span>
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/**
 * The skeleton shown while the curriculum loads.
 *
 * @returns The skeleton grid.
 */
export function CurriculumSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-xl border border-[#F0F0F0] bg-white dark:border-[#30435F] dark:bg-[#1B2A44]"
        />
      ))}
    </div>
  );
}

/**
 * The state shown when a course has no published curriculum yet.
 *
 * @param props - Component props.
 * @param props.onBack - Returns to the subjects grid.
 * @returns The empty state.
 */
export function CurriculumEmpty({ onBack }: { onBack: () => void }) {
  return (
    <div className="rounded-xl border border-[#F0F0F0] bg-white p-16 text-center dark:border-[#30435F] dark:bg-[#1B2A44]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F8F8] dark:bg-[#111C31]">
        <FileText className="h-7 w-7 text-[#878787] dark:text-slate-400" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-[#030E18] dark:text-white">No Curriculum Available</h3>
      <p className="mb-6 text-sm text-[#6F6F6F] dark:text-slate-300">
        Your teacher has not published a curriculum for this course yet.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg bg-[#003366] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002244] dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Back to Subjects
      </button>
    </div>
  );
}

/**
 * The state shown when the curriculum could not be loaded.
 *
 * @param props - Component props.
 * @param props.message - The reason, keyed on `error.code`.
 * @param props.onBack - Returns to the subjects grid.
 * @param props.onRetry - Refetches the curriculum.
 * @returns The error state.
 */
export function CurriculumError({
  message,
  onBack,
  onRetry,
}: {
  message: string;
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="alert">
      <div className="w-full max-w-md rounded-xl border border-[#F0F0F0] bg-white p-8 text-center dark:border-[#30435F] dark:bg-[#1B2A44]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
          <BookOpen className="h-8 w-8 text-red-500 dark:text-red-300" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-[#030E18] dark:text-white">Failed to Load Curriculum</h3>
        <p className="mb-6 text-sm text-[#6F6F6F] dark:text-slate-300">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-[#D9D9D9] px-4 py-2 text-sm font-medium text-[#030E18] transition-colors hover:bg-gray-50 dark:border-[#30435F] dark:text-white dark:hover:bg-[#243853]"
          >
            Back to Subjects
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-[#003366] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002244] dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
