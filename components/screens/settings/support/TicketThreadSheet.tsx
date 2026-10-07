"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Sheet } from "@/components/tl/Sheet";
import { ScreenError, ScreenLoading } from "@/components/tl/states";
import { fieldControl, fieldLabel, ghostButton, primaryButton, rowButton } from "@/components/tl/styles";
import { useTicket, useTicketActions } from "@/hooks/support/useTickets";
import { messageForError } from "@/lib/errorMessages";
import {
  AREA_LABELS,
  CLOSED_TICKET_TEXT,
  authorLine,
  canReopen,
  conflictMessage,
  deskLabel,
  isConflict,
  relativeTime,
  reopenDeadline,
  reopenExpiredText,
  reopenHint,
  validateReply,
  type TicketAction,
} from "@/lib/support/tickets";
import { TICKET_BODY_MAX, type Ticket } from "@/types/v15";
import { AttachmentField, useTicketFiles } from "./AttachmentField";
import { AttachmentLinks, StatusChip } from "./TicketBits";

/** Props for {@link TicketThreadSheet}. */
export interface TicketThreadSheetProps {
  /** The ticket to show; the sheet is open while one is set. */
  ticketId: string | null;
  /** Called with `false` when it closes. */
  onOpenChange: (open: boolean) => void;
  /** Opens the New ticket sheet (from a closed or expired ticket). */
  onNewTicket: () => void;
  /** The student's school, for the "My school" desk. */
  schoolName?: string | null;
}

/**
 * One ticket's thread (v1.5 §1 `GET /tickets/:id`): its status, every
 * message oldest first with its files, and what the student can do next:
 * reply with up to five files, reopen within 7 days of it being resolved
 * (past that, the reason and a "New ticket" button), or close it after a
 * confirm step. A 409 is explained in an alert, the draft is kept and the
 * ticket reloaded.
 *
 * @param props - See {@link TicketThreadSheetProps}.
 * @param props.ticketId - The ticket, or null when closed.
 * @param props.onOpenChange - Open/close callback.
 * @param props.onNewTicket - Opens the New ticket sheet.
 * @param props.schoolName - The student's school.
 * @returns The sheet.
 */
export function TicketThreadSheet({ ticketId, onOpenChange, onNewTicket, schoolName }: TicketThreadSheetProps) {
  const { ticket, isLoading, error, refetch } = useTicket(ticketId);
  return (
    <Sheet
      open={Boolean(ticketId)}
      onOpenChange={onOpenChange}
      eyebrowText={ticket?.reference ?? "Support ticket"}
      title={ticket?.subject ?? "Support ticket"}
      subtitle={ticket ? `${deskLabel(ticket.desk, schoolName)} · ${AREA_LABELS[ticket.area] ?? AREA_LABELS.other}` : undefined}
    >
      {ticket ? (
        <ThreadBody key={ticket.id} ticket={ticket} onNewTicket={onNewTicket} />
      ) : error ? (
        <ScreenError message={error} onRetry={refetch} />
      ) : isLoading || ticketId ? (
        <ScreenLoading label="Loading the ticket" blocks={2} />
      ) : null}
    </Sheet>
  );
}

/**
 * The loaded thread: status, messages, next steps and the reply box.
 *
 * @param props - The ticket and the New ticket opener.
 * @param props.ticket - The ticket.
 * @param props.onNewTicket - Opens the New ticket sheet.
 * @returns The content.
 */
