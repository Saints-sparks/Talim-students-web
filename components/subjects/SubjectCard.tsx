"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subjectNameOf } from "@/hooks/useCurriculum";
import type { Course } from "@/services/curriculum.service";

/**
 * One course tile in the subjects grid.
 *
 * @param props - Component props.
 * @param props.course - The course to show.
 * @param props.onViewCurriculum - Opens the course's curriculum.
 * @returns The card element.
 */
export default function SubjectCard({
  course,
  onViewCurriculum,
}: {
  course: Course;
  onViewCurriculum: (course: Course) => void;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-[#003366] dark:border-[#30435F] dark:bg-[#1B2A44] dark:hover:border-blue-400">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#003366] to-[#004080]">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-[#003366] dark:text-white dark:group-hover:text-blue-200">
              {course.title}
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{subjectNameOf(course)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#003366] dark:text-blue-200">{course.courseCode}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
          {course.description || "No description available"}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={() => onViewCurriculum(course)}
          className="flex items-center space-x-2 rounded-lg border border-[#002244] bg-transparent px-4 py-2 text-[#030E18] transition-all duration-200 hover:bg-[#003366] hover:text-white dark:border-blue-400 dark:text-white dark:hover:bg-blue-700"
        >
          <span>View Curriculum</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
