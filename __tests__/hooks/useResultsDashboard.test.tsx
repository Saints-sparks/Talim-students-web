import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { useResultsDashboard } from "@/hooks/useResultsDashboard";
import { usePublishedCourseAssessments } from "@/hooks/usePublishedCourseAssessments";
import { queryKeys } from "@/lib/queryKeys";
import { makeTestQueryClient } from "@/test-utils/render";

const courses = [
  { _id: "course-a", name: "Maths", publishedAssessmentsCount: 2 },
  { _id: "course-b", name: "English", publishedAssessmentsCount: 0 },
];

jest.mock("@/hooks/useStudentIdentity", () => ({
  useStudentIdentity: () => ({
    userId: "u1",
    studentId: "s1",
    classId: "c1",
    className: "JSS 2A",
    termId: "term-1",
    isReady: true,
  }),
}));
jest.mock("@/hooks/usePublishedGradeCourses", () => ({
  usePublishedGradeCourses: () => ({ courses, isLoading: false, errorCause: null, termId: "term-1" }),
}));
jest.mock("@/hooks/useStudentCumulativeGrade", () => ({
  useStudentCumulativeGrade: () => ({ cumulativeGrade: null, isLoading: false, errorCause: null }),
}));
jest.mock("@/hooks/usePublishedCourseAssessments", () => ({
  usePublishedCourseAssessments: jest.fn(() => ({ assessments: [], isLoading: false, errorCause: null })),
}));

const assessmentsHook = usePublishedCourseAssessments as jest.Mock;

function setup() {
  const client = makeTestQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, ...renderHook(() => useResultsDashboard(), { wrapper }) };
}

describe("useResultsDashboard", () => {
  beforeEach(() => assessmentsHook.mockClear());

  it("opens the first listed course and summarises the class", () => {
    const { result } = setup();
    expect(result.current.selectedCourseId).toBe("course-a");
    expect(assessmentsHook).toHaveBeenLastCalledWith("course-a", "term-1");
    expect(result.current.summary).toEqual({ courseCount: 2, coursesWithResults: 1, publishedAssessments: 2 });
  });

  it("switches to another listed course", () => {
    const { result } = setup();
    act(() => result.current.selectCourse("course-b"));
    expect(result.current.selectedCourse?.name).toBe("English");
    expect(assessmentsHook).toHaveBeenLastCalledWith("course-b", "term-1");
  });

  it("never requests a course the API did not list for the student", () => {
    const { result } = setup();
    act(() => result.current.selectCourse("another-students-course"));
    expect(result.current.selectedCourseId).toBe("course-a");
    expect(assessmentsHook).not.toHaveBeenCalledWith("another-students-course", expect.anything());
  });

  it("refreshes by invalidating every cached result", () => {
    const { result, client } = setup();
    const spy = jest.spyOn(client, "invalidateQueries");
    act(() => result.current.refresh());
    expect(spy).toHaveBeenCalledWith({ queryKey: queryKeys.grades.all });
  });
});
