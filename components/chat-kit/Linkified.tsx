/**
 * Chat kit — message text with its links made tappable. Text keeps its line
 * breaks (the parent bubble sets `whitespace-pre-wrap`); links open in a new
 * tab without giving the target page access to this one.
 */
import { linkify } from "./linkify";

export interface LinkifiedProps {
  text: string | null | undefined;
  /** "inverted" for light-on-dark own bubbles. */
  tone?: "default" | "inverted";
  className?: string;
}

export function Linkified({ text, tone = "default", className }: LinkifiedProps) {
  const color = tone === "inverted" ? "text-white" : "text-blue-600";
  return (
    <>
      {linkify(text).map((segment, i) =>
        segment.type === "link" ? (
          <a
            key={i}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${color} underline underline-offset-2 break-all ${className ?? ""}`}
          >
            {segment.text}
          </a>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </>
  );
}
