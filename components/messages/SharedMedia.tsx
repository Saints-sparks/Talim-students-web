"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Link2 } from "lucide-react";
import {
  Lightbox,
  attachmentKind,
  extractLinks,
  formatBytes,
} from "@/components/chat-kit";
import type { ChatAttachment, ChatMessage } from "@/types/chat";

interface SharedMediaProps {
  messages: ChatMessage[];
}

interface Collected {
  images: ChatAttachment[];
  videos: ChatAttachment[];
  documents: ChatAttachment[];
  links: string[];
}

/** Images, videos, documents and links from the messages loaded in this chat, newest first. */
function collect(messages: ChatMessage[]): Collected {
  const result: Collected = { images: [], videos: [], documents: [], links: [] };
  const seenLinks = new Set<string>();
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.status !== "sent") continue;
    message.attachments.forEach((attachment) => {
      if (!attachment.url) return;
      const kind = attachmentKind(attachment);
      if (kind === "image") result.images.push(attachment);
      else if (kind === "video") result.videos.push(attachment);
      else if (kind === "document" || kind === "file") result.documents.push(attachment);
    });
    extractLinks(message.text).forEach((link) => {
      if (seenLinks.has(link)) return;
      seenLinks.add(link);
      result.links.push(link);
    });
  }
  return result;
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section className="mt-4 first:mt-0">
      <h5 className="mb-2 text-xs font-medium uppercase tracking-wide text-[#7B7B7B]">
        {title} · {count}
      </h5>
      {children}
    </section>
  );
}

export default function SharedMedia({ messages }: SharedMediaProps) {
  const { images, videos, documents, links } = useMemo(() => collect(messages), [messages]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const empty = !images.length && !videos.length && !documents.length && !links.length;

  return (
    <div>
      <p className="mb-3 text-xs text-[#9B9B9B]">From loaded messages</p>

      {empty && (
        <p className="py-6 text-center text-sm text-[#7B7B7B]">
          No photos, videos, files or links in the loaded messages.
        </p>
      )}

      <Section title="Photos" count={images.length}>
        <div className="grid grid-cols-3 gap-1">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="aspect-square overflow-hidden rounded-md bg-gray-100"
              aria-label={`Open image ${index + 1} of ${images.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.name || `Image ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        <Lightbox
          images={images.map((image) => ({ url: image.url, name: image.name }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      </Section>

      <Section title="Videos" count={videos.length}>
        <div className="grid grid-cols-2 gap-2">
          {videos.map((video, index) => (
            <video
              key={`${video.url}-${index}`}
              src={video.url}
              controls
              preload="metadata"
              playsInline
              className="aspect-video w-full rounded-md bg-black"
            />
          ))}
        </div>
      </Section>

      <Section title="Documents" count={documents.length}>
        <ul className="flex flex-col gap-1.5">
          {documents.map((doc, index) => (
            <li
              key={`${doc.url}-${index}`}
              className="flex items-center gap-2 rounded-lg bg-gray-900/5 px-2.5 py-2"
            >
              <FileText size={18} className="flex-shrink-0 text-gray-500" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#030E18]" title={doc.name}>
                  {doc.name || "File"}
                </p>
                {doc.size ? <p className="text-xs text-[#7B7B7B]">{formatBytes(doc.size)}</p> : null}
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                download={doc.name || true}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-900/10"
                aria-label={`Download ${doc.name || "file"}`}
              >
                <Download size={16} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Links" count={links.length}>
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded px-1 py-1.5 text-sm text-blue-600 hover:underline"
              >
                <Link2 size={16} className="flex-shrink-0" aria-hidden />
                <span className="truncate">{link}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
