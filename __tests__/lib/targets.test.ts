import { categoryTag, defaultActionLabel, targetHref } from "@/lib/learner/targets";

describe("notification targets", () => {
  it("maps the producers' pages onto the app's routes", () => {
    expect(targetHref({ page: "resources", courseId: "c1" })).toBe("/files?course=c1");
    expect(targetHref({ page: "messages", roomId: "r1" })).toBe("/messages?room=r1");
    expect(targetHref({ page: "subjects", courseId: "c1" })).toBe("/subjects/c1");
    expect(targetHref({ page: "today" })).toBe("/dashboard");
    expect(targetHref({ page: "payments" })).toBeNull();
    expect(targetHref(null)).toBeNull();
  });

  it("opens a results notice on its term, read from the metadata when the target has none (live API)", () => {
    expect(targetHref({ page: "grading", classId: "k1" }, { termId: "t-third", classId: "k1" })).toBe("/results?term=t-third");
    expect(targetHref({ page: "results", termId: "t1" }, { termId: "t2" })).toBe("/results?term=t1");
    expect(targetHref({ page: "grading", courseId: "c1" }, {})).toBe("/results");
  });

  it("labels updates by category and falls back to a page name", () => {
    expect(categoryTag("academics")).toBe("Assessments");
    expect(categoryTag("payments")).toBe("Talim");
    expect(defaultActionLabel("/files?course=c1")).toBe("Open Files");
    expect(defaultActionLabel("/subjects/c1")).toBe("Open the subject");
  });
});
