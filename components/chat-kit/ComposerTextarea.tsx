"use client";

/**
 * Chat kit — the message box. A textarea that grows with what you type (up
 * to `maxRows`), so a paragraph can be written and reviewed.
 *
 * Enter: on a device with a mouse or trackpad it sends and Shift+Enter
 * starts a new line; on a touch screen Enter always starts a new line (the
 * Send button sends) — a phone keyboard has no Shift+Enter. Enter never
 * sends while an IME (e.g. Chinese, Japanese) is composing a word.
 */
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react";

export interface EnterKeyState {
  key: string;
  shiftKey: boolean;
  isComposing: boolean;
  /** Whether a plain Enter should send on this device. */
  enterSends: boolean;
}

/** True when this key press should send the message. */
export function shouldSubmitOnEnter({ key, shiftKey, isComposing, enterSends }: EnterKeyState): boolean {
  return key === "Enter" && !shiftKey && !isComposing && enterSends;
}

/** A touch screen is the primary pointer: Enter should not send. */
export function primaryPointerIsTouch(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(pointer: coarse)").matches
    : false;
}

export interface ComposerTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange" | "rows"> {
  value: string;
  onValueChange: (value: string) => void;
  /** Called for an Enter that should send (see above). */
  onSubmit: () => void;
  /** Tallest the box grows before it scrolls. Default 6. */
  maxRows?: number;
  /** Override the per-device rule: always / never send on Enter. */
  submitOnEnter?: boolean;
}

export const ComposerTextarea = forwardRef<HTMLTextAreaElement, ComposerTextareaProps>(
  function ComposerTextarea(
    { value, onValueChange, onSubmit, maxRows = 6, submitOnEnter, className, onKeyDown, ...rest },
    forwardedRef,
  ) {
    const ref = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current as HTMLTextAreaElement);

    const resize = useCallback(() => {
      const el = ref.current;
      if (!el) return;
      el.style.height = "auto";
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
      const max = lineHeight * maxRows;
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [maxRows]);

    useLayoutEffect(resize, [value, resize]);

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const send = shouldSubmitOnEnter({
        key: event.key,
        shiftKey: event.shiftKey,
        isComposing: event.nativeEvent.isComposing,
        enterSends: submitOnEnter ?? !primaryPointerIsTouch(),
      });
      if (send) {
        event.preventDefault();
        onSubmit();
      }
    };

    return (
      <textarea
        {...rest}
        ref={ref}
        rows={1}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className={`resize-none ${className ?? ""}`}
      />
    );
  },
);
