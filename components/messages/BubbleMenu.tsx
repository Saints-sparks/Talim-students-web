"use client";

import { MessageMenu, type ChatKitAttachment } from "@/components/chat-kit";
import { toast } from "@/components/CustomToast";

interface BubbleMenuProps {
  msg: { _id: string; sender: string; text?: string; attachments?: ChatKitAttachment[] };
  isMine: boolean;
  onReply?: (reply: { messageId: string; senderName: string; preview: string }) => void;
  /** Present when this user may delete this message. */
  onDeleteMessage?: () => Promise<void>;
}

/** The message options for one stored bubble. */
export default function BubbleMenu({ msg, isMine, onReply, onDeleteMessage }: BubbleMenuProps) {
  return (
    <MessageMenu
      messageId={msg._id}
      text={msg.text}
      attachments={msg.attachments}
      onReply={
        onReply
          ? () =>
              onReply({
                messageId: msg._id,
                senderName: msg.sender,
                preview: msg.text || (msg.attachments?.length ? "Attachment" : ""),
              })
          : undefined
      }
      onDelete={onDeleteMessage}
      onNotify={(text) => (/copied/i.test(text) ? toast.success(text) : toast.error(text))}
      tone={isMine ? "inverted" : "default"}
      className="absolute right-1 top-1 z-10"
    />
  );
}
