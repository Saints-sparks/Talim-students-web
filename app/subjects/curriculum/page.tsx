// app/subjects/curriculum/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import CurriculumDetailView from "@/components/curriculum/CurriculumDetailView";
import {
  CurriculumEmpty,
  CurriculumError,
  CurriculumGrid,
  CurriculumHeader,
  CurriculumSkeleton,
} from "@/components/curriculum/CurriculumList";
import { useCourseCurriculum } from "@/hooks/useCurriculum";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import type { CurriculumDetail } from "@/services/curriculum.service";

/**
 * The curriculum published for one course in the current term.
 *
 * The term comes from the signed-in session, so a link without `termId` still
 * resolves; the course id must be on the URL.
 *
 * @returns The curriculum screen.
 */
function CurriculumScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { termId: sessionTermId } = useStudentIdentity();

  const courseId = searchParams.get("courseId");
  const termId = searchParams.get("termId") ?? sessionTermId;
  const courseTitle = searchParams.get("courseTitle");
  const courseCode = searchParams.get("courseCode");

  const [openCurriculum, setOpenCurriculum] = useState<CurriculumDetail | null>(null);
  const { curricula, isLoading, error, refetch } = useCourseCurriculum(courseId, termId);

  const backToSubjects = () => router.push("/subjects");
  const heading = courseTitle ? decodeURIComponent(courseTitle) : curricula[0]?.course?.title || "Course Curriculum";
  const code = courseCode ? decodeURIComponent(courseCode) : (curricula[0]?.course?.courseCode ?? null);

  if (openCurriculum) {
    return (
      <Layout>
        <CurriculumDetailView curriculum={openCurriculum} onBack={() => setOpenCurriculum(null)} />
      </Layout>
    );
  }

  const missingParam = !courseId
    ? "This link is missing the course it should open."
    : !termId
      ? "We couldn't work out the current term for your school."
      : null;

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F8F8] p-6 dark:bg-[#0B1224]">
        <div className="mx-auto max-w-7xl">
          <CurriculumHeader title={heading} code={code} onBack={backToSubjects} />

          {missingParam ? (
            <CurriculumError message={missingParam} onBack={backToSubjects} onRetry={backToSubjects} />
          ) : isLoading ? (
            <CurriculumSkeleton />
          ) : error ? (
            <CurriculumError message={error} onBack={backToSubjects} onRetry={refetch} />
          ) : curricula.length === 0 ? (
            <CurriculumEmpty onBack={backToSubjects} />
          ) : (
            <CurriculumGrid curricula={curricula} onOpen={setOpenCurriculum} />
          )}
        </div>
      </div>
    </Layout>
  );
}

/**
 * Route entry. `useSearchParams` needs a Suspense boundary in the App Router.
 *
 * @returns The curriculum page.
 */
export default function CurriculumPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="min-h-screen bg-[#F8F8F8] p-6 dark:bg-[#0B1224]">
            <div className="mx-auto max-w-7xl">
              <CurriculumSkeleton />
            </div>
          </div>
        </Layout>
      }
    >
      <CurriculumScreen />
    </Suspense>
  );
}
