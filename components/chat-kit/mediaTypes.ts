/**
 * Chat media kit — pure helpers shared by every piece of the kit.
 *
 * Copied file-for-file into the other Talim web apps (see README.md).
 * No app imports here: only the platform (MediaRecorder, File).
 */

/** The attachment families the chat API knows. */
export type AttachmentKind = "image" | "video" | "audio" | "document" | "file";

/** A message attachment as the chat API sends it (`MessageView.attachments[]`). */
export interface ChatKitAttachment {
  url: string;
  type?: AttachmentKind | string;
  /** Audio only: an MP3 of a WebM/Ogg/WAV note. Play this when present. */
  playbackUrl?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
}

/** What `send-chat-message` expects for each attachment. */
export interface SendableAttachment {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  type: AttachmentKind;
  width?: number;
  height?: number;
  duration?: number;
}

// ─── Limits ─────────────────────────────────────────────────────────────────

export const MAX_FILES_PER_MESSAGE = 10;
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const MAX_OTHER_BYTES = 25 * 1024 * 1024;
/** Longest voice note, in seconds. */
export const MAX_VOICE_SECONDS = 5 * 60;
/** Shortest voice note worth sending, in seconds. */
export const MIN_VOICE_SECONDS = 1;

/** The backend's extension allowlist for `POST /upload/chat-attachment`. */
export const ALLOWED_EXTENSIONS = [
  "jpg", "jpeg", "png", "gif", "webp",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv",
  "zip", "rar",
  "mp4", "mp3", "m4a", "aac", "wav", "webm", "ogg",
] as const;

/** `accept` for the composer's file input. */
export const ATTACHMENT_ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

/** `accept` for picking a group picture. */
export const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.gif,.webp";

export const UNSUPPORTED_TYPE_MESSAGE = "This file type isn't supported";
export const TOO_MANY_FILES_MESSAGE = `You can attach up to ${MAX_FILES_PER_MESSAGE} files`;

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "heic", "heif", "svg"];
const VIDEO_EXT = ["mp4", "mov", "m4v", "avi", "mkv"];
const AUDIO_EXT = ["mp3", "m4a", "aac", "wav", "ogg", "oga", "opus", "webm"];
const DOCUMENT_EXT = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf", "odt", "ods", "odp"];
const DOCUMENT_MIME = /^(application\/(pdf|msword|rtf|vnd\.ms-|vnd\.openxmlformats-officedocument|vnd\.oasis\.opendocument)|text\/(plain|csv))/i;

// ─── Recording ──────────────────────────────────────────────────────────────

/** Recorder formats in order of preference (AAC plays everywhere, iOS included). */
export const RECORDER_MIME_CANDIDATES = [
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/aac",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
] as const;

/**
 * The first recorder format this browser supports, or `''` to let the
 * browser choose.
 *
 * @param isTypeSupported - Defaults to `MediaRecorder.isTypeSupported`.
 */
export function pickRecorderMime(isTypeSupported?: (mime: string) => boolean): string {
  const check =
    isTypeSupported ??
    (typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function"
      ? (mime: string) => MediaRecorder.isTypeSupported(mime)
      : undefined);
  if (!check) return "";
  for (const mime of RECORDER_MIME_CANDIDATES) {
    try {
      if (check(mime)) return mime;
    } catch {
      // Some browsers throw for unknown types; try the next one.
    }
  }
  return "";
}

/** The file extension for a recorded audio MIME type. Unknown → `webm`. */
export function extensionForMime(mime: string | null | undefined): "m4a" | "aac" | "webm" | "ogg" {
  const base = (mime ?? "").split(";")[0].trim().toLowerCase();
  if (base === "audio/mp4" || base === "audio/x-m4a" || base === "audio/m4a" || base === "video/mp4") return "m4a";
  if (base === "audio/aac" || base === "audio/x-aac") return "aac";
  if (base === "audio/ogg" || base === "application/ogg") return "ogg";
  return "webm";
}

// ─── Formatting ─────────────────────────────────────────────────────────────

/** Seconds as `m:ss`. NaN, Infinity, negatives and missing values give `0:00`. */
export function formatDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Bytes as `KB` / `MB` (one decimal under 10). */
export function formatBytes(bytes: number | null | undefined): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

// ─── Kinds ──────────────────────────────────────────────────────────────────

