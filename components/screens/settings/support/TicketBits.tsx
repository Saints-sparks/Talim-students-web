"use client";

import React from "react";
import { Paperclip } from "lucide-react";
import { formatBytes } from "@/lib/learner/format";
import { STATUS_META } from "@/lib/support/tickets";
import { pill, pillTone } from "@/components/tl/styles";
import type { Attachment, TicketStatus } from "@/types/v15";

/**
 * A ticket's status as a chip in the `tl` pill tones ("Open", "Waiting on
 * you", "Resolved"…).
 *
 * @param props - The status.
 * @param props.status - The ticket's status.
 * @returns The chip.
 */
export function StatusChip({ status }: { status: TicketStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.open;
  return <span className={`${pill} ${pillTone[meta.tone]}`}>{meta.label}</span>;
}

/**
 * The files on a ticket message, each a link that opens in a new tab.
 *
 * @param props - The files.
 * @param props.attachments - The message's attachments.
 * @returns The list, or null when there are none.
 */
export function AttachmentLinks({ attachments }: { attachments: Attachment[] }) {
  if (!attachments.length) return null;
  return (
    <ul className="mt-2.5 flex flex-wrap gap-2" aria-label="Attachments">
      {attachments.map((file, index) => (
        <li key={`${file.url}-${index}`}>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-[13px] border border-tl-line bg-tl-surface px-3.5 text-sm font-bold text-tl-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tl-link"
          >
            <Paperclip aria-hidden className="h-4 w-4 shrink-0" />
            <span className="truncate">{file.name}</span>
            {file.size ? <span className="shrink-0 font-semibold text-tl-muted">{formatBytes(file.size)}</span> : null}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
