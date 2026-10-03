import { Ban, Check, CheckCheck, Clock } from "lucide-react";
import MessageAttachments from "./MessageAttachments";
import BubbleMenu from "./BubbleMenu";
import { Linkified, QuotedMessage, type ChatReplyTo, type ReplyDraft } from "@/components/chat-kit";
import { focusRing } from "@/components/tl/styles";
import type { ChatAttachment, OwnMessageTick } from "@/types/chat";

interface MessageBubbleProps {
  msg: {
    _id: string;
    senderType: string;
    sender: string;
    type: string;
    text?: string;
    duration?: number;
    attachments?: ChatAttachment[];
    uploadProgress?: number[];
    time: string;
    status?: "sent" | "pending" | "failed";
    error?: string;
    /** Own messages only. */
    tick?: OwnMessageTick;
    /** Groups: "Read by N", shown under my latest message only. */
    readByLabel?: string;
    replyTo?: ChatReplyTo;
    isDeleted?: boolean;
  };
  /** Groups label each sender; a direct chat only has one other person. */
  showSenderName?: boolean;
  /** Start a reply to this message (omitted in a read-only thread). */
  onReply?: (reply: ReplyDraft) => void;
  /** Present when this user may delete this message. */
  onDeleteMessage?: () => Promise<void>;
  /** Scroll to a quoted message; omitted for one that isn't loaded. */
  onJump?: (messageId: string) => void;
  onRetry?: () => void;
  onDelete?: () => void;
}

/**
 * One message, styled like the redesign: my messages in a navy bubble on the
 * right, others' in a grey bubble on the left with the sender's name above,
 * and the time (or "Not sent" with Retry / Delete) under each. Replies,
 * attachments, voice notes and the message menu come from the chat kit.
 *
 * @param props - See {@link MessageBubbleProps}.
 * @param props.msg - The message, ready to show.
 * @param props.showSenderName - Whether to name the sender (groups).
 * @param props.onReply - Starts a reply.
 * @param props.onDeleteMessage - Deletes a stored message.
 * @param props.onJump - Scrolls to a quoted message.
 * @param props.onRetry - Resends a failed message.
 * @param props.onDelete - Discards a failed message.
 * @returns The bubble row.
 */
export default function GroupMessageBubble({
  msg,
  showSenderName = true,
  onReply,
  onDeleteMessage,
  onJump,
  onRetry,
  onDelete,
}: MessageBubbleProps) {
  const isPending = msg.status === "pending";
  const isFailed = msg.status === "failed";
  const mine = msg.senderType === "self";
  const showMenu = !isPending && !isFailed && !msg.isDeleted;
  const failedAction = `inline-flex min-h-[44px] items-center rounded-md px-1 font-bold underline ${focusRing}`;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[min(78%,520px)] flex-col ${mine ? "items-end" : "items-start"}`}>
        {showSenderName && !mine && (
          <p className="mb-[5px] px-1 text-[13px] font-bold text-tl-muted">{msg.sender}</p>
        )}

        <div
          className={`group relative max-w-full rounded-2xl px-4 py-[13px] text-base leading-normal ${showMenu ? "pr-9" : ""} ${
            isPending ? "opacity-70" : ""
          } ${mine ? "bg-tl-brand-fill text-tl-on-brand" : "bg-tl-track text-tl-ink"}`}
        >
          {showMenu && <BubbleMenu msg={msg} isMine={mine} onReply={onReply} onDeleteMessage={onDeleteMessage} />}

          {msg.isDeleted ? (
            <p className="flex items-center gap-1.5 text-[15px] italic opacity-80">
              <Ban className="h-3.5 w-3.5" aria-hidden /> This message was deleted
            </p>
          ) : (
            <>
              {msg.replyTo && (
                <QuotedMessage replyTo={msg.replyTo} tone={mine ? "inverted" : "default"} onJump={onJump} />
              )}
              {msg.attachments && msg.attachments.length > 0 && (
                <MessageAttachments
                  attachments={msg.attachments}
                  isMine={mine}
                  pending={isPending || isFailed}
                  failed={isFailed}
                  progress={isPending ? msg.uploadProgress : undefined}
                />
              )}
              {msg.text && (
                <p className={`whitespace-pre-wrap break-words ${msg.attachments?.length ? "mt-1.5" : ""}`}>
                  <Linkified text={msg.text} tone={mine ? "inverted" : "default"} />
                </p>
              )}
            </>
          )}
        </div>

        <div className={`mt-[5px] flex items-center gap-1 px-1 text-xs text-tl-faint ${mine ? "flex-row-reverse" : "flex-row"}`}>
          {isFailed ? (
            <span className="flex flex-wrap items-center gap-x-1 text-tl-danger" title={msg.error}>
              Not sent
              {onRetry && (
                <>
                  {" · "}
                  <button type="button" className={failedAction} onClick={onRetry}>
                    Retry
                  </button>
                </>
              )}
              {onDelete && (
                <>
                  {" · "}
                  <button type="button" className={failedAction} onClick={onDelete}>
                    Delete
                  </button>
                </>
              )}
            </span>
          ) : (
            <span>{msg.time}</span>
          )}
          {mine && msg.tick === "pending" && <Clock className="h-3 w-3" aria-label="Sending" />}
          {mine && msg.tick === "sent" && <Check className="h-3.5 w-3.5" aria-label="Sent" />}
          {mine && msg.tick === "read" && <CheckCheck className="h-3.5 w-3.5 text-tl-link" aria-label="Read" />}
        </div>
        {mine && msg.readByLabel && <p className="px-1 text-[11px] text-tl-faint">{msg.readByLabel}</p>}
      </div>
    </div>
  );
}
