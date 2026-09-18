"use client";

import Layout from "@/components/Layout";
import SubjectGrid from "@/components/SubjectGrid";

/**
 * The subjects screen. The grid owns its own loading, empty and error states,
 * so the page is just the scroll container around it.
 *
 * @returns The subjects page.
 */
export default function SubjectsPage() {
  return (
    <Layout>
      <div className="flex h-screen flex-col">
        {/* D6: the list scrolls inside this container, not the page. */}
        <main className="w-full flex-grow space-y-6 overflow-y-auto scrollbar-hide">
          <SubjectGrid />
        </main>
      </div>
    </Layout>
  );
}
