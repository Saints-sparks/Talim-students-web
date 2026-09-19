"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Mic, Paperclip, SendHorizontal, X } from "lucide-react";
import type { ReplyTarget } from "@/types/chat";
import {
  ATTACHMENT_ACCEPT,
  ComposerAttachments,
  addToSelection,
  formatDuration,
  useVoiceRecorder,
  type VoiceRecording,
} from "@/components/chat-kit";

interface MessageInputProps {
  onSendMessage?: (content: string) => void;
  /** Sends the picked files with the typed text as their caption. */
  onSendFiles?: (files: File[], caption: string) => void;
  onSendVoice?: (file: File, durationSeconds: number) => void;
  replyingMessage?: ReplyTarget | null;
  disabled?: boolean;
  /** Draft restored when the room is reopened. */
  initialValue?: string;
  onDraftChange?: (text: string) => void;
}

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
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
    <div className="p-4 bg-white border-t border-gray-100" data-guide="messages-input">
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
          className="mb-2 flex items-center gap-2 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-700"
        >
          <span className="flex-1">{recorder.error}</span>
          <button
            type="button"
            onClick={recorder.clearError}
            className="rounded p-0.5 hover:bg-red-100"
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-end space-x-3">
        {recorder.isRecording ? (
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" aria-hidden />
            <span className="text-sm text-red-600 font-medium">Recording</span>
            <span className="text-sm text-red-500 ml-auto tabular-nums" aria-live="polite">
              {formatDuration(recorder.elapsed)}
            </span>
            <button
              type="button"
              onClick={recorder.cancel}
              className="p-1 rounded-full hover:bg-red-100"
              title="Cancel recording"
              aria-label="Cancel recording"
            >
              <X size={16} className="text-red-500" />
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
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || !onSendFiles}
              title="Attach files"
              aria-label="Attach files"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <Input
                placeholder={hasFiles ? "Add a caption..." : "Type a message..."}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 resize-none"
                value={message}
                onChange={(e) => updateMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
              />
            </div>
          </>
        )}

        {recorder.isRecording ? (
          <button
            type="button"
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            onClick={() => void stopAndSend()}
            title="Stop and send"
            aria-label="Stop and send voice note"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        ) : canSend ? (
          <button
            type="button"
            className="p-2 rounded-full transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSendMessage}
            aria-label="Send"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            className="p-2 rounded-full transition-all duration-200 text-gray-500 hover:bg-gray-100 disabled:text-gray-300"
            onClick={() => void startRecording()}
            disabled={disabled || !onSendVoice}
            title="Record voice note"
            aria-label="Record voice note"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
