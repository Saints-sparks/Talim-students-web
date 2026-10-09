import fs from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { ENVELOPE } from "./creds";

export interface ContrastNode {
  target: string;
  html: string;
  summary: string;
}
export interface PageContrast {
  path: string;
  violatingElements: number;
  nodes: ContrastNode[];
  /** Elements axe could not judge (a background it cannot resolve); they need a look at the screenshot. */
  incompleteElements: number;
  incomplete: ContrastNode[];
}

/** Runs axe's `color-contrast` rule only, on what is currently on screen. */
export async function contrastOf(page: Page, route: string): Promise<PageContrast> {
  const result = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  const describe = (rule: (typeof result.violations)[number]): ContrastNode[] =>
    rule.nodes.map((n) => ({
      target: n.target.join(" "),
      html: n.html.slice(0, 200),
      summary: (n.failureSummary ?? "").split("\n").slice(1).join(" ").trim().slice(0, 300),
    }));
  const nodes = result.violations.flatMap(describe);
  const incomplete = result.incomplete.flatMap(describe);
  return { path: route, violatingElements: nodes.length, nodes, incompleteElements: incomplete.length, incomplete };
}

/** Writes e2e/reports/contrast-<theme>.json and prints a one-screen summary. */
export function writeContrastReport(app: string, theme: string, pages: PageContrast[]): void {
  const total = pages.reduce((n, p) => n + p.violatingElements, 0);
  const totalIncomplete = pages.reduce((n, p) => n + p.incompleteElements, 0);
  const dir = path.join("e2e", "reports");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `contrast-${theme}.json`),
    JSON.stringify({ app, theme, envelope: ENVELOPE, totalViolatingElements: total, totalIncompleteElements: totalIncomplete, pages }, null, 2),
  );
  const rows = pages
    .filter((p) => p.violatingElements > 0)
    .sort((a, b) => b.violatingElements - a.violatingElements)
    .map((p) => `  ${String(p.violatingElements).padStart(4)}  ${p.path}`);
  // eslint-disable-next-line no-console
  console.log(
    `\n[contrast] ${app} ${theme}: ${total} failing elements on ${pages.filter((p) => p.violatingElements).length}/${pages.length} pages, ${totalIncomplete} undecidable\n${rows.join("\n")}\n`,
  );
}
