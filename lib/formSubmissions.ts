"use client";
import axios from "axios";
import { z } from "zod";
import { CheckoutSchema, SignUpSchema } from "@/lib/schema";
import { Session } from "next-auth";
import { toast } from "sonner";
import PaystackPop from "@paystack/inline-js";
import { onSuccess } from "@/lib/paymentCallbacks";
import { FetchAppointment } from "./queries";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useCreateAccount = () => {
	const onCreateAccount = async (data: z.output<typeof SignUpSchema>) => {
		try {
			await axios.post("/api/auth/signup", data);
		} catch (error: any) {
			toast.error(error.response.data.message);
			throw error;
		}
	};
	return { onCreateAccount };
};

export const VerifyPaystackPayment = async (
	reference: string,
	amount: number
) => {
	try {
		const response = await fetch(
			`/api/paystack/verify/${reference}?rate=${amount}`,
			{
				method: "GET",
			}
		);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Payment Veriication error:", error);
		alert("Payment verification failed, We will retry and notify you");
	}
};

export const handlePaystackPayment = async (
	data: z.output<typeof CheckoutSchema>,
	session: Session | null,
	push: (href: string, options?: NavigateOptions) => void
) => {
	try {
		const appointmentData = await FetchAppointment(data.appointment);

		if (appointmentData?.statusCode !== 200) {
			toast.error("Error", { description: appointmentData?.message });
			return;
		}

		if ("data" in appointmentData) {
			if (appointmentData?.data?.status === "completed") {
				toast.error("Failed", {
					description: "This appointment has already been completed",
				});
				return;
			}
			if (appointmentData?.data?.paid === true) {
				toast.error("Failed", {
					description: "This appointment has already been paid",
				});
				return;
			}
			const response = await fetch("/api/paystack/initialize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: data.email,
					amount: data.amount,
					channels: [data.channel],
					metadata: {
						patientId: session?.user?.id,
						patient_name: data.fullName,
						patient_email: data.email,
						appointment: data.appointment,
					},
				}),
			});

			const result = await response.json();

			if (result.status) {
				const popup = new PaystackPop(); // Initialize Paystack inline

				popup.resumeTransaction(result?.data?.access_code, {
					// Handle payment success
					onSuccess: (res: any) => onSuccess(res, data.amount, push),
				});
			} else {
				// Handle payment initialization error
				toast.error("Payment initialization failed", {
					description: result.message,
				});
				console.error("Payment initialization failed", result);
			}
		}
	} catch (error: any) {
		console.error("Payment error:", error);
		toast.error(error.message);
	}
};
