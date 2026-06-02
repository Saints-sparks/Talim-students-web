"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurriculum } from "@/hooks/useCurriculum";
import { API_BASE_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";
import { Course } from "@/services/curriculum.service";
import { BookOpen, Users, Calendar, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingCard from "@/components/LoadingCard";
import { useAuthContext } from "@/contexts/AuthContext";

interface SubjectCardProps {
  course: Course;
  onViewCurriculum: (course: Course) => Promise<void>;
  loading?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  course,
  onViewCurriculum,
  loading = false,
}) => {
  // Memoize curriculum hook to avoid duplicate requests
  const curriculum = useCurriculum();
  const getSubjectNameByCourse = curriculum.getSubjectNameByCourse;
  const getTeacherNameByCourse = curriculum.getTeacherNameByCourse;

  return (
    <div className="bg-white dark:bg-[#1B2A44] rounded-2xl border border-gray-200 dark:border-[#30435F] p-6 transition-all duration-300 hover:border-[#003366] dark:hover:border-blue-400 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-lg group-hover:text-[#003366] dark:group-hover:text-blue-200 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 font-medium">
              {getSubjectNameByCourse(course)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#003366] dark:text-blue-200">
            {course.courseCode}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">
          {course.description || "No description available"}
        </p>
      </div>

      

      <div className="flex justify-between items-center">
        <Button
          onClick={() => onViewCurriculum(course)}
          disabled={loading}
          className="bg-transparent border border-[#002244] dark:border-blue-400 text-[#030E18] dark:text-white hover:bg-[#003366] hover:text-white dark:hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
        >
          <span>{loading ? "Loading..." : "View Curriculum"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Local types for class API response (adjust if your backend differs)
interface ClassCourse {
  _id: string;
  title: string;
  description?: string;
  courseCode?: string;
  teacherId?: any;
  subjectId?: any;
  classId?: any;
}

interface ClassData {
  _id: string;
  name: string;
  schoolId?: string;
  classTeacherId?: string;
  courses: ClassCourse[];
}

const SubjectGrid: React.FC<{ classId?: string; termId?: string }> = ({
  classId,
  termId: propTermId,
}) => {
  const router = useRouter();
  const { accessToken, isAuthenticated } = useAuthContext();

  // state
  const [effectiveClassId, setEffectiveClassId] = useState<string | undefined>(
    classId
  );
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchingCurriculumFor, setFetchingCurriculumFor] = useState<
    string | null
  >(null);

  // derive class id from localStorage if not provided via props
  useEffect(() => {
    if (classId) {
      setEffectiveClassId(classId);
      return;
    }

    try {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj?.classId) setEffectiveClassId(userObj.classId);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [classId]);

  // fetch class data when dependencies change
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    if (!effectiveClassId) {
      setError("No class selected");
      setClassData(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch(`${API_BASE_URL}/classes/${effectiveClassId}`, {
          method: "GET",
          accessToken,
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          let msg = res.statusText;
          try {
            const body = await res.json();
            msg = body?.message || JSON.stringify(body) || msg;
          } catch (e) {}
          throw new Error(msg || "Failed to fetch class data");
        }

        const data = await res.json();
        setClassData(data);
      } catch (err: any) {
        if (err.name === "AbortError") return; // ignore abort
        setError(err.message || "Failed to load class");
        setClassData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [effectiveClassId, accessToken, isAuthenticated]);

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const courses = classData?.courses || [];
    if (!q) return courses;
    return courses.filter((course) => {
      return (
        (course.title || "").toLowerCase().includes(q) ||
        (course.courseCode || "").toLowerCase().includes(q)
      );
    });
  }, [classData, searchTerm]);

  // helper to try and resolve a termId from multiple places
  const resolveTermId = (): string | null => {
    // 1. prop
    if (propTermId) return propTermId;

    // 2. try to read from localStorage.user (most apps store the full user object there)
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const parsedUser = JSON.parse(userStr);
          if (parsedUser?.termId) return parsedUser.termId;
        }
      } catch (e) {
        // ignore parse errors
      }

      // 3. try common standalone keys
      const candidates = ["termId", "currentTermId", "currentTerm", "term"];
      for (const key of candidates) {
        try {
          const v = localStorage.getItem(key);
          if (!v) continue;
          // if stored as JSON object like { _id: '...' }
          try {
            const parsed = JSON.parse(v);
            if (parsed && typeof parsed === "object") {
              if (parsed._id) return parsed._id;
              if (parsed.id) return parsed.id;
            }
          } catch (e) {
            // not JSON
            return v;
          }
        } catch (e) {
          // ignore access errors
        }
      }
    }

    // 4. try classData (sometimes apps include activeTerm on class)
    // @ts-ignore
    if ((classData as any)?.activeTerm?._id)
      return (classData as any).activeTerm._id;

    return null;
  };

  // fetch curriculum for given course and term then navigate to curriculum page
  const fetchCurriculumAndNavigate = async (course: Course) => {
    const courseId = course._id;
    const termId = resolveTermId();

    if (!termId) {
      setError(
        "No termId available. Please provide a termId prop to SubjectGrid or set 'termId'/'currentTermId' in localStorage."
      );
      return;
    }

    setFetchingCurriculumFor(courseId);

    try {
      const res = await authFetch(`${API_BASE_URL}/curriculum/by-course-term`, {
        method: "POST",
        accessToken,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, termId }),
      });

      if (!res.ok) {
        let msg = res.statusText;
        try {
          const body = await res.json();
          msg = body?.message || JSON.stringify(body) || msg;
        } catch (e) {}
        throw new Error(msg || "Failed to fetch curriculum");
      }

      const data = await res.json();

      // store the payload in sessionStorage so the curriculum page can read it
      try {
        const storageKey = `curriculum_${courseId}_${termId}`;
        sessionStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        // ignore storage errors
      }

      // navigate to curriculum page with query params (page should read sessionStorage key)
      router.push(`/subjects/curriculum?courseId=${courseId}&termId=${termId}`);
    } catch (err: any) {
      setError(err.message || "Failed to fetch curriculum");
    } finally {
      setFetchingCurriculumFor(null);
    }
  };

  // render states
  if (loading) {
    return (
      <div className="px-3 sm:px-6 py-4 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#030E18] dark:text-white">Loading...</h2>
          <p className="text-gray-600 dark:text-slate-300">
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
      <div className="px-3 sm:px-6 py-4 h-full">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Class
          </h3>
          <p className="text-gray-600 dark:text-slate-300 text-center max-w-md mb-4">{error}</p>
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

  if (!classData || classData.courses.length === 0) {
    return (
      <div className="px-3 sm:px-6 py-4 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#030E18] dark:text-white">No Courses</h2>
          <p className="text-gray-600 dark:text-slate-300">No courses found for this class.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-4 h-full">
      <div className="mb-4 sm:mb-6" data-guide="subjects-header">
        <h2 className="text-2xl font-medium mb-2 text-[#030E18] dark:text-white">Subjects</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Explore your course curriculum and materials
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4" data-guide="subjects-search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses or codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#30435F] rounded-lg bg-white dark:bg-[#1B2A44] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4" data-guide="subjects-count">
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Showing {filteredCourses.length} of {classData?.courses.length || 0}{" "}
          courses
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" data-guide="subjects-grid">
        {filteredCourses.map((course) => {
          // normalize nested id fields if backend returns plain ids
          const normalizedCourse: Course = {
            ...(course as any),
            subjectId:
              typeof (course as any).subjectId === "string"
                ? { _id: (course as any).subjectId, name: "", code: "" }
                : (course as any).subjectId,
            teacherId:
              typeof (course as any).teacherId === "string"
                ? {
                    _id: (course as any).teacherId,
                    firstName: "",
                    lastName: "",
                    email: "",
                  }
                : (course as any).teacherId,
            classId:
              typeof (course as any).classId === "string"
                ? { _id: (course as any).classId, name: "", level: "" }
                : (course as any).classId,
          } as Course;

          return (
            <SubjectCard
              key={course._id}
              course={normalizedCourse}
              loading={fetchingCurriculumFor === course._id}
              onViewCurriculum={fetchCurriculumAndNavigate}
            />
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600 dark:text-slate-300 text-center max-w-md">
            Try adjusting your search terms to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;
