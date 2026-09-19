import { ApiError } from "@/lib/apiError";
import { getCloudinaryConfig, uploadImageToCloudinary } from "@/lib/cloudinary";

const ORIGINAL_ENV = { ...process.env };
const file = new File(["x"], "me.png", { type: "image/png" });

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  jest.restoreAllMocks();
});

describe("getCloudinaryConfig", () => {
  it("is null until both variables are set", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    delete process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    expect(getCloudinaryConfig()).toBeNull();
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "acme";
    expect(getCloudinaryConfig()).toBeNull();
  });

  it("reads the cloud name and preset from the environment", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = " acme ";
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = "preset";
    expect(getCloudinaryConfig()).toEqual({ cloudName: "acme", uploadPreset: "preset" });
  });
});

describe("uploadImageToCloudinary", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "acme";
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = "preset";
  });

  it("posts to the configured cloud and returns the secure url", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({ secure_url: "https://cdn.test/a.png" }) });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(uploadImageToCloudinary(file)).resolves.toBe("https://cdn.test/a.png");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.cloudinary.com/v1_1/acme/image/upload");
    expect((init.body as FormData).get("upload_preset")).toBe("preset");
    expect(init.headers).toBeUndefined();
  });

  it("refuses to upload when it is not configured, without calling the network", async () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    await expect(uploadImageToCloudinary(file)).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("turns a rejected upload and an unreachable host into typed errors", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ error: { message: "bad" } }) })
      .mockRejectedValueOnce(new TypeError("Failed to fetch")) as unknown as typeof fetch;

    await expect(uploadImageToCloudinary(file)).rejects.toMatchObject({ code: "UNKNOWN", status: 400 });
    await expect(uploadImageToCloudinary(file)).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
  });
});
