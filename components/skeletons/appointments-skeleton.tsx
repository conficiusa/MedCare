import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-stretch sm:items-center border rounded-lg shadow-sm bg-white"
        >
          <div className="text-center p-4 sm:p-6 border-b sm:border-b-0 sm:border-r w-full sm:w-24 bg-gray-50">
            <Skeleton className="h-4 w-8 mx-auto mb-1" />
            <Skeleton className="h-8 w-12 mx-auto" />
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="space-y-1 w-full sm:w-auto sm:min-w-[140px]">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="flex-1 w-full">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-6 rounded-full" />
                ))}
              </div>
            </div>

            {index === 3 && <Skeleton className="h-5 w-32 rounded-full" />}
          </div>

          <div className="p-4 sm:p-6">
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
