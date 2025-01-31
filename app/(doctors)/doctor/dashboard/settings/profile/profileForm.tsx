import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Session } from "next-auth";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

const ProfileForm = ({ session }: { session: Session }) => {
  return (
    <form className="space-y-8">
      <div className="grid gap-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input id="username" placeholder="Name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <Input id="website" placeholder="Website" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Your Photo</label>
        <div className="flex items-center gap-4">
          <Image
            src={session?.user?.image as string}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Delete
            </Button>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Update your photo and personal details.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Your Bio
        </label>
        <Textarea
          id="bio"
          placeholder="Add a short bio..."
          className="min-h-[100px]"
        />
        <p className="text-sm text-muted-foreground">
          Write a short introduction.
        </p>
      </div>
    </form>
  );
};

export default ProfileForm;
