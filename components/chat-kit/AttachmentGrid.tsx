"use client";

/**
 * Chat media kit — a message's attachments: images (one at natural aspect,
 * 2–4 as a square grid, more as 4 tiles with "+N"), videos, voice notes and
 * document chips. Images open in the Lightbox. The caption (`text`) is the
 * bubble's job, not the grid's.
 */
import { useMemo, useState } from "react";
import { Download, File as FileIcon, FileText, Loader2 } from "lucide-react";
import { Lightbox } from "./Lightbox";
import { VoicePlayer } from "./VoicePlayer";
import { attachmentKind, fitWithin, formatBytes, type AttachmentKind, type ChatKitAttachment } from "./mediaTypes";

export interface AttachmentGridProps {
  attachments: ChatKitAttachment[];
  /** `inverted` for light-on-dark bubbles (your own messages). */
  tone?: "default" | "inverted";
  /**
   * Upload progress per attachment index (0–1) while a message is still
   * sending. Items below 1 show a progress overlay.
   */
  progress?: Array<number | undefined>;
  /** The message isn't stored yet (local previews, no downloads). */
  pending?: boolean;
  /** The message failed to send: no spinners or progress, shown as not sent. */
  failed?: boolean;
  className?: string;
  /** Called with a user-facing message when a voice note can't play. */
  onPlaybackError?: (message: string) => void;
}

/** Largest single image / video box, in px. */
export const MEDIA_MAX_WIDTH = 280;
export const MEDIA_MAX_HEIGHT = 360;
const GRID_TILES = 4;

interface Indexed {
  attachment: ChatKitAttachment;
  index: number;
  kind: AttachmentKind;
}

function ProgressOverlay({ value }: { value: number | undefined }) {
  if (value === undefined || value >= 1) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
      <div className="flex flex-col items-center gap-1">
        <Loader2 size={20} className="animate-spin" aria-hidden />
        {value > 0 && <span className="text-xs tabular-nums">{Math.round(value * 100)}%</span>}
      </div>
    </div>
  );
}

export function AttachmentGrid({
  attachments,
  tone = "default",
  progress,
  pending = false,
  failed = false,
  className = "",
  onPlaybackError,
}: AttachmentGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inverted = tone === "inverted";
  // A failed message isn't uploading any more: no progress overlays.
  const shownProgress = failed ? undefined : progress;

  const items = useMemo<Indexed[]>(
    () =>
      (attachments ?? [])
        .filter((a) => a && (a.url || pending))
        .map((attachment, index) => ({ attachment, index, kind: attachmentKind(attachment) })),
    [attachments, pending]
  );
  const images = items.filter((i) => i.kind === "image" && i.attachment.url);
  const others = items.filter((i) => !(i.kind === "image" && i.attachment.url));

  if (items.length === 0) return null;

  const renderImages = () => {
    if (images.length === 0) return null;
    if (images.length === 1) {
      const { attachment, index } = images[0];
      const size = fitWithin(attachment.width, attachment.height, MEDIA_MAX_WIDTH, MEDIA_MAX_HEIGHT);
      return (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative block overflow-hidden rounded-lg bg-black/5"
          style={size ? { width: size.width, height: size.height } : undefined}
          aria-label={`Open image${attachment.name ? ` ${attachment.name}` : ""}`}
        >
          <img
            src={attachment.url}
            alt={attachment.name || "Image"}
            loading="lazy"
            width={size?.width}
            height={size?.height}
            className={size ? "h-full w-full object-contain" : "block h-auto max-h-[360px] w-auto max-w-[280px] object-contain"}
          />
          <ProgressOverlay value={shownProgress?.[index]} />
        </button>
      );
    }

    const shown = images.slice(0, GRID_TILES);
    const extra = images.length - GRID_TILES;
    return (
      <div className="grid grid-cols-2 gap-1" style={{ width: MEDIA_MAX_WIDTH, maxWidth: "100%" }}>
        {shown.map(({ attachment, index }, tile) => (
          <button
            key={`${attachment.url}-${index}`}
            type="button"
            onClick={() => setLightboxIndex(tile)}
            className="relative aspect-square overflow-hidden rounded-md bg-black/5"
            aria-label={
              tile === GRID_TILES - 1 && extra > 0 ? `Open images, ${extra} more` : `Open image ${tile + 1} of ${images.length}`
            }
          >
            <img
              src={attachment.url}
              alt={attachment.name || `Image ${tile + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <ProgressOverlay value={shownProgress?.[index]} />
            {tile === GRID_TILES - 1 && extra > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-semibold text-white">
                +{extra}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderOther = ({ attachment, index, kind }: Indexed) => {
    const key = `${attachment.url || attachment.name || "file"}-${index}`;
    const itemProgress = shownProgress?.[index];

    if (kind === "video" && attachment.url) {
      const size = fitWithin(attachment.width, attachment.height, MEDIA_MAX_WIDTH, MEDIA_MAX_HEIGHT);
      return (
        <div key={key} className="relative overflow-hidden rounded-lg bg-black">
          <video
            src={attachment.url}
            controls
            preload="metadata"
            playsInline
            width={size?.width}
            height={size?.height}
            className="block max-h-[360px] max-w-[280px]"
          />
          <ProgressOverlay value={itemProgress} />
        </div>
      );
    }

    if (kind === "audio") {
      return (
        <VoicePlayer
          key={key}
          url={attachment.url}
          playbackUrl={attachment.playbackUrl}
          duration={attachment.duration}
          tone={tone}
          pending={pending || !attachment.url}
          failed={failed}
          onError={onPlaybackError}
        />
      );
    }

    const Icon = kind === "document" ? FileText : FileIcon;
    const sizeLabel = formatBytes(attachment.size);
    const canDownload = Boolean(attachment.url) && !pending;
    return (
      <div
        key={key}
        className={`flex w-full min-w-[200px] max-w-[280px] items-center gap-2 rounded-lg px-2.5 py-2 ${
          inverted ? "bg-white/15 text-white" : "bg-gray-900/5 text-gray-900"
        }`}
      >
        <Icon size={20} className="flex-shrink-0 opacity-80" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" title={attachment.name}>
            {attachment.name || "File"}
          </p>
          <p className={`text-xs ${inverted ? "text-white/70" : "text-gray-500"}`}>
            {itemProgress !== undefined && itemProgress < 1
              ? `Uploading${itemProgress > 0 ? ` ${Math.round(itemProgress * 100)}%` : "…"}`
              : sizeLabel}
          </p>
        </div>
        {canDownload ? (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            download={attachment.name || true}
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
              inverted ? "hover:bg-white/20" : "hover:bg-gray-900/10"
            }`}
            aria-label={`Download ${attachment.name || "file"}`}
            title="Download"
          >
            <Download size={16} aria-hidden />
          </a>
        ) : (
          itemProgress !== undefined && itemProgress < 1 && <Loader2 size={16} className="flex-shrink-0 animate-spin" aria-hidden />
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {renderImages()}
      {others.map(renderOther)}
      {images.length > 0 && (
        <Lightbox
          images={images.map(({ attachment }) => ({ url: attachment.url, name: attachment.name }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
