"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Sheet } from "@/components/tl/Sheet";
import { chip, fieldControl, fieldLabel, ghostButton, primaryButton } from "@/components/tl/styles";
import { useCreateTicket } from "@/hooks/support/useTickets";
import { messageForError } from "@/lib/errorMessages";
import { APP_VERSION } from "@/lib/appInfo";
import { AREA_LABELS, allowedDesks, areasFor, deskLabel, ticketContext, validateNewTicket, type NewTicketErrors, type NewTicketField } from "@/lib/support/tickets";
import { TICKET_BODY_MAX, TICKET_SUBJECT_MAX, type Ticket, type TicketArea, type TicketDesk, type TicketRole } from "@/types/tickets";
import { useRovingGroup } from "../roving";
import { AttachmentField, useTicketFiles } from "./AttachmentField";

/** Props for {@link NewTicketSheet}. */
export interface NewTicketSheetProps {
  /** Whether the sheet is showing. */
  open: boolean;
  /** Called with `false` when it closes. */
  onOpenChange: (open: boolean) => void;
  /** The requester's role (a student here); decides the desks and the area chips. */
  role: TicketRole;
  /** The student's school, for the "My school" choice. */
  schoolName?: string | null;
  /** Called with the new ticket, to open its thread. */
  onCreated: (ticket: Ticket) => void;
}

const FORM_ID = "new-ticket-form";

/** The fields in the order they show, for focusing the first problem. */
const FIELD_ORDER: readonly NewTicketField[] = ["desk", "area", "subject", "body", "attachments"];

/**
 * Settings → Help → New ticket (v1.5 §1 `POST /tickets`): who should help
 * (the student's school or Talim support), what it is about, a subject
 * (3–140 characters), the message (up to 5000) and up to five files. The
 * checks run on Send and focus the first field that needs attention; the
 * draft stays if sending fails, and the new ticket's thread opens after.
 *
 * @param props - See {@link NewTicketSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @param props.role - The requester's role.
 * @param props.schoolName - The student's school.
 * @param props.onCreated - Receives the new ticket.
 * @returns The sheet.
 */
