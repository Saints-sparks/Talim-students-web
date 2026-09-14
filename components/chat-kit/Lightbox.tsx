"use client";

/**
 * Chat media kit — full-screen image viewer: prev/next (buttons and ←/→),
 * Esc / backdrop / × to close, Download, "2 / 4" counter. Focus stays in the
 * dialog while open and returns to where it was on close; the page behind
 * doesn't scroll.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

export interface LightboxImage {
  url: string;
  name?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  /** Index of the image to show; `null` (or `open={false}`) hides the lightbox. */
  index: number | null;
  open?: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Lightbox({ images, index, open = true, onClose, onIndexChange }: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const count = images.length;
  const isOpen = open && index !== null && count > 0;
  const safeIndex = index === null ? 0 : Math.min(Math.max(index, 0), Math.max(count - 1, 0));
  const image = isOpen ? images[safeIndex] : undefined;

  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (delta: number) => {
      if (count < 2 || index === null) return;
      onIndexChange?.((safeIndex + delta + count) % count);
    },
    [count, index, safeIndex, onIndexChange]
  );

  // Body scroll lock + focus in / focus back.
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => (closeRef.current ?? dialogRef.current)?.focus(), 0);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    };
  }, [isOpen]);

  // Keys work wherever focus is while the dialog is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!mounted || !isOpen || !image) return null;

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.name ? `Image: ${image.name}` : "Image viewer"}
      tabIndex={-1}
      onKeyDown={trapFocus}
      onClick={onBackdrop}
      className="fixed inset-0 z-[1000] flex flex-col bg-black/90 outline-none"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white" onClick={onBackdrop}>
        <span className="min-w-0 truncate text-sm text-white/80">
          {count > 1 ? `${safeIndex + 1} / ${count}` : image.name ?? ""}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            download={image.name || true}
            className={buttonClass}
            aria-label="Download image"
            title="Download"
          >
            <Download size={18} aria-hidden />
          </a>
          <button ref={closeRef} type="button" onClick={onClose} className={buttonClass} aria-label="Close" title="Close">
            <X size={20} aria-hidden />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6" onClick={onBackdrop}>
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            className={`${buttonClass} absolute left-3 top-1/2 -translate-y-1/2`}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
        )}
        <img
          key={image.url}
          src={image.url}
          alt={image.name || `Image ${safeIndex + 1} of ${count}`}
          className="max-h-full max-w-full select-none object-contain"
          draggable={false}
        />
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            className={`${buttonClass} absolute right-3 top-1/2 -translate-y-1/2`}
            aria-label="Next image"
          >
            <ChevronRight size={22} aria-hidden />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
