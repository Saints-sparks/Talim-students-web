#!/usr/bin/env node
/**
 * Refreshes types/api.d.ts from a backend checkout's generated contract
 * (docs/api-types.d.ts). Offline: it only copies a file.
 *
 *   npm run types:api
 *   TALIM_BACKEND_PATH=/path/to/talimBE-V2 npm run types:api
 *
 * Exits 0 (with a message) when the backend checkout is not present, so a
 * missing checkout never breaks CI or a fresh clone.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syncApiTypes } from "./sync-api-types-core.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(appRoot, "types/api.d.ts");
const backend = resolve(appRoot, process.env.TALIM_BACKEND_PATH ?? "../talimBE-V2");
const source = resolve(backend, "docs/api-types.d.ts");

const result = syncApiTypes(source, target);
if (result === "missing-source") {
  console.log(`api types: backend contract not found at ${source}; kept the existing copy (set TALIM_BACKEND_PATH to refresh).`);
} else if (result === "unchanged") {
  console.log("api types: already up to date (no change).");
} else {
  console.log(`api types: ${result} ${target} from ${source}. Run npm run type-check to see what the new contract breaks.`);
}
