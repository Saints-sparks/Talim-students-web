import { Ban, Check, CheckCheck, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import MessageAttachments from "./MessageAttachments";
import BubbleMenu from "./BubbleMenu";
import { Linkified, QuotedMessage, type ChatReplyTo, type ReplyDraft } from "@/components/chat-kit";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";
import type { ChatAttachment, OwnMessageTick } from "@/types/chat";

interface MessageBubbleProps {
  msg: {
    _id: string;
    senderType: string;
    avatar: string;
    sender: string;
    color: string;
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
  /** Start a reply to this message. */
  onReply?: (reply: ReplyDraft) => void;
  /** Present when this user may delete this message. */
  onDeleteMessage?: () => Promise<void>;
  /** Scroll to a quoted message; omitted for one that isn't loaded. */
  onJump?: (messageId: string) => void;
  onRetry?: () => void;
  onDelete?: () => void;
}

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

  const initials = getUserInitials(msg.sender);
  const bgColor = msg.color || generateColorFromString(msg.sender);

  return (
    <div
      className={`relative flex items-end ${
        msg.senderType === "self" ? "justify-end" : "justify-start"
      } gap-2 px-2 sm:px-0 mb-3`}
    >
      <div className={`flex gap-2 max-w-[85%] sm:max-w-md ${
        msg.senderType === "self" ? "flex-row-reverse" : "flex-row"
      }`}>
        {/* Avatar - only show for other users, not self */}
        {msg.senderType !== "self" && (
          <div className="relative w-8 h-8 flex-shrink-0 self-end mb-1">
            <Avatar className="w-8 h-8 rounded-full">
              <AvatarImage src={msg.avatar} />
              <AvatarFallback 
                className="text-white font-medium text-xs"
                style={{ backgroundColor: bgColor }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${
          msg.senderType === "self" ? "items-end" : "items-start"
        }`}>
          {/* Sender Name - only show for group messages from others */}
          {showSenderName && msg.sender !== "me" && msg.senderType !== "self" && (
            <div className="mb-1 px-1">
              <p 
                className="text-xs font-semibold"
                style={{ color: bgColor }}
              >
                {msg.sender}
              </p>
            </div>
          )}

          {/* Message Bubble */}
          <Card
            className={`px-3 py-2 sm:px-4 sm:py-3 border-none shadow-sm relative group ${
              isPending ? "opacity-70" : ""
            } ${
              msg.senderType === "self"
                ? "bg-blue-500 text-white rounded-2xl rounded-br-md"
                : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md"
            }`}
          >
            {!isPending && !isFailed && !msg.isDeleted && (
              <BubbleMenu
                msg={msg}
                isMine={msg.senderType === "self"}
                onReply={onReply}
                onDeleteMessage={onDeleteMessage}
              />
            )}

            {msg.isDeleted ? (
              <p className="flex items-center gap-1.5 text-sm italic opacity-80">
                <Ban className="w-3.5 h-3.5" aria-hidden /> This message was deleted
              </p>
            ) : (
              <>
                {msg.replyTo && (
                  <QuotedMessage
                    replyTo={msg.replyTo}
                    tone={msg.senderType === "self" ? "inverted" : "default"}
                    onJump={onJump}
                  />
                )}
                {msg.attachments && msg.attachments.length > 0 && (
                  <MessageAttachments
                    attachments={msg.attachments}
                    isMine={msg.senderType === "self"}
                    pending={isPending || isFailed}
                    failed={isFailed}
                    progress={isPending ? msg.uploadProgress : undefined}
                  />
                )}
                {msg.text && (
                  <p
                    className={`text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap ${
                      msg.attachments?.length ? "mt-1.5" : ""
                    }`}
                  >
                    <Linkified text={msg.text} tone={msg.senderType === "self" ? "inverted" : "default"} />
                  </p>
                )}
              </>
            )}
          </Card>

          {/* Time and Status */}
          <div className={`flex items-center gap-1 text-xs text-gray-400 mt-1 px-1 ${
            msg.senderType === "self" ? "flex-row-reverse" : "flex-row"
          }`}>
            {isFailed ? (
              <span className="text-red-600" title={msg.error}>
                Not sent
                {onRetry && (
                  <>
                    {" · "}
                    <button className="underline hover:text-red-800" onClick={onRetry}>
                      Retry
                    </button>
                  </>
                )}
                {onDelete && (
                  <>
                    {" · "}
                    <button className="underline hover:text-red-800" onClick={onDelete}>
                      Delete
                    </button>
                  </>
                )}
              </span>
            ) : (
              <span>{msg.time}</span>
            )}
            {msg.senderType === "self" && msg.tick === "pending" && (
              <Clock className="w-3 h-3" aria-label="Sending" />
            )}
            {msg.senderType === "self" && msg.tick === "sent" && (
              <Check className="w-3.5 h-3.5" aria-label="Sent" />
            )}
            {msg.senderType === "self" && msg.tick === "read" && (
              <CheckCheck className="w-3.5 h-3.5 text-blue-500" aria-label="Read" />
            )}
          </div>
          {msg.senderType === "self" && msg.readByLabel && (
            <p className="text-[11px] text-gray-400 px-1">{msg.readByLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}
