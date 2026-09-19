# Chat media kit

How every Talim web app shows, sends and plays chat media.

**Reference copy: Talim-Sch-Admin `src/components/chat-kit/`.** It is copied
file-for-file into Talim-Teachers, Talim-students-web and talim-parents (as
`.jsx` under `src/Components/chat-kit/`). **Change it here first, then copy.**
Don't edit a copy on its own.

Rules for the kit:

- No imports from the app (contexts, stores, toasts, API clients, theme
  components). App-specific behaviour comes in through props/callbacks
  (`uploadFn`, `onError`, `onPlaybackError`, `onAutoStop`).
- Only `react`, `react-dom` and `lucide-react`; styling is plain Tailwind.
- Works on React 18 and 19.

## Files

| File | Exports |
|---|---|
| `mediaTypes.ts` | `pickRecorderMime(isTypeSupported?)`, `extensionForMime(mime)`, `formatDuration(s)`, `formatBytes(n)`, `fileExtension(name)`, `fileKind(file)`, `attachmentKind(att)`, `maxBytesFor(kind)`, `validateFile(file)`, `addToSelection(current, incoming)`, `messageTypeFor(kinds, isVoice)`, `fitWithin(w, h, maxW, maxH)`, `extractLinks(text)`; limits `MAX_FILES_PER_MESSAGE` (10), `MAX_IMAGE_BYTES` (15 MB), `MAX_VIDEO_BYTES` (100 MB), `MAX_OTHER_BYTES` (25 MB), `MAX_VOICE_SECONDS` (300), `ALLOWED_EXTENSIONS`, `ATTACHMENT_ACCEPT`, `IMAGE_ACCEPT`; types `AttachmentKind`, `ChatKitAttachment`, `SendableAttachment` |
| `activePlayer.ts` | `activePlayerController`, `createActivePlayerController()` — one voice note plays at a time |
| `AttachmentGrid.tsx` | `AttachmentGrid`, `MEDIA_MAX_WIDTH`, `MEDIA_MAX_HEIGHT` |
| `Lightbox.tsx` | `Lightbox` |
| `VoicePlayer.tsx` | `VoicePlayer`, `VOICE_PLAY_ERROR` |
| `useVoiceRecorder.ts` | `useVoiceRecorder`, `VOICE_*_ERROR` messages |
| `ComposerAttachments.tsx` | `ComposerAttachments` |
| `useAttachmentUpload.ts` | `useAttachmentUpload(uploadFn)`, `uploadAttachments(items, uploadFn, options)`, `toSendableAttachment` |
| `linkify.ts` | `linkify(text)` → `{type:'text'|'link', text, href?}[]`; pure, the mobile app carries a copy |
| `Linkified.tsx` | `Linkified` — message text with tappable links (`rel="noopener noreferrer"`) |
| `clipboard.ts` | `copyText(text)` → `Promise<boolean>` (Clipboard API, textarea fallback) |
| `ReplyQuote.tsx` | `ReplyBar` (above the composer), `QuotedMessage` (inside the bubble); types `ChatReplyTo`, `ReplyDraft` |
| `ComposerTextarea.tsx` | `ComposerTextarea` (auto-growing message box), `shouldSubmitOnEnter`, `primaryPointerIsTouch` |
| `MessageMenu.tsx` | `MessageMenu` — Reply / Copy text / Download / Delete for one message |
| `index.ts` | everything above |
| `__tests__/` | jest tests (copy only into apps that run jest) |

## Props

