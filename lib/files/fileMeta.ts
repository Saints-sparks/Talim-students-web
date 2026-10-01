/**
 * Pure helpers for the file rows on Files and Subject detail: the type label
 * ("PDF", "DOCX"), the grey meta line, and the "n files" counts.
 */
import { formatBytes, formatDate } from "@/lib/learner/format";
import type { ResourceKind, StudentFile } from "@/types/learner";

/** The label of a kind when neither the address nor the MIME type names a format. */
const KIND_LABEL: Record<ResourceKind, string> = {
  pdf: "PDF",
  slides: "Slides",
  video: "Video",
  doc: "Document",
  image: "Image",
  other: "File",
};

/** Common MIME types and the format students know them by. */
const MIME_LABEL: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "text/plain": "TXT",
  "text/csv": "CSV",
  "application/zip": "ZIP",
  "video/mp4": "MP4",
  "audio/mpeg": "MP3",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

const EXTENSION_RE = /\.([a-z0-9]{2,5})$/i;

/**
 * The extension at the end of a file address, ignoring its query and hash.
 *
 * @param url - The address, or null.
 * @returns The extension in capitals ("DOCX"), or null.
 */
export function extensionOf(url: string | null | undefined): string | null {
  if (!url) return null;
  const path = url.split(/[?#]/)[0];
  const last = path.slice(path.lastIndexOf("/") + 1);
  const match = EXTENSION_RE.exec(last);
  return match ? match[1].toUpperCase() : null;
}

/**
 * The format a file is shown as: its extension when the address has one (the
 * design's "PDF", "DOCX", "XLSX"), else its MIME type's, else its kind's.
 *
 * @param file - The file.
 * @returns The label.
 */
export function fileTypeLabel(file: Pick<StudentFile, "url" | "mimeType" | "kind">): string {
  return extensionOf(file.url) ?? (file.mimeType ? MIME_LABEL[file.mimeType.toLowerCase()] : undefined) ?? KIND_LABEL[file.kind] ?? "File";
}

/**
 * The grey line under a file's name: "PDF · 12 May 2026 · 471 KB", with the
 * teacher first on the Files list ("Mr Seyi Tinubu · PDF · …"). Parts the API
 * left out are skipped.
 *
 * @param file - The file.
 * @param withTeacher - Whether to start with the teacher's name.
 * @returns The line.
 */
export function fileMetaLine(file: StudentFile, withTeacher = false): string {
  return [withTeacher ? file.teacher?.name : null, fileTypeLabel(file), formatDate(file.createdAt), formatBytes(file.sizeBytes)]
    .filter(Boolean)
    .join(" · ");
}

/**
 * "1 file" or "4 files".
 *
 * @param count - How many.
 * @returns The phrase.
 */
export function filesCount(count: number): string {
  return `${count} file${count === 1 ? "" : "s"}`;
}
