"use client";

import { useEffect, useMemo, useState } from "react";
import { usePublishedGradeCourses } from "@/hooks/usePublishedGradeCourses";
import { usePublishedCourseAssessments } from "@/hooks/usePublishedCourseAssessments";
import { useStudentCumulativeGrade } from "@/hooks/useStudentCumulativeGrade";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { EmptyState } from "@/components/EmptyState";
import type {
  PublishedAssessmentResult,
  PublishedCourse,
} from "@/services/grades.service";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  RefreshCw,
  Trophy,
} from "lucide-react";

function gradeBadgeClass(grade: string) {
  const g = (grade || "").toUpperCase();
  if (g === "A+" || g === "A") return "bg-emerald-100 text-emerald-700";
  if (g === "B+" || g === "B") return "bg-blue-100 text-blue-700";
  if (g === "C+" || g === "C") return "bg-amber-100 text-amber-700";
  if (g === "D+" || g === "D") return "bg-orange-100 text-orange-700";
  if (g === "E") return "bg-red-100 text-red-500";
  if (g === "F") return "bg-red-200 text-red-800";
  return "bg-gray-100 text-gray-500";
}

function progressColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 70) return "bg-blue-500";
  if (pct >= 60) return "bg-amber-400";
  if (pct >= 45) return "bg-orange-500";
  return "bg-red-500";
}

function getErrorVariant(msg: string): "network" | "auth" | "server" | "default" {
  const m = msg.toLowerCase();
  if (m.includes("network") || m.includes("fetch") || m.includes("connection"))
    return "network";
  if (m.includes("unauthorized") || m.includes("token") || m.includes("session"))
    return "auth";
  if (m.includes("500") || m.includes("server")) return "server";
  return "default";
}

