/**
 * In-memory session store — the one place non-React code (services, the API
 * client, the socket) reads the signed-in student and their token from.
 *
 * `AuthContext` writes to it whenever the session changes; everything else only
 * reads. On a cold call before `AuthContext` has mounted it hydrates once from
 * the persisted user, so early service calls still resolve. Nothing here
 * decodes tokens: the introspected user is the source of truth.
 */

/** The signed-in student, as stored for non-React code to read. */
export interface SessionUser {
  /** Mongo id of the user document, when the API returned one. */
  _id?: string;
  /** Legacy alias some endpoints return instead of `userId`. */
  id?: string;
  /** Id of the user account (what `/students/by-user/:userId` takes). */
  userId?: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  /** School the student belongs to; string or populated object. */
  schoolId?: string | { _id?: string; id?: string; name?: string };
  schoolName?: string;
  /** Id of the student profile document, when known. */
  studentId?: string;
  [key: string]: unknown;
}

type Listener = () => void;

let currentUser: SessionUser | null = null;
let currentToken: string | null = null;
let hydrated = false;
const listeners = new Set<Listener>();

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

/**
 * Reads one persisted value, preferring `localStorage`.
 *
 * @param key - Storage key to read.
 * @returns The stored string, or `null` outside the browser.
 */
function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Loads the persisted user/token once, for reads before AuthContext mounts. */
function hydrate(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  currentToken = readStorage("accessToken");
  const raw = readStorage("user");
  if (raw) {
    try {
      currentUser = JSON.parse(raw) as SessionUser;
    } catch {
      currentUser = null;
    }
  }
}

/** Notifies every subscriber that the session changed. */
function notify(): void {
  for (const listener of listeners) listener();
}

/**
 * Extracts a 24-hex school id from the shapes the API returns for
 * `user.schoolId` (a string, or a populated `{ _id }` object).
 *
 * @param value - Whatever the API put in `schoolId`.
 * @returns The id, or `null` when it is missing or malformed.
 */
export function extractSchoolId(value: unknown): string | null {
  if (typeof value === "string") return OBJECT_ID.test(value) ? value : null;
  if (value && typeof value === "object") {
    const obj = value as { _id?: unknown; id?: unknown };
    if (typeof obj._id === "string" && OBJECT_ID.test(obj._id)) return obj._id;
    if (typeof obj.id === "string" && OBJECT_ID.test(obj.id)) return obj.id;
  }
  return null;
}

export const sessionStore = {
  /**
   * The signed-in student, or `null`.
   *
   * @returns The stored user.
   */
  getUser(): SessionUser | null {
    hydrate();
    return currentUser;
  },

  /**
   * The current access token, or `null`.
   *
   * @returns The bearer token requests are sent with.
   */
  getToken(): string | null {
    hydrate();
    return currentToken;
  },

  /**
   * The signed-in student's school id, or `null` when signed out.
   *
   * @returns The 24-hex school id.
   */
  getSchoolId(): string | null {
    hydrate();
    return extractSchoolId(currentUser?.schoolId);
  },

  /**
   * The signed-in student's user-account id, or `null`.
   *
   * @returns The id `/students/by-user/:userId` takes.
   */
  getUserId(): string | null {
    hydrate();
    return currentUser?.userId ?? currentUser?._id ?? currentUser?.id ?? null;
  },

  /**
   * Replaces the user (and optionally the token). Called by AuthContext.
   *
   * @param user - The signed-in student, or `null` on sign-out.
   * @param token - The access token, when it changed too.
   */
  set(user: SessionUser | null, token?: string | null): void {
    hydrated = true;
    currentUser = user;
    if (token !== undefined) currentToken = token;
    notify();
  },

  /**
   * Updates the token only (after a refresh).
   *
   * @param token - The new access token.
   */
  setToken(token: string | null): void {
    hydrated = true;
    currentToken = token;
    notify();
  },

  /**
   * Merges fields into the current user (profile edits).
   *
   * @param partial - Fields to overwrite.
   */
  patchUser(partial: Partial<SessionUser>): void {
    if (!currentUser) return;
    currentUser = { ...currentUser, ...partial };
    notify();
  },

  /** Clears everything on logout. */
  clear(): void {
    hydrated = true;
    currentUser = null;
    currentToken = null;
    notify();
  },

  /**
   * Subscribes to session changes.
   *
   * @param listener - Called after every change.
   * @returns An unsubscribe function.
   */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
