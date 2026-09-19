import { ChevronRight, FileText } from "lucide-react";
import { formatCourseTotal, gradeBadgeClass, formatPercent } from "@/lib/results";
import type { PublishedCourse } from "@/services/grades.service";

function CourseButton({
  course,
  active,
  onClick,
}: {
  course: PublishedCourse;
  active: boolean;
  onClick: () => void;
}) {
  const total = formatCourseTotal(course);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? "border-[#003366] bg-[#003366]/5 dark:border-blue-300 dark:bg-blue-300/10"
          : "border-[#F0F0F0] bg-white hover:border-[#C8D6E5] dark:border-[#30435F] dark:bg-[#1B2A44] dark:hover:border-blue-400/60"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#003366]/10 dark:bg-blue-300/15 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-[#003366] dark:text-blue-200" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#030E18] dark:text-white truncate">{course.name}</div>
          <div className="text-xs text-[#AAAAAA] dark:text-slate-400 mt-0.5 flex flex-wrap gap-x-2">
            {course.code && <span>{course.code}</span>}
            {course.teacher && <span>{course.teacher}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {course.gradeLevel && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${gradeBadgeClass(course.gradeLevel)}`}>
              {course.gradeLevel}
            </span>
          )}
          {course.coursePosition != null && (
            <span className="text-[10px] text-[#6F6F6F] dark:text-slate-300 font-medium">
              #{course.coursePosition} in class
            </span>
          )}
          <ChevronRight
            className={`w-4 h-4 text-[#AAAAAA] dark:text-slate-400 transition-transform ${active ? "rotate-90" : ""}`}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs">
        <span className="text-[#003366] dark:text-blue-200 font-medium">
          {course.publishedAssessmentsCount} published
        </span>
        <span className="text-[#6F6F6F] dark:text-slate-300">
          {total ?? (course.currentAverage != null ? formatPercent(course.currentAverage) : "No grade yet")}
        </span>
      </div>
    </button>
  );
}

/**
 * The class's courses for the term, one selectable card each.
 *
 * @param props - Component props.
 * @param props.courses - The courses the API listed for this student.
 * @param props.selectedId - The open course.
 * @param props.onSelect - Called with the id of the course clicked.
 * @returns The list.
 */
export function CourseList({
  courses,
  selectedId,
  onSelect,
}: {
  courses: readonly PublishedCourse[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#030E18] dark:text-white">Courses</h2>
        <span className="text-xs text-[#AAAAAA] dark:text-slate-400">{courses.length} enrolled</span>
      </div>
      <div className="space-y-3">
        {courses.map((course) => (
          <CourseButton
            key={course._id}
            course={course}
            active={course._id === selectedId}
            onClick={() => onSelect(course._id)}
          />
        ))}
      </div>
    </div>
  );
}
