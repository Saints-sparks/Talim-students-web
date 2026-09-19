import {
  ALLOWED_EXTENSIONS,
  ATTACHMENT_ACCEPT,
  MAX_FILES_PER_MESSAGE,
  MAX_IMAGE_BYTES,
  MAX_OTHER_BYTES,
  MAX_VIDEO_BYTES,
  RECORDER_MIME_CANDIDATES,
  TOO_MANY_FILES_MESSAGE,
  UNSUPPORTED_TYPE_MESSAGE,
  addToSelection,
  attachmentKind,
  extensionForMime,
  extractLinks,
  fileExtension,
  fileKind,
  fitWithin,
  formatBytes,
  formatDuration,
  messageTypeFor,
  pickRecorderMime,
  validateFile,
} from "../mediaTypes";

const MB = 1024 * 1024;
const file = (name: string, size = 1000, type = "") => ({ name, size, type });

describe("pickRecorderMime", () => {
  it("prefers AAC in MP4 when supported", () => {
    expect(pickRecorderMime(() => true)).toBe("audio/mp4;codecs=mp4a.40.2");
  });

  it("falls through the list in order", () => {
    const supported = new Set(["audio/webm", "audio/ogg;codecs=opus"]);
    expect(pickRecorderMime((m) => supported.has(m))).toBe("audio/webm");
    expect(pickRecorderMime((m) => m === "audio/ogg;codecs=opus")).toBe("audio/ogg;codecs=opus");
  });

  it("returns '' when nothing is supported or the check throws", () => {
    expect(pickRecorderMime(() => false)).toBe("");
    expect(
      pickRecorderMime(() => {
        throw new Error("nope");
      })
    ).toBe("");
  });

  it("returns '' without MediaRecorder (node)", () => {
    expect(pickRecorderMime()).toBe("");
  });

  it("checks the documented candidates", () => {
    const seen: string[] = [];
    pickRecorderMime((m) => {
      seen.push(m);
      return false;
    });
    expect(seen).toEqual([...RECORDER_MIME_CANDIDATES]);
  });
});

describe("extensionForMime", () => {
  it.each([
    ["audio/mp4;codecs=mp4a.40.2", "m4a"],
    ["audio/mp4", "m4a"],
    ["audio/aac", "aac"],
    ["audio/webm;codecs=opus", "webm"],
    ["audio/webm", "webm"],
    ["audio/ogg;codecs=opus", "ogg"],
    ["", "webm"],
    [undefined, "webm"],
  ])("%s → %s", (mime, ext) => {
    expect(extensionForMime(mime)).toBe(ext);
  });
});

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [12.9, "0:12"],
    [65, "1:05"],
    [600, "10:00"],
    [NaN, "0:00"],
    [Infinity, "0:00"],
    [-3, "0:00"],
    [undefined, "0:00"],
    [null, "0:00"],
  ])("%s → %s", (seconds, text) => {
    expect(formatDuration(seconds as number | undefined)).toBe(text);
  });
});

describe("formatBytes", () => {
  it("uses KB under a megabyte and MB above", () => {
    expect(formatBytes(200)).toBe("1 KB");
    expect(formatBytes(512 * 1024)).toBe("512 KB");
    expect(formatBytes(2.5 * MB)).toBe("2.5 MB");
    expect(formatBytes(42 * MB)).toBe("42 MB");
    expect(formatBytes(undefined)).toBe("");
  });
});

describe("fileKind / attachmentKind", () => {
  it("uses the MIME type first", () => {
    expect(fileKind(file("x.bin", 1, "image/png"))).toBe("image");
    expect(fileKind(file("clip", 1, "video/mp4"))).toBe("video");
    expect(fileKind(file("note", 1, "audio/mp4"))).toBe("audio");
    expect(fileKind(file("a", 1, "application/pdf"))).toBe("document");
    expect(fileKind(file("a", 1, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))).toBe(
      "document"
    );
  });

  it("falls back to the extension", () => {
    expect(fileKind(file("photo.JPG"))).toBe("image");
    expect(fileKind(file("movie.mov"))).toBe("video");
    expect(fileKind(file("song.mp3"))).toBe("audio");
    expect(fileKind(file("sheet.xlsx"))).toBe("document");
    expect(fileKind(file("archive.zip"))).toBe("file");
    expect(fileKind(file("noext"))).toBe("file");
  });

  it("reads a received attachment's type, then MIME, then name / URL", () => {
    expect(attachmentKind({ url: "https://x/a", type: "audio" })).toBe("audio");
    expect(attachmentKind({ url: "https://x/a", type: "voice" })).toBe("audio");
    expect(attachmentKind({ url: "https://x/a", type: "file", mimeType: "image/jpeg" })).toBe("image");
    expect(attachmentKind({ url: "https://x/report.pdf?sig=1" })).toBe("document");
    expect(attachmentKind({ url: "https://x/blob", name: "clip.mp4" })).toBe("video");
    expect(attachmentKind({ url: "https://x/blob.zip", type: "file" })).toBe("file");
  });

  it("reads extensions without query strings", () => {
    expect(fileExtension("https://res.cloudinary.com/a/b/note.m4a?x=1#y")).toBe("m4a");
    expect(fileExtension(".hidden")).toBe("");
    expect(fileExtension("")).toBe("");
  });
});

