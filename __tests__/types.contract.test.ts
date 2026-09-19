/**
 * Compile-time contract guard. Each payload below is built with an alias of
 * the backend's generated contract (`types/api.d.ts`), so `tsc` (run by
 * `npm run typecheck`, not only jest) fails when a DTO renames, removes or
 * retypes a field, or adds a required one, until the portal follows it.
 * Refresh the contract with `npm run types:api`.
 *
 * The `@ts-expect-error` lines prove the guard is live: if an alias ever
 * degraded to `any`/`unknown` the unused directive would itself fail `tsc`.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { RequestBody } from "@/types/apiContract";
import type {
  AvatarUrlPayload,
  ChangePasswordBody,
  ChatPreferencesBody,
  CreateChatRoomBody,
  NotificationPreferencesBody,
  ResetPasswordPayload,
  WebPushSubscribePayload,
} from "@/types/apiPayloads";
import type { ChatPreferences } from "@/services/settings.service";
import type { NotificationPreferences } from "@/services/notification.service";
import { syncApiTypes } from "../scripts/sync-api-types-core.mjs";

describe("student write payloads type-check against the backend DTOs", () => {
  it("POST /auth/change-password", () => {
    const payload = {
      currentPassword: "Old#Pass123",
      newPassword: "Str0ng!Pass",
      confirmPassword: "Str0ng!Pass",
    } satisfies ChangePasswordBody;
    // @ts-expect-error `confirmPassword` is required by ChangePasswordDto
    const missing: ChangePasswordBody = { currentPassword: "a", newPassword: "b" };
    // @ts-expect-error a field the DTO does not declare is a 400
    const extra: ChangePasswordBody = { ...payload, logoutEverywhere: true };
    expect(payload.confirmPassword).toBe(payload.newPassword);
    expect([missing, extra]).toHaveLength(2);
  });

  it("POST /auth/reset-password", () => {
    const payload = { email: "student@school.test", token: "123456", newPassword: "Str0ng!Pass" } satisfies ResetPasswordPayload;
    // @ts-expect-error `token` is required
    const missing: ResetPasswordPayload = { email: payload.email, newPassword: payload.newPassword };
    expect(payload.token).toHaveLength(6);
    expect(missing).toBeDefined();
  });

  it("POST /notifications/web-push/subscribe", () => {
    const payload = {
      endpoint: "https://push.example.test/send/abc",
      keys: { p256dh: "BPub", auth: "secret" },
      userAgent: "jest",
    } satisfies WebPushSubscribePayload;
    // @ts-expect-error `keys` is required
    const missing: WebPushSubscribePayload = { endpoint: payload.endpoint };
    expect(payload.keys.auth).toBe("secret");
    expect(missing).toBeDefined();
  });

  it("PATCH /notifications/preferences and /chat/preferences", () => {
    const notifications = { pushEnabled: true, webPushEnabled: false, quietHoursStart: "22:00" } satisfies NotificationPreferencesBody;
    const chat = { messageNotifications: true, readReceipts: false, showOnlineStatus: true } satisfies ChatPreferencesBody;
    // @ts-expect-error `soundEnabled` is a Teachers-portal field, not a chat-preference DTO field
    const wrong: ChatPreferencesBody = { soundEnabled: true };
    // The hand-named app types are subsets of the DTOs, so they stay assignable to them.
    const asNotifications: NotificationPreferencesBody = notifications satisfies NotificationPreferences;
    const asChat: ChatPreferencesBody = chat satisfies ChatPreferences;
    expect([asNotifications, asChat, wrong]).toHaveLength(3);
  });

  it("PUT /auth/profile/avatar (JSON form) and POST /chat/rooms", () => {
    const avatar = { avatarUrl: "https://res.cloudinary.com/demo/image/upload/avatar.png" } satisfies AvatarUrlPayload;
    const room = { type: "one_to_one", participants: ["665f0000000000000000a001", "665f0000000000000000a002"] } satisfies CreateChatRoomBody;
    // @ts-expect-error a room type outside the enum is a 400
    const badRoom: CreateChatRoomBody = { type: "direct", participants: [] };
    expect(avatar.avatarUrl).toMatch(/^https:/);
    expect([room, badRoom]).toHaveLength(2);
  });

  it("resolves a real body, not `any`", () => {
    // `never` for an endpoint with no JSON body proves the helper is not `any`.
    // (`/auth/logout` used to be this example; it now takes an optional
    // `{ refreshToken }` body for native apps.)
    type NoBody = RequestBody<"/notifications/read-all", "patch">;
    const noBody: [NoBody] extends [never] ? true : false = true;
    expect(noBody).toBe(true);
  });
});

describe("scripts/sync-api-types-core", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "api-types-"));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("creates, reports unchanged, then updates the copy", () => {
    const source = join(dir, "backend", "api-types.d.ts");
    const target = join(dir, "app", "types", "api.d.ts");
    // `backend/` does not exist yet: a missing checkout is reported, not thrown.
    expect(syncApiTypes(source, target)).toBe("missing-source");
    expect(existsSync(target)).toBe(false);

    mkdirSync(join(dir, "backend"));
    writeFileSync(source, "export interface paths {}\n");
    expect(syncApiTypes(source, target)).toBe("created");
    expect(readFileSync(target, "utf8")).toBe("export interface paths {}\n");
    expect(syncApiTypes(source, target)).toBe("unchanged");

    writeFileSync(source, "export interface paths { '/x': never }\n");
    expect(syncApiTypes(source, target)).toBe("updated");
    expect(readFileSync(target, "utf8")).toContain("'/x'");
  });
});
