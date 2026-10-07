"use client";

import React, { useCallback, useId, useState } from "react";
import { Paperclip } from "lucide-react";
import { ATTACHMENT_ACCEPT, validateFile } from "@/components/chat-kit/mediaTypes";
import { useAttachmentUpload, type UploadItem } from "@/components/chat-kit/useAttachmentUpload";
import { rowButton } from "@/components/tl/styles";
import { formatBytes } from "@/lib/learner/format";
import { MAX_TICKET_ATTACHMENTS } from "@/lib/support/tickets";
import { ticketsService } from "@/services/tickets.service";
import type { Attachment } from "@/types/v15";

/** What {@link useTicketFiles} hands a form. */
export interface TicketFiles {
  /** The picked files; an item keeps its upload once done, so a retry skips it. */
  items: UploadItem[];
  /** Why picked files were refused (type, size, the 5-file cap). */
  problems: string[];
  /** Adds picked files, refusing what the upload route would. */
  add: (files: File[]) => void;
  /** Removes one file. */
  remove: (index: number) => void;
  /** Uploads what is not uploaded yet and answers the ticket's attachment objects. */
  uploadAll: () => Promise<Attachment[]>;
  /** True while files upload. */
  isUploading: boolean;
  /** Forgets every file and problem (after a successful send). */
  reset: () => void;
}

/**
 * The files of one ticket message: picking (the chat kit's checks, at most
 * 5 files), removing, and uploading with the chat kit's uploader through the
 * app's `POST /upload/chat-attachment` helper.
 *
 * @returns The files and their actions.
 */
export function useTicketFiles(): TicketFiles {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const { upload, isUploading } = useAttachmentUpload(ticketsService.uploadAttachment);

  /**
   * Adds picked files, refusing what the upload route would and anything past the cap.
   *
   * @param files - The files just chosen.
   */
  const add = useCallback(
    (files: File[]) => {
      const next = [...items];
      const refused: string[] = [];
      let overCap = false;
      for (const file of files) {
        const problem = validateFile(file);
        if (problem) refused.push(problem);
        else if (next.length >= MAX_TICKET_ATTACHMENTS) overCap = true;
        else next.push({ file });
      }
      if (overCap) refused.push(`You can attach up to ${MAX_TICKET_ATTACHMENTS} files.`);
      setItems(next);
      setProblems(refused);
    },
    [items]
  );

  /**
   * Removes one picked file.
   *
   * @param index - Its position.
   */
  const remove = useCallback((index: number) => {
    setItems((current) => current.filter((_, at) => at !== index));
    setProblems([]);
  }, []);

  /**
   * Uploads what is not uploaded yet (two at a time).
   *
   * @returns The ticket's attachment objects, in order.
   */
  const uploadAll = useCallback(async (): Promise<Attachment[]> => {
    if (!items.length) return [];
    const uploaded = await upload(items);
    return uploaded.map(({ url, name, mimeType, size }) => ({ url, name, mimeType, size }));
  }, [items, upload]);

  /** Forgets every file and problem. */
  const reset = useCallback(() => {
    setItems([]);
    setProblems([]);
  }, []);

  return { items, problems, add, remove, uploadAll, isUploading, reset };
}

/** Props for {@link AttachmentField}. */
export interface AttachmentFieldProps {
  /** The files and their actions, from {@link useTicketFiles}. */
  files: TicketFiles;
  /** While the form sends. */
  disabled?: boolean;
  /** A form-level error about the files (from the ticket checks). */
  error?: string;
}

/**
 * The attach-files control of a ticket form: a labelled file input styled as
 * a button, the count out of 5, the picked files each with a 44px Remove
 * button, and why any file was refused.
 *
 * @param props - See {@link AttachmentFieldProps}.
 * @param props.files - The files and their actions.
 * @param props.disabled - Whether the form is sending.
 * @param props.error - A form-level error about the files.
 * @returns The field.
 */
export function AttachmentField({ files, disabled, error }: AttachmentFieldProps) {
  const inputId = useId();
  const countId = useId();
  const errorId = useId();
  const full = files.items.length >= MAX_TICKET_ATTACHMENTS;

  /**
   * Hands the chosen files to {@link TicketFiles.add} and clears the input,
   * so the same file can be picked again.
   *
   * @param event - The input's change.
   */
  const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (picked.length) files.add(picked);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={inputId}
          type="file"
          multiple
          accept={ATTACHMENT_ACCEPT}
          onChange={pick}
          disabled={disabled || full}
          aria-describedby={`${countId}${error ? ` ${errorId}` : ""}`}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className={`${rowButton} cursor-pointer gap-2 peer-focus-visible:ring-2 peer-focus-visible:ring-tl-link peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-tl-surface peer-disabled:cursor-not-allowed peer-disabled:opacity-40`}
        >
          <Paperclip aria-hidden className="h-4 w-4" />
          Attach files
        </label>
        <span id={countId} className="text-[13px] text-tl-muted">
          {files.items.length} of {MAX_TICKET_ATTACHMENTS} files · photos, PDFs and documents
        </span>
      </div>
      {files.items.length ? (
        <ul className="mt-2.5 flex flex-col gap-2" aria-label="Attached files">
          {files.items.map((item, index) => (
            <li key={`${item.file.name}-${item.file.size}-${index}`} className="flex items-center gap-3 rounded-[14px] border border-tl-line-soft px-3.5 py-1.5">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-tl-ink">{item.file.name}</span>
              <span className="shrink-0 text-[13px] text-tl-muted">{formatBytes(item.file.size)}</span>
              <button
                type="button"
                className={rowButton}
                onClick={() => files.remove(index)}
                disabled={disabled}
                aria-label={`Remove ${item.file.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {files.problems.length || error ? (
        <div id={errorId} role="alert" className="mt-2 text-[13px] font-semibold text-tl-danger">
          {[...files.problems, ...(error ? [error] : [])].map((problem) => (
            <p key={problem}>{problem}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
