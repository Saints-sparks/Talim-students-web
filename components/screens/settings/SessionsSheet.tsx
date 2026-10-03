"use client";

import React, { useMemo, useState } from "react";
import { Sheet, SheetRow } from "@/components/tl/Sheet";
import { ghostButton, pill, pillTone, primaryButton, rowButton } from "@/components/tl/styles";
import { useSessions } from "@/hooks/account/useAccount";
import { relativeWhen } from "@/lib/learner/format";
import { messageForError } from "@/lib/errorMessages";
import type { AuthSession } from "@/types/learner";
import type { SettingsSheetProps } from "./sheetKeys";

/**
 * "Chrome on macOS", from what the API could read of the browser.
 *
 * @param session - One session.
 * @returns The row's bold line.
 */
export function sessionTitle(session: AuthSession): string {
  if (session.browser && session.os) return `${session.browser} on ${session.os}`;
  return session.browser || session.os || session.device || "Unknown device";
}

/**
 * "Mac · Last active today · 102.89.1.10", leaving out what the API did not send.
 *
 * @param session - One session.
 * @param now - The reference time (the clock by default).
 * @returns The row's grey line.
 */
export function sessionDetail(session: AuthSession, now: Date = new Date()): string {
  const when = relativeWhen(session.lastUsedAt, now);
  const active = when ? `Last active ${when === "Today" || when === "Yesterday" ? when.toLowerCase() : when}` : "";
  return [session.device, active, session.ip].filter(Boolean).join(" · ");
}

/**
 * Where the account is signed in (§34): one row per session, this browser
 * marked "This device", "Sign out" on each other one, and "Sign out of all
 * other devices" behind an inline confirmation.
 *
 * @param props - See {@link SettingsSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @returns The sheet.
 */
export function SessionsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { data, isLoading, error, refetch, revokeOne, revokeOthers } = useSessions(open);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // This browser first, then the most recently used.
  const sessions = useMemo(
    () => [...(data ?? [])].sort((a, b) => Number(b.current) - Number(a.current) || b.lastUsedAt.localeCompare(a.lastUsedAt)),
    [data]
  );
  const others = sessions.filter((session) => !session.current).length;
  const pendingId = revokeOne.isPending ? revokeOne.variables : null;
  const actionError = revokeOne.error ?? revokeOthers.error;

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setConfirming(false);
      setNotice(null);
      revokeOne.reset();
      revokeOthers.reset();
    }
    onOpenChange(value);
  };

  const signOutOne = (session: AuthSession) => {
    setNotice(null);
    revokeOne.mutate(session.id, { onSuccess: () => setNotice(`Signed out of ${sessionTitle(session)}.`) });
  };

  const signOutOthers = () => {
    setNotice(null);
    revokeOthers.mutate(undefined, {
      onSuccess: (result) => {
        setConfirming(false);
        const count = result?.revoked ?? others;
        setNotice(`Signed out of ${count} other device${count === 1 ? "" : "s"}.`);
      },
    });
  };

  let body: React.ReactNode;
  if (isLoading) {
    body = (
      <p role="status" className="text-sm text-tl-muted">
        Loading where you&apos;re signed in…
      </p>
    );
  } else if (error && !data) {
    body = (
      <div role="alert" className="flex flex-wrap items-center gap-3 rounded-[14px] bg-tl-danger-bg px-4 py-3">
        <p className="min-w-[180px] flex-1 text-sm font-semibold text-tl-danger">{error}</p>
        <button type="button" className={rowButton} onClick={refetch}>
          Try again
        </button>
      </div>
    );
  } else if (!sessions.length) {
    body = <p className="text-sm text-tl-muted">You&apos;re not signed in anywhere else.</p>;
  } else {
    body = (
      <>
        <ul className="flex flex-col gap-2.5" aria-label="Signed-in devices">
          {sessions.map((session) => (
            <li key={session.id}>
              <SheetRow
                label={sessionTitle(session)}
                description={sessionDetail(session)}
                action={
                  session.current ? (
                    <span className={`${pill} ${pillTone.success}`}>This device</span>
                  ) : (
                    <button
                      type="button"
                      className={rowButton}
                      onClick={() => signOutOne(session)}
                      disabled={pendingId === session.id || revokeOthers.isPending}
                      aria-label={`Sign out of ${sessionTitle(session)}`}
                    >
                      {pendingId === session.id ? "Signing out…" : "Sign out"}
                    </button>
                  )
                }
              />
            </li>
          ))}
        </ul>
        {others === 0 ? <p className="text-sm text-tl-muted">You&apos;re only signed in on this device.</p> : null}
      </>
    );
  }

  const confirmBlock =
    confirming && others > 0 ? (
      <div className="rounded-2xl border border-tl-line-soft bg-tl-subtle p-4">
        <p className="text-sm font-bold text-tl-ink">
          Sign out of {others} other device{others === 1 ? "" : "s"}? You&apos;ll stay signed in here.
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <button type="button" className={primaryButton} onClick={signOutOthers} disabled={revokeOthers.isPending}>
            {revokeOthers.isPending ? "Signing out…" : "Yes, sign them out"}
          </button>
          <button type="button" className={ghostButton} onClick={() => setConfirming(false)} disabled={revokeOthers.isPending}>
            Keep them
          </button>
        </div>
      </div>
    ) : null;

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
      eyebrowText="Security"
      title="Active sessions"
      subtitle="Where your Talim account is signed in. Sign out of anything you don't recognise, then change your password."
      footer={
        <>
          {others > 0 && !confirming ? (
            <button type="button" className={ghostButton} onClick={() => setConfirming(true)}>
              Sign out of all other devices
            </button>
          ) : null}
          <button type="button" className={`${primaryButton} ml-auto`} onClick={() => handleOpenChange(false)}>
            Done
          </button>
        </>
      }
    >
      {body}
      {confirmBlock}
      {actionError ? (
        <p role="alert" className="rounded-[14px] bg-tl-danger-bg px-4 py-3 text-sm font-semibold text-tl-danger">
          {messageForError(actionError, "We couldn't sign that device out. Please try again.")}
        </p>
      ) : null}
      <p role="status" aria-live="polite" className="text-sm font-semibold text-tl-success empty:hidden">
        {notice}
      </p>
    </Sheet>
  );
}
