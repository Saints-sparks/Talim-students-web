"use client";

import React, { useCallback } from "react";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { useOpenFile } from "@/hooks/learner/actions";
import { rowButton } from "@/components/tl/styles";
import type { StudentFile } from "@/types/learner";

/**
 * Opens a shared file: a new tab with the file, the view recorded on the
 * server (`POST /resources/:id/view`), and onboarding's "download a resource"
 * step ticked.
 *
 * @returns `open(file)`; call it from a click.
 */
export function useDownloadFile(): (file: Pick<StudentFile, "id" | "downloadUrl" | "name">) => void {
  const { markStepComplete } = useStudentOnboarding();
  const onOpened = useCallback(() => markStepComplete("download-resource"), [markStepComplete]);
  return useOpenFile(onOpened);
}

/** Props for {@link DownloadFileButton}. */
export interface DownloadFileButtonProps {
  /** The file the button opens. */
  file: Pick<StudentFile, "id" | "downloadUrl" | "name">;
  /** What the click calls (from {@link useDownloadFile}, shared by a list). */
  onDownload: (file: Pick<StudentFile, "id" | "downloadUrl" | "name">) => void;
}

/**
 * A row's "Download" button. Its accessible name carries the file's name so
 * a list of them can be told apart.
 *
 * @param props - See {@link DownloadFileButtonProps}.
 * @param props.file - The file.
 * @param props.onDownload - Opens it.
 * @returns The button.
 */
export function DownloadFileButton({ file, onDownload }: DownloadFileButtonProps) {
  return (
    <button
      type="button"
      className={rowButton}
      title="Save this file to your device"
      aria-label={`Download ${file.name}`}
      onClick={() => onDownload(file)}
    >
      Download
    </button>
  );
}
