"use client";

/**
 * Chat media kit — uploads a message's files (two at a time) with the app's
 * own upload helper and returns the attachment objects `send-chat-message`
 * takes. Files that already uploaded are skipped, so a retry only uploads
 * what failed.
 */
import { useCallback, useState } from "react";
import { fileKind, type AttachmentKind, type ChatKitAttachment, type SendableAttachment } from "./mediaTypes";

/**
 * The app's upload helper (`POST /upload/chat-attachment`). Call `onProgress`
 * with 0–1 if the helper can report progress; otherwise it is reported as
 * done when the promise resolves.
 */
export type ChatUploadFn = (
  file: File,
  onProgress?: (fraction: number) => void
) => Promise<Partial<ChatKitAttachment> & { url: string }>;

export interface UploadItem {
  file: File;
  /** Force the attachment type (a voice recording is `audio`). */
  kind?: AttachmentKind;
  /** Seconds, for audio / video when known locally. */
  duration?: number;
  /** Set once uploaded; items with it are not uploaded again. */
  uploaded?: SendableAttachment;
}

export interface UploadOptions {
  /** Progress of item `index`, 0–1. */
  onProgress?: (index: number, fraction: number) => void;
  /** Item `index` finished uploading (store it so a retry skips it). */
  onItemUploaded?: (index: number, attachment: SendableAttachment) => void;
  /** Uploads at once (default 2). */
  concurrency?: number;
}

/** Builds the send payload's attachment from an upload response. */
export function toSendableAttachment(
  item: Pick<UploadItem, "file" | "kind" | "duration">,
  response: Partial<ChatKitAttachment> & { url: string }
): SendableAttachment {
  const kind: AttachmentKind =
    item.kind ?? (response.type as AttachmentKind | undefined) ?? fileKind(item.file);
  const attachment: SendableAttachment = {
    url: response.url,
    name: response.name || item.file.name,
    mimeType: response.mimeType || item.file.type || "application/octet-stream",
    size: typeof response.size === "number" ? response.size : item.file.size,
    type: kind,
  };
  if (typeof response.width === "number") attachment.width = response.width;
  if (typeof response.height === "number") attachment.height = response.height;
  const duration = typeof response.duration === "number" && response.duration > 0 ? response.duration : item.duration;
  if (typeof duration === "number") attachment.duration = duration;
  return attachment;
}

/**
 * Uploads every item that isn't uploaded yet, `concurrency` at a time, and
 * resolves with all attachments in the items' order. Rejects with the first
 * failure (after the uploads already running settle); items that succeeded
 * are reported through `onItemUploaded` and marked `uploaded`.
 */
export async function uploadAttachments(
  items: UploadItem[],
  uploadFn: ChatUploadFn,
  options: UploadOptions = {}
): Promise<SendableAttachment[]> {
  const concurrency = Math.max(1, options.concurrency ?? 2);
  const queue = items.map((_, index) => index).filter((index) => !items[index].uploaded);
  let failure: unknown = null;

  items.forEach((item, index) => {
    if (item.uploaded) options.onProgress?.(index, 1);
  });

  const worker = async () => {
    while (queue.length > 0 && failure === null) {
      const index = queue.shift() as number;
      const item = items[index];
      options.onProgress?.(index, 0);
      try {
        const response = await uploadFn(item.file, (fraction) =>
          options.onProgress?.(index, Math.min(1, Math.max(0, fraction)))
        );
        if (!response || typeof response.url !== "string" || !response.url) {
          throw new Error("Upload failed");
        }
        const attachment = toSendableAttachment(item, response);
        item.uploaded = attachment;
        options.onProgress?.(index, 1);
        options.onItemUploaded?.(index, attachment);
      } catch (err) {
        if (failure === null) failure = err ?? new Error("Upload failed");
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  if (failure !== null) throw failure;
  return items.map((item) => item.uploaded as SendableAttachment);
}

export interface UseAttachmentUploadReturn {
  upload: (items: UploadItem[], options?: UploadOptions) => Promise<SendableAttachment[]>;
  isUploading: boolean;
  /** Progress per item of the latest upload, 0–1. */
  progress: number[];
}

export function useAttachmentUpload(uploadFn: ChatUploadFn): UseAttachmentUploadReturn {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState<number[]>([]);

  const upload = useCallback(
    async (items: UploadItem[], options: UploadOptions = {}) => {
      setActive((n) => n + 1);
      setProgress(items.map((item) => (item.uploaded ? 1 : 0)));
      try {
        return await uploadAttachments(items, uploadFn, {
          ...options,
          onProgress: (index, fraction) => {
            setProgress((prev) => {
              if (prev[index] === fraction) return prev;
              const next = [...prev];
              next[index] = fraction;
              return next;
            });
            options.onProgress?.(index, fraction);
          },
        });
      } finally {
        setActive((n) => n - 1);
      }
    },
    [uploadFn]
  );

  return { upload, isUploading: active > 0, progress };
}
