"use client";

import React from "react";
import { rowButton } from "@/components/tl/styles";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import { fileMetaLine } from "@/lib/files/fileMeta";
import type { PageMeta, StudentFile } from "@/types/learner";
import { DownloadFileButton, type DownloadFileButtonProps } from "./fileActions";

/**
 * One file on the Files list: the subject tag (its code, the full name for
 * screen readers), the file's name and meta line, and Download.
 *
 * @param props - Component props.
 * @param props.file - The file.
 * @param props.onDownload - Opens it and records the view.
 * @returns The row.
 */
export function FileRow({ file, onDownload }: { file: StudentFile; onDownload: DownloadFileButtonProps["onDownload"] }) {
  const { course } = file;
  return (
    <li className="flex flex-wrap items-center gap-3.5 border-b border-tl-line-soft px-5 py-4">
      <span
        title={course.title}
        className={`${subjectToneClass(course.id)} shrink-0 whitespace-nowrap rounded-full bg-subj-tint px-2.5 py-1.5 text-xs font-extrabold text-subj-ink`}
      >
        {course.code ? (
          <>
            <span aria-hidden>{course.code}</span>
            <span className="sr-only">{course.title}</span>
          </>
        ) : (
          course.title
        )}
      </span>
      <div className="min-w-[160px] flex-1">
        <p className="text-base font-bold text-tl-ink">{file.name}</p>
        <p className="mt-[3px] text-sm text-tl-muted">{fileMetaLine(file, true)}</p>
      </div>
      <DownloadFileButton file={file} onDownload={onDownload} />
    </li>
  );
}

/** Props for {@link FilePager}. */
export interface FilePagerProps {
  /** The page's pagination meta. */
  meta: PageMeta;
  /** Goes to a page. */
  onPage: (page: number) => void;
}

/**
 * Previous / Next under the list when there is more than one page.
 *
 * @param props - See {@link FilePagerProps}.
 * @param props.meta - Where the list is.
 * @param props.onPage - Changes page.
 * @returns The pager, or null on a single page.
 */
export function FilePager({ meta, onPage }: FilePagerProps) {
  if (meta.lastPage <= 1) return null;
  return (
    <nav aria-label="Pages of files" className="flex flex-wrap items-center gap-3 border-b border-tl-line-soft px-5 py-3">
      <button type="button" className={rowButton} disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>
        Previous
      </button>
      <span className="text-sm font-bold text-tl-muted">
        Page {meta.page} of {meta.lastPage}
      </span>
      <button type="button" className={rowButton} disabled={meta.page >= meta.lastPage} onClick={() => onPage(meta.page + 1)}>
        Next
      </button>
    </nav>
  );
}
