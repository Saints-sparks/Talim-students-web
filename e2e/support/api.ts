import { API_URL, type Account } from "./creds";

/** Removes `{ success, data }` when the backend runs with the success envelope on. */
export function unwrap<T>(body: unknown): T {
  const b = body as { success?: unknown; data?: unknown } | null;
  return (b && b.success === true && "data" in b ? b.data : body) as T;
}

/** Signs in over HTTP (no browser) and returns the access token. */
export async function apiLogin(account: Pick<Account, "email" | "password">): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: account.email, password: account.password }),
  });
  if (!res.ok) throw new Error(`API sign-in for ${account.email} failed: ${res.status}`);
  return unwrap<{ access_token: string }>(await res.json()).access_token;
}

/** Calls the API as `token` and returns the parsed, unwrapped body (throws on non-2xx). */
export async function apiCall<T = unknown>(
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 300)}`);
  return unwrap<T>(text ? JSON.parse(text) : null);
}

/** A run-unique email that the backend's `seed.js --reset` recognises and removes. */
export function throwawayEmail(label: string): string {
  return `e2e.new.${label}.${Date.now().toString(36)}@e2e.talim.test`;
}
