import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function OnlineCardSkeleton() {
  return (
    <Card className="dark:bg-muted/30 bg-background min-w-full md:min-w-[15rem] max-w-full p-4 rounded-md max-sm:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-4 w-[100px]" />
      </CardFooter>
    </Card>
  );
}
export default function CardOnlineSkeleton() {
  return (
    <>
      <OnlineCardSkeleton />
      <OnlineCardSkeleton />
      <OnlineCardSkeleton />
      <OnlineCardSkeleton />
      <OnlineCardSkeleton />
      <OnlineCardSkeleton />
      <OnlineCardSkeleton />
      <OnlineCardSkeleton />
    </>
  );
}
