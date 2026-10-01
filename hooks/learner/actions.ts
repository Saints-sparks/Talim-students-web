"use client";

/**
 * The learner screens' actions: open a subject's group chat, open a file
 * (recording the view), and download every file as one zip.
 */
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { learnerService } from "@/services/learner.service";
import { useChatContext } from "@/contexts/ChatContext";
import { toast } from "@/components/CustomToast";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";
import type { StudentFile } from "@/types/learner";

/**
 * The messages page's address for one room.
 *
 * @param roomId - The room.
 * @returns `/messages?room=…`.
 */
export function roomHref(roomId: string): string {
  return `/messages?room=${encodeURIComponent(roomId)}`;
}

/**
 * "Message this subject": goes to the subject's group, first creating it on
 * the server when the subject has none yet (`POST /chat/course-groups/:id/open`,
 * idempotent). The chat list is refreshed so the new group shows at once.
 *
 * @returns `open(courseId, roomId)` and whether a group is being opened.
 */
export function useOpenCourseGroup() {
  const router = useRouter();
  const { refreshChatRooms } = useChatContext();
  const mutation = useMutation({
    mutationFn: (courseId: string) => learnerService.openCourseGroup(courseId),
  });

  const open = useCallback(
    async (courseId: string, roomId: string | null) => {
      if (roomId) {
        router.push(roomHref(roomId));
        return;
      }
      try {
        const room = await mutation.mutateAsync(courseId);
        const id = room._id || room.roomId;
        if (!id) throw new Error("The group came back without an id");
        refreshChatRooms();
        router.push(roomHref(id));
      } catch (error) {
        logger.error("subjects", "Opening the subject group failed", error);
        toast.error(messageForError(error, "We couldn't open this subject's group. Please try again."));
      }
    },
    [mutation, refreshChatRooms, router]
  );

  return { open, isOpening: mutation.isPending };
}

/**
 * Opens a file in a new tab and records the view (`POST /resources/:id/view`)
 * in the background; a failed record never blocks the file.
 *
 * @param onOpened - Called after a file is opened (onboarding's "download a
 *   resource" step).
 * @returns `openFile(file)`.
 */
export function useOpenFile(onOpened?: () => void) {
  return useCallback(
    (file: Pick<StudentFile, "id" | "url" | "name">) => {
      if (!file.url) {
        toast.error("This file isn't available to download yet.");
        return;
      }
      window.open(file.url, "_blank", "noopener,noreferrer");
      onOpened?.();
      void learnerService.recordFileView(file.id).catch((error) => logger.warn("files", "Recording a file view failed", error));
    },
    [onOpened]
  );
}

/**
 * Saves a blob as a file through a temporary link.
 *
 * @param blob - The bytes.
 * @param fileName - The name to save under.
 */
export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * "Download all": one streamed zip of the student's files (B7 archive),
 * optionally one subject's only.
 *
 * @returns `downloadAll(courseId?)` and whether it is running.
 */
export function useDownloadAllFiles() {
  const [isDownloading, setDownloading] = useState(false);
  const downloadAll = useCallback(async (courseId?: string) => {
    setDownloading(true);
    try {
      const { blob, fileName } = await learnerService.downloadFilesArchive(courseId);
      saveBlob(blob, fileName);
    } catch (error) {
      logger.error("files", "Downloading the archive failed", error);
      toast.error(messageForError(error, "We couldn't download your files. Please try again."));
    } finally {
      setDownloading(false);
    }
  }, []);
  return { downloadAll, isDownloading };
}
