import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Camera } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./profileForm";
import ProfilePic from "./profilePicUpdate";
import { fetchUserData } from "@/lib/queries";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  const user = await fetchUserData(session?.user?.id ?? "");
  if ("data" in user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container flex gap-8 px-4">
          {/* Main Content */}
          <main className="flex-1">
            <div className="rounded-xl">
              {/* Header with gradient */}
              <div className="relative h-48 rounded-t-xl bg-muted dark:bg-muted/70" />
              {/* Profile Content */}
              <div className="relative -mt-16 rounded-b-xl border bg-background px-6 pb-6 pt-20">
                {/* Profile Image */}
                <div className="absolute -top-24 left-6 size-32 rounded-full border-4 border-background">
                  <ProfilePic />
                </div>

             
              <ProfileForm user={user?.data} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
