"use client";

import React, { useEffect, useId, useState } from "react";
import { Sheet } from "@/components/tl/Sheet";
import { ghostButton, primaryButton, rowButton } from "@/components/tl/styles";
import { toast } from "@/components/CustomToast";
import { useAuthContext } from "@/contexts/AuthContext";
import { useChangePhoto } from "@/hooks/account/useAccount";
import { ApiError } from "@/lib/apiError";
import { messageForError } from "@/lib/errorMessages";
import { formatBytes } from "@/lib/learner/format";
import { ProfileAvatar } from "./AccountPanel";
import type { SettingsSheetProps } from "./sheetKeys";

/** The largest photo the sheet accepts (Cloudinary's free-plan image limit). */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/**
 * Why a picked file cannot be used as a profile photo.
 *
 * @param file - The file the student picked.
 * @returns A sentence, or null when it is fine.
 */
export function photoProblem(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Choose a picture (JPG, PNG or WebP), not another kind of file.";
  if (file.size > MAX_PHOTO_BYTES) return "That photo is larger than 10 MB. Please choose a smaller one.";
  return null;
}

/**
 * The sentence for a failed upload. The Cloudinary step reports its own
 * problems ("Photo uploads aren't set up for this app yet.") as `UNKNOWN`,
 * which the generic mapping would hide, so those are shown as written.
 *
 * @param error - What the upload threw.
 * @returns The sentence to show.
 */
export function photoErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.code === "UNKNOWN" && error.message) return error.message;
  return messageForError(error, "We couldn't save your photo. Please try again.");
}

/**
 * The change-photo sheet: pick an image, see it in the round frame, and
 * save it. It uploads to Cloudinary, saves the URL on the account, and the
 * new photo shows everywhere at once; the sheet closes with a toast.
 *
 * @param props - See {@link SettingsSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @returns The sheet.
 */
export function PhotoSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { user } = useAuthContext();
  const upload = useChangePhoto();
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  // One object URL per picked file, revoked when the file changes or the sheet closes.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setFile(null);
      setProblem(null);
      upload.reset();
    }
    onOpenChange(value);
  };

  const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    event.target.value = "";
    upload.reset();
    if (!picked) return;
    const issue = photoProblem(picked);
    setProblem(issue);
    setFile(issue ? null : picked);
  };

  const save = () => {
    if (!file || upload.isPending) return;
    upload.mutate(file, {
      onSuccess: () => {
        toast.success("Your new photo is saved.");
        handleOpenChange(false);
      },
    });
  };

  const error = problem ?? (upload.error ? photoErrorMessage(upload.error) : null);

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
      eyebrowText="Account"
      title="Change photo"
      subtitle="Choose a clear picture of yourself from this device. It shows beside your name in Talim."
      footer={
        <>
          <button type="button" className={ghostButton} onClick={() => handleOpenChange(false)}>
            Cancel
          </button>
          <button type="button" className={`${primaryButton} ml-auto`} onClick={save} disabled={!file || upload.isPending}>
            {upload.isPending ? "Saving…" : "Save photo"}
          </button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-[18px]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your new photo" className="h-[96px] w-[96px] shrink-0 rounded-full object-cover" />
        ) : (
          <ProfileAvatar user={user} sizeClass="h-[96px] w-[96px] text-[28px]" />
        )}
        <div className="min-w-[180px] flex-1">
          <input id={inputId} type="file" accept="image/*" onChange={pick} className="peer sr-only" />
          <label
            htmlFor={inputId}
            className={`${rowButton} cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-tl-link peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-tl-surface`}
          >
            {file ? "Choose another photo" : "Choose a photo"}
          </label>
          <p className="mt-2 break-words text-[13px] text-tl-muted" aria-live="polite">
            {file ? `${file.name}${file.size ? ` · ${formatBytes(file.size)}` : ""}` : "JPG, PNG or WebP, up to 10 MB."}
          </p>
        </div>
      </div>
      {error ? (
        <p role="alert" className="rounded-[14px] bg-tl-danger-bg px-4 py-3 text-sm font-semibold text-tl-danger">
          {error}
        </p>
      ) : null}
    </Sheet>
  );
}
