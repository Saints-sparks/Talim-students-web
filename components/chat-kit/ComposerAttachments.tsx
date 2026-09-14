"use client";

/**
 * Chat media kit — the strip of picked files above the message box:
 * thumbnails for images, chips for everything else, × to remove, and the
 * validation messages. The parent owns the file list (add with
 * `addToSelection` from mediaTypes) and does the uploading.
 */
import { useEffect, useRef, useState } from "react";
import { File as FileIcon, FileText, Film, Music, X } from "lucide-react";
import { fileKind, formatBytes } from "./mediaTypes";

export interface ComposerAttachmentsProps {
  files: File[];
  onRemove: (index: number) => void;
  /** Validation messages to show under the strip. */
  errors?: string[];
  onDismissErrors?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Object URLs for the image files in `files`. URLs are created once per
 * File and revoked when the file leaves the list (removed or sent) or the
 * component unmounts.
 */
function useImagePreviews(files: File[]): Map<File, string> {
  const cacheRef = useRef<Map<File, string>>(new Map());
  const [previews, setPreviews] = useState<Map<File, string>>(() => new Map());

  useEffect(() => {
    const cache = cacheRef.current;
    const next = new Map<File, string>();
    for (const file of files) {
      if (fileKind(file) !== "image") continue;
      next.set(file, cache.get(file) ?? URL.createObjectURL(file));
    }
    for (const [file, url] of cache) {
      if (!next.has(file)) URL.revokeObjectURL(url);
    }
    cacheRef.current = next;
    setPreviews(next);
  }, [files]);

  // Revoke whatever is left on unmount.
  useEffect(() => {
    const holder = cacheRef;
    return () => {
      for (const url of holder.current.values()) URL.revokeObjectURL(url);
      holder.current = new Map();
    };
  }, []);

  return previews;
}

export function ComposerAttachments({
  files,
  onRemove,
  errors = [],
  onDismissErrors,
  disabled = false,
  className = "",
}: ComposerAttachmentsProps) {
  const previews = useImagePreviews(files);
  if (files.length === 0 && errors.length === 0) return null;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {files.length > 0 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Attachments to send">
          {files.map((file, index) => {
            const kind = fileKind(file);
            const preview = previews.get(file);
            const key = `${file.name}-${file.size}-${file.lastModified}-${index}`;
            const removeButton = (
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={disabled}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-white shadow hover:bg-gray-900 disabled:opacity-50"
                aria-label={`Remove ${file.name}`}
                title="Remove"
              >
                <X size={12} aria-hidden />
              </button>
            );

            if (kind === "image") {
              return (
                <li key={key} className="relative flex-shrink-0">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    {preview && <img src={preview} alt={file.name} className="h-full w-full object-cover" />}
                  </div>
                  {removeButton}
                </li>
              );
            }

            const Icon = kind === "video" ? Film : kind === "audio" ? Music : kind === "document" ? FileText : FileIcon;
            return (
              <li key={key} className="relative flex-shrink-0">
                <div className="flex h-16 w-44 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5">
                  <Icon size={20} className="flex-shrink-0 text-gray-500" aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-800" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[11px] text-gray-500">{formatBytes(file.size)}</p>
                  </div>
                </div>
                {removeButton}
              </li>
            );
          })}
        </ul>
      )}

      {errors.length > 0 && (
        <div role="alert" className="flex items-start gap-2 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
          <ul className="flex-1 space-y-0.5">
            {errors.map((message, i) => (
              <li key={`${message}-${i}`}>{message}</li>
            ))}
          </ul>
          {onDismissErrors && (
            <button
              type="button"
              onClick={onDismissErrors}
              className="flex-shrink-0 rounded p-0.5 hover:bg-red-100"
              aria-label="Dismiss"
            >
              <X size={12} aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
