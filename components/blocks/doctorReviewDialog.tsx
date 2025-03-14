"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ItemStyles, Rating, StickerStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Appointment, ReviewType } from "@/lib/definitions";
import { addReview } from "@/lib/actions";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

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
	const [loading, setLoading] = useState<boolean>(false);
	const { push } = useRouter();
	const theme = useTheme();

	const customStar: ItemStyles = {
		itemShapes: StickerStar,
		activeFillColor: "#fae206",
		inactiveFillColor:
			theme?.resolvedTheme === "dark" ? "#2d3748" : "hsla(240 6.8% 85.9%)",
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			if (!rating || rating === 0) {
				toast.error("Please select a rating");
				return;
			}
			const data: Partial<ReviewType> = {
				comment: review,
				rating,
				doctorId: appointment?.doctor?.doctorId,
				userId: appointment?.patient?.patientId,
			};
			const res = await addReview(data);
			if ("data" in res) {
				toast.success("Sucess", { description: res?.message });
				setLoading(false);
				return;
			}
			toast.error("Error", { description: res.message });
			setLoading(false);
			push("/dashboard/appointments");
			return;
		} catch (error: any) {
			setLoading(false);
			toast.error("Failed to submit");
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className='grid gap-4 p-4'>
			<div className='flex flex-col space-y-1.5 text-center '>
				<h3 className='text-xl font-semibold leading-none tracking-tight'>
					Leave a review
				</h3>
				<p className='text-sm text-muted-foreground'>
					Please share your experience with Dr.{" "}
					{appointment?.doctor?.name?.split(" ")[0]}. Your feedback helps other
					patients make informed decisions.
				</p>
			</div>
			<div className='flex flex-col items-center justify-cpenter space-y-2'>
				<h4 className='text-lg font-semibold leading-none tracking-tight'>
					Rate your experience
				</h4>
				<div className='flex items-center justify-center space-x-1'>
					<Rating
						style={{ maxWidth: 180 }}
						value={rating}
						onChange={setRating}
						itemStyles={customStar}
					/>
				</div>
				<span className='text-muted-foreground transition-all duration-300'>
					{getRating(rating)}
				</span>
			</div>
			<Textarea
				placeholder='Write your review here...'
				value={review}
				onChange={(e) => setReview(e.target.value)}
				rows={4}
			/>
			<Button onClick={() => handleSubmit()} disabled={loading}>
				<span>Submit</span>
			</Button>
		</div>
	);
};

export default DoctorReviewDialog;
