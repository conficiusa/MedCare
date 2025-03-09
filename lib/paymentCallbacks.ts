"use client";
import { toast } from "sonner";
import { VerifyPaystackPayment } from "@/lib/formSubmissions";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

// TODO: make sure to get the amount backend for verification in future
export const onSuccess = async (
	res: any,
	amount: number,
	push: (href: string, options?: NavigateOptions) => void
) => {
	// verify payment
	const verificationPromise = VerifyPaystackPayment(res.reference, amount);
	toast.promise(verificationPromise, {
		loading: "Confirming your appointment...",

		// Handle payment verification sucess
		success: async (data: any) => {
			//verifying payment was a success
			push("/dashboard/appointments");
			if (data?.data?.data?.status === "success") {
				return "Appointment Confirmed";
			}
		},
		error: () => {
			return "Your appointment confirmation status will be sent via secure email";
		},
		description: (data) => {
			if (data) {
				return "Contact support if you do not receive an email in 30 minutes";
			}
		},
	});
};
