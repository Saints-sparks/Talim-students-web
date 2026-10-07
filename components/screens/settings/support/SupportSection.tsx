"use client";

import React, { useId, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ScreenError, ScreenLoading } from "@/components/tl/states";
import { focusRing, primaryButton, rowButton } from "@/components/tl/styles";
import { useMyTickets } from "@/hooks/support/useTickets";
import { deskLabel, relativeTime } from "@/lib/support/tickets";
import type { TicketRole, TicketSummary } from "@/types/v15";
import { NewTicketSheet } from "./NewTicketSheet";
import { TicketThreadSheet } from "./TicketThreadSheet";
import { StatusChip } from "./TicketBits";

/** Props for {@link SupportSection}. */
export interface SupportSectionProps {
  /** The ticket whose thread is open (`?ticket=`), or null. */
  openTicketId: string | null;
  /** Opens a ticket's thread, or closes it with null; the caller keeps the URL in step. */
  onOpenTicket: (ticketId: string | null) => void;
}

/**
 * Settings → Help → My tickets (v1.5 §1): a "New ticket" button and the
 * student's tickets, most recent activity first, each with its status chip,
 * desk, reference, an unread dot when someone has written since, and when it
 * last changed. One `GET /tickets/mine` per page ("Load more"); no call per
 * row. A row opens the thread; a new ticket opens its thread once sent.
 *
 * Guide target: `settings-support`.
 *
 * @param props - See {@link SupportSectionProps}.
 * @param props.openTicketId - The ticket whose thread is open.
 * @param props.onOpenTicket - Opens or closes a thread.
 * @returns The section and its sheets.
 */
export function SupportSection({ openTicketId, onOpenTicket }: SupportSectionProps) {
  const { user } = useAuthContext();
  const headingId = useId();
  const list = useMyTickets();
  const [composing, setComposing] = useState(false);
  // This portal admits students only; they may raise tickets to either desk.
  const role: TicketRole = "student";
  const now = new Date();

  return (
    <section aria-labelledby={headingId} data-guide="settings-support" className="mt-6 border-t border-tl-line-soft pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 id={headingId} className="text-[17px] font-extrabold text-tl-ink">
            My tickets
          </h3>
          <p className="mt-0.5 text-[13px] text-tl-muted">Questions for your school or Talim support. Replies arrive here and in your updates.</p>
        </div>
        <button type="button" className={primaryButton} onClick={() => setComposing(true)}>
          <Plus aria-hidden className="h-4 w-4" />
          New ticket
        </button>
      </div>

      <div className="mt-4">
        {list.isLoading ? (
          <ScreenLoading label="Loading your tickets" blocks={1} />
        ) : list.error ? (
          <ScreenError message={list.error} onRetry={list.refetch} />
        ) : list.tickets.length === 0 ? (
          <p className="rounded-[16px] border border-dashed border-tl-line p-4 text-sm text-tl-muted">
            No tickets yet. If something isn&apos;t right, raise a ticket and the reply will arrive here.
          </p>
        ) : (
          <ul aria-label="My tickets" className="flex flex-col gap-2">
            {list.tickets.map((ticket) => (
              <li key={ticket.id}>
                <TicketRow ticket={ticket} now={now} schoolName={user?.schoolName} onOpen={() => onOpenTicket(ticket.id)} />
              </li>
            ))}
          </ul>
        )}
        {list.hasMore ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" className={rowButton} onClick={list.loadMore} disabled={list.isLoadingMore}>
              {list.isLoadingMore ? "Loading…" : "Load more"}
            </button>
            {list.loadMoreError ? (
              <p role="alert" className="text-[13px] font-semibold text-tl-danger">
                {list.loadMoreError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <NewTicketSheet
        open={composing}
        onOpenChange={setComposing}
        role={role}
        schoolName={user?.schoolName}
        onCreated={(ticket) => {
          setComposing(false);
          onOpenTicket(ticket.id);
        }}
      />
      <TicketThreadSheet
        ticketId={openTicketId}
        onOpenChange={(open) => {
          if (!open) onOpenTicket(null);
        }}
        onNewTicket={() => {
          onOpenTicket(null);
          setComposing(true);
        }}
        schoolName={user?.schoolName}
      />
    </section>
  );
}

/**
 * One ticket in the list as one 44px+ button: subject, unread dot,
 * reference, desk, last activity and the status chip.
 *
 * @param props - The ticket and what opening it does.
 * @param props.ticket - The ticket.
 * @param props.now - The current time, for "Updated 2 h ago".
 * @param props.schoolName - The student's school, for the desk label.
 * @param props.onOpen - Opens its thread.
 * @returns The row.
 */
function TicketRow({ ticket, now, schoolName, onOpen }: { ticket: TicketSummary; now: Date; schoolName?: string | null; onOpen: () => void }) {
  const updated = relativeTime(ticket.lastActivityAt, now);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex min-h-[64px] w-full items-center gap-3 rounded-[16px] border border-tl-line bg-tl-surface px-3.5 py-3 text-left transition-colors hover:bg-tl-bg ${focusRing}`}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {ticket.unread ? (
            <>
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-tl-brand" />
              <span className="sr-only">New reply. </span>
            </>
          ) : null}
          <span className="truncate text-[15px] font-extrabold text-tl-ink">{ticket.subject}</span>
        </span>
        <span className="mt-0.5 block text-[13px] text-tl-muted">
          {ticket.reference} · {deskLabel(ticket.desk, schoolName)}
          {updated ? ` · Updated ${updated}` : ""}
        </span>
      </span>
      <StatusChip status={ticket.status} />
      <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-tl-faint" />
    </button>
  );
}