export function NewTicketSheet({ open, onOpenChange, role, schoolName, onCreated }: NewTicketSheetProps) {
  const desks = allowedDesks(role);
  const areas = areasFor(role);
  const create = useCreateTicket();
  const files = useTicketFiles();
  const ids = { desk: useId(), area: useId(), subject: useId(), body: useId(), subjectCount: useId(), bodyCount: useId(), error: useId() };
  const [desk, setDesk] = useState<TicketDesk | null>(null);
  const [area, setArea] = useState<TicketArea | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<NewTicketErrors>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const fieldRefs = useRef<Partial<Record<NewTicketField, HTMLElement | null>>>({});
  const deskProps = useRovingGroup(desks, desk ?? desks[0], setDesk);
  const areaProps = useRovingGroup(areas, area ?? areas[0], setArea);
  const { reset: resetCreate } = create;
  const { reset: resetFiles } = files;

  useEffect(() => {
    if (!open) return;
    setDesk(desks.length === 1 ? desks[0] : null);
    setArea(null);
    setSubject("");
    setBody("");
    setErrors({});
    setSendError(null);
    resetCreate();
    resetFiles();
    // Only on opening: `desks` is a new array on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resetCreate, resetFiles]);

  const sending = create.isPending || files.isUploading;

  /**
   * Checks the draft, then uploads the files and raises the ticket.
   *
   * @param event - The form's submit.
   */
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const found = validateNewTicket({ desk, area, subject, body, attachmentCount: files.items.length }, role);
    setErrors(found);
    setSendError(null);
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first || !desk || !area) {
      if (first) fieldRefs.current[first]?.focus();
      return;
    }
    try {
      const attachments = await files.uploadAll();
      const ticket = await create.mutateAsync({
        desk,
        area,
        subject: subject.trim(),
        body: body.trim(),
        ...(attachments.length ? { attachments } : {}),
        context: ticketContext(APP_VERSION),
      });
      onCreated(ticket);
    } catch (error) {
      setSendError(messageForError(error, "We couldn't send your ticket. Please try again."));
    }
  };

  /**
   * The ids describing a field: its counter and its error, when shown.
   *
   * @param field - The field.
   * @param counterId - Its counter's id, if it has one.
   * @returns The space-separated ids, or undefined.
   */
  const describedBy = (field: NewTicketField, counterId?: string) =>
    [counterId, errors[field] ? `${ids.error}-${field}` : null].filter(Boolean).join(" ") || undefined;

  /**
   * A field's error line.
   *
   * @param field - The field.
   * @returns The line, or null.
   */
  const errorLine = (field: NewTicketField) =>
    errors[field] ? (
      <p id={`${ids.error}-${field}`} className="mt-1.5 text-[13px] font-semibold text-tl-danger">
        {errors[field]}
      </p>
    ) : null;

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => !sending && onOpenChange(value)}
      eyebrowText="New ticket"
      title="How can we help?"
      subtitle="Ask your school, or tell Talim support about something in the app. Replies arrive here and in your updates."
      footer={
        <>
          <button type="button" className={ghostButton} onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </button>
          <button type="submit" form={FORM_ID} className={`${primaryButton} ml-auto`} disabled={sending}>
            {sending ? "Sending…" : "Send ticket"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} className="flex flex-col gap-[18px]" noValidate>
        <div>
          <p id={ids.desk} className="mb-2.5 text-[13px] font-extrabold text-tl-muted">
            Who should help?
          </p>
          <div role="radiogroup" aria-labelledby={ids.desk} aria-describedby={describedBy("desk")} className="flex flex-wrap gap-[9px]">
            {desks.map((option, index) => {
              const props = deskProps(option, index);
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={desk === option}
                  onClick={() => setDesk(option)}
                  disabled={sending}
                  {...props}
                  ref={(node) => {
                    props.ref(node);
                    if (index === 0) fieldRefs.current.desk = node;
                  }}
                  className={chip(desk === option)}
                >
                  {deskLabel(option, schoolName)}
                </button>
              );
            })}
          </div>
          {errorLine("desk")}
        </div>

        <div>
          <p id={ids.area} className="mb-2.5 text-[13px] font-extrabold text-tl-muted">
            What is it about?
          </p>
          <div role="radiogroup" aria-labelledby={ids.area} aria-describedby={describedBy("area")} className="flex flex-wrap gap-[9px]">
            {areas.map((option, index) => {
              const props = areaProps(option, index);
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={area === option}
                  onClick={() => setArea(option)}
                  disabled={sending}
                  {...props}
                  ref={(node) => {
                    props.ref(node);
                    if (index === 0) fieldRefs.current.area = node;
                  }}
                  className={chip(area === option)}
                >
                  {AREA_LABELS[option]}
                </button>
              );
            })}
          </div>
          {errorLine("area")}
        </div>

        <div>
          <label htmlFor={ids.subject} className={`${fieldLabel} mb-[7px] block`}>
            Subject
          </label>
          <input
            id={ids.subject}
            ref={(node) => {
              fieldRefs.current.subject = node;
            }}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={TICKET_SUBJECT_MAX}
            placeholder="e.g. My Biology total shows blank"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={describedBy("subject", ids.subjectCount)}
            disabled={sending}
            className={fieldControl}
          />
          <p id={ids.subjectCount} className="mt-1.5 text-right text-[13px] text-tl-muted">
            {subject.trim().length} / {TICKET_SUBJECT_MAX}
          </p>
          {errorLine("subject")}
        </div>

        <div>
          <label htmlFor={ids.body} className={`${fieldLabel} mb-[7px] block`}>
            Message
          </label>
          <textarea
            id={ids.body}
            ref={(node) => {
              fieldRefs.current.body = node;
            }}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={TICKET_BODY_MAX}
            placeholder="What happened, where, and what you expected to see."
            aria-invalid={Boolean(errors.body)}
            aria-describedby={describedBy("body", ids.bodyCount)}
            disabled={sending}
            className={`${fieldControl} min-h-[130px] resize-y py-3 text-sm font-semibold leading-relaxed`}
          />
          <p id={ids.bodyCount} className="mt-1.5 text-right text-[13px] text-tl-muted">
            {body.trim().length} / {TICKET_BODY_MAX}
          </p>
          {errorLine("body")}
        </div>

        <AttachmentField files={files} disabled={sending} error={errors.attachments} />

        {sendError ? (
          <p role="alert" className="rounded-[14px] bg-tl-danger-bg px-4 py-3 text-sm font-semibold text-tl-danger">
            {sendError}
          </p>
        ) : null}
      </form>
    </Sheet>
  );
}
