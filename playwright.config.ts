import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end suite for the Students portal, run against a throwaway local
 * backend (see the backend repo's e2e/README.md). One worker, one browser:
 * the suites share one database, and other agents' work should not be starved.
 *
 *   E2E_ENVELOPE=false npm run e2e    # backend started with API_ENVELOPE_SUCCESS=false
 *   E2E_ENVELOPE=true  npm run e2e    # ... and =true
 *   E2E_APP_PORT=3113 E2E_API_URL=http://localhost:5087 npm run e2e   # a second stack
 */
const PORT = Number(process.env.E2E_APP_PORT ?? 3002);
const API_URL = process.env.E2E_API_URL ?? "http://localhost:5055";
const ENVELOPE = process.env.E2E_ENVELOPE ?? "false";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  globalSetup: "./e2e/support/global-setup.ts",
  workers: 1,
  fullyParallel: false,
  retries: 0,
  // `next dev` compiles each route on first visit, which is slow on a busy machine.
  timeout: 120_000,
  expect: { timeout: 20_000 },
  reporter: [["list"], ["json", { outputFile: `./e2e/reports/results-envelope-${ENVELOPE}.json` }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      testIgnore: /auth\.setup\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}/signin`,
    reuseExistingServer: process.env.E2E_REUSE_SERVER === "1",
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_API_BASE_URL: API_URL,
      NEXT_PUBLIC_WEBSOCKET_URL: API_URL,
      // Dummies: nothing here may reach a real Cloudinary account.
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "e2e-dummy-cloud",
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "e2e-dummy-preset",
      NEXT_PUBLIC_USE_FIXTURES: "false",
      NEXT_TELEMETRY_DISABLED: "1",
      NEXT_DIST_DIR: ".next-e2e",
    },
  },
});
