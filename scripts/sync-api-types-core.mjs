/**
 * Copy logic behind `npm run types:api`, kept free of process and URL globals
 * so it can be unit-tested.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Copies `source` to `target`, reporting whether the target changed.
 * @param {string} source - The backend's generated contract (`docs/api-types.d.ts`).
 * @param {string} target - This app's copy (`api.d.ts`).
 * @returns {"missing-source" | "created" | "updated" | "unchanged"} What happened.
 */
export function syncApiTypes(source, target) {
  if (!existsSync(source)) return "missing-source";
  const next = readFileSync(source);
  const exists = existsSync(target);
  if (exists && readFileSync(target).equals(next)) return "unchanged";
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, next);
  return exists ? "updated" : "created";
}
