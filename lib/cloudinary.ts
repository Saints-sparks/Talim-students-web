import { ApiError } from "@/lib/apiError";

/** Where profile photos are uploaded, read from the deployment's environment. */
export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

/**
 * Reads the Cloudinary account and unsigned upload preset from
 * `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
 *
 * The variables are read on each call, not at import, so a deployment without
 * them still builds and only the upload itself reports the gap.
 *
 * @returns The config, or `null` when either variable is missing.
 */
export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  return cloudName && uploadPreset ? { cloudName, uploadPreset } : null;
}

/**
 * Uploads an image straight to Cloudinary and returns its public URL. This is
 * the one call in the app that does not go through the API client: the target
 * is a third-party origin, so the session token must never be attached.
 *
 * @param file - The image the student picked.
 * @returns The `secure_url` of the stored image.
 * @throws {ApiError} `UNKNOWN` when uploads are not configured or Cloudinary
 * rejects the file, `SERVICE_UNAVAILABLE` when Cloudinary cannot be reached.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new ApiError("UNKNOWN", "Photo uploads aren't set up for this app yet.", 0);
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", config.uploadPreset);

  let response: Response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`, {
      method: "POST",
      body,
    });
  } catch {
    throw ApiError.unreachable();
  }

  const payload = (await response.json().catch(() => null)) as { secure_url?: unknown } | null;
  if (!response.ok || typeof payload?.secure_url !== "string" || !payload.secure_url) {
    throw new ApiError("UNKNOWN", "We couldn't upload that image. Please try another one.", response.status);
  }
  return payload.secure_url;
}
