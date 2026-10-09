import fs from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/** One axe rule broken on a page, with a few of the elements that break it. */
export interface AxeFinding {
  rule: string;
  impact: string | null;
  help: string;
  targets: string[];
}

/** WCAG 2.1 A and AA: the level the platform promises (AA contrast in light and dark). */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/**
 * Runs axe's WCAG 2.1 A/AA rules on what is on screen and appends the result to
 * e2e/reports/axe-<file>.json (one entry per page and theme).
 *
 * @param page - The page, loaded and settled.
 * @param label - What was checked, e.g. "/support (dark)".
 * @param file - The report's name, e.g. "support".
 * @returns Every rule broken, with up to five targets each.
 */
export async function axeFindings(page: Page, label: string, file: string): Promise<AxeFinding[]> {
  const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const findings = result.violations.map((v) => ({
    rule: v.id,
    impact: v.impact ?? null,
    help: v.help,
    targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
  }));
  const dir = path.join("e2e", "reports");
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `axe-${file}.json`);
  const prior = fs.existsSync(out) ? (JSON.parse(fs.readFileSync(out, "utf8")) as Record<string, AxeFinding[]>) : {};
  prior[label] = findings;
  fs.writeFileSync(out, JSON.stringify(prior, null, 2));
  // eslint-disable-next-line no-console
  console.log(`[axe] ${label}: ${findings.length ? findings.map((f) => `${f.rule} (${f.targets.length})`).join(", ") : "clean"}`);
  return findings;
}
