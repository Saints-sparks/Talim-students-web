import { test as base, expect, type Page } from "@playwright/test";
import { API_URL } from "./creds";

/** Something the page did that a healthy page does not. */
export interface Finding {
  kind: "pageerror" | "console.error" | "http" | "requestfailed" | "external";
  detail: string;
}

/** One reason a finding is expected. Every entry in an allow-list needs one. */
export interface Allowed {
  kind?: Finding["kind"];
  match: RegExp;
  reason: string;
}

/** Collects what went wrong on a page while a test drives it. */
export class Monitor {
  readonly findings: Finding[] = [];

  constructor(page: Page) {
    page.on("pageerror", (err) => this.add("pageerror", `${err.name}: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      // The browser's own line for a failed request; the `http` finding below carries the URL and status.
      if (/^Failed to load resource/.test(text)) return;
      this.add("console.error", text.slice(0, 400));
    });
    page.on("response", (res) => {
      const url = res.url();
      if (!url.startsWith(API_URL)) return;
      if (res.status() >= 200 && res.status() < 300) return;
      this.add("http", `${res.request().method()} ${url.replace(API_URL, "")} -> ${res.status()}`);
    });
    page.on("requestfailed", (req) => {
      const url = req.url();
      // Off-machine requests are aborted on purpose and already reported as `external`.
      if (!/^https?:\/\/(localhost|127\.0\.0\.1)/.test(url)) return;
      // Aborted navigations and cancelled fetches happen whenever the user moves on.
      if (/ERR_ABORTED|NS_BINDING_ABORTED/.test(req.failure()?.errorText ?? "")) return;
      this.add("requestfailed", `${req.method()} ${url.slice(0, 200)} ${req.failure()?.errorText ?? ""}`);
    });
  }

  private add(kind: Finding["kind"], detail: string): void {
    this.findings.push({ kind, detail });
  }

  /** Records an outgoing request to a host that is not the app or the local API. */
  external(url: string): void {
    this.add("external", url.slice(0, 200));
  }

  /** Forgets everything seen so far (call before the step being judged). */
  clear(): void {
    this.findings.length = 0;
  }

  /** Findings that no allow-list entry explains. */
  unexpected(allow: readonly Allowed[] = []): Finding[] {
    return this.findings.filter(
      (f) => !allow.some((a) => (!a.kind || a.kind === f.kind) && a.match.test(f.detail)),
    );
  }
}

export const test = base.extend<{ monitor: Monitor }>({
  monitor: [
    async ({ page }, use) => {
      const monitor = new Monitor(page);
      // Nothing may leave this machine: anything that is not the app or the API is aborted and recorded.
      await page.route(
        (url) => !["localhost", "127.0.0.1"].includes(url.hostname),
        (route) => {
          monitor.external(route.request().url());
          return route.abort();
        },
      );
      await use(monitor);
    },
    { auto: true },
  ],
});

export { expect };
