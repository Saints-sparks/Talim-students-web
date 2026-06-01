// app/subjects/curriculum/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Calendar,
  BookOpen,
  User,
  Clock,
  FileText,
  Paperclip,
  ChevronRight,
} from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "@/components/CustomToast";
import html2canvas from "html2canvas";
import { Curriculum } from "@/services/curriculum.service";
import { API_BASE_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";
import { useAuthContext } from "@/contexts/AuthContext";

// ── Curriculum detail view ────────────────────────────────────────────────────

interface CurriculumViewProps {
  curriculum: Curriculum;
  onBack: () => void;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({
  curriculum,
  onBack,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    try {
      const canvas = await html2canvas(contentRef.current, {
        background: "#ffffff",
        scale: 2,
      } as any);
      const imgData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = `${curriculum.course?.title || "curriculum"}.png`;
      a.click();
      toast.success("Curriculum downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download curriculum");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4" data-guide="curriculum-detail-actions">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#6F6F6F] hover:text-[#030E18] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          {/* Main card */}
          <div
            ref={contentRef}
            className="bg-white rounded-2xl border border-[#F0F0F0] p-8"
            data-guide="curriculum-detail-content"
          >
            {/* Title + code badge */}
            <div className="flex flex-wrap items-start gap-3 mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-[#030E18]">
                    {curriculum.course?.title || "Untitled Course"}
                  </h1>
                  {curriculum.course?.courseCode && (
                    <span className="bg-gray-100 text-[#0A2343] text-xs font-semibold rounded px-3 py-1 shrink-0">
                      {curriculum.course.courseCode}
                    </span>
                  )}
                </div>
                {curriculum.course?.description && (
                  <p className="text-[#6F6F6F] text-sm mt-1">
                    {curriculum.course.description}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#003366] shrink-0" />
                <span className="font-medium text-[#030E18] text-sm">Term</span>
                <span className="bg-gray-100 text-[#0A2343] text-xs font-semibold rounded px-3 py-1">
                  {curriculum.term?.name || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#003366] shrink-0" />
                <span className="font-medium text-[#030E18] text-sm">Teacher</span>
                <span className="bg-gray-100 text-[#0A2343] text-xs font-semibold rounded px-3 py-1">
                  {curriculum.teacherId
                    ? `${curriculum.teacherId.firstName || ""} ${curriculum.teacherId.lastName || ""}`.trim()
                    : "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#003366] shrink-0" />
                <span className="font-medium text-[#030E18] text-sm">Last Updated</span>
                <span className="bg-gray-100 text-[#0A2343] text-xs font-semibold rounded px-3 py-1">
                  {new Date(curriculum.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-[#003366]" />
                <h2 className="text-base font-semibold text-[#030E18]">
                  Curriculum Content
                </h2>
              </div>
              <div className="bg-[#F8F8F8] rounded-xl p-5">
                {curriculum.content?.trim() ? (
                  <div
                    className="prose prose-sm max-w-none text-[#030E18] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: curriculum.content }}
                  />
                ) : (
                  <p className="text-[#6F6F6F] text-sm">
                    No content available for this curriculum.
                  </p>
                )}
              </div>
            </div>

            {/* Attachments */}
            {curriculum.attachments && curriculum.attachments.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="w-5 h-5 text-[#003366]" />
                  <h2 className="text-base font-semibold text-[#030E18]">
                    Attachments
                  </h2>
                </div>
                <div className="space-y-2">
                  {curriculum.attachments.map((attachment: string, i: number) => (
                    <a
                      key={i}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#003366] hover:text-[#002244] transition-colors text-sm"
                    >
                      <Paperclip className="w-4 h-4 shrink-0" />
                      <span>{attachment.split("/").pop() || `Attachment ${i + 1}`}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer metadata */}
            <div className="flex flex-wrap gap-6 text-xs text-[#878787] pt-4 border-t border-[#F0F0F0]">
              <span>
                <span className="font-medium">Created:</span>{" "}
                {new Date(curriculum.updatedAt).toLocaleDateString()}
              </span>
              <span>
                <span className="font-medium">Last Modified:</span>{" "}
                {new Date(curriculum.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Curriculum list page ──────────────────────────────────────────────────────

const CurriculumPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken } = useAuthContext();

  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [viewingCurriculum, setViewingCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const courseId = searchParams.get("courseId");
  const termIdFromUrl = searchParams.get("termId");
  const courseTitle = searchParams.get("courseTitle");
  const courseCode = searchParams.get("courseCode");

  useEffect(() => {
    const fetchOrLoad = async () => {
      setLoading(true);
      setLocalError(null);

      if (!courseId) {
        setLocalError("Missing courseId in URL.");
        setLoading(false);
        return;
      }

      let termId = termIdFromUrl;
      if (!termId && typeof window !== "undefined") {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const parsed = JSON.parse(userStr);
            if (parsed?.termId) termId = parsed.termId;
          }
        } catch (e) {}
      }

      if (!termId) {
        setLocalError("No termId found (URL or localStorage).");
        setLoading(false);
        return;
      }

      const storageKey = `curriculum_${courseId}_${termId}`;
      try {
        const cached = sessionStorage.getItem(storageKey);
        if (cached) {
          setCurricula(JSON.parse(cached) as Curriculum[]);
          setLoading(false);
          return;
        }
      } catch (e) {}

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

        const data = (await res.json()) as Curriculum[];
        setCurricula(data);
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(data));
        } catch (e) {}
      } catch (err: any) {
        console.error(err);
        setLocalError(err?.message || "Failed to load curriculum");
      } finally {
        setLoading(false);
      }
    };

    fetchOrLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, termIdFromUrl, accessToken]);

  const handleBackToSubjects = () => router.push("/subjects");

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (viewingCurriculum) {
    return (
      <Layout>
        <CurriculumView
          curriculum={viewingCurriculum}
          onBack={() => setViewingCurriculum(null)}
        />
      </Layout>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F8F8F8] p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <button
                onClick={handleBackToSubjects}
                className="flex items-center gap-2 text-[#6F6F6F] hover:text-[#030E18] transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Subjects</span>
              </button>
              <div className="h-7 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#F0F0F0] rounded-xl h-40 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (localError) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F8F8F8] p-6 flex items-center justify-center">
          <div className="bg-white rounded-xl border border-[#F0F0F0] p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-[#030E18] mb-2">
              Failed to Load Curriculum
            </h3>
            <p className="text-[#6F6F6F] text-sm mb-6">{localError}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleBackToSubjects}
                className="px-4 py-2 border border-[#D9D9D9] rounded-lg text-sm font-medium text-[#030E18] hover:bg-gray-50 transition-colors"
              >
                Back to Subjects
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#003366] text-white rounded-lg text-sm font-medium hover:bg-[#002244] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F8F8] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8" data-guide="curriculum-header">
            <button
              onClick={handleBackToSubjects}
              className="flex items-center gap-2 text-[#6F6F6F] hover:text-[#030E18] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Subjects</span>
            </button>
            <h1 className="text-2xl font-bold text-[#030E18] mb-1">
              {courseTitle ? decodeURIComponent(courseTitle) : "Course Curriculum"}
            </h1>
            <p className="text-[#6F6F6F] text-sm">
              {courseCode
                ? `Course Code: ${decodeURIComponent(courseCode)}`
                : "Select a curriculum to read"}
            </p>
          </div>

          {curricula.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#F0F0F0] p-16 text-center">
              <div className="w-14 h-14 bg-[#F8F8F8] rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-7 h-7 text-[#878787]" />
              </div>
              <h3 className="text-base font-semibold text-[#030E18] mb-2">
                No Curriculum Available
              </h3>
              <p className="text-[#6F6F6F] text-sm mb-6">
                There is no curriculum content available for this course yet.
              </p>
              <button
                onClick={handleBackToSubjects}
                className="px-4 py-2 bg-[#003366] text-white rounded-lg text-sm font-medium hover:bg-[#002244] transition-colors"
              >
                Back to Subjects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-guide="curriculum-list">
              {curricula.map((curriculum) => (
                <button
                  key={curriculum._id}
                  onClick={() => setViewingCurriculum(curriculum)}
                  className="bg-white border border-[#F0F0F0] rounded-xl p-5 hover:border-[#003366] hover:shadow-sm transition-all duration-200 text-left group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#EAF2FB] rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#003366]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#030E18] text-sm group-hover:text-[#003366] transition-colors truncate">
                        {curriculum.course?.title}
                      </h3>
                      <p className="text-xs text-[#6F6F6F] mt-0.5">
                        {curriculum.term?.name}
                      </p>
                    </div>
                  </div>

                  {/* Content preview */}
                  <div
                    className="text-[#6F6F6F] text-xs line-clamp-2 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: (curriculum.content || "No content available.").substring(0, 120) + "…",
                    }}
                  />

                  <div className="flex items-center justify-between text-xs text-[#878787]">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        {curriculum.teacherId
                          ? `${curriculum.teacherId.firstName || ""} ${curriculum.teacherId.lastName || ""}`.trim()
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(curriculum.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {curriculum.attachments && curriculum.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex items-center gap-1 text-xs text-[#003366]">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{curriculum.attachments.length} attachment{curriculum.attachments.length > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CurriculumPage;