/** Lower-case extension of a file name or URL (query string ignored), or `''`. */
export function fileExtension(nameOrUrl: string | null | undefined): string {
  const clean = (nameOrUrl ?? "").split(/[?#]/)[0];
  const last = clean.split("/").pop() ?? "";
  const dot = last.lastIndexOf(".");
  return dot > 0 && dot < last.length - 1 ? last.slice(dot + 1).toLowerCase() : "";
}

function kindFromMime(mime: string): AttachmentKind | null {
  const m = mime.toLowerCase();
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  if (DOCUMENT_MIME.test(m)) return "document";
  return null;
}

function kindFromExtension(ext: string): AttachmentKind {
  if (IMAGE_EXT.includes(ext)) return "image";
  if (VIDEO_EXT.includes(ext)) return "video";
  if (AUDIO_EXT.includes(ext)) return "audio";
  if (DOCUMENT_EXT.includes(ext)) return "document";
  return "file";
}

/** A picked file's kind: MIME type first, then extension. */
export function fileKind(file: { type?: string; name?: string }): AttachmentKind {
  return kindFromMime(file.type ?? "") ?? kindFromExtension(fileExtension(file.name));
}

const KINDS: AttachmentKind[] = ["image", "video", "audio", "document", "file"];

/** A received attachment's kind: its `type`, then MIME type, then name / URL extension. */
export function attachmentKind(attachment: ChatKitAttachment): AttachmentKind {
  const given = (attachment.type ?? "").toLowerCase();
  if (given === "voice") return "audio";
  if ((KINDS as string[]).includes(given) && given !== "file") return given as AttachmentKind;
  const fromMime = kindFromMime(attachment.mimeType ?? "");
  if (fromMime) return fromMime;
  const ext = fileExtension(attachment.name) || fileExtension(attachment.url);
  return kindFromExtension(ext);
}

/** The largest upload allowed for a kind. */
export function maxBytesFor(kind: AttachmentKind): number {
  if (kind === "image") return MAX_IMAGE_BYTES;
  if (kind === "video") return MAX_VIDEO_BYTES;
  return MAX_OTHER_BYTES;
}

// ─── Validation ─────────────────────────────────────────────────────────────

/** Why a file can't be sent, or `null` when it can. */
export function validateFile(file: { name: string; size: number; type?: string }): string | null {
  const ext = fileExtension(file.name);
  if (!ext || !(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return `${file.name}: ${UNSUPPORTED_TYPE_MESSAGE}`;
  }
  const kind = fileKind(file);
  const max = maxBytesFor(kind);
  if (file.size > max) {
    return `${file.name} is too large (max ${Math.round(max / (1024 * 1024))} MB)`;
  }
  if (file.size === 0) return `${file.name} is empty`;
  return null;
}

/**
 * Adds picked files to a selection: rejects unsupported / oversized files
 * and anything past the per-message limit, with one message per problem.
 */
export function addToSelection<F extends { name: string; size: number; type?: string }>(
  current: F[],
  incoming: F[]
): { files: F[]; errors: string[] } {
  const files = [...current];
  const errors: string[] = [];
  let overLimit = false;
  for (const file of incoming) {
    const error = validateFile(file);
    if (error) {
      errors.push(error);
      continue;
    }
    if (files.length >= MAX_FILES_PER_MESSAGE) {
      overLimit = true;
      continue;
    }
    files.push(file);
  }
  if (overLimit) errors.push(TOO_MANY_FILES_MESSAGE);
  return { files, errors };
}

/** The message `type` for what is being sent. */
export function messageTypeFor(kinds: AttachmentKind[], isVoice = false): "text" | "voice" | "image" | "file" {
  if (isVoice) return "voice";
  if (kinds.length === 0) return "text";
  if (kinds.every((k) => k === "image")) return "image";
  return "file";
}

/**
 * The size an image / video is shown at inside `maxWidth × maxHeight`,
 * keeping its aspect ratio (never upscaled). `null` without dimensions.
 */
export function fitWithin(
  width: number | undefined,
  height: number | undefined,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } | null {
  if (!width || !height || width <= 0 || height <= 0) return null;
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

/** URLs in a piece of text (http/https and `www.`), without duplicates. */
export function extractLinks(text: string | null | undefined): string[] {
  if (!text) return [];
  const found = text.match(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi) ?? [];
  const seen = new Set<string>();
  const links: string[] = [];
  for (const raw of found) {
    const trimmed = raw.replace(/[),.;:!?\]]+$/, "");
    const url = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
    if (!seen.has(url)) {
      seen.add(url);
      links.push(url);
    }
  }
  return links;
}
