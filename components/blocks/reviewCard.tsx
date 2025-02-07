import { ReviewType } from "@/lib/definitions";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import "@smastrom/react-rating/style.css";
import { Rating } from "@smastrom/react-rating";

const ReviewCard = ({ review }: { review: ReviewType }) => {
  return (
    <div>
      <div className="px-3 py-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-xs capitalize">{"Anonymous"}</h3>
            <div className="flex items-center">
              <Rating value={review?.rating} readOnly className="max-w-14" />
              <span className="ml-2 text-xs text-muted-foreground ">
                {moment(review?.createdAt).format("MMMM DD, YYYY.")}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12px] pl-14">{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
