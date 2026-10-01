/**
 * Shared class strings for the students redesign (the design's buttons, cards,
 * pills and form controls). Kept under `components/` so Tailwind's content
 * scan sees them. Colours come from the `tl-*` tokens in `app/globals.css`,
 * which switch with the dark theme, so nothing here needs a `dark:` variant.
 */

/** Keyboard focus ring for every interactive element. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tl-link focus-visible:ring-offset-2 focus-visible:ring-offset-tl-surface";

/** The navy primary button. */
export const primaryButton = `inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[13px] bg-tl-brand-fill px-[18px] py-3 text-[15px] font-bold text-tl-on-brand transition-colors hover:bg-tl-brand-fill-hover disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

/** The outlined secondary button. */
export const ghostButton = `inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[13px] border border-tl-control bg-tl-surface px-[18px] py-3 text-[15px] font-bold text-tl-brand transition-colors hover:bg-tl-bg disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

/** The smaller outlined action on list rows ("Download", "Go"). */
export const rowButton = `inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-[13px] border border-tl-control bg-tl-surface px-4 py-2.5 text-sm font-bold text-tl-brand transition-colors hover:bg-tl-bg disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

/** A text link with an arrow ("Full result sheet →"). */
export const textLink = `inline-flex min-h-[44px] items-center whitespace-nowrap rounded-md text-sm font-bold text-tl-link hover:underline ${focusRing}`;

/** The white card (radius 22, soft shadow). */
export const card =
  "rounded-[22px] border border-tl-line bg-tl-surface p-[clamp(18px,2.4vw,24px)] text-tl-ink shadow-[0_1px_2px_rgba(15,27,46,0.04),0_14px_30px_-22px_rgba(15,27,46,0.1)] dark:shadow-none";

/** The card's frame without padding, for rows that run edge to edge. */
export const cardFrame =
  "overflow-hidden rounded-[22px] border border-tl-line bg-tl-surface text-tl-ink shadow-[0_1px_2px_rgba(15,27,46,0.04),0_14px_30px_-22px_rgba(15,27,46,0.1)] dark:shadow-none";

/** The smaller stat card (radius 20, faint shadow). */
export const statCard =
  "rounded-[20px] border border-tl-line bg-tl-surface p-5 text-tl-ink shadow-[0_1px_2px_rgba(15,27,46,0.04)] dark:shadow-none";

/** The pale tile inside a card (glance tiles, score cards). */
export const tile = "rounded-2xl border border-tl-line-soft bg-tl-subtle p-4";

/** Page heading (clamp 24-32px, 800). */
export const pageTitle = "m-0 text-[clamp(24px,3.4vw,32px)] font-extrabold tracking-[-0.6px] text-tl-ink";

/** The grey line under a page heading. */
export const pageSubtitle = "mt-[5px] text-[15px] text-tl-muted";

/** Card heading (19px, 800). */
export const cardTitle = "text-[19px] font-extrabold tracking-[-0.3px] text-tl-ink";

/** Small uppercase label ("UP NEXT"). */
export const eyebrow = "text-xs font-extrabold uppercase tracking-[0.07em] text-tl-faint";

/** A rounded pill; add colour classes. */
export const pill = "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full px-[11px] py-1 text-[13px] font-extrabold";

/** Page padding and width inside the shell. */
export const pagePad = "w-full max-w-[1460px] px-[clamp(14px,3vw,26px)] pb-12 pt-[clamp(18px,3vw,28px)]";

/** A labelled form control (input, select) in a sheet or a toolbar. */
export const fieldControl = `min-h-[44px] w-full rounded-[13px] border border-tl-control bg-tl-surface px-3.5 text-[15px] text-tl-ink placeholder:text-tl-faint disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

/** The label above a {@link fieldControl}. */
export const fieldLabel = "text-xs font-extrabold uppercase tracking-[0.05em] text-tl-faint";

/** Colour classes for a {@link pill}, by meaning. */
export const pillTone = {
  success: "bg-tl-success-bg text-tl-success",
  warning: "bg-tl-warning-bg text-tl-warning",
  muted: "bg-tl-track text-tl-muted",
  danger: "bg-tl-danger-bg text-tl-danger",
  accent: "bg-tl-accent-bg text-tl-accent",
  info: "bg-tl-select text-tl-brand",
} as const;

/** A tone name of {@link pillTone}. */
export type PillTone = keyof typeof pillTone;

/**
 * A selectable filter chip (Updates filters, Files subjects).
 *
 * @param on - Whether it is the selected one.
 * @returns The class string.
 */
export function chip(on: boolean): string {
  return `inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-[15px] py-2 text-sm font-bold transition-colors ${focusRing} ${
    on ? "bg-tl-brand-fill text-tl-on-brand" : "border border-tl-line bg-tl-surface text-tl-muted hover:text-tl-ink"
  }`;
}

/**
 * One row of the sidebar (and the settings tabs): pale blue when active.
 *
 * @param active - Whether it is the current page.
 * @returns The class string.
 */
export function navItem(active: boolean): string {
  return `flex min-h-[44px] w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left text-[15px] transition-colors ${focusRing} ${
    active ? "bg-tl-select font-bold text-tl-brand" : "font-semibold text-tl-muted hover:bg-tl-bg hover:text-tl-ink"
  }`;
}
