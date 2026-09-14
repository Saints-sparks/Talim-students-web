/**
 * Chat media kit. Reference copy: Talim-Sch-Admin `src/components/chat-kit/`.
 * See README.md before changing anything here.
 */
export * from "./mediaTypes";
export * from "./activePlayer";
export { AttachmentGrid, MEDIA_MAX_WIDTH, MEDIA_MAX_HEIGHT } from "./AttachmentGrid";
export type { AttachmentGridProps } from "./AttachmentGrid";
export { Lightbox } from "./Lightbox";
export type { LightboxImage, LightboxProps } from "./Lightbox";
export { VoicePlayer, VOICE_PLAY_ERROR } from "./VoicePlayer";
export type { VoicePlayerProps } from "./VoicePlayer";
export {
  useVoiceRecorder,
  VOICE_UNSUPPORTED_ERROR,
  VOICE_PERMISSION_ERROR,
  VOICE_TOO_SHORT_ERROR,
  VOICE_FAILED_ERROR,
  VOICE_NO_MIC_ERROR,
} from "./useVoiceRecorder";
export type { VoiceRecording, UseVoiceRecorderOptions, UseVoiceRecorderReturn } from "./useVoiceRecorder";
export { ComposerAttachments } from "./ComposerAttachments";
export type { ComposerAttachmentsProps } from "./ComposerAttachments";
export { useAttachmentUpload, uploadAttachments, toSendableAttachment } from "./useAttachmentUpload";
export type { ChatUploadFn, UploadItem, UploadOptions, UseAttachmentUploadReturn } from "./useAttachmentUpload";