```ts
<AttachmentGrid
  attachments={message.attachments}   // { url, type, name, mimeType, size, width, height, duration, playbackUrl }[]
  tone="inverted"                     // "default" | "inverted" (light-on-dark own bubbles)
  progress={[0.4, 1]}                 // optional: upload progress per attachment index, 0–1
  pending={isPendingBubble}           // optional: local previews, no download links
  onPlaybackError={(msg) => toast(msg)} // optional
/>
// Caption (message.text) goes below the grid, rendered by the bubble.

<Lightbox images={[{ url, name }]} index={openIndex /* number | null */} onClose={...} onIndexChange={setIndex} />

<VoicePlayer url={a.url} playbackUrl={a.playbackUrl} duration={a.duration} tone="default" pending={false} onError={...} />

const recorder = useVoiceRecorder({ maxDurationSeconds: 300, onAutoStop: (rec) => rec && send(rec) });
// recorder.start(): Promise<boolean>
// recorder.stop(): Promise<{ file: File; duration: number } | null>   (null + error "Hold longer to record" under 1 s)
// recorder.cancel(), recorder.isRecording, recorder.elapsed, recorder.error, recorder.clearError()

<ComposerAttachments files={files} onRemove={(i) => ...} errors={errors} onDismissErrors={...} disabled={false} />
// Add picks with: const { files, errors } = addToSelection(current, Array.from(input.files));
// <input type="file" multiple accept={ATTACHMENT_ACCEPT} />

const { upload, isUploading, progress } = useAttachmentUpload(uploadFn);
// uploadFn(file, onProgress?) => Promise<{ url, name?, mimeType?, size?, type?, width?, height?, duration? }>
// upload(items: { file, kind?, duration?, uploaded? }[], { onProgress?(i, f), onItemUploaded?(i, att), concurrency? })
//   → Promise<SendableAttachment[]>; items already `uploaded` are skipped (retry re-uploads only failures).
```

## Sending (what the apps do with it)

- `type`: `voice` for a recording (attachment `kind: "audio"`, `duration` on the
  message), `image` when every file is an image, else `file`
  (`messageTypeFor`). Caption goes in `text`.
- Voice files are named `voice-note-<ts>.<m4a|aac|webm|ogg>` so the backend's
  extension allowlist accepts them.

## Notes

- **Lightbox inside dialogs:** `Lightbox` renders in a portal on `document.body`.
  A modal dialog that traps focus and blocks outside pointer events (Radix
  `Dialog`, headless `Dialog` with `modal`) makes the lightbox unusable. Open it
  from a non-modal panel, or close the dialog first.
- **Failed messages:** pass `failed` to `AttachmentGrid` for messages that
  couldn't be sent, so voice notes show a warning instead of a spinner and no
  progress overlays remain.
- **Plain `<img>`:** the kit uses `<img>` on purpose (blob previews, CDN URLs, no
  Next image config needed). Apps whose lint loads the Next plugin report
  `@next/next/no-img-element` warnings for these tags; the kit carries no
  rule-specific disable comments because the apps' lint setups differ (a disable
  for a rule an app doesn't load is itself a lint error).

### Text, replies, composer and message menu

```tsx
<Linkified text={message.text} tone={isMe ? "inverted" : "default"} />   // inside a whitespace-pre-wrap <p>

{message.replyTo && <QuotedMessage replyTo={message.replyTo} tone=... onJump={loaded ? scrollTo : undefined} />}
{reply && <ReplyBar reply={{ messageId, senderName, preview }} onCancel={() => setReply(null)} />}

<ComposerTextarea value={text} onValueChange={setText} onSubmit={send} placeholder="Type a message" />
// Enter sends with a mouse; on a touch screen Enter is a new line and the Send button sends.

<MessageMenu
  messageId={message._id}
  text={message.text}
  attachments={message.attachments}
  onReply={() => setReply(...)}
  onDelete={mine || canModerate ? () => deleteMessage(message._id) : undefined}  // omit = no Delete item
  onNotify={toast}
  className="absolute right-1 top-1"
/>
// The bubble (or a wrapper) needs the Tailwind `group` class: on devices with hover the trigger
// appears on hover; on touch it is always visible. Render it only on stored messages — not on
// pending/failed/deleted ones. It renders nothing when no action applies.
```

Sending a reply: put `replyToId` (the quoted message's `_id`) in the `send-chat-message`
payload and clear the reply once the bubble exists. The server returns the quote as `message.replyTo`.
