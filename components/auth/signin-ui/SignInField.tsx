"use client";

import React, { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInDescribedBy, signInInputClass, signInLabelClass } from "./classes";

/** Props for {@link SignInField}. */
export interface SignInFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  /** The input's id. The label, hint (`${id}-hint`) and error (`${id}-error`) are tied to it. */
  id: string;
  /** The visible label. */
  label: ReactNode;
  /** A line under the input that stays (a format example). */
  hint?: ReactNode;
  /** What is wrong with the value, in red under the input and read out with the field. */
  error?: ReactNode | null;
  /** Mark the input invalid without an error of its own (a banner explains it). */
  invalid?: boolean;
  /** Other ids that describe the input (a banner, a rules list), added to `aria-describedby`. */
  describedBy?: string[];
  /** Content under the error and hint (a password rules checklist). */
  after?: ReactNode;
  /** Classes for the field's wrapper (spacing). */
  className?: string;
}

/**
 * The label, error, hint and extra content around an input. Internal to the
 * fields below.
 *
 * @param props - The parts of the field.
 * @param props.id - The input's id.
 * @param props.label - The visible label.
 * @param props.hint - The lasting hint.
 * @param props.error - The error, when there is one.
 * @param props.after - Content under the error and hint.
 * @param props.className - Classes for the wrapper.
 * @param props.children - The input.
 * @returns The labelled field.
 */
function FieldFrame({
  id,
  label,
  hint,
  error,
  after,
  className,
  children,
}: Pick<SignInFieldProps, "id" | "label" | "hint" | "error" | "after" | "className"> & { children: ReactNode }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label htmlFor={id} className={signInLabelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-[#6F6F6F] dark:text-slate-400">
          {hint}
        </p>
      ) : null}
      {after}
    </div>
  );
}

/**
 * A labelled text input of the sign-in look. The error and hint are named in
 * the input's `aria-describedby`, and `aria-invalid` is set while there is an
 * error (or `invalid` is true). Every other prop goes to the `<input>`.
 *
 * @param props - See {@link SignInFieldProps}.
 * @param ref - Forwarded to the input, for focusing it on an error.
 * @returns The field.
 */
export const SignInField = forwardRef<HTMLInputElement, SignInFieldProps>(function SignInField(
  { id, label, hint, error, invalid = false, describedBy = [], after, className, type = "text", ...input },
  ref,
) {
  const isInvalid = Boolean(error) || invalid;
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} after={after} className={className}>
      <input
        ref={ref}
        id={id}
        type={type}
        {...input}
        aria-invalid={isInvalid || undefined}
        aria-describedby={signInDescribedBy(id, { hint: Boolean(hint), error: Boolean(error), extra: describedBy })}
        className={signInInputClass(isInvalid)}
      />
    </FieldFrame>
  );
});

/** Props for {@link SignInPasswordField}. */
export interface SignInPasswordFieldProps extends Omit<SignInFieldProps, "type"> {
  /** The password is shown as text. Leave it out to let the field keep its own state. */
  visible?: boolean;
  /** Flips {@link SignInPasswordFieldProps.visible} when the field is controlled. */
  onToggleVisible?: () => void;
  /** The toggle's accessible names while hidden and while shown. */
  toggleLabels?: readonly [show: string, hide: string];
  /** Leave the toggle out (a second field that follows the first one's toggle). */
  hideToggle?: boolean;
}

/**
 * A labelled password input of the sign-in look with an eye button inside its
 * right edge. The button is `type="button"` (it never submits), has a 44px
 * hit area, and is named "Show password" / "Hide password" by default.
 *
 * @param props - See {@link SignInPasswordFieldProps}; the rest go to the input.
 * @param ref - Forwarded to the input, for focusing it on an error.
 * @returns The field.
 */
export const SignInPasswordField = forwardRef<HTMLInputElement, SignInPasswordFieldProps>(function SignInPasswordField(
  {
    id,
    label,
    hint,
    error,
    invalid = false,
    describedBy = [],
    after,
    className,
    visible,
    onToggleVisible,
    toggleLabels = ["Show password", "Hide password"],
    hideToggle = false,
    ...input
  },
  ref,
) {
  const [ownVisible, setOwnVisible] = useState(false);
  const shown = visible ?? ownVisible;
  const toggle = onToggleVisible ?? (() => setOwnVisible((v) => !v));
  const isInvalid = Boolean(error) || invalid;
  const toggleLabel = shown ? toggleLabels[1] : toggleLabels[0];

  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} after={after} className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={shown ? "text" : "password"}
          {...input}
          aria-invalid={isInvalid || undefined}
          aria-describedby={signInDescribedBy(id, { hint: Boolean(hint), error: Boolean(error), extra: describedBy })}
          className={`${signInInputClass(isInvalid)} ${hideToggle ? "" : "pr-11"}`}
        />
        {hideToggle ? null : (
          <button
            type="button"
            onClick={toggle}
            aria-label={toggleLabel}
            aria-controls={id}
            title={toggleLabel}
            className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366]/40 dark:text-slate-400 dark:hover:text-slate-200 dark:focus-visible:ring-blue-400/40"
          >
            {shown ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        )}
      </div>
    </FieldFrame>
  );
});

/** Props for {@link SignInCheckbox}. */
export interface SignInCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  /** The words next to the box ("Keep me signed in"). */
  label: ReactNode;
}

/**
 * A small checkbox with its label ("Keep me signed in"). The whole label is
 * the target, 44px tall.
 *
 * @param props - See {@link SignInCheckboxProps}; the rest go to the input.
 * @param props.label - The words next to the box.
 * @returns The labelled checkbox.
 */
export function SignInCheckbox({ label, ...input }: SignInCheckboxProps) {
  return (
    <label className="flex min-h-[44px] cursor-pointer select-none items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
      <input type="checkbox" {...input} className="h-4 w-4 rounded border-gray-300 accent-[#003366] dark:accent-blue-500" />
      {label}
    </label>
  );
}

/**
 * The row under the password with "Keep me signed in" on the left and
 * "Forgot password?" on the right. Its children are 44px tall targets; the
 * row is pulled in by 12px above and below so it keeps the compact spacing.
 *
 * @param props - The row's content.
 * @param props.children - Usually a {@link SignInCheckbox} and a link with `signInLinkClass`.
 * @returns The row.
 */
export function SignInOptionsRow({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="-my-3 flex flex-wrap items-center justify-between gap-x-4">{children}</div>
    </div>
  );
}
