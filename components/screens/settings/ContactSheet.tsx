"use client";

import React from "react";
import { Sheet, SheetRow } from "@/components/tl/Sheet";
import { primaryButton, rowButton } from "@/components/tl/styles";
import { useSchoolContact } from "@/hooks/learner/queries";
import { SUPPORT_EMAIL } from "@/lib/appInfo";
import type { SchoolContact } from "@/types/learner";
import type { SettingsSheetProps } from "./sheetKeys";

/**
 * "08:00" → "8:00".
 *
 * @param time - A 24-hour `HH:mm` time.
 * @returns The time without a leading zero on the hour.
 */
function shortTime(time: string): string {
  return time.replace(/^0(\d)/, "$1");
}

/**
 * The line under the school's name: "The school office, Monday to Friday,
 * 8:00 – 16:00." when the school recorded its hours.
 *
 * @param contact - B12's answer.
 * @returns The sentence.
 */
export function officeHoursLine(contact: Pick<SchoolContact, "officeHours"> | null | undefined): string {
  const hours = contact?.officeHours;
  if (!hours?.start || !hours?.end) return "The school office.";
  return `The school office, Monday to Friday, ${shortTime(hours.start)} – ${shortTime(hours.end)}.`;
}

/**
 * A phone number as a `tel:` link target (digits and a leading plus only).
 *
 * @param phone - The number as the school wrote it.
 * @returns The `tel:` URL.
 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/**
 * Who to contact (B12 / §36): the school office (call, email, visit, each only
 * when the school recorded it) and the Talim support team, with a note on
 * which to use for what.
 *
 * @param props - See {@link SettingsSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @returns The sheet.
 */
export function ContactSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { data, isLoading, error, refetch } = useSchoolContact(open);

  let school: React.ReactNode = null;
  if (isLoading) {
    school = (
      <p role="status" className="text-sm text-tl-muted">
        Loading your school&apos;s contact details…
      </p>
    );
  } else if (error && !data) {
    school = (
      <div role="alert" className="flex flex-wrap items-center gap-3 rounded-[14px] bg-tl-danger-bg px-4 py-3">
        <p className="min-w-[180px] flex-1 text-sm font-semibold text-tl-danger">{error}</p>
        <button type="button" className={rowButton} onClick={refetch}>
          Try again
        </button>
      </div>
    );
  } else if (data) {
    const rows: React.ReactNode[] = [];
    if (data.phone) {
      rows.push(
        <SheetRow
          key="call"
          label="Call the office"
          description={data.phone}
          action={
            <a href={telHref(data.phone)} className={rowButton} aria-label="Call the school office">
              Call
            </a>
          }
        />
      );
    }
    if (data.email) {
      rows.push(
        <SheetRow
          key="email"
          label="Email the office"
          description={data.email}
          action={
            <a href={`mailto:${data.email}`} className={rowButton} aria-label="Email the school office">
              Email
            </a>
          }
        />
      );
    }
    if (data.address) {
      rows.push(
        <SheetRow
          key="visit"
          label="Visit"
          description={data.address}
          action={
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(data.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={rowButton}
              aria-label="Map of the school's address (opens in a new tab)"
            >
              Map
            </a>
          }
        />
      );
    }
    school = rows.length ? (
      <ul className="flex flex-col gap-2.5" aria-label="Your school office">
        {rows.map((row, index) => (
          <li key={index}>{row}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-tl-muted">Your school hasn&apos;t added its phone, email or address yet. Ask at the school office.</p>
    );
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      eyebrowText="Contact"
      title={data?.name || "Your school"}
      subtitle={officeHoursLine(data)}
      footer={
        <button type="button" className={`${primaryButton} ml-auto`} onClick={() => onOpenChange(false)}>
          Done
        </button>
      }
    >
      {school}
      <SheetRow
        label="Talim support team"
        description={SUPPORT_EMAIL}
        action={
          <a href={`mailto:${SUPPORT_EMAIL}`} className={rowButton} aria-label="Email Talim support">
            Email
          </a>
        }
      />
      <p className="rounded-[14px] border border-tl-line-soft bg-tl-subtle p-3.5 text-[13px] leading-[1.6] text-tl-muted">
        For timetable changes or class matters, contact your school office. For a fault in the portal itself, use Report a problem.
      </p>
    </Sheet>
  );
}
