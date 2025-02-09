import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Camera } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./profileForm";
import ProfilePic from "./profilePicUpdate";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container flex gap-8 px-4 py-6">
        {/* Main Content */}
        <main className="flex-1">
          <div className="rounded-xl">
            {/* Header with gradient */}
            <div className="relative h-48 rounded-t-xl bg-muted dark:bg-muted/70">
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-4 top-4"
              >
                <Camera className="size-4" />
              </Button>
            </div>

            {/* Profile Content */}
            <div className="relative -mt-16 rounded-b-xl border bg-background px-6 pb-6 pt-20">
              {/* Profile Image */}
              <div className="absolute -top-24 left-6 size-32 rounded-full border-4 border-background">
                <ProfilePic initialImage={session?.user?.image ?? null} />
              </div>

              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">Profile</h1>
                  <p className="text-sm text-muted-foreground">
                    Update your photo and personal details
                  </p>
                </div>
                <Button className="w-[200px]">Save</Button>
              </div>
              <ProfileForm session={session} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
