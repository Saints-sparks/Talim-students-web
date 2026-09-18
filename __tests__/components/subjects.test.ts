import { filterCourses } from "@/components/SubjectGrid";
import { toPreview } from "@/components/curriculum/CurriculumList";
import type { Course } from "@/services/curriculum.service";

function course(overrides: Partial<Course>): Course {
  return {
    _id: "c1",
    title: "Mathematics",
    description: "",
    courseCode: "MTH101",
    createdAt: "",
    updatedAt: "",
    ...overrides,
  } as Course;
}

describe("filterCourses", () => {
  const courses = [
    course({ _id: "1", title: "Mathematics", courseCode: "MTH101" }),
    course({ _id: "2", title: "English Language", courseCode: "ENG201" }),
  ];

  it("returns everything for an empty query", () => {
    expect(filterCourses(courses, "  ")).toHaveLength(2);
  });

  it("matches the title and the code, case-insensitively", () => {
    expect(filterCourses(courses, "english").map((c) => c._id)).toEqual(["2"]);
    expect(filterCourses(courses, "mth").map((c) => c._id)).toEqual(["1"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterCourses(courses, "biology")).toEqual([]);
  });
});

describe("toPreview", () => {
  it("strips markup and collapses whitespace", () => {
    expect(toPreview("<p>Week 1</p>\n<ul><li>Algebra</li></ul>")).toBe("Week 1 Algebra");
  });

  it("truncates long content", () => {
    expect(toPreview("<p>" + "a".repeat(200) + "</p>", 10)).toBe(`${"a".repeat(10)}…`);
  });

  it("explains an empty body", () => {
    expect(toPreview(undefined)).toBe("No content available.");
    expect(toPreview("<p></p>")).toBe("No content available.");
  });
});
