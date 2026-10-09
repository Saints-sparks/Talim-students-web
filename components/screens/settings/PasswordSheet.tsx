"use client";

import React, { useId, useMemo, useState } from "react";
import { Check, Circle, Eye, EyeOff } from "lucide-react";
import { Sheet, SheetDone } from "@/components/tl/Sheet";
import { fieldControl, fieldLabel, focusRing, ghostButton, primaryButton } from "@/components/tl/styles";
import { useChangePassword, usePasswordPolicy } from "@/hooks/account/useAccount";
import { rulesFromPolicy } from "@/lib/passwordPolicy";
import { messageForError } from "@/lib/errorMessages";
import type { SettingsSheetProps } from "./sheetKeys";

const FORM_ID = "change-password-form";

/** Props for {@link PasswordField}. */
export interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  describedBy?: string;
  /** A message about this field (a wrong password), shown under it and announced. */
  error?: string | null;
  /** True while the form is sending. */
  disabled?: boolean;
}

/**
 * One password input with its label and a 44px show/hide button (also the
 * Delete account sheet's).
 *
 * @param props - See {@link PasswordFieldProps}.
 * @param props.label - The visible label.
 * @param props.value - What is typed.
 * @param props.onChange - Called with the new text.
 * @param props.autoComplete - The password manager hint.
 * @param props.describedBy - The id of the checklist or note that describes it.
 * @param props.error - A message about this field, shown under it.
 * @param props.disabled - Disables the input while sending.
 * @returns The field.
 */
export function PasswordField({ label, value, onChange, autoComplete, describedBy, error, disabled }: PasswordFieldProps) {
  const id = useId();
  const errorId = useId();
  const [visible, setVisible] = useState(false);
  const described = [describedBy, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className={`${fieldLabel} mb-[7px] block`}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={described}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          className={`${fieldControl} min-h-[48px] pr-12 font-semibold`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          className={`absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[11px] text-tl-muted hover:text-tl-ink ${focusRing}`}
        >
          {visible ? <EyeOff aria-hidden className="h-[18px] w-[18px]" /> : <Eye aria-hidden className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-[13px] font-semibold text-tl-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The line under the fields: what still stands between the student and a
 * valid change (the design's notes).
 *
 * @param newPassword - The new password typed so far.
 * @param confirm - The confirmation typed so far.
 * @param rulesMet - Whether every rule passes.
 * @returns The sentence.
 */
export function passwordNote(newPassword: string, confirm: string, rulesMet: boolean): string {
  if (!newPassword) return "You will stay signed in on this device.";
  if (!rulesMet) return "Your new password needs everything on the list above.";
  if (newPassword !== confirm) return "The two new passwords do not match yet.";
  return "Looks good.";
}

/**
 * The change-password sheet: current, new and confirm fields, a live
 * checklist of the API's password rules (the built-in rules while they load
 * or if they fail), and Update, enabled once everything passes. The API signs
 * every other device out; this one stays signed in with the fresh token.
 *
 * @param props - See {@link SettingsSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @returns The sheet.
 */
export function PasswordSheet({ open, onOpenChange }: SettingsSheetProps) {
  const policy = usePasswordPolicy(open);
  const change = useChangePassword();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const checklistId = useId();
  const noteId = useId();

  const rules = useMemo(() => rulesFromPolicy(policy.data ?? null), [policy.data]);
  const results = useMemo(() => rules.map((rule) => ({ label: rule.label, passed: rule.test(next) })), [rules, next]);
  const rulesMet = results.every((rule) => rule.passed);
  const valid = current.length > 0 && rulesMet && next === confirm;
  const done = change.isSuccess;

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setCurrent("");
      setNext("");
      setConfirm("");
      change.reset();
    }
    onOpenChange(value);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || change.isPending) return;
    change.mutate({ currentPassword: current, newPassword: next, confirmPassword: confirm });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
      eyebrowText="Security"
      title="Change password"
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
            <button type="submit" form={FORM_ID} className={`${primaryButton} ml-auto`} disabled={!valid || change.isPending}>
              {change.isPending ? "Updating…" : "Update password"}
            </button>
          </>
        )
      }
    >
      {done ? (
        <SheetDone title="Password updated" note="Use your new password next time you sign in. Other devices have been signed out." />
      ) : (
        <form id={FORM_ID} onSubmit={submit} className="flex flex-col gap-[18px]" noValidate>
          <PasswordField label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" />
          <PasswordField label="New password" value={next} onChange={setNext} autoComplete="new-password" describedBy={checklistId} />
          <div>
            <p className="text-[13px] font-extrabold text-tl-muted">Your new password needs</p>
            <ul id={checklistId} aria-live="polite" className="mt-2 flex flex-col gap-1.5">
              {results.map((rule) => (
                <li key={rule.label} className={`flex items-center gap-2 text-[13px] ${rule.passed ? "font-bold text-tl-success" : "text-tl-muted"}`}>
                  {rule.passed ? <Check aria-hidden className="h-4 w-4 shrink-0" /> : <Circle aria-hidden className="h-4 w-4 shrink-0" />}
                  {rule.label}
                  <span className="sr-only">{rule.passed ? " (done)" : " (not yet)"}</span>
                </li>
              ))}
            </ul>
            {policy.error ? <p className="mt-2 text-[13px] text-tl-muted">We couldn&apos;t load your school&apos;s password rules, so the usual ones are shown.</p> : null}
          </div>
          <PasswordField label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" describedBy={noteId} />
          <p id={noteId} aria-live="polite" className="text-[13px] text-tl-muted">
            {passwordNote(next, confirm, rulesMet)}
          </p>
          {change.error ? (
            <p role="alert" className="rounded-[14px] bg-tl-danger-bg px-4 py-3 text-sm font-semibold text-tl-danger">
              {messageForError(change.error, "We couldn't change your password. Please try again.")}
            </p>
          ) : null}
        </form>
      )}
    </Sheet>
  );
}
