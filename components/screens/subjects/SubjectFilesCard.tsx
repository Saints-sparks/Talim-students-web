"use client";

import React from "react";
import Link from "next/link";
import { card, cardTitle, textLink } from "@/components/tl/styles";
import { DownloadFileButton, useDownloadFile } from "@/components/screens/files/fileActions";
import { fileMetaLine, filesCount } from "@/lib/files/fileMeta";
import type { StudentSubjectDetail } from "@/types/learner";

/**
 * "Files from {teacher}": the subject's shared files with a Download button
 * each (which records the view), and a link to the subject's files on Files.
 *
 * @param props - Component props.
 * @param props.detail - B4's answer.
 * @returns The card.
 */
export function SubjectFilesCard({ detail }: { detail: StudentSubjectDetail }) {
  const download = useDownloadFile();
  const files = detail.resources;
  const teacher = detail.teacher?.name ?? "your teacher";

  return (
    <section aria-labelledby="subject-files-title" className={card} data-guide="subject-files">
      <h2 id="subject-files-title" className={cardTitle}>
        Files from {teacher}
      </h2>
      <p className="mt-1 text-sm text-tl-muted">{files.length ? `${filesCount(files.length)} shared` : "Nothing shared yet"}</p>
      {files.length ? (
        <ul className="flex flex-col">
          {files.map((file) => (
            <li key={file.id} className="mt-3.5 flex flex-wrap items-center gap-3.5 rounded-2xl border border-tl-line-soft p-3.5">
              <div className="min-w-[150px] flex-1">
                <p className="text-base font-bold text-tl-ink">{file.name}</p>
                <p className="mt-[3px] text-sm text-tl-muted">{fileMetaLine(file)}</p>
              </div>
              <DownloadFileButton file={file} onDownload={download} />
            </li>
          ))}
        </ul>
      ) : null}
      <Link href={`/files?course=${encodeURIComponent(detail.course.id)}`} className={`${textLink} mt-2`} title="Every file shared in this subject">
        All files →
      </Link>
    </section>
  );
}
