import { API_BASE_URL } from "@/lib/constants";
import { refreshAccessToken } from "@/lib/authFetch";
import { sessionStore } from "@/lib/session";
import type { ChatAttachment } from "@/types/chat";

// services/chat.service.ts

const UPLOAD_FAILED = "Couldn't upload the file. Please try again.";

/** The parsed outcome of one `XMLHttpRequest` upload. */
interface XhrResult {
  status: number;
  body: UploadResponseBody | null;
}

/** The fields the upload endpoint returns for a stored attachment. */
interface UploadResponseBody {
  url?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  type?: ChatAttachment["type"];
  width?: number;
  height?: number;
  duration?: number;
  playbackUrl?: string;
  message?: string | string[];
  [key: string]: unknown;
}

/**
 * One multipart POST with upload progress (fetch can't report it).
 *
 * @param url - Absolute upload URL.
 * @param form - The multipart body.
 * @param token - Bearer token to send, if any.
 * @param onProgress - Called with the fraction uploaded so far.
 * @returns The status and parsed body of the response.
 */
function postWithProgress(
  url: string,
  form: FormData,
  token: string | null,
  onProgress?: (fraction: number) => void
): Promise<XhrResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Accept", "application/json");
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) onProgress(event.loaded / event.total);
      };
    }
    xhr.onload = () => {
      let body: UploadResponseBody | null = null;
      try {
        body = xhr.responseText ? (JSON.parse(xhr.responseText) as UploadResponseBody) : null;
      } catch {
        body = null;
      }
      resolve({ status: xhr.status, body });
    };
    xhr.onerror = () => reject(new Error("Couldn't upload the file. Check your connection and try again."));
    xhr.onabort = () => reject(new Error(UPLOAD_FAILED));
    xhr.send(form);
  });
}

export const chatService = {
  /**
   * Uploads one chat attachment (`POST /upload/chat-attachment`, multipart `file`).
   * Sends the bearer token and refreshes it once on 401, like `authFetch`.
   *
   * @param file - The file the student picked.
   * @param onProgress - Called with the fraction uploaded so far.
   * @returns The stored attachment's URL and metadata.
   * @throws {Error} When the upload fails or returns no URL.
   */
  uploadChatAttachment: async (
    file: File,
    onProgress?: (fraction: number) => void
  ): Promise<Partial<ChatAttachment> & { url: string }> => {
    const url = `${API_BASE_URL}/upload/chat-attachment`;
    const makeForm = () => {
      const form = new FormData();
      form.append("file", file, file.name);
      return form;
    };
    const stored = sessionStore.getToken();

    let result = await postWithProgress(url, makeForm(), stored, onProgress);
    if (result.status === 401) {
      const token = await refreshAccessToken();
      result = await postWithProgress(url, makeForm(), token, onProgress);
    }

    if (result.status < 200 || result.status >= 300 || !result.body?.url) {
      const message = Array.isArray(result.body?.message)
        ? result.body.message[0]
        : result.body?.message;
      throw new Error(typeof message === "string" && message ? message : UPLOAD_FAILED);
    }

    const data = result.body;
    return {
      url: data.url as string,
      name: data.name || file.name,
      mimeType: data.mimeType || file.type,
      size: typeof data.size === "number" ? data.size : file.size,
      type: data.type || undefined,
      width: typeof data.width === "number" ? data.width : undefined,
      height: typeof data.height === "number" ? data.height : undefined,
      duration: typeof data.duration === "number" ? data.duration : undefined,
      playbackUrl: typeof data.playbackUrl === "string" ? data.playbackUrl : undefined,
    };
  },
};
