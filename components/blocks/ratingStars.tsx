"use client";
import "@smastrom/react-rating/style.css";
import { Rating } from "@smastrom/react-rating";

interface RatingsProps {
  value: number;
}
export default function Ratings({ value }: RatingsProps) {
  return <Rating value={value} readOnly className="max-w-20" />;
}
