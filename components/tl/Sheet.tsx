"use client";

import React, { type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { eyebrow, focusRing } from "./styles";

/** Props for {@link Sheet}. */
export interface SheetProps {
  /** Whether the sheet is showing. */
  open: boolean;
  /** Called with `false` on Escape, the close button or a click outside. */
  onOpenChange: (open: boolean) => void;
  /** Small uppercase line above the title. */
  eyebrowText?: ReactNode;
  /** The sheet's heading (its accessible name). */
  title: ReactNode;
  /** One or two lines under the title; also the dialog's accessible description. */
  subtitle?: ReactNode;
  /** The body. */
  children?: ReactNode;
  /** Buttons along the bottom. */
  footer?: ReactNode;
  /** Widest the sheet gets on wide screens; the design's 560 by default. */
  maxWidthClass?: string;
}

/**
 * The redesign's sheet: a centred dialog (max 560px) on wider screens and a
 * bottom sheet on phones. Radix supplies the focus trap, Escape to close,
 * focus return to the opener and `aria-modal`; the first focusable control
 * inside receives focus when it opens.
 *
 * @param props - See {@link SheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @param props.eyebrowText - The line above the title.
 * @param props.title - The heading.
 * @param props.subtitle - The description.
 * @param props.children - The body.
 * @param props.footer - The buttons.
 * @param props.maxWidthClass - Width cap class.
 * @returns The dialog.
 */
export function Sheet({ open, onOpenChange, eyebrowText, title, subtitle, children, footer, maxWidthClass = "sm:max-w-[560px]" }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[rgba(15,27,46,0.45)] print:hidden" />
        <Dialog.Content
          {...(subtitle ? {} : { "aria-describedby": undefined })}
          className={`fixed inset-x-0 bottom-0 z-[81] max-h-[88vh] overflow-y-auto rounded-t-[24px] bg-tl-surface p-[clamp(22px,3vw,30px)] pb-[max(22px,env(safe-area-inset-bottom))] font-manrope text-tl-ink shadow-[0_30px_70px_-30px_rgba(15,27,46,0.45)] focus:outline-none sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[calc(100%-40px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[24px] dark:border dark:border-tl-line print:hidden ${maxWidthClass}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {eyebrowText ? <div className={eyebrow}>{eyebrowText}</div> : null}
              <Dialog.Title className="mt-1.5 text-[21px] font-extrabold leading-tight tracking-[-0.4px] text-tl-ink">{title}</Dialog.Title>
              {subtitle ? <Dialog.Description className="mt-1 text-[13px] leading-[1.55] text-tl-muted">{subtitle}</Dialog.Description> : null}
            </div>
            <Dialog.Close
              aria-label="Close"
              className={`-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-tl-faint hover:bg-tl-bg hover:text-tl-ink ${focusRing}`}
            >
              <X className="h-5 w-5" aria-hidden />
            </Dialog.Close>
          </div>
          {children ? <div className="mt-[18px] flex flex-col gap-[18px]">{children}</div> : null}
          {footer ? <div className="mt-[22px] flex flex-wrap gap-2.5">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Props for {@link SheetRow}. */
export interface SheetRowProps {
  /** The row's bold line. */
  label: ReactNode;
  /** The grey line under it. */
  description?: ReactNode;
  /** The action control (a button or link styled with `rowButton`). */
  action?: ReactNode;
}

/**
 * A bordered row with a label, a description and one action (the design's
 * `sheet.rows`).
 *
 * @param props - See {@link SheetRowProps}.
 * @param props.label - The bold line.
 * @param props.description - The grey line.
 * @param props.action - The control on the right.
 * @returns The row.
 */
export function SheetRow({ label, description, action }: SheetRowProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-tl-line-soft px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold text-tl-ink">{label}</div>
        {description ? <div className="mt-[3px] break-words text-[13px] text-tl-muted">{description}</div> : null}
      </div>
      {action}
    </div>
  );
}

/** Props for {@link SheetDone}. */
export interface SheetDoneProps {
  /** "Password updated". */
  title: ReactNode;
  /** The sentence under it. */
  note?: ReactNode;
  /** A reference to quote (a support ticket number). */
  reference?: string | null;
}

/**
 * The finished state of a sheet: a green tick, a title, a note and an
 * optional reference box. Announced politely to screen readers.
 *
 * @param props - See {@link SheetDoneProps}.
 * @param props.title - The heading.
 * @param props.note - The explanation.
 * @param props.reference - The reference, when there is one.
 * @returns The done block.
 */
export function SheetDone({ title, note, reference }: SheetDoneProps) {
  return (
    <div role="status" aria-live="polite">
      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-tl-success-bg text-tl-success">
        <Check className="h-7 w-7" aria-hidden />
      </div>
      <div className="mt-4 text-[19px] font-extrabold tracking-[-0.3px]">{title}</div>
      {note ? <div className="mt-1.5 text-sm leading-relaxed text-tl-muted">{note}</div> : null}
      {reference ? (
        <div className="mt-[18px] rounded-2xl border border-tl-line-soft bg-tl-subtle p-4">
          <div className={eyebrow}>Reference</div>
          <div className="mt-1 text-base font-extrabold">{reference}</div>
        </div>
      ) : null}
    </div>
  );
}
