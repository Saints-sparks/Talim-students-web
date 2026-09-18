"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { ArrowLeft, Calendar, ChevronRight, Clock, Download, FileText, Paperclip, User } from "lucide-react";
import { toast } from "@/components/CustomToast";
import { logger } from "@/lib/logger";
import type { CurriculumDetail } from "@/services/curriculum.service";

/**
 * Formats a timestamp for display, tolerating a missing value.
 *
 * @param value - An ISO timestamp, or nothing.
 * @returns The local date, or an em dash.
 */
function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

/**
 * The full reading view for one curriculum document, with a PNG export.
 *
 * @param props - Component props.
 * @param props.curriculum - The document to show.
 * @param props.onBack - Returns to the list.
 * @returns The detail view.
 */
export default function CurriculumDetailView({
  curriculum,
  onBack,
}: {
  curriculum: CurriculumDetail;
  onBack: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, { backgroundColor: "#ffffff", scale: 2 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${curriculum.course?.title || "curriculum"}.png`;
      link.click();
      toast.success("Curriculum downloaded.");
    } catch (error) {
      logger.error("curriculum", "Rendering the curriculum to PNG failed", error);
      toast.error("We couldn't download that. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const teacherName = curriculum.course?.teacherName?.trim();

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0B1224]">
      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between" data-guide="curriculum-detail-actions">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-[#6F6F6F] transition-colors hover:text-[#030E18] dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded-lg bg-[#003366] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002244] disabled:opacity-60 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Preparing…" : "Download"}
            </button>
          </div>

          <div
            ref={contentRef}
            data-guide="curriculum-detail-content"
            className="rounded-2xl border border-[#F0F0F0] bg-white p-8 dark:border-[#30435F] dark:bg-[#1B2A44]"
          >
            <div className="mb-6 flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-[#030E18] dark:text-white">
                    {curriculum.course?.title || "Untitled Course"}
                  </h1>
                  {curriculum.course?.courseCode && (
                    <span className="shrink-0 rounded bg-gray-100 px-3 py-1 text-xs font-semibold text-[#0A2343] dark:bg-[#243853] dark:text-slate-100">
                      {curriculum.course.courseCode}
                    </span>
                  )}
                </div>
                {curriculum.course?.description && (
                  <p className="mt-1 text-sm text-[#6F6F6F] dark:text-slate-300">{curriculum.course.description}</p>
                )}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: Calendar, label: "Term", value: curriculum.term?.name || "—" },
                { icon: User, label: "Teacher", value: teacherName || "Not assigned" },
                { icon: Clock, label: "Last Updated", value: formatDate(curriculum.updatedAt) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 shrink-0 text-[#003366] dark:text-blue-300" />
                  <span className="text-sm font-medium text-[#030E18] dark:text-white">{label}</span>
                  <span className="rounded bg-gray-100 px-3 py-1 text-xs font-semibold text-[#0A2343] dark:bg-[#243853] dark:text-slate-100">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#003366] dark:text-blue-300" />
                <h2 className="text-base font-semibold text-[#030E18] dark:text-white">Curriculum Content</h2>
              </div>
              <div className="rounded-xl bg-[#F8F8F8] p-5 dark:bg-[#111C31]">
                {curriculum.content?.trim() ? (
                  <div
                    className="prose prose-sm max-w-none leading-relaxed text-[#030E18] dark:prose-invert dark:text-slate-200"
                    // The content is rich text written by the student's own teacher
                    // and sanitised server-side before storage.
                    dangerouslySetInnerHTML={{ __html: curriculum.content }}
                  />
                ) : (
                  <p className="text-sm text-[#6F6F6F] dark:text-slate-300">
                    No content available for this curriculum.
                  </p>
                )}
              </div>
            </div>

            {curriculum.attachments?.length ? (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-[#003366] dark:text-blue-300" />
                  <h2 className="text-base font-semibold text-[#030E18] dark:text-white">Attachments</h2>
                </div>
                <div className="space-y-2">
                  {curriculum.attachments.map((attachment, index) => (
                    <a
                      key={attachment}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#003366] transition-colors hover:text-[#002244] dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      <Paperclip className="h-4 w-4 shrink-0" />
                      <span>{attachment.split("/").pop() || `Attachment ${index + 1}`}</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-6 border-t border-[#F0F0F0] pt-4 text-xs text-[#878787] dark:border-[#30435F] dark:text-slate-400">
              <span>
                <span className="font-medium">Created:</span> {formatDate(curriculum.createdAt)}
              </span>
              <span>
                <span className="font-medium">Last Modified:</span> {formatDate(curriculum.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
