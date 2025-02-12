"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { ReviewsPerPage } from "@/lib/constants";
import { ReviewType as Review } from "@/lib/definitions";
import { fetchDoctorReviews } from "@/lib/queries";
import ReviewCard from "./reviewCard";
import { Star } from "lucide-react";

export default function DoctorReviews({
  initialReviews,
  id,
  rating,
}: {
  initialReviews: Review[];
  id: string;
  rating: number;
}) {
  const [skip, setSkip] = useState(ReviewsPerPage);
  const [scrollTrigger, isInView] = useInView();
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (hasMore) {
      const reviewsData = await fetchDoctorReviews(id, skip);
      if ("data" in reviewsData) {
        if (reviewsData.data.length === 0) {
          setHasMore(false);
        }
        setReviews((prev) => [...prev, ...reviewsData.data]);
        setSkip((prev) => prev + ReviewsPerPage);
      }
      if ("error" in reviewsData) {
        setError(reviewsData.error);
      }
    }
  };

  useEffect(() => {
    if (isInView && hasMore) {
      loadMore();
    }
  }, [isInView, hasMore, loadMore]);

  return (
    <>
      <p className="text-3xl font-semibold mt-8 mb-4 px-3 flex gap-6 items-center">
        Average Rating{" "}
        <span className="flex items-center gap-2">
          {rating} <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        </span>
      </p>
      <div className="space-y-4 divide-y-[0.5px]">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <div className="w-full flex items-center justify-center">
        {(hasMore && (
          <div ref={scrollTrigger} className="text-xs text-muted-foreground">
            Loading...
          </div>
        )) || (
          <p className="text-sm text-muted-foreground ">
            No more reviews to load
          </p>
        )}
      </div>
    </>
  );
}
