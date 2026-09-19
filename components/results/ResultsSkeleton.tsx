import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/StateComponents";

/**
 * The first-load placeholder, shaped like the tiles and the two-column body.
 *
 * @returns The skeleton.
 */
export function ResultsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading your results">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="border border-[#F0F0F0] shadow-none rounded-2xl dark:border-[#30435F] dark:bg-[#1B2A44]">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-8 w-20 rounded-xl" />
              <Skeleton className="h-4 w-28 rounded-xl" />
              <Skeleton className="h-3 w-16 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="lg:col-span-2 h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
