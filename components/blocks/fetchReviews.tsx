import { fetchDoctorReviews } from "@/lib/queries";
import DoctorReviews from "./reviews";

const FetchReviews = async ({ id, rating }: { id: string; rating: number }) => {
  const reviewsData = await fetchDoctorReviews(id, 0);
  if ("data" in reviewsData) {
    return (
      <DoctorReviews
        initialReviews={reviewsData.data}
        id={id}
        rating={rating}
      />
    );
  }
  if ("error" in reviewsData) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center flex-col">
        <p className="text-destructive">{reviewsData.error}</p>
        <p className="text-xs">There was an error fetching reviews</p>
      </div>
    );
  }
};

export default FetchReviews;
