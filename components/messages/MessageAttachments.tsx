"use client";

import { FileText, Image as ImageIcon, Mic, Video } from "lucide-react";
import type { ChatAttachment, ChatMessageType } from "@/types/chat";

interface MessageAttachmentsProps {
  attachments: ChatAttachment[];
  type: ChatMessageType | string;
  duration?: number;
  isMine: boolean;
}

const ICONS = {
  image: ImageIcon,
  audio: Mic,
  video: Video,
  document: FileText,
  file: FileText,
} as const;

const FALLBACK_LABELS = {
  image: "Photo",
  audio: "Voice note",
  video: "Video",
  document: "Document",
  file: "File",
} as const;

/**
 * The one place message attachments are rendered. For now each attachment is a
 * plain link; the shared media kit (image viewer, voice player, file card)
 * replaces this body without touching the bubbles.
 */
export default function MessageAttachments({ attachments, isMine }: MessageAttachmentsProps) {
  if (!attachments.length) return null;

  return (
    <div className="flex flex-col gap-1">
      {attachments.map((attachment, index) => {
        const kind = attachment.type in ICONS ? attachment.type : "file";
        const Icon = ICONS[kind];
        const href = attachment.playbackUrl || attachment.url;
        return (
          <a
            key={`${attachment.url}-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-sm underline-offset-2 hover:underline ${
              isMine ? "text-white" : "text-blue-600"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-[14rem]">
              {attachment.name || FALLBACK_LABELS[kind]}
            </span>
          </a>
        );
      })}
    </div>
  );
}
