"use client";

import React, { useId, useMemo, useRef } from "react";
import { Search } from "lucide-react";
import { useFiles, useSubjects } from "@/hooks/learner/queries";
import { useDownloadAllFiles } from "@/hooks/learner/actions";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { PageHeader } from "@/components/tl/bits";
import { EmptyNote, ScreenError, ScreenLoading } from "@/components/tl/states";
import { cardFrame, fieldControl, ghostButton, primaryButton } from "@/components/tl/styles";
import { filesCount } from "@/lib/files/fileMeta";
import type { StudentFilesPage } from "@/types/learner";
import { FilePager, FileRow } from "./FileList";
import { useDownloadFile } from "./fileActions";
import { useFileFilters } from "./useFileFilters";

/** One choice of the subject filter. */
interface SubjectOption {
  id: string;
  title: string;
}

/**
 * The subject filter's choices: the student's subjects from B3, plus the
 * subject in the address when B3 has not loaded it (so the select still
 * shows it).
 *
 * @param subjects - B3's subjects, once loaded.
 * @param course - The selected course id, or "".
 * @param files - The current page, to name a course B3 does not list.
 * @returns The options, in B3's order.
 */
export function subjectOptions(
  subjects: ReadonlyArray<{ course: { id: string; title: string } }> | undefined,
  course: string,
  files: StudentFilesPage | undefined
): SubjectOption[] {
  const options = (subjects ?? []).map((s) => ({ id: s.course.id, title: s.course.title }));
  if (course && !options.some((o) => o.id === course)) {
    const named = files?.data.find((f) => f.course.id === course)?.course.title;
    options.push({ id: course, title: named ?? "Selected subject" });
  }
  return options;
}

/**
 * The line under the list: "4 files shared this term.", or for a search
 * "2 files match “indices”." (also what a screen reader hears when the list
 * changes).
 *
 * @param total - The number of files the API found.
 * @param q - The search, or "".
 * @returns The line.
 */
export function resultLine(total: number, q: string): string {
  if (q) return total === 0 ? `No files match “${q}”.` : `${filesCount(total)} ${total === 1 ? "matches" : "match"} “${q}”.`;
  return `${filesCount(total)} shared this term.`;
}

/**
 * The Files screen (`/files`): every file the student's teachers shared, one
 * page of `GET /students/me/files` (B7) at a time, with a debounced search,
 * a subject filter (kept in the address as `?course=&q=`), Download per file
 * (which records the view) and "Download all" as one zip.
 *
 * Also reads B3 (`useSubjects`, cached and shared with the Subjects screen)
 * for the filter's subject names.
 *
 * @returns The screen with its loading, error, empty and no-match states.
 */
export default function FilesScreen() {
  const { className } = useStudentIdentity();
  const filters = useFileFilters();
  const { course, text, q, page } = filters;
  const files = useFiles({ courseId: course || undefined, q: q || undefined, page });
  const subjects = useSubjects();
  const { downloadAll, isDownloading } = useDownloadAllFiles();
  const download = useDownloadFile();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const filterId = useId();

  const options = useMemo(() => subjectOptions(subjects.data?.subjects, course, files.data), [subjects.data, course, files.data]);
  const courseTitle = course ? options.find((o) => o.id === course)?.title ?? null : null;
  const data = files.data;
  const total = data?.meta.total ?? 0;

  /** Empties the search and puts the cursor back in the box. */
  const clearSearch = () => {
    filters.clearSearch();
    searchRef.current?.focus();
  };

  let body: React.ReactNode;
  if (files.isLoading) {
    body = (
      <div className="p-5">
        <ScreenLoading label="Loading your files" blocks={2} />
      </div>
    );
  } else if (files.error || !data) {
    body = (
      <div className="p-5">
        <ScreenError message={files.error ?? "We couldn't load your files. Please try again."} onRetry={files.refetch} />
      </div>
    );
  } else if (total === 0 && q) {
    body = (
      <EmptyNote
        title={`No files match “${q}”.`}
        action={
          <button type="button" className={ghostButton} onClick={clearSearch}>
            Clear search
          </button>
        }
      >
        Try another word, or search by the subject&apos;s name.
      </EmptyNote>
    );
  } else if (total === 0 && course) {
    body = (
      <EmptyNote
        title={courseTitle ? `No ${courseTitle} files yet.` : "No files for this subject yet."}
        action={
          <button type="button" className={ghostButton} onClick={() => filters.setCourse("")}>
            Show all subjects
          </button>
        }
      />
    );
  } else if (total === 0) {
    body = <EmptyNote title="Nothing shared with your class yet.">Files your teachers share appear here.</EmptyNote>;
  } else {
    body = (
      <>
        <ul aria-label="Files" aria-busy={files.isFetching || undefined}>
          {data.data.map((file) => (
            <FileRow key={file.id} file={file} onDownload={download} />
          ))}
        </ul>
        <FilePager meta={data.meta} onPage={filters.setPage} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader title="Files" subtitle={`Everything your teachers shared with ${className ?? "your class"}.`} guide="files-header" />
      <section aria-label="Shared files" className={cardFrame}>
        <div className="flex flex-wrap items-end gap-3 border-b border-tl-line-soft px-5 py-4">
          <div className="min-w-[180px] flex-[2]" data-guide="files-search">
            <label htmlFor={searchId} className="sr-only">
              Search files
            </label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-faint" />
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                value={text}
                onChange={(event) => filters.setText(event.target.value)}
                placeholder="Search files"
                title="Search by file or subject name"
                autoComplete="off"
                className={`${fieldControl} pl-10`}
              />
            </div>
          </div>
          <div className="min-w-[160px] flex-1" data-guide="files-filter">
            <label htmlFor={filterId} className="sr-only">
              Subject
            </label>
            <select id={filterId} value={course} onChange={(event) => filters.setCourse(event.target.value)} className={fieldControl}>
              <option value="">All subjects</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className={primaryButton}
            data-guide="files-download-all"
            title={courseTitle ? `Download every ${courseTitle} file as one zip` : "Download every file at once"}
            disabled={total === 0}
            aria-busy={isDownloading || undefined}
            aria-disabled={isDownloading || undefined}
            onClick={() => {
              // Not `disabled` while busy, so keyboard focus stays on the button.
              if (!isDownloading) void downloadAll(course || undefined);
            }}
          >
            {isDownloading ? "Preparing zip…" : courseTitle ? `Download all ${courseTitle} files` : "Download all"}
          </button>
        </div>
        <div data-guide="files-list">{body}</div>
        {data && !files.isLoading ? (
          // Always present once loaded, so a new count after a search or filter is read out.
          <p role="status" className={total > 0 ? "px-5 py-4 text-sm text-tl-muted" : "sr-only"}>
            {resultLine(total, q)}
          </p>
        ) : null}
      </section>
    </div>
  );
}
