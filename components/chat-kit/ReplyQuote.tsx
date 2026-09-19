/**
 * Chat kit — the two halves of a reply: the bar above the composer while
 * you are replying (`ReplyBar`), and the quote inside the bubble that was
 * sent as a reply (`QuotedMessage`).
 *
 * Both work from the server's `replyTo` snapshot, so the quote still reads
 * if the original was deleted or isn't loaded.
 */
import { X } from "lucide-react";

/** What the server sends as `message.replyTo`. */
export interface ChatReplyTo {
  messageId: string;
  senderId?: string;
  senderName: string;
  preview: string;
  type?: string;
}

/** The message being replied to, as picked in the UI. */
export interface ReplyDraft {
  messageId: string;
  senderName: string;
  preview: string;
}

export interface ReplyBarProps {
  reply: ReplyDraft;
  onCancel: () => void;
  className?: string;
}

export function ReplyBar({ reply, onCancel, className }: ReplyBarProps) {
  return (
    <div
      className={`flex items-start justify-between gap-3 border-l-4 border-blue-500 bg-blue-50 px-3 py-2 ${className ?? ""}`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-blue-700">Replying to {reply.senderName}</p>
        <p className="truncate text-sm leading-tight text-gray-700">{reply.preview}</p>
      </div>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel reply"
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        <X size={14} className="text-blue-600" />
      </button>
    </div>
  );
}

export interface QuotedMessageProps {
  replyTo: ChatReplyTo;
  /** "inverted" for light-on-dark own bubbles. */
  tone?: "default" | "inverted";
  /** Scroll to the original. Omit when it can't be found in the thread. */
  onJump?: (messageId: string) => void;
}

export function QuotedMessage({ replyTo, tone = "default", onJump }: QuotedMessageProps) {
  const inverted = tone === "inverted";
  const box = inverted
    ? "border-white/70 bg-white/15 text-white"
    : "border-blue-500 bg-gray-100 text-gray-800";
  const name = inverted ? "text-white" : "text-blue-700";
  const body = (
    <>
      <span className={`block truncate text-xs font-semibold ${name}`}>{replyTo.senderName}</span>
      <span className="block truncate text-xs opacity-90">{replyTo.preview}</span>
    </>
  );
  const classes = `mb-1.5 block w-full min-w-0 rounded-md border-l-4 px-2 py-1 text-left ${box}`;

  return onJump ? (
    <button
      type="button"
      onClick={() => onJump(replyTo.messageId)}
      aria-label={`Go to the message from ${replyTo.senderName}`}
      className={`${classes} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500`}
    >
      {body}
    </button>
  ) : (
    <div className={classes}>{body}</div>
  );
}
