import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-full min-h-[calc(100dvh_-_4rem)] flex-col items-center justify-center gap-2">
      <Frown className="w-10 text-muted-foreground" />
      <h2 className="text-xl font-semibold">No Doctors Available </h2>
      <p>
        adjust your filters if there any. Or check back later for Open Slots{" "}
      </p>
      <Link
        href="/find-a-doctor"
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm  transition-colors hover:bg-green-600"
      >
        Notify me of open slots
      </Link>
    </main>
  );
}
