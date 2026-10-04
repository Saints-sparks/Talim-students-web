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
