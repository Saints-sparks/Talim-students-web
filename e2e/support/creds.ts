/**
 * The accounts created by the backend's `e2e/seed.js` that this suite uses.
 * Fixed on purpose: the seed prints the same list, and its README documents it.
 */
export const API_URL = process.env.E2E_API_URL ?? "http://localhost:5055";
export const ENVELOPE = process.env.E2E_ENVELOPE ?? "false";

export interface Account {
  email: string;
  password: string;
  name: string;
}

const PASSWORD = "Demo#Pass2026";

export const ACCOUNTS = {
  /** Grade 5A at Greenfield: published Third Term results, files, a subject group. */
  student: { email: "ada.student@e2e.talim.test", password: PASSWORD, name: "Ada Student" },
  /** Refused by this portal. */
  teacher: { email: "teacher@e2e.talim.test", password: PASSWORD, name: "Tolu Teacher" },
  /** Refused by this portal. */
  parent: { email: "parent@e2e.talim.test", password: PASSWORD, name: "Paul Parent" },
  /** Global setup's envelope probe. */
  schoolAdmin: { email: "admin@e2e.talim.test", password: PASSWORD, name: "Sade Principal" },
  /** Replies to a ticket as the school desk. */
  platform: { email: "platform@e2e.talim.test", password: PASSWORD, name: "Paula Platform" },
} satisfies Record<string, Account>;

export const AUTH_DIR = "e2e/.auth";
export const authFile = (key: keyof typeof ACCOUNTS): string => `${AUTH_DIR}/${key}.json`;

/** The theme switch's storage key (providers/theme-provider.tsx). */
export const THEME_KEY = "talim_student_theme";
