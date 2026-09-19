import {
  clampPercent,
  formatCourseTotal,
  formatPercent,
  gradeBadgeClass,
  progressColor,
  resolveSelectedCourseId,
  summariseCourses,
} from "@/lib/results";
import type { PublishedCourse } from "@/services/grades.service";

function course(id: string, published = 0): PublishedCourse {
  return { _id: id, name: id, publishedAssessmentsCount: published };
}

describe("gradeBadgeClass", () => {
  it("maps each grade band to its colour, with a dark variant", () => {
    expect(gradeBadgeClass("A+")).toContain("emerald");
    expect(gradeBadgeClass("a")).toContain("emerald");
    expect(gradeBadgeClass("B")).toContain("blue");
    expect(gradeBadgeClass("C+")).toContain("amber");
    expect(gradeBadgeClass("D")).toContain("orange");
    expect(gradeBadgeClass("E")).toContain("red-100");
    expect(gradeBadgeClass("F")).toContain("red-200");
    for (const grade of ["A", "B", "C", "D", "E", "F", "?"]) expect(gradeBadgeClass(grade)).toContain("dark:");
  });

  it("falls back to grey for a missing or unknown grade", () => {
    expect(gradeBadgeClass(undefined)).toContain("gray-100");
    expect(gradeBadgeClass(null)).toContain("gray-100");
    expect(gradeBadgeClass("Z")).toContain("gray-100");
  });
});

describe("progressColor", () => {
  it("changes band exactly at 80, 70, 60 and 45", () => {
    expect(progressColor(100)).toBe("bg-emerald-500");
    expect(progressColor(80)).toBe("bg-emerald-500");
    expect(progressColor(79.9)).toBe("bg-blue-500");
    expect(progressColor(70)).toBe("bg-blue-500");
    expect(progressColor(69.9)).toBe("bg-amber-400");
    expect(progressColor(60)).toBe("bg-amber-400");
    expect(progressColor(59.9)).toBe("bg-orange-500");
    expect(progressColor(45)).toBe("bg-orange-500");
    expect(progressColor(44.9)).toBe("bg-red-500");
    expect(progressColor(0)).toBe("bg-red-500");
  });
});

describe("clampPercent and formatPercent", () => {
  it("keeps a bar inside 0-100 and survives junk", () => {
    expect(clampPercent(140)).toBe(100);
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(Number.NaN)).toBe(0);
    expect(clampPercent(62.5)).toBe(62.5);
  });

  it("formats to one decimal and shows a dash when there is no value", () => {
    expect(formatPercent(72.456)).toBe("72.5%");
    expect(formatPercent(72.456, 0)).toBe("72%");
    expect(formatPercent(0)).toBe("0.0%");
    expect(formatPercent(null)).toBe("-");
    expect(formatPercent(undefined)).toBe("-");
    expect(formatPercent(Number.NaN)).toBe("-");
  });
});

describe("summariseCourses", () => {
  it("counts courses, courses with results and published assessments", () => {
    expect(summariseCourses([course("a", 2), course("b", 0), course("c", 3)])).toEqual({
      courseCount: 3,
      coursesWithResults: 2,
      publishedAssessments: 5,
    });
    expect(summariseCourses([])).toEqual({ courseCount: 0, coursesWithResults: 0, publishedAssessments: 0 });
  });
});

describe("resolveSelectedCourseId", () => {
  const courses = [course("a"), course("b")];

  it("opens the first course by default", () => {
    expect(resolveSelectedCourseId(courses, null)).toBe("a");
  });

  it("honours a click on a listed course", () => {
    expect(resolveSelectedCourseId(courses, "b")).toBe("b");
  });

  it("never returns an id the API did not list for this student", () => {
    expect(resolveSelectedCourseId(courses, "someone-elses-course")).toBe("a");
  });

  it("is null when the class has no courses", () => {
    expect(resolveSelectedCourseId([], "b")).toBeNull();
  });
});

describe("formatCourseTotal", () => {
  it("shows score, max and average once a grade record exists", () => {
    expect(formatCourseTotal({ cumulativeScore: 45, maxScore: 60, currentAverage: 75 })).toBe("45/60 = 75.0%");
  });

  it("is null before there is a total, and never prints undefined", () => {
    expect(formatCourseTotal({ cumulativeScore: null, maxScore: 60, currentAverage: 75 })).toBeNull();
    expect(formatCourseTotal({ cumulativeScore: 45, maxScore: 60 })).toBe("45/60 = -");
  });
});
