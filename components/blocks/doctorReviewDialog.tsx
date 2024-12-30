"use client";

import React, { useState} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Appointment } from "@/lib/definitions";

interface DoctorReviewDialogProps {
  appointment: Partial<Appointment>;
}

function getRating(
  rating: number
):
  | "Not recommended"
  | "Fairly recommended"
  | "Recommended"
  | "Highly recommended"
  | "Somewhat recommended"
  | "None"
  | "" {
  switch (rating) {
    case 1:
      return "Not recommended";
    case 2:
      return "Somewhat recommended";
    case 3:
      return "Fairly recommended";
    case 4:
      return "Recommended";
    case 5:
      return "Highly recommended";
    default:
      return "";
  }
}
const DoctorReviewDialog: React.FC<DoctorReviewDialogProps> = ({
  appointment,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  return (
    <div className="grid gap-4 p-4">
      <div className="flex flex-col space-y-1.5 text-center ">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Leave a review
        </h3>
        <p className="text-sm text-muted-foreground">
          Please share your experience with Dr. {appointment?.doctor?.name?.split(" ")[0]}. Your feedback
          helps other patients make informed decisions.
        </p>
      </div>
      <div className="flex flex-col items-center justify-cpenter space-y-2">
        <div className="flex items-center justify-center space-x-1">
          <Rating
            style={{ maxWidth: 180 }}
            value={rating}
            onChange={setRating}
          />
        </div>
        <span className="text-muted-foreground transition-all duration-300">
          {getRating(rating)}
        </span>
      </div>
      <Textarea
        placeholder="Write your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
      />
      <Button>
        <span>Submit</span>
      </Button>
    </div>
  );
};

export default DoctorReviewDialog;
