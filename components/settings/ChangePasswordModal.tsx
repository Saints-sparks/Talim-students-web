"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { settingsService } from "@/services/settings.service";
import { checkPassword, firstPasswordProblem } from "@/lib/passwordPolicy";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-500";

/**
 * One password field with a show/hide control.
 *
 * @param props - Component props.
 * @param props.label - Field label.
 * @param props.value - Current value.
 * @param props.onChange - Called with the new value.
 * @param props.autoComplete - Browser autofill hint.
 * @returns The field element.
 */
function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className={INPUT_CLASS}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          autoComplete={autoComplete}
        />
        <button
          type="button"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

/**
 * The change-password dialog.
 *
 * Posts to `/auth/change-password`, which every role may call — the
 * `/settings/security/change-password` alias this used to call is gated to
 * school admins and answers 403 for a student. The API requires
 * `confirmPassword` alongside the other two and revokes other sessions, so the
 * fresh token it returns replaces the current one.
 *
 * @param props - Component props.
 * @param props.onClose - Closes the dialog.
 * @returns The dialog element.
 */
export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { accessToken, setAuthState, user } = useAuthContext();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // D6: a modal must not leave the page scrolling behind it, and must restore
  // whatever overflow the page had when it closes.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(closeTimer.current);
    };
  }, [onClose]);

  const rules = checkPassword(newPwd);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (newPwd !== confirmPwd) {
      setError("New passwords do not match.");
      return;
    }
    const problem = firstPasswordProblem(newPwd);
    if (problem) {
      setError(problem);
      return;
    }

    setLoading(true);
    try {
      const result = await settingsService.changePassword({
        currentPassword: currentPwd,
        newPassword: newPwd,
        confirmPassword: confirmPwd,
      });
      // Every other session is signed out, so adopt the new token immediately.
      if (result?.access_token) {
        localStorage.setItem("accessToken", result.access_token);
        setAuthState(user, result.access_token);
      }
      setSuccess(true);
      closeTimer.current = setTimeout(onClose, 1500);
    } catch (err) {
      logger.error("settings", "Password change failed", err);
      setError(messageForError(err, "Failed to change password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Change password"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">Change Password</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Password changed successfully</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Your other devices have been signed out.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField
              label="Current password"
              value={currentPwd}
              onChange={setCurrentPwd}
              autoComplete="current-password"
            />
            <PasswordField label="New password" value={newPwd} onChange={setNewPwd} autoComplete="new-password" />

            {newPwd ? (
              <ul className="space-y-1">
                {rules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      rule.passed ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-slate-400"
                    }`}
                  >
                    <Check className={`h-3 w-3 ${rule.passed ? "opacity-100" : "opacity-30"}`} />
                    {rule.label}
                  </li>
                ))}
              </ul>
            ) : null}

            <PasswordField
              label="Confirm new password"
              value={confirmPwd}
              onChange={setConfirmPwd}
              autoComplete="new-password"
            />

            {error && (
              <p role="alert" className="text-xs text-red-500 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !accessToken}
                className="flex-1 rounded-lg bg-[#003366] py-2 text-sm font-semibold text-white hover:bg-[#002244] disabled:opacity-60 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
