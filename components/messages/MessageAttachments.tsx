"use client";

import { AttachmentGrid } from "@/components/chat-kit";
import { toast } from "@/components/CustomToast";
import type { ChatAttachment } from "@/types/chat";

interface MessageAttachmentsProps {
  attachments: ChatAttachment[];
  isMine: boolean;
  /** Not stored yet: local previews, no download links. */
  pending?: boolean;
  /** Upload progress per attachment (0–1) while sending. */
  progress?: number[];
}

const showPlaybackError = (message: string) => toast.error(message);

/**
 * The one place message attachments are rendered (both chat types): the chat
 * kit's grid of images, videos, voice notes and files. Captions are rendered
 * below by the bubble.
 */
export default function MessageAttachments({
  attachments,
  isMine,
  pending = false,
  progress,
}: MessageAttachmentsProps) {
  if (!attachments.length) return null;
  return (
    <AttachmentGrid
      attachments={attachments}
      tone={isMine ? "inverted" : "default"}
      pending={pending}
      progress={progress}
      onPlaybackError={showPlaybackError}
    />
  );
}