function ThreadBody({ ticket, onNewTicket }: { ticket: Ticket; onNewTicket: () => void }) {
  const replyId = useId();
  const countId = useId();
  const errorId = useId();
  const { reply, reopen, close } = useTicketActions(ticket.id);
  const files = useTicketFiles();
  const [text, setText] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [confirmingClose, setConfirmingClose] = useState(false);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (confirmingClose) confirmButton.current?.focus();
    else if (wasConfirming.current) closeButton.current?.focus();
    wasConfirming.current = confirmingClose;
  }, [confirmingClose]);

  const now = new Date();
  const closed = ticket.status === "closed";
  const deadline = reopenDeadline(ticket);
  const reopenable = canReopen(ticket, now);
  const expired = ticket.status === "resolved" && !reopenable;
  const busy = reply.isPending || files.isUploading || reopen.isPending || close.isPending;
  const messages = ticket.messages.filter((message) => !message.internal);

  /**
   * The words for a failed request: the 409 explanation, or the error's own.
   *
   * @param error - What the request threw.
   * @param action - What was being done.
   * @param fallback - Words when the error carries none.
   * @returns The sentence.
   */
  const explain = (error: unknown, action: TicketAction, fallback: string) => (isConflict(error) ? conflictMessage(error, action, ticket) : messageForError(error, fallback));

  /**
   * Checks and sends the reply; the draft stays if it fails.
   *
   * @param event - The form's submit.
   */
  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const invalid = validateReply(text, files.items.length);
    setReplyError(invalid);
    setProblem(null);
    if (invalid) return;
    try {
      const attachments = await files.uploadAll();
      await reply.mutateAsync({ body: text.trim(), ...(attachments.length ? { attachments } : {}) });
      setText("");
      files.reset();
    } catch (error) {
      setProblem(explain(error, "reply", "We couldn't send your reply. Please try again."));
    }
  };

  /** Reopens the resolved ticket. */
  const doReopen = async () => {
    setProblem(null);
    try {
      await reopen.mutateAsync();
    } catch (error) {
      setProblem(explain(error, "reopen", "We couldn't reopen this ticket. Please try again."));
    }
  };

  /** Closes the ticket after the confirm step. */
  const doClose = async () => {
    setProblem(null);
    try {
      await close.mutateAsync();
    } catch (error) {
      setProblem(explain(error, "close", "We couldn't close this ticket. Please try again."));
    } finally {
      setConfirmingClose(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <StatusChip status={ticket.status} />
        {ticket.createdAt ? <span className="text-[13px] text-tl-muted">Raised {relativeTime(ticket.createdAt, now)}</span> : null}
      </div>

      <ol aria-label="Messages" className="flex flex-col gap-3">
        {messages.map((message) => {
          const author = authorLine(message.author, ticket.requester.userId);
          return (
            <li
              key={message.id}
              className={`rounded-[16px] border p-3.5 ${author.side ? "border-tl-line bg-tl-surface" : "border-tl-line-soft bg-tl-subtle"}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-extrabold text-tl-ink">
                  {author.name}
                  {author.side ? <span className="ml-1.5 text-[13px] font-bold text-tl-muted">{author.side}</span> : null}
                </p>
                <time dateTime={message.createdAt} className="text-[13px] text-tl-muted">
                  {relativeTime(message.createdAt, now)}
                </time>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-tl-ink">{message.body}</p>
              <AttachmentLinks attachments={message.attachments} />
            </li>
          );
        })}
      </ol>

      {ticket.status === "resolved" && reopenable && deadline ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-tl-line-soft bg-tl-subtle p-3.5">
          <p className="text-[13px] text-tl-muted">{reopenHint(deadline)}</p>
          <button type="button" className={rowButton} onClick={doReopen} disabled={busy}>
            {reopen.isPending ? "Reopening…" : "Reopen"}
          </button>
        </div>
      ) : null}

      {expired || closed ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-tl-line-soft bg-tl-subtle p-3.5">
          <p className="text-[13px] text-tl-muted">{closed ? CLOSED_TICKET_TEXT : reopenExpiredText(ticket.reference)}</p>
          <button type="button" className={rowButton} onClick={onNewTicket}>
            New ticket
          </button>
        </div>
      ) : null}

      {problem ? (
        <p role="alert" className="rounded-[14px] bg-tl-danger-bg px-4 py-3 text-sm font-semibold text-tl-danger">
          {problem}
        </p>
      ) : null}

      {closed ? null : (
        <form onSubmit={send} className="flex flex-col gap-3 border-t border-tl-line-soft pt-4" noValidate>
          <div>
            <label htmlFor={replyId} className={`${fieldLabel} mb-[7px] block`}>
              Your reply
            </label>
            <textarea
              id={replyId}
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={TICKET_BODY_MAX}
              aria-invalid={Boolean(replyError)}
              aria-describedby={replyError ? `${countId} ${errorId}` : countId}
              disabled={busy}
              className={`${fieldControl} min-h-[100px] resize-y py-3 text-sm font-semibold leading-relaxed`}
            />
            <p id={countId} className="mt-1.5 text-right text-[13px] text-tl-muted">
              {text.trim().length} / {TICKET_BODY_MAX}
            </p>
            {replyError ? (
              <p id={errorId} className="mt-1 text-[13px] font-semibold text-tl-danger">
                {replyError}
              </p>
            ) : null}
          </div>
          <AttachmentField files={files} disabled={busy} />
          {confirmingClose ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="w-full text-[13px] text-tl-muted">Close this ticket? You won&apos;t be able to reply to it afterwards.</p>
              <button type="button" className={ghostButton} onClick={() => setConfirmingClose(false)} disabled={close.isPending}>
                Keep it open
              </button>
              <button ref={confirmButton} type="button" className={primaryButton} onClick={doClose} disabled={close.isPending}>
                {close.isPending ? "Closing…" : "Yes, close ticket"}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-between gap-2.5">
              <button ref={closeButton} type="button" className={ghostButton} onClick={() => setConfirmingClose(true)} disabled={busy}>
                Close ticket
              </button>
              <button type="submit" className={primaryButton} disabled={busy}>
                {reply.isPending || files.isUploading ? "Sending…" : "Send reply"}
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
}
