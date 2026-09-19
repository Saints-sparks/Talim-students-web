"use client";

/**
 * Chat kit — the actions on one message: Reply, Copy text, Download and
 * Delete. Only the actions that apply are shown (no text → no Copy; no
 * `onDelete` → no Delete), and the menu renders nothing when none apply.
 *
 * - Belongs to one message: each bubble renders its own, keyed by nothing
 *   but its own state, so opening one can never open another. Opening a menu
 *   closes any other that is open.
 * - Reachable on touch: the trigger is always visible on devices without
 *   hover. On devices with hover it appears when the bubble is hovered, so
 *   the bubble (or a wrapper around it) needs the Tailwind `group` class.
 * - Delete asks for confirmation inside the menu.
 *
 * Position it from the parent with `className` (e.g. `absolute top-1 right-1`).
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Copy, CornerUpLeft, Download, Trash2 } from "lucide-react";
import { createActivePlayerController } from "./activePlayer";
import { copyText } from "./clipboard";

/** One menu open at a time, across every bubble. */
const openMenus = createActivePlayerController();

export interface MessageMenuProps {
  messageId: string;
  /** The message text; enables "Copy text". */
  text?: string;
  /** Attachments; enables "Download". */
  attachments?: Array<{ url: string; name?: string }>;
  /** Present = "Reply" is offered. */
  onReply?: () => void;
  /** Present = "Delete" is offered (only pass it when this user may delete). */
  onDelete?: () => Promise<void> | void;
  /** Feedback for the app's toast: "Message copied", delete errors. */
  onNotify?: (message: string) => void;
  /** "inverted" for light-on-dark own bubbles (styles the trigger only). */
  tone?: "default" | "inverted";
  /** Which edge of the trigger the popover lines up with. Default "end". */
  align?: "start" | "end";
  className?: string;
}

const MAX_DOWNLOADS_LISTED = 10;

export function MessageMenu({
  messageId,
  text,
  attachments,
  onReply,
  onDelete,
  onNotify,
  tone = "default",
  align = "end",
  className,
}: MessageMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [above, setAbove] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const handle = useRef({ pause: () => setOpen(false) });

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    setConfirming(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Only one menu open at a time; opening flips above when there's no room.
  useEffect(() => {
    const controller = openMenus;
    const self = handle.current;
    if (!open) {
      controller.release(self);
      return;
    }
    controller.activate(self);
    const rect = triggerRef.current?.getBoundingClientRect();
    setAbove(rect ? window.innerHeight - rect.bottom < 240 && rect.top > 240 : false);
    popoverRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => controller.release(self);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const downloads = (attachments ?? []).filter((a) => a.url).slice(0, MAX_DOWNLOADS_LISTED);
  const hasText = Boolean(text && text.trim());
  if (!onReply && !hasText && !downloads.length && !onDelete) return null;

  const handleCopy = async () => {
    const ok = await copyText(text ?? "");
    onNotify?.(ok ? "Message copied" : "Couldn't copy the message");
    close(true);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setBusy(true);
    try {
      await onDelete();
      close();
    } catch (error) {
      onNotify?.(error instanceof Error && error.message ? error.message : "Couldn't delete the message");
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = Array.from(popoverRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    if (!items.length) return;
    event.preventDefault();
    const at = items.indexOf(document.activeElement as HTMLElement);
    const next = event.key === "ArrowDown" ? (at + 1) % items.length : (at - 1 + items.length) % items.length;
    items[next].focus();
  };

  const trigger =
    tone === "inverted"
      ? "text-white/80 hover:bg-white/20"
      : "text-gray-500 hover:bg-gray-100";
  const item =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none";

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`} data-message-id={messageId}>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Message options"
        aria-haspopup="menu"
        aria-expanded={open}
        data-open={open}
        onClick={() => (open ? close() : setOpen(true))}
        className={`flex h-6 w-6 items-center justify-center rounded-md opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 data-[open=true]:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 ${trigger}`}
      >
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="menu"
          aria-label="Message options"
          onKeyDown={handleMenuKeyDown}
          className={`absolute z-50 min-w-[11rem] max-w-[16rem] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg ${
            align === "end" ? "right-0" : "left-0"
          } ${above ? "bottom-full mb-1" : "top-full mt-1"}`}
        >
          {confirming ? (
            <div className="px-3 py-2">
              <p className="mb-2 text-sm text-gray-800">Delete this message for everyone?</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={() => setConfirming(false)}
                  className="rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={handleDelete}
                  className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-50"
                >
                  {busy ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {onReply && (
                <button
                  type="button"
                  role="menuitem"
                  className={item}
                  onClick={() => {
                    close();
                    onReply();
                  }}
                >
                  <CornerUpLeft size={16} aria-hidden /> Reply
                </button>
              )}
              {hasText && (
                <button type="button" role="menuitem" className={item} onClick={handleCopy}>
                  <Copy size={16} aria-hidden /> Copy text
                </button>
              )}
              {downloads.map((attachment, i) => (
                <a
                  key={attachment.url}
                  role="menuitem"
                  className={item}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={attachment.name || true}
                  onClick={() => close()}
                >
                  <Download size={16} aria-hidden className="flex-shrink-0" />
                  <span className="truncate">
                    {downloads.length === 1 ? "Download" : `Download ${attachment.name || `file ${i + 1}`}`}
                  </span>
                </a>
              ))}
              {onDelete && (
                <button
                  type="button"
                  role="menuitem"
                  className={`${item} text-red-600`}
                  onClick={() => setConfirming(true)}
                >
                  <Trash2 size={16} aria-hidden /> Delete
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
