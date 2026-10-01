/**
 * Class strings of the Talim sign-in look (the two-panel screen with the tree
 * logo and the app-name pill). Plain Tailwind 3 utilities only, with `dark:`
 * variants for a `darkMode: "class"` setup, so the file can be copied as is
 * into Talim-students-web (Next.js) and talim-parents (Vite + React).
 * See docs/signin-ui.md.
 */

/** A field's label: small, medium weight, near-black (near-white in dark mode). */
export const signInLabelClass = "block text-sm font-medium text-[#030E18] dark:text-slate-100";

/** A text link on the sign-in screen ("Forgot password?"), with a 44px tall hit area. */
export const signInLinkClass = "inline-flex min-h-[44px] items-center text-sm text-[#003366] hover:underline dark:text-blue-300";

/** A link inside a line of small print (the footer's support address). */
export const signInInlineLinkClass = "text-[#003366] hover:underline dark:text-blue-300";

/**
 * The class string of a text input on the sign-in look: 44px tall, the pale
 * grey fill, a navy focus ring, and a red border once the value is invalid.
 *
 * @param invalid - Whether the field currently has an error.
 * @returns The class string for the `<input>`.
 */
export function signInInputClass(invalid = false): string {
  const base =
    "h-11 w-full rounded-lg border bg-[#F9FAFB] px-3 text-sm text-gray-900 placeholder-gray-400 transition-all " +
    "focus:outline-none focus:ring-2 focus:ring-[#003366]/30 disabled:opacity-60 " +
    "dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:ring-blue-400/30";
  const border = invalid
    ? "border-red-400 focus:border-red-500 dark:border-red-500"
    : "border-[#E5E7EB] focus:border-[#003366] dark:border-slate-700 dark:focus:border-blue-400";
  return `${base} ${border}`;
}

/**
 * The `aria-describedby` value of a field: its error first, then its hint,
 * then any other describing ids (a rules list, a banner).
 *
 * @param id - The input's id; the error is `${id}-error`, the hint `${id}-hint`.
 * @param parts - Which descriptions are on screen.
 * @param parts.hint - A hint is shown under the field.
 * @param parts.error - An error is shown under the field.
 * @param parts.extra - Other ids that describe the field.
 * @returns The ids, space separated, or undefined when there are none.
 */
export function signInDescribedBy(id: string, { hint = false, error = false, extra = [] }: { hint?: boolean; error?: boolean; extra?: string[] }): string | undefined {
  const ids = [error ? `${id}-error` : null, hint ? `${id}-hint` : null, ...extra].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}
