"use client";

export function MetricCardSkeleton() {
  return (
    <div className="p-4 py-7 bg-white dark:bg-[#1B2A44] rounded-xl shadow animate-pulse">
      <div className="h-12 w-12 bg-gray-200 dark:bg-[#30435F] rounded-full mb-3"></div>
      <div className="h-4 w-24 bg-gray-200 dark:bg-[#30435F] rounded mb-2"></div>
      <div className="h-3 w-16 bg-gray-100 dark:bg-[#253651] rounded"></div>
    </div>
  );
}

export function TimetableSkeleton() {
  return (
    <div className="p-6 rounded-xl shadow bg-white dark:bg-[#1B2A44]">
      {/* Header */}
      <div className="animate-pulse">
        <div className="h-5 w-40 bg-gray-200 dark:bg-[#30435F] rounded mb-2"></div>
        <div className="h-3 w-60 bg-gray-100 dark:bg-[#253651] rounded"></div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mt-4 animate-pulse py-5">
        <div className="h-8 w-28 bg-gray-200 dark:bg-[#30435F] rounded"></div>
        <div className="h-8 w-36 bg-gray-200 dark:bg-[#30435F] rounded"></div>
        <div className="h-8 w-24 bg-gray-100 dark:bg-[#253651] rounded"></div>
        <div className="h-8 w-24 bg-gray-100 dark:bg-[#253651] rounded"></div>
      </div>

      {/* Loader body */}
      <div className="flex flex-col justify-center items-center h-60 mt-6">
        <div className="h-12 w-12 border-4 border-blue-600 dark:border-blue-300 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-[#30435F] rounded mb-2 animate-pulse"></div>
        <div className="h-3 w-72 bg-gray-100 dark:bg-[#253651] rounded animate-pulse"></div>
      </div>
    </div>
  );
}


export function AttendanceSkelenton() {
return (
  <div className="grid grid-cols-5 gap-4">
    {[...Array(25)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-200 rounded-lg dark:bg-gray-700" />
    ))}
  </div>
);
}