describe("validateFile / addToSelection", () => {
  it("accepts every allowlisted extension within its size", () => {
    for (const ext of ALLOWED_EXTENSIONS) {
      expect(validateFile(file(`a.${ext}`))).toBeNull();
    }
    expect(ATTACHMENT_ACCEPT.split(",")).toHaveLength(ALLOWED_EXTENSIONS.length);
  });

  it("rejects HEIC, MOV and unknown types", () => {
    expect(validateFile(file("IMG_1.HEIC", 10, "image/heic"))).toContain(UNSUPPORTED_TYPE_MESSAGE);
    expect(validateFile(file("clip.mov", 10, "video/quicktime"))).toContain(UNSUPPORTED_TYPE_MESSAGE);
    expect(validateFile(file("tool.exe"))).toContain(UNSUPPORTED_TYPE_MESSAGE);
    expect(validateFile(file("noext"))).toContain(UNSUPPORTED_TYPE_MESSAGE);
  });

  it("applies per-kind size limits", () => {
    expect(validateFile(file("a.png", MAX_IMAGE_BYTES))).toBeNull();
    expect(validateFile(file("a.png", MAX_IMAGE_BYTES + 1))).toMatch(/too large \(max 15 MB\)/);
    expect(validateFile(file("a.mp4", MAX_VIDEO_BYTES))).toBeNull();
    expect(validateFile(file("a.mp4", MAX_VIDEO_BYTES + 1))).toMatch(/max 100 MB/);
    expect(validateFile(file("a.pdf", MAX_OTHER_BYTES + 1))).toMatch(/max 25 MB/);
    expect(validateFile(file("a.pdf", 0))).toMatch(/empty/);
  });

  it("keeps valid files, reports each problem, and caps the count", () => {
    const current = Array.from({ length: MAX_FILES_PER_MESSAGE - 1 }, (_, i) => file(`f${i}.pdf`));
    const result = addToSelection(current, [file("bad.heic"), file("ok.png"), file("extra.png")]);
    expect(result.files).toHaveLength(MAX_FILES_PER_MESSAGE);
    expect(result.files[MAX_FILES_PER_MESSAGE - 1].name).toBe("ok.png");
    expect(result.errors).toEqual([`bad.heic: ${UNSUPPORTED_TYPE_MESSAGE}`, TOO_MANY_FILES_MESSAGE]);
  });
});

describe("messageTypeFor", () => {
  it("picks voice / image / file / text", () => {
    expect(messageTypeFor(["audio"], true)).toBe("voice");
    expect(messageTypeFor(["image", "image"])).toBe("image");
    expect(messageTypeFor(["image", "document"])).toBe("file");
    expect(messageTypeFor(["video"])).toBe("file");
    expect(messageTypeFor([])).toBe("text");
  });
});

describe("fitWithin", () => {
  it("scales down to the box keeping the aspect ratio, never up", () => {
    expect(fitWithin(1600, 1200, 280, 360)).toEqual({ width: 280, height: 210 });
    expect(fitWithin(1080, 1920, 280, 360)).toEqual({ width: 203, height: 360 });
    expect(fitWithin(100, 50, 280, 360)).toEqual({ width: 100, height: 50 });
    expect(fitWithin(undefined, 50, 280, 360)).toBeNull();
  });
});

describe("extractLinks", () => {
  it("finds http(s) and www links without trailing punctuation or duplicates", () => {
    expect(
      extractLinks("See https://talim.app/fees, and www.example.com/a?b=1). Again: https://talim.app/fees")
    ).toEqual(["https://talim.app/fees", "https://www.example.com/a?b=1"]);
    expect(extractLinks("no links here")).toEqual([]);
    expect(extractLinks(undefined)).toEqual([]);
  });
});
