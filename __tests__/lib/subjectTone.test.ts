import { SUBJECT_TONE_COUNT, subjectToneClass, subjectToneIndex } from "@/lib/learner/subjectTone";

describe("subject tones", () => {
  it("use the API's colourKey as the tone, wrapping past twelve", () => {
    expect(subjectToneClass(0)).toBe("subj-0");
    expect(subjectToneClass(11)).toBe("subj-11");
    expect(subjectToneIndex(12)).toBe(0);
    expect(subjectToneIndex(25)).toBe(1);
  });

  it("hash a course id when there is no colourKey, always to the same tone", () => {
    const tone = subjectToneIndex("6ac1be41cabfac93d6b3526d");
    expect(tone).toBeGreaterThanOrEqual(0);
    expect(tone).toBeLessThan(SUBJECT_TONE_COUNT);
    expect(subjectToneIndex("6ac1be41cabfac93d6b3526d")).toBe(tone);
  });
});

/** WCAG relative luminance of an "r g b" triple. */
function luminance(rgb: number[]): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

describe("subject tone colours (app/globals.css)", () => {
  it("every solid tone carries white initials at AA (4.5:1), in both themes", () => {
    const css: string = require("fs").readFileSync(require("path").join(__dirname, "../../app/globals.css"), "utf8");
    const solids = [...css.matchAll(/\.subj-(\d+) \{ --subj-solid: (\d+) (\d+) (\d+);/g)];
    expect(solids.length).toBeGreaterThanOrEqual(SUBJECT_TONE_COUNT * 2);
    const failing = solids
      .map((m) => ({ tone: m[1], ratio: 1.05 / (luminance([m[2], m[3], m[4]].map(Number)) + 0.05) }))
      .filter((t) => t.ratio < 4.5);
    expect(failing).toEqual([]);
  });
});
