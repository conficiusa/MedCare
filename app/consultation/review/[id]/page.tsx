import DoctorReviewDialog from "@/components/blocks/doctorReviewDialog";
import { FetchAppointment } from "@/lib/queries";
interface Params {
  id: string;
}
interface ReviewProps {
  params: Params;
}
const ReviewDoctor = async ({ params }: ReviewProps) => {
  const data = await FetchAppointment(params?.id);
  if ("data" in data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-background p-4">
        <div className="w-full max-w-md bg-background dark:bg-muted/40 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* <div className="relative w-20 h-20 mb-2">
            <div className="absolute inset-0 bg-background rounded-full" />
            <div className="absolute inset-1 bg-background rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-10 h-10 text-primary" strokeWidth={2.5} />
            </div>
          </div> */}
            <DoctorReviewDialog appointment={data?.data} />
          </div>
        </div>
      </div>
    );
  }
};

export default ReviewDoctor;
