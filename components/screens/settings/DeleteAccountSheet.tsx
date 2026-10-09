"use client";

import React, { useEffect, useId, useState, type FormEvent } from "react";
import { Sheet } from "@/components/tl/Sheet";
import { dangerButton, dangerGhostButton, fieldControl, fieldLabel, ghostButton, textLink } from "@/components/tl/styles";
import { useRequestAccountDeletion } from "@/hooks/account/useAccount";
import { DELETION_REASON_MAX, deletionErrorMessage } from "@/lib/auth/accountDeletion";
import { DELETE_ACCOUNT_INFO_URL } from "@/lib/appInfo";
import { PasswordField } from "./PasswordSheet";
import type { SettingsSheetProps } from "./sheetKeys";

const FORM_ID = "delete-account-form";

/** What deleting does, in the danger zone and in the sheet. */
const DELETION_SUMMARY =
  "Your account will be deleted in 30 days, and signing in before then cancels it. After that your name, email, phone number and photo are erased. Your school keeps your grades, attendance and payments, with your details removed.";

/**
 * Settings → Security → Danger zone: what deleting the account does, a link
 * to the full explanation on www.mytalim.com, and "Delete account", which
 * opens {@link DeleteAccountSheet}.
 *
 * @param props - The zone.
 * @param props.onDelete - Opens the delete sheet.
 * @returns The section.
 */
export function DangerZone({ onDelete }: { onDelete: () => void }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="mt-7 rounded-[18px] border border-tl-danger/30 p-5">
      <h3 id={headingId} className="text-xs font-extrabold uppercase tracking-[0.07em] text-tl-danger">
        Danger zone
      </h3>
      <p className="mt-2 text-[15px] font-bold text-tl-ink">Delete account</p>
      <p className="mt-1 text-sm leading-[1.6] text-tl-muted">{DELETION_SUMMARY}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <a href={DELETE_ACCOUNT_INFO_URL} target="_blank" rel="noopener noreferrer" className={`${textLink} whitespace-normal`}>
          What happens when you delete your account
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <button type="button" className={dangerGhostButton} onClick={onDelete}>
          Delete account
        </button>
      </div>
    </section>
  );
}

/**
 * The Delete account confirmation: the password (with the show button, like
 * Change password), an optional reason and an "I understand" box. Delete
 * stays disabled until the box is ticked and a password is typed. A wrong
 * password shows on the field; any other refusal shows in a banner. On
 * success `useRequestAccountDeletion` signs out and lands on sign-in with
 * the date. The sheet (Radix) supplies the labelled heading, focus trap and
 * Escape.
 *
 * @param props - See {@link SettingsSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @returns The sheet.
 */
export function DeleteAccountSheet({ open, onOpenChange }: SettingsSheetProps) {
  const request = useRequestAccountDeletion();
  const { reset } = request;
  const reasonId = useId();
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setReason("");
    setUnderstood(false);
    setFieldError(null);
    setBannerError(null);
    reset();
  }, [open, reset]);

  const busy = request.isPending;
  const ready = understood && password.length > 0 && !busy;

  /**
   * Sends the request, or shows why it was refused.
   *
   * @param event - The form submit.
   */
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setFieldError(null);
    setBannerError(null);
    const trimmed = reason.trim();
    request.mutate(
      { password, ...(trimmed ? { reason: trimmed } : {}) },
      {
        onError: (error) => {
          const { field, banner } = deletionErrorMessage(error);
          setFieldError(field);
          setBannerError(banner);
        },
      }
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => !busy && onOpenChange(value)}
      eyebrowText="Danger zone"
      title="Delete your account?"
      footer={
        <>
          <button type="button" className={ghostButton} onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </button>
          <button type="submit" form={FORM_ID} className={`${dangerButton} ml-auto`} disabled={!ready}>
            {busy ? "Deleting…" : "Delete account"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} className="flex flex-col gap-[18px]" noValidate>
        <p className="text-sm leading-[1.7] text-tl-body">You&apos;ll be signed out on every device now. {DELETION_SUMMARY}</p>
        {bannerError ? (
          <p role="alert" className="rounded-[14px] bg-tl-danger-bg px-4 py-3 text-sm font-semibold text-tl-danger">
            {bannerError}
          </p>
        ) : null}
        <PasswordField
          label="Password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFieldError(null);
          }}
          autoComplete="current-password"
          error={fieldError}
          disabled={busy}
        />
        <div>
          <label htmlFor={reasonId} className={`${fieldLabel} mb-[7px] block`}>
            Why are you leaving? (optional)
          </label>
          <textarea
            id={reasonId}
            value={reason}
            maxLength={DELETION_REASON_MAX}
            disabled={busy}
            onChange={(event) => setReason(event.target.value)}
            className={`${fieldControl} min-h-[88px] resize-y py-3 text-sm leading-[1.6]`}
          />
        </div>
        <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm leading-[1.6] text-tl-body">
          <input
            type="checkbox"
            checked={understood}
            disabled={busy}
            onChange={(event) => setUnderstood(event.target.checked)}
            className="mt-[3px] h-5 w-5 shrink-0 accent-tl-danger"
          />
          <span>I understand my account will be deleted in 30 days unless I sign in before then.</span>
        </label>
      </form>
    </Sheet>
  );
}
