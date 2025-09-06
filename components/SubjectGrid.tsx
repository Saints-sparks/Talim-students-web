// components/SubjectGrid.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurriculum } from "@/hooks/useCurriculum";
import { Course } from "@/services/curriculum.service";
import {
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingCard from "@/components/LoadingCard";

interface SubjectCardProps {
  course: Course;
  onViewCurriculum: (course: Course) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  course,
  onViewCurriculum,
}) => {
  const { getSubjectNameByCourse, getTeacherNameByCourse } = useCurriculum();

  const handleViewCurriculum = () => {
    onViewCurriculum(course);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:bnorder-[#003366] group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-[#003366] transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {getSubjectNameByCourse(course)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#003366]">
            {course.courseCode}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {course.description || "No description available"}
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {getTeacherNameByCourse(course)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={handleViewCurriculum}
          className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <span>View Curriculum</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const SubjectGrid: React.FC = () => {
  const router = useRouter();
  const { courses, isLoading, error, getCoursesBySubject } = useCurriculum();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const handleViewCurriculum = (course: Course) => {
    router.push(
      `/subjects/curriculum?courseId=${
        course._id
      }&courseTitle=${encodeURIComponent(
        course.title
      )}&courseCode=${encodeURIComponent(course.courseCode)}`
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.subjectId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesSubject =
      selectedSubject === "all" ||
      (course.subjectId?.name || "").toLowerCase() ===
        selectedSubject.toLowerCase();

    return matchesSearch && matchesSubject;
  });

  const coursesBySubject = getCoursesBySubject();
  const subjectNames = Object.keys(coursesBySubject);

  if (isLoading) {
    return (
      <div className="px-6 py-4 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#030E18]">My Courses</h2>
          <p className="text-gray-600">
            Explore your course curriculum and materials
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} height="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-4 h-full">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Courses
          </h3>
          <p className="text-gray-600 text-center max-w-md mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#003366] hover:bg-[#002244] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="px-6 py-4 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#030E18]">My Courses</h2>
          <p className="text-gray-600">
            Explore your course curriculum and materials
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Subjects Available
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            You don't have any subjects assigned yet. Please contact your
            administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-[#030E18]">My Courses</h2>
        <p className="text-gray-600">
          Explore your course curriculum and materials
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search subjects, courses, or codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent min-w-[200px]"
          >
            <option value="all">All Courses</option>
            {subjectNames.map((subjectName) => (
              <option key={subjectName} value={subjectName}>
                {subjectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <SubjectCard
            key={course._id}
            course={course}
            onViewCurriculum={handleViewCurriculum}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;
