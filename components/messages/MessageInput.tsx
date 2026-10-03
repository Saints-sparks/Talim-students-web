"use client";

import { useId, useRef, useState } from "react";
import { Mic, Paperclip, X } from "lucide-react";
import {
  ATTACHMENT_ACCEPT,
  ComposerAttachments,
  ComposerTextarea,
  addToSelection,
  formatDuration,
  useVoiceRecorder,
  type VoiceRecording,
} from "@/components/chat-kit";
import { focusRing, primaryButton } from "@/components/tl/styles";

interface MessageInputProps {
  onSendMessage?: (content: string) => void;
  /** Sends the picked files with the typed text as their caption. */
  onSendFiles?: (files: File[], caption: string) => void;
  onSendVoice?: (file: File, durationSeconds: number) => void;
  disabled?: boolean;
  /** Draft restored when the room is reopened. */
  initialValue?: string;
  onDraftChange?: (text: string) => void;
}

/** The round 44px icon button beside the message box (attach, record). */
const iconButton = `flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-tl-line text-tl-muted transition-colors hover:bg-tl-bg hover:text-tl-ink disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

/**
 * The composer, as the redesign draws it: attach, a labelled "Write a
 * message" box that grows with the text, record a voice note, and Send.
 * Picked files wait above the box with the text as their caption.
 *
 * @param props - See {@link MessageInputProps}.
 * @param props.onSendMessage - Sends text.
 * @param props.onSendFiles - Sends files with a caption.
 * @param props.onSendVoice - Sends a voice note.
 * @param props.disabled - Whether sending is off.
 * @param props.initialValue - The saved draft.
 * @param props.onDraftChange - Saves the draft as it changes.
 * @returns The composer.
 */
export default function MessageInput({
  onSendMessage,
  onSendFiles,
  onSendVoice,
  disabled = false,
  initialValue = "",
  onDraftChange,
}: MessageInputProps) {
  const [message, setMessage] = useState(initialValue);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const sendRecording = (recording: VoiceRecording | null) => {
    if (recording) onSendVoice?.(recording.file, recording.duration);
  };

  // The thread remounts per room, so leaving a room or the page throws the
  // recording away and releases the microphone (the hook does it on unmount).
  const recorder = useVoiceRecorder({ onAutoStop: sendRecording });

  const updateMessage = (text: string) => {
    setMessage(text);
    onDraftChange?.(text);
  };

  const hasText = message.trim().length > 0;
  const hasFiles = files.length > 0;
  const canSend = (hasText || hasFiles) && !recorder.isRecording && !disabled;

  const handleSendMessage = () => {
    if (!canSend) return;
    // The message now lives in a pending bubble, which offers Retry if it fails.
    if (hasFiles && onSendFiles) {
      onSendFiles(files, message.trim());
      setFiles([]);
      setFileErrors([]);
      updateMessage("");
      return;
    }
    if (hasText && onSendMessage) {
      onSendMessage(message.trim());
      updateMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;
    const result = addToSelection(files, picked);
    setFiles(result.files);
    setFileErrors(result.errors);
  };

  const startRecording = async () => {
    if (disabled) return;
    recorder.clearError();
    await recorder.start();
  };

  const stopAndSend = async () => {
    sendRecording(await recorder.stop());
  };

  return (
    <div className="border-t border-tl-line-soft px-[clamp(12px,2vw,20px)] py-3.5" data-guide="messages-input">
      <ComposerAttachments
        files={files}
        onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
        errors={fileErrors}
        onDismissErrors={() => setFileErrors([])}
        disabled={disabled}
        className="mb-2"
      />

      {recorder.error && !recorder.isRecording && (
        <div
          role="alert"
          className="mb-2 flex items-center gap-2 rounded-xl bg-tl-danger-bg px-3 py-1.5 text-[13px] text-tl-danger"
        >
          <span className="flex-1">{recorder.error}</span>
          <button
            type="button"
            onClick={recorder.clearError}
            className={`flex h-11 w-11 items-center justify-center rounded-full ${focusRing}`}
            aria-label="Dismiss"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2.5">
        {recorder.isRecording ? (
          <div className="flex min-h-[46px] flex-1 items-center gap-3 rounded-[13px] border border-tl-danger bg-tl-danger-bg pl-4 pr-1 text-tl-danger">
            <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-tl-danger" aria-hidden />
            <span className="text-sm font-bold">Recording</span>
            <span className="ml-auto text-sm tabular-nums" aria-live="polite">
              {formatDuration(recorder.elapsed)}
            </span>
            <button
              type="button"
              onClick={recorder.cancel}
              className={`flex h-11 w-11 items-center justify-center rounded-full ${focusRing}`}
              title="Cancel recording"
              aria-label="Cancel recording"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept={ATTACHMENT_ACCEPT}
              onChange={handleFileChange}
              tabIndex={-1}
              aria-hidden
            />
            <button
              type="button"
              className={iconButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || !onSendFiles}
              title="Attach a file"
              aria-label="Attach files"
            >
              <Paperclip className="h-[18px] w-[18px]" aria-hidden />
            </button>

            <div className="min-w-0 flex-1">
              <label htmlFor={inputId} className="sr-only">
                Write a message
              </label>
              <ComposerTextarea
                id={inputId}
                placeholder={hasFiles ? "Add a caption" : "Write a message"}
                className={`block min-h-[46px] w-full rounded-[13px] border border-tl-control bg-tl-surface px-3.5 py-[11px] text-[15px] leading-6 text-tl-ink placeholder:text-tl-faint disabled:opacity-60 ${focusRing}`}
                value={message}
                onValueChange={updateMessage}
                // Enter sends with a mouse; on a touch screen it is a new line and Send sends.
                onSubmit={handleSendMessage}
                disabled={disabled}
              />
            </div>

            <button
              type="button"
              className={iconButton}
              onClick={() => void startRecording()}
              disabled={disabled || !onSendVoice}
              title="Record a voice note"
              aria-label="Record voice note"
            >
              <Mic className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </>
        )}

        {recorder.isRecording ? (
          <button
            type="button"
            className={primaryButton}
            onClick={() => void stopAndSend()}
            title="Stop and send"
            aria-label="Stop and send voice note"
          >
            Send
          </button>
        ) : (
          <button
            type="button"
            className={primaryButton}
            onClick={handleSendMessage}
            disabled={!canSend}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
