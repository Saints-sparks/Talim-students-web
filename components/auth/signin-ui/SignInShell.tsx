import React, { type ReactNode } from "react";
import { signInInlineLinkClass } from "./classes";

/** Props for {@link SignInShell}. */
export interface SignInShellProps {
  /** The left column: logo header, heading, banner, form and footer. */
  children: ReactNode;
  /**
   * The illustration on the navy panel. It sits in a square, `relative` box,
   * so a Next `<Image fill className="object-contain" />` or a plain
   * `<img className="h-full w-full object-contain" />` both fit.
   */
  illustration: ReactNode;
  /** The bold line under the illustration ("Talim Teacher Portal"). */
  panelTitle: ReactNode;
  /** The sentence under {@link SignInShellProps.panelTitle}. */
  panelText: ReactNode;
}

/**
 * The layout of the Talim sign-in look: the white form column on the left
 * (the only column on phones and tablets) and, from `lg`, the navy brand panel
 * on the right with the illustration, a title, a line of text and three
 * decorative dots. It is the page's `main` landmark. Presentational only.
 *
 * @param props - See {@link SignInShellProps}.
 * @param props.children - The left column's content.
 * @param props.illustration - The picture on the navy panel.
 * @param props.panelTitle - The panel's title.
 * @param props.panelText - The panel's sentence.
 * @returns The full-screen layout.
 */
export function SignInShell({ children, illustration, panelTitle, panelText }: SignInShellProps) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center bg-white px-8 py-12 sm:px-16 dark:bg-slate-900">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      <div className="hidden flex-col items-center justify-center bg-[#003366] p-12 lg:flex">
        <div className="relative aspect-square w-full max-w-md opacity-90">{illustration}</div>
        <div className="mt-8 text-center">
          <p className="text-xl font-bold text-white">{panelTitle}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">{panelText}</p>
        </div>
        <div className="mt-10 flex gap-2" aria-hidden="true">
          <div className="h-2 w-8 rounded-full bg-white/60" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
        </div>
      </div>
    </main>
  );
}

/** Props for {@link SignInFooter}. */
export interface SignInFooterProps {
  /** The support address, shown as a `mailto:` link. */
  supportEmail: string;
  /** The name after the copyright sign. Defaults to "Talim". */
  brand?: string;
  /** The year after the name. Defaults to the current year. */
  year?: number;
}

/**
 * The small print under the form: "© Talim 2026 · support@…".
 *
 * @param props - See {@link SignInFooterProps}.
 * @param props.supportEmail - The support address.
 * @param props.brand - The name after the copyright sign.
 * @param props.year - The year shown.
 * @returns The footer line.
 */
export function SignInFooter({ supportEmail, brand = "Talim", year = new Date().getFullYear() }: SignInFooterProps) {
  return (
    <p className="mt-10 text-center text-xs text-gray-500 dark:text-slate-400">
      © {brand} {year} ·{" "}
      <a href={`mailto:${supportEmail}`} className={signInInlineLinkClass}>
        {supportEmail}
      </a>
    </p>
  );
}
