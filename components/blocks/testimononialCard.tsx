// import { lusitana } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const TestimonialCard = () => {
  return (
    <div className="max-w-md">
      <div className="text-center">
        <p className="text-sm font-semibold">Stanley Mensa</p>
        <p className="text-xs">janedoe@gmail.com</p>
        <Image
          src="/rating.png"
          alt="rating"
          className="mx-auto my-3 object-cover w-auto h-auto"
          width={80}
          height={50}
        />

        {/* //TODO : add back lusitana font */}
        <p className={cn("text-sm")}>
          “The ability to consult with a doctor from the comfort of my home has
          saved me so much time and stress. The process is seamless, the doctors
          are attentive, and I feel well taken care of.”
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
