import React, { type ReactNode } from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

/**
 * The colour of a {@link SignInErrorBanner}:
 * - `danger`: red, for a refused account ("Access denied") or a failed save;
 * - `warning`: amber, for a wrong email, staff number or password;
 * - `neutral`: grey, for anything else (the server's own message).
 */
export type SignInErrorTone = "danger" | "warning" | "neutral";

const BOX: Record<SignInErrorTone, string> = {
  danger: "border-red-100 bg-red-50 dark:border-red-900/60 dark:bg-red-950/40",
  warning: "border-amber-100 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40",
  neutral: "border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/60",
};

const ICON: Record<SignInErrorTone, string> = {
  danger: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  neutral: "text-gray-500 dark:text-slate-400",
};

const TEXT: Record<SignInErrorTone, string> = {
  danger: "text-red-700 dark:text-red-300",
  warning: "text-amber-700 dark:text-amber-300",
  neutral: "text-gray-600 dark:text-slate-300",
};

/** Props for {@link SignInErrorBanner}. */
export interface SignInErrorBannerProps {
  /** The colour; see {@link SignInErrorTone}. */
  tone: SignInErrorTone;
  /** A bold first line ("Access denied"); the message is then set smaller under it. */
  title?: ReactNode;
  /** The explanation. */
  children: ReactNode;
  /** The shield icon (a refused account) instead of the circle. */
  icon?: "alert" | "shield";
  /** An id, so a field can name the banner in its `aria-describedby`. */
  id?: string;
  /** Classes for spacing (the sign-in page uses `mt-6`). */
  className?: string;
}

/**
 * The rounded banner above a sign-in form for a failure that is not one
 * field's: a refused account, wrong credentials, a server error. It has
 * `role="alert"`, so it is read out as soon as it appears.
 *
 * @param props - See {@link SignInErrorBannerProps}.
 * @param props.tone - The colour.
 * @param props.title - The bold first line.
 * @param props.children - The explanation.
 * @param props.icon - Which icon to draw.
 * @param props.id - The banner's id.
 * @param props.className - Spacing classes.
 * @returns The banner.
 */
export function SignInErrorBanner({ tone, title, children, icon = "alert", id, className = "" }: SignInErrorBannerProps) {
  const Icon = icon === "shield" ? ShieldAlert : AlertCircle;
  return (
    <div id={id} role="alert" className={`rounded-xl border p-4 ${BOX[tone]} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${ICON[tone]}`} aria-hidden />
        {title ? (
          <div>
            <p className={`text-sm font-semibold ${TEXT[tone]}`}>{title}</p>
            <div className={`mt-1 text-xs leading-relaxed ${TEXT[tone]}`}>{children}</div>
          </div>
        ) : (
          <div className={`text-sm ${TEXT[tone]}`}>{children}</div>
        )}
      </div>
    </div>
  );
}
