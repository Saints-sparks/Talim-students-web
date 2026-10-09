import fs from "node:fs";
import { API_URL, ENVELOPE, ACCOUNTS, AUTH_DIR } from "./creds";

/**
 * Fails fast, with the fix, when the backend is not running, is not seeded, or
 * runs with a different envelope mode than the one this run claims to test.
 */
export default async function globalSetup(): Promise<void> {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.mkdirSync("e2e/reports", { recursive: true });

  const health = await fetch(`${API_URL}/health`).catch(() => null);
  if (!health?.ok) {
    throw new Error(`Backend not reachable at ${API_URL}. In the backend repo: bash e2e/start-backend.sh`);
  }

  const login = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: ACCOUNTS.schoolAdmin.email, password: ACCOUNTS.schoolAdmin.password }),
  });
  if (!login.ok) {
    throw new Error(`Seeded school admin cannot sign in (HTTP ${login.status}). Run: node e2e/seed.js`);
  }
  const body = (await login.json()) as Record<string, unknown>;
  const enveloped = body.success === true && typeof body.data === "object";
  if (String(enveloped) !== ENVELOPE) {
    throw new Error(
      `Backend envelope is ${enveloped ? "ON" : "OFF"} but E2E_ENVELOPE=${ENVELOPE}. ` +
        `Restart it with API_ENVELOPE_SUCCESS=${ENVELOPE} or change E2E_ENVELOPE.`,
    );
  }
  // eslint-disable-next-line no-console
  console.log(`[e2e] backend ${API_URL} ok, success envelope ${enveloped ? "ON" : "OFF"}`);
}
