"use client";

import React, { useId, useState } from "react";
import { Sheet, SheetDone } from "@/components/tl/Sheet";
import { chip, fieldControl, fieldLabel, ghostButton, primaryButton } from "@/components/tl/styles";
import { useAuthContext } from "@/contexts/AuthContext";
import { SUPPORT_AREA_OPTIONS, useSupportTicket } from "@/hooks/account/useAccount";
import { messageForError } from "@/lib/errorMessages";
import type { SupportArea } from "@/types/learner";
import { useRovingGroup } from "./roving";
import type { SettingsSheetProps } from "./sheetKeys";

/** The shortest description the API accepts (§35). */
export const REPORT_MIN = 10;
/** The longest description the API accepts (§35). */
export const REPORT_MAX = 2000;

const AREA_VALUES: readonly SupportArea[] = SUPPORT_AREA_OPTIONS.map((option) => option.value);
const FORM_ID = "report-problem-form";

/**
 * Sends a problem report to Talim support (§35, not the school): where it
 * happened as a radio group of chips, what went wrong (10–2000 characters,
 * with a counter), then the done state with the ticket's reference.
 *
 * @param props - See {@link SettingsSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @returns The sheet.
 */
export function ReportSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { user } = useAuthContext();
  const ticket = useSupportTicket();
  const [area, setArea] = useState<SupportArea>(AREA_VALUES[0]);
  const [text, setText] = useState("");
  const areaHeadingId = useId();
  const textId = useId();
  const countId = useId();
  const chipProps = useRovingGroup(AREA_VALUES, area, setArea);

  const email = user?.email || "your email address";
  const length = text.trim().length;
  const valid = length >= REPORT_MIN && length <= REPORT_MAX;
  const done = ticket.isSuccess;

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setArea(AREA_VALUES[0]);
      setText("");
      ticket.reset();
    }
    onOpenChange(value);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || ticket.isPending) return;
    ticket.mutate({ area, description: text });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
      eyebrowText="Report a problem"
      title="Tell Talim what is not working"
      subtitle="This goes to the Talim support team, not your school."
      footer={
        done ? (
          <button type="button" className={`${primaryButton} ml-auto`} onClick={() => handleOpenChange(false)}>
            Done
          </button>
        ) : (
          <>
            <button type="button" className={ghostButton} onClick={() => handleOpenChange(false)}>
              Cancel
            </button>
            <button type="submit" form={FORM_ID} className={`${primaryButton} ml-auto`} disabled={!valid || ticket.isPending}>
              {ticket.isPending ? "Sending…" : "Send to Talim support"}
            </button>
          </>
        )
      }
    >
      {done ? (
        <SheetDone
          title="Report sent"
          note={`Talim support will reply to ${email} within one working day.`}
          reference={ticket.data?.reference ?? null}
        />
      ) : (
        <form id={FORM_ID} onSubmit={submit} className="flex flex-col gap-[18px]" noValidate>
          <div>
            <p id={areaHeadingId} className="mb-2.5 text-[13px] font-extrabold text-tl-muted">
              Where did it happen?
            </p>
            <div role="radiogroup" aria-labelledby={areaHeadingId} className="flex flex-wrap gap-[9px]">
              {SUPPORT_AREA_OPTIONS.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={area === option.value}
                  onClick={() => setArea(option.value)}
                  {...chipProps(option.value, index)}
                  className={chip(area === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor={textId} className={`${fieldLabel} mb-[7px] block`}>
              What went wrong
            </label>
            <textarea
              id={textId}
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={REPORT_MAX}
              placeholder="e.g. My Biology results show a blank total."
              aria-describedby={countId}
              className={`${fieldControl} min-h-[120px] resize-y py-3 text-sm font-semibold leading-relaxed`}
            />
            <p id={countId} className="mt-1.5 flex justify-between gap-3 text-[13px] text-tl-muted">
              <span>{length < REPORT_MIN ? `At least ${REPORT_MIN} characters.` : null}</span>
              <span className="ml-auto">
                {text.length} / {REPORT_MAX}
              </span>
            </p>
          </div>
          <p className="text-[13px] leading-[1.6] text-tl-muted">We reply to {email}. Your school can&apos;t see this report.</p>
          {ticket.error ? (
            <p role="alert" className="rounded-[14px] bg-tl-danger-bg px-4 py-3 text-sm font-semibold text-tl-danger">
              {messageForError(ticket.error, "We couldn't send your report. Please try again.")}
            </p>
          ) : null}
        </form>
      )}
    </Sheet>
  );
}
