import { Skeleton } from "@/components/ui/skeleton";

export function DoctorProfileAsideSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="p-4 space-y-4">
        <Skeleton className="w-full h-48 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
