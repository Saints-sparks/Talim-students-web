import React, { type ReactNode } from "react";

/** Props for {@link SignInLogoHeader}. */
export interface SignInLogoHeaderProps {
  /**
   * The tree mark, 40px square: a Next `<Image>` or a plain `<img>`. Give it
   * `alt=""`, since the brand name is written next to it.
   */
  logo: ReactNode;
  /** The word in the pill: "Teachers", "Students" or "Parents". */
  appName: string;
  /** The brand name next to the logo. Defaults to "Talim". */
  brand?: string;
  /** Spacing under the row. Defaults to `mb-8`. */
  className?: string;
}

/**
 * The logo row of the sign-in look: the tree mark, "Talim" in bold and the
 * app's name in a pale blue pill.
 *
 * @param props - See {@link SignInLogoHeaderProps}.
 * @param props.logo - The tree mark.
 * @param props.appName - The pill's word.
 * @param props.brand - The brand name.
 * @param props.className - Spacing under the row.
 * @returns The logo row.
 */
export function SignInLogoHeader({ logo, appName, brand = "Talim", className = "mb-8" }: SignInLogoHeaderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logo}
      <span className="text-xl font-bold text-[#030E18] dark:text-slate-100">{brand}</span>
      <span className="ml-0.5 rounded-full bg-[#EAF2FB] px-2.5 py-0.5 text-xs font-semibold text-[#003366] dark:bg-[#1a2740] dark:text-blue-300">
        {appName}
      </span>
    </div>
  );
}

/** Props for {@link SignInHeading}. */
export interface SignInHeadingProps {
  /** The page's one `h1` ("Welcome back"). */
  title: ReactNode;
  /** The grey line under it. */
  subtitle?: ReactNode;
}

/**
 * The heading of the sign-in look: a bold `h1` and a grey line under it.
 *
 * @param props - See {@link SignInHeadingProps}.
 * @param props.title - The heading.
 * @param props.subtitle - The line under it.
 * @returns The heading block.
 */
export function SignInHeading({ title, subtitle }: SignInHeadingProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-[#030E18] dark:text-slate-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-[#6F6F6F] dark:text-slate-400">{subtitle}</p> : null}
    </>
  );
}
