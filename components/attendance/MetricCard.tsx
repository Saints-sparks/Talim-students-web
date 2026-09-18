import { Card, CardContent } from "@/components/ui/card";
import type { MetricCardProps } from "@/types/dashboard";

export function MetricCard({ icon, value, label, message }: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-2 flex mb-6 justify-start items-center gap-2 flex-row">
          <div className=" flex justify-center items-center text-blue-600">
            {icon}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
        {/* Horizontal lines */}
        <div className=" h-px -mx-6 bg-gray-200" />
        <p className="mt-4 inline-flex items-center text-sm text-[#606060] cursor-default">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
