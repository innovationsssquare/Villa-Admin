import { Skeleton } from "@/components/ui/skeleton"

export default function Revenueskeleton() {
  return (
    <div className="p-2 bg-white rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-60 flex flex-col justify-between text-sm text-gray-500">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>

        {/* Chart container */}
        <div className="ml-16 relative">
          {/* Chart background */}
          <div className="h-60 bg-gray-50 rounded relative overflow-hidden">
         
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>

          {/* X-axis title */}
          <div className="flex justify-center mt-4">
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Y-axis title */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90">
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}
