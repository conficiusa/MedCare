import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
            <div className="relative h-48 rounded-t-xl bg-gradient-to-r from-blue-200 via-pink-100 to-yellow-100">
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
              <div className="absolute -top-24 left-6 size-32 rounded-full border-4 border-background bg-white">
                <Image
                  src={session?.user?.image as string}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              </div>

              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">Profile</h1>
                  <p className="text-sm text-muted-foreground">
                    Update your photo and personal details
                  </p>
                </div>
                <Button>Save</Button>
              </div>

              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