function StatCard({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <Card className="border border-[#F0F0F0] shadow-none rounded-2xl">
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#030E18] leading-tight tabular-nums">
              {value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#6F6F6F] mt-1 truncate">
              {label}
            </div>
            {sub && <div className="text-xs text-[#AAAAAA] mt-0.5">{sub}</div>}
          </div>
          <div className="flex-shrink-0 p-2 sm:p-2.5 bg-[#003366]/10 rounded-xl text-[#003366]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className ?? ""}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="border border-[#F0F0F0] shadow-none rounded-2xl">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="lg:col-span-2 h-96 w-full" />
      </div>
    </div>
  );
}

function CourseButton({
  course,
  active,
  onClick,
}: {
  course: PublishedCourse;
  active: boolean;
  onClick: () => void;
}) {
  const average = course.currentAverage ?? null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? "border-[#003366] bg-[#003366]/5"
          : "border-[#F0F0F0] bg-white hover:border-[#C8D6E5]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#003366]/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-[#003366]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#030E18] truncate">{course.name}</div>
          <div className="text-xs text-[#AAAAAA] mt-0.5 flex flex-wrap gap-x-2">
            {course.code && <span>{course.code}</span>}
            {course.teacher && <span>{course.teacher}</span>}
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-[#AAAAAA] transition-transform ${
            active ? "rotate-90" : ""
          }`}
        />
      </div>
      <div className="flex items-center justify-between mt-4 text-xs">
        <span className="text-[#003366] font-medium">
          {course.publishedAssessmentsCount} published
        </span>
        <span className="text-[#6F6F6F]">
          {average != null ? `${average.toFixed(1)}%` : "No average"}
        </span>
      </div>
    </button>
  );
}

function AssessmentRow({ item }: { item: PublishedAssessmentResult }) {
  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-[#030E18] truncate">
            {item.assessment.name}
          </div>
          <div className="text-xs text-[#AAAAAA] mt-1 capitalize">
            {item.assessment.assessmentType || "Assessment"}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${gradeBadgeClass(item.gradeLevel)}`}>
            {item.gradeLevel}
          </span>
          <div className="text-right">
            <div className="text-sm font-bold text-[#030E18]">
              {item.percentage.toFixed(1)}%
            </div>
            <div className="text-xs text-[#AAAAAA]">
              {item.score}/{item.maxScore}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor(item.percentage)}`}
            style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
        <div>
          <div className="text-[#AAAAAA]">Class avg</div>
          <div className="font-semibold text-[#030E18]">
            {item.classAverage != null ? `${item.classAverage}%` : "-"}
          </div>
        </div>
        <div>
          <div className="text-[#AAAAAA]">Highest</div>
          <div className="font-semibold text-[#030E18]">
            {item.highestScore ?? "-"}
          </div>
        </div>
        <div>
          <div className="text-[#AAAAAA]">Lowest</div>
          <div className="font-semibold text-[#030E18]">
            {item.lowestScore ?? "-"}
          </div>
        </div>
        <div>
          <div className="text-[#AAAAAA]">Comparison</div>
          <div className="font-semibold text-[#030E18] truncate">
            {item.comparison || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsDashboard() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    courses,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
    termId,
  } = usePublishedGradeCourses();

  const {
    cumulativeGrade,
    isLoading: cumulativeLoading,
    error: cumulativeError,
    refetch: refetchCumulative,
  } = useStudentCumulativeGrade();

  const {
    assessments,
    isLoading: assessmentsLoading,
    error: assessmentsError,
    refetch: refetchAssessments,
  } = usePublishedCourseAssessments(selectedCourseId, termId);

  useEffect(() => {
    if (!selectedCourseId && courses?.length) {
      setSelectedCourseId(courses[0]._id);
    }
  }, [courses, selectedCourseId]);

  const selectedCourse = useMemo(
    () => courses?.find((course) => course._id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );

  const publishedCourseCount =
    courses?.filter((course) => course.publishedAssessmentsCount > 0).length ?? 0;
  const publishedAssessmentCount =
    courses?.reduce((sum, course) => sum + course.publishedAssessmentsCount, 0) ?? 0;

  const isLoading = coursesLoading || cumulativeLoading;
  const error = coursesError ?? null;
  const hasCourses = courses && courses.length > 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchCourses();
    refetchCumulative();
    refetchAssessments();
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="min-h-full p-3 sm:p-5 lg:p-6 bg-[#F8F8F8] space-y-5 sm:space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#030E18]">Results</h1>
          <p className="text-sm text-[#AAAAAA] mt-0.5">
            Academic performance overview
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#003366] bg-white border border-[#F0F0F0] rounded-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center py-24">
          <ErrorDisplay
            error={error}
            onRetry={handleRefresh}
            title="Academic Data Unavailable"
            variant={getErrorVariant(error)}
          />
        </div>
      ) : !hasCourses ? (
        <div className="flex items-center justify-center py-24">
          <EmptyState
            title="No Courses Found"
            message="Your class courses will appear here once your enrollment is ready."
            actionLabel="Refresh"
            onAction={handleRefresh}
            icon={<BookOpen className="h-12 w-12" />}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={<BarChart3 className="w-5 h-5" />}
              value={
                cumulativeGrade?.percentage != null
                  ? `${cumulativeGrade.percentage.toFixed(1)}%`
                  : "-"
              }
              label="Grade Score"
              sub="Published"
            />
            <StatCard
              icon={<Trophy className="w-5 h-5" />}
              value={cumulativeGrade?.position != null ? `#${cumulativeGrade.position}` : "-"}
              label="Class Position"
              sub="This term"
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5" />}
              value={courses?.length || "-"}
              label="Courses"
              sub={`${publishedCourseCount} with results`}
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              value={publishedAssessmentCount || "-"}
              label="Assessments"
              sub="Published"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#030E18]">
                  Courses
                </h2>
                <span className="text-xs text-[#AAAAAA]">
                  {courses?.length ?? 0} enrolled
                </span>
              </div>
              <div className="space-y-3">
                {courses?.map((course) => (
                  <CourseButton
                    key={course._id}
                    course={course}
                    active={course._id === selectedCourseId}
                    onClick={() => setSelectedCourseId(course._id)}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[#030E18]">
                    {selectedCourse?.name || "Course Results"}
                  </h2>
                  <p className="text-xs text-[#AAAAAA] mt-0.5">
                    {selectedCourse?.publishedAssessmentsCount ?? 0} published assessments
                  </p>
                </div>
                {selectedCourse?.gradeLevel && (
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-lg ${gradeBadgeClass(
                      selectedCourse.gradeLevel
                    )}`}
                  >
                    {selectedCourse.gradeLevel}
                  </span>
                )}
              </div>

              {assessmentsError ? (
                <Card className="border border-[#F0F0F0] shadow-none rounded-2xl">
                  <CardContent className="py-10">
                    <ErrorDisplay
                      error={assessmentsError}
                      onRetry={refetchAssessments}
                      title="Course Results Unavailable"
                      variant={getErrorVariant(assessmentsError)}
                    />
                  </CardContent>
                </Card>
              ) : assessmentsLoading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-36 w-full" />
                  ))}
                </div>
              ) : assessments.length === 0 ? (
                <Card className="border border-[#F0F0F0] shadow-none rounded-2xl">
                  <CardContent className="py-14 text-center">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#6F6F6F] font-medium text-sm">
                      No published assessments yet
                    </p>
                    <p className="text-xs text-[#AAAAAA] mt-1">
                      Published results for this course will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {assessments.map((item) => (
                    <AssessmentRow key={item.publicationId} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
