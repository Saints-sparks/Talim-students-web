import { toSendableAttachment, uploadAttachments, type UploadItem } from "../useAttachmentUpload";

function makeFile(name: string, type: string, size = 10): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("uploadAttachments", () => {
  it("uploads two at a time and returns attachments in order", async () => {
    let running = 0;
    let peak = 0;
    const uploadFn = jest.fn(async (file: File) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 5));
      running--;
      return { url: `https://cdn/${file.name}`, width: 10, height: 20 };
    });
    const items: UploadItem[] = ["a.png", "b.png", "c.pdf"].map((name) => ({
      file: makeFile(name, name.endsWith(".png") ? "image/png" : "application/pdf"),
    }));
    const progress: Array<[number, number]> = [];

    const result = await uploadAttachments(items, uploadFn, { onProgress: (i, f) => progress.push([i, f]) });

    expect(peak).toBe(2);
    expect(result.map((a) => a.url)).toEqual(["https://cdn/a.png", "https://cdn/b.png", "https://cdn/c.pdf"]);
    expect(result[0]).toMatchObject({ type: "image", name: "a.png", mimeType: "image/png", size: 10, width: 10 });
    expect(result[2].type).toBe("document");
    expect(progress).toContainEqual([2, 1]);
  });

  it("skips uploaded items on retry and keeps what succeeded", async () => {
    const items: UploadItem[] = [
      { file: makeFile("ok.png", "image/png") },
      { file: makeFile("flaky.pdf", "application/pdf") },
    ];
    let fail = true;
    const uploadFn = jest.fn(async (file: File) => {
      if (file.name === "flaky.pdf" && fail) throw new Error("Network down");
      return { url: `https://cdn/${file.name}` };
    });

    await expect(uploadAttachments(items, uploadFn, { concurrency: 1 })).rejects.toThrow("Network down");
    expect(items[0].uploaded?.url).toBe("https://cdn/ok.png");
    expect(items[1].uploaded).toBeUndefined();

    fail = false;
    const result = await uploadAttachments(items, uploadFn);
    expect(result.map((a) => a.url)).toEqual(["https://cdn/ok.png", "https://cdn/flaky.pdf"]);
    expect(uploadFn.mock.calls.map(([f]) => (f as File).name)).toEqual(["ok.png", "flaky.pdf", "flaky.pdf"]);
  });

  it("treats a response without a URL as a failure", async () => {
    const items: UploadItem[] = [{ file: makeFile("a.png", "image/png") }];
    await expect(uploadAttachments(items, async () => ({ url: "" }))).rejects.toThrow("Upload failed");
  });
});

describe("toSendableAttachment", () => {
  it("forces the voice note type and keeps the local duration when the server has none", () => {
    const file = makeFile("voice-note-1.webm", "audio/webm");
    expect(
      toSendableAttachment({ file, kind: "audio", duration: 7 }, { url: "https://cdn/v.webm", type: "video" })
    ).toEqual({ url: "https://cdn/v.webm", name: "voice-note-1.webm", mimeType: "audio/webm", size: 10, type: "audio", duration: 7 });
  });

  it("prefers the server's duration", () => {
    const file = makeFile("n.m4a", "audio/mp4");
    expect(toSendableAttachment({ file, kind: "audio", duration: 7 }, { url: "u", duration: 6.4 }).duration).toBe(6.4);
  });
});
