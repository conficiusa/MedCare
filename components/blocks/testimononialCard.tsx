import { lusitana } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import React from "react";

const TestimonialCard = () => {
  return (
    <div className="max-w-md">
      <div className="text-center">
        <p className="text-sm font-semibold">Stanley Mensa</p>
        <p className="text-xs">janedoe@gmail.com</p>
        <img src="/rating.png" alt="rating" className="mx-auto my-3" />
        <p className={cn("text-sm", lusitana.className)}>
          “The ability to consult with a doctor from the comfort of my home has
          saved me so much time and stress. The process is seamless, the doctors
          are attentive, and I feel well taken care of.”
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
