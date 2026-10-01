import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

/** Props for {@link SignInPrimaryButton}. */
export interface SignInPrimaryButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  /** The action is under way: the button shows a spinner and {@link SignInPrimaryButtonProps.loadingText}, and is disabled. */
  loading?: boolean;
  /** What the button says while loading ("Signing in…"). */
  loadingText?: ReactNode;
  /** The button's words ("Sign in"). */
  children: ReactNode;
}

/**
 * The full-width navy button of the sign-in look, 44px tall. It submits by
 * default and is disabled while `loading` (or when `disabled` is passed).
 *
 * @param props - See {@link SignInPrimaryButtonProps}; the rest go to the `<button>`.
 * @param props.loading - Show the spinner and the loading text.
 * @param props.loadingText - The words while loading.
 * @param props.children - The words otherwise.
 * @returns The button.
 */
export function SignInPrimaryButton({ loading = false, loadingText, children, type = "submit", disabled, ...button }: SignInPrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      {...button}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#003366] text-sm font-semibold text-white transition-colors hover:bg-[#002244] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
