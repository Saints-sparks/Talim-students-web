"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingCard from "@/components/LoadingCard";
import SubjectCard from "@/components/subjects/SubjectCard";
import { useClassCourses } from "@/hooks/useCurriculum";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import type { Course } from "@/services/curriculum.service";

/**
 * Filters courses by a free-text query over their title and code.
 *
 * @param courses - Every course in the class.
 * @param query - The raw search box contents.
 * @returns The matching courses.
 */
export function filterCourses(courses: Course[], query: string): Course[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return courses;
  return courses.filter(
    (course) =>
      (course.title ?? "").toLowerCase().includes(needle) ||
      (course.courseCode ?? "").toLowerCase().includes(needle)
  );
}

/**
 * The subjects screen: every course taught to the signed-in student's class,
 * each linking to its curriculum for the current term.
 *
 * The class comes from the session, so no id is taken from the URL or from
 * `localStorage` — a student can only ever see their own class.
 *
 * @returns The subjects grid.
 */
export default function SubjectGrid() {
  const router = useRouter();
  const { termId } = useStudentIdentity();
  const { courses, isLoading, error, refetch } = useClassCourses();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => filterCourses(courses, searchQuery), [courses, searchQuery]);

  const openCurriculum = (course: Course) => {
    const params = new URLSearchParams({ courseId: course._id });
    if (termId) params.set("termId", termId);
    if (course.title) params.set("courseTitle", course.title);
    if (course.courseCode) params.set("courseCode", course.courseCode);
    router.push(`/subjects/curriculum?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="h-full px-3 py-4 sm:px-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-[#030E18] dark:text-white">Subjects</h2>
          <p className="text-gray-600 dark:text-slate-300">Explore your course curriculum and materials</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} height="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full px-3 py-4 sm:px-6">
        <div className="flex flex-col items-center justify-center py-20" role="alert">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <BookOpen className="h-8 w-8 text-red-600 dark:text-red-300" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Failed to load your subjects</h3>
          <p className="mb-4 max-w-md text-center text-gray-600 dark:text-slate-300">{error}</p>
          <Button onClick={refetch} className="bg-[#003366] text-white hover:bg-[#002244]">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="h-full px-3 py-4 sm:px-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-[#030E18] dark:text-white">Subjects</h2>
          <p className="text-gray-600 dark:text-slate-300">
            No courses have been assigned to your class yet. They will appear here once your school adds them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full px-3 py-4 sm:px-6">
      <div className="mb-4 sm:mb-6" data-guide="subjects-header">
        <h2 className="mb-2 text-2xl font-medium text-[#030E18] dark:text-white">Subjects</h2>
        <p className="text-gray-600 dark:text-slate-300">Explore your course curriculum and materials</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row" data-guide="subjects-search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search courses or codes..."
            aria-label="Search courses"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#003366] dark:border-[#30435F] dark:bg-[#1B2A44] dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="mb-4" data-guide="subjects-count">
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" data-guide="subjects-grid">
        {filteredCourses.map((course) => (
          <SubjectCard key={course._id} course={course} onViewCurriculum={openCurriculum} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-[#243853]">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">No results found</h3>
          <p className="max-w-md text-center text-gray-600 dark:text-slate-300">
            Try adjusting your search terms to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}
