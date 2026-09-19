import { gradesService } from "@/services/grades.service";
import { api } from "@/lib/authFetch";

jest.mock("@/lib/authFetch", () => ({ api: { get: jest.fn() } }));

const get = api.get as jest.Mock;

describe("gradesService: a student only ever reads their own results", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    get.mockResolvedValue([]);
  });

  it("sends every results read to /grade-records/student/me, with no student id", async () => {
    await gradesService.getPublishedCoursesByTerm("term-1");
    await gradesService.getPublishedAssessmentsForCourse("course-1", "term-1");
    await gradesService.getCumulativeGradeByTerm("term-1");
    await gradesService.getAllCumulativeGrades();
    await gradesService.getCourseGradesByTerm("term-1");
    await gradesService.getAssessmentGrades("assessment-1");

    const urls = get.mock.calls.map(([url]) => new URL(url).pathname);
    expect(urls).toEqual([
      "/grade-records/student/me/courses/term/term-1",
      "/grade-records/student/me/courses/course-1/published-assessments/term/term-1",
      "/grade-records/student/me/cumulative-grades/term-1",
      "/grade-records/student/me/cumulative-grades",
      "/grade-records/student/me/course-grades/term/term-1",
      "/grade-records/student/me/assessments/assessment-1",
    ]);
  });

  it("reads a bare array or a flat page the same way", async () => {
    get.mockResolvedValueOnce({ data: [{ _id: "c1" }], total: 1, page: 1, limit: 50, totalPages: 1 });
    await expect(gradesService.getAllCumulativeGrades()).resolves.toEqual([{ _id: "c1" }]);
    get.mockResolvedValueOnce([{ _id: "c2" }]);
    await expect(gradesService.getPublishedCoursesByTerm("t")).resolves.toEqual([{ _id: "c2" }]);
  });
});
