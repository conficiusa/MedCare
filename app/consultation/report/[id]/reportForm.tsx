"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronDown, ChevronUp, SendIcon, PlusCircle } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormBuilder } from "@/components/blocks/formBuilder";
import DatePickerForm from "@/components/blocks/dobpicker";
import { clinicalImaging, labInvestigations } from "@/lib/data";
import { formSchema } from "./components/schema";
import { ExpandedSections, PrescriptionItem } from "./components/types";
import { PrescriptionForm } from "./components/prescriptionForm";
import MultiSelector from "@/components/blocks/multipleSelector";
import { defaultOptions } from "./components/defaultOptions";
import { Appointment, User } from "@/lib/definitions";
import Logo from "@/components/blocks/logo";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

// Types
type SectionName =
	| "patientInfo"
	| "consultation"
	| "medicalHistory"
	| "examination"
	| "assessment"
	| "followUp"
	| "investigations";

type FormValues = z.infer<typeof formSchema>;

/**
 * A reusable component for section headers that can be expanded/collapsed
 */
interface SectionHeaderProps {
	title: string;
	isExpanded: boolean;
	onToggle: () => void;
}

const SectionHeader = ({ title, isExpanded, onToggle }: SectionHeaderProps) => (
	<CardHeader className='cursor-pointer max-sm:px-2' onClick={onToggle}>
		<div className='flex items-center justify-between'>
			<CardTitle className='text-xs uppercase text-muted-foreground'>
				{title}
			</CardTitle>
			{isExpanded ? (
				<ChevronUp className='h-5 w-5 text-primary' />
			) : (
				<ChevronDown className='h-5 w-5 text-primary' />
			)}
		</div>
	</CardHeader>
);

export default function ConsultationReport({
	appointment,
	user,
}: {
	appointment: Appointment;
	user: Partial<User>;
}) {
	// State to track which sections are expanded
	const { push } = useRouter();
	const [isPending, startTransition] = useTransition();
	const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
		patientInfo: false,
		consultation: true,
		medicalHistory: true,
		examination: true,
		assessment: true,
		followUp: true,
		investigations: true,
	});
	// State for the "I understand" checkbox
	const [understood, setUnderstood] = useState(false);

	// Initialize form with default values
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultOptions(appointment, user, appointment?.id),
	});

  console.log(user.dob)
	/**
	 * Toggles the expanded/collapsed state of a section
	 */

	const toggleSection = (section: SectionName) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	/**
	 * Handles form submission
	 */
	const handleSubmit = async (data: FormValues) => {
		const res = await fetch("/api/consultation/reports", {
			method: "POST",
			body: JSON.stringify(data),
		});
		const resData = await res.json();
		if (res.status !== 200) {
			throw new Error(resData.error);
		}
		return data;
	};
	const onSubmit = async (data: FormValues) => {
		toast.promise(handleSubmit(data), {
			loading: "Submitting report...",
			success: () => {
				startTransition(() => {
					push("/doctor/dashboard/appointments");
				});
				return "consultation report submitted successfully";
			},
			error: (error) => {
				return error.message;
			},
			description: async (data) => {
				console.log(data);
				return data.error;
			},
		});
	};

	/**
	 * Adds a new prescription to the form
	 */
	const addPrescription = () => {
		const currentPrescriptions = form.getValues("prescriptions");
		const newPrescription: PrescriptionItem = {
			medication: "",
			dosage: "",
			frequency: "",
			duration: "",
			instructions: "",
		};

		form.setValue("prescriptions", [...currentPrescriptions, newPrescription]);
	};

	/**
	 * Removes a prescription from the form
	 */
	const removePrescription = (index: number) => {
		const currentPrescriptions = form.getValues("prescriptions");
		form.setValue(
			"prescriptions",
			currentPrescriptions.filter((_, i) => i !== index)
		);
	};

	return (
		<div className='min-h-screen dark:bg-background py-4'>
			<div className='mx-auto px-2 sm:px-6 lg:px-8'>
				<div className='sm:bg-muted sm:dark:bg-muted/30 shadow-xl rounded-lg overflow-hidden'>
					{/* Header */}
					<div className='p-3 sm:p-10 sm:bg-muted bg-muted/30'>
						<h1 className='text-xl md:text-3xl font-bold flex items-center gap-3 mb-2 '>
							MedCare Hub <Logo />
						</h1>
						<h3 className='text-lg sm:text-xl font-semibold mt-4'>
							Consultation Report
						</h3>
						<p className='text-muted-foreground sm:text-sm text-xs'>
							Complete the form below to document the patient consultation
						</p>
					</div>

					{/* Form */}
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='px-1 py-4 sm:p-10 space-y-8'
						>
							{/* Patient Information */}
							<p className='text-[10px] uppercase text-muted-foreground flex items-center gap-2'>
								<span className='text-base'>*</span> Required fields
							</p>
							<Card>
								<SectionHeader
									title='Patient Information'
									isExpanded={expandedSections.patientInfo}
									onToggle={() => toggleSection("patientInfo")}
								/>

								{expandedSections.patientInfo && (
									<CardContent className='max-sm:px-2'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<FormBuilder
												name='patientName'
												label='Patient Name *'
												message
											>
												<Input placeholder='Full name' disabled />
											</FormBuilder>

											<DatePickerForm
												name='dateOfBirth'
												control={form.control}
												label="Patient's Date of Birth *"
												disabled
											/>
										</div>
									</CardContent>
								)}
							</Card>

							{/* Consultation Details */}
							<Card>
								<SectionHeader
									title='Consultation Details'
									isExpanded={expandedSections.consultation}
									onToggle={() => toggleSection("consultation")}
								/>

								{expandedSections.consultation && (
									<CardContent className='max-sm:px-2'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
											<DatePickerForm
												name='consultationDate'
												control={form.control}
												label='Consultation Date *'
												disabled
											/>

											<FormBuilder
												name='consultationTime'
												label='Consultation Time *'
												message
											>
												<Input placeholder='Time of consultation' disabled />
											</FormBuilder>
										</div>

										<div className='space-y-4'>
											<FormBuilder
												name='chiefComplaint'
												label='Chief Complaint *'
												message
											>
												<Textarea
													placeholder='Main reason for the consultation'
													rows={8}
												/>
											</FormBuilder>

											<FormBuilder
												name='historyOfPresentIllness'
												label='History of Present Illness *'
												message
											>
												<Textarea
													placeholder="Detailed history of the patient's current illness"
													rows={12}
												/>
											</FormBuilder>
										</div>
									</CardContent>
								)}
							</Card>

							{/* Clinical Investigations */}
							<Card>
								<SectionHeader
									title='Clinical Investigations'
									isExpanded={expandedSections.investigations}
									onToggle={() => toggleSection("investigations")}
								/>

								{expandedSections.investigations && (
									<CardContent className='max-sm:px-2'>
										<div className='space-y-6'>
											<div>
												<FormLabel className='text-base font-medium'>
													Laboratory Investigations
												</FormLabel>
												<FormDescription className='mt-1 mb-3'>
													Select recommended lab tests for the patient
												</FormDescription>
												<div className=' mt-1'>
													<MultiSelector
														defaultOptions={labInvestigations}
														form={form}
														name={`clinicalInvestigations.lab_tests`}
														empty='No test found'
														label='Recommended Lab Tests'
														placeholder='Select lab tests'
													/>
												</div>
											</div>

											<div>
												<FormLabel className='text-base font-medium'>
													Imaging Investigations
												</FormLabel>
												<FormDescription className='mt-1 mb-3'>
													Select recommended imaging tests for the patient
												</FormDescription>
												<div className=' mt-2'>
													<MultiSelector
														defaultOptions={clinicalImaging}
														form={form}
														name={`clinicalInvestigations.imaging`}
														empty='Empty'
														label='Recommended Imaging Tests'
														placeholder='Select imaging tests'
													/>
												</div>
											</div>
										</div>
									</CardContent>
								)}
							</Card>

							{/* Assessment and Plan */}
							<Card>
								<SectionHeader
									title='Assessment and Plan'
									isExpanded={expandedSections.assessment}
									onToggle={() => toggleSection("assessment")}
								/>

								{expandedSections.assessment && (
									<CardContent className='max-sm:px-2'>
										<div className='space-y-4'>
											<FormBuilder name='assessment' label='Assessment' message>
												<Textarea
													placeholder="Clinical assessment of the patient's condition"
													className='min-h-[100px]'
												/>
											</FormBuilder>
											<FormBuilder name='diagnosis' label='Diagnosis' message>
												<Textarea
													placeholder='Medical diagnosis based on the assessment'
													className='min-h-[100px]'
												/>
											</FormBuilder>
											<FormBuilder
												name='treatmentPlan'
												label='Treatment Plan'
												message
											>
												<Textarea
													placeholder='Proposed treatment plan for the patient'
													className='min-h-[100px]'
												/>
											</FormBuilder>

											{/* Prescriptions */}
											<div className='space-y-4'>
												<div className='flex items-center justify-between'>
													<FormLabel className='text-base font-medium'>
														Prescriptions
													</FormLabel>
												</div>
												{form.watch("prescriptions").map((_, index) => (
													<PrescriptionForm
														key={index}
														index={index}
														onDelete={() => removePrescription(index)}
														showDelete={index > 0}
													/>
												))}
												<Button
													type='button'
													variant='outline'
													size='sm'
													onClick={addPrescription}
													className='text-primary hover:bg-primary/10 hover:text-primary/80'
												>
													<PlusCircle className='mr-2 h-4 w-4' />
													Add Prescription
												</Button>
											</div>
										</div>
									</CardContent>
								)}
							</Card>

							{/* Follow-up and Referrals */}
							<Card>
								<SectionHeader
									title='Follow-up and Referrals'
									isExpanded={expandedSections.followUp}
									onToggle={() => toggleSection("followUp")}
								/>

								{expandedSections.followUp && (
									<CardContent className='max-sm:px-2'>
										<div className='space-y-4'>
											<FormBuilder
												name='followUp'
												label='Recommendation and Follow up instructions'
												message
											>
												<Textarea placeholder='Follow-up timeline and instructions' />
											</FormBuilder>
										</div>
									</CardContent>
								)}
							</Card>

							{/* Action Buttons */}
							<div className='space-y-4'>
								<div className='flex items-center max-sm:items-start space-x-2'>
									<Checkbox
										id='terms'
										checked={understood}
										onCheckedChange={(checked) =>
											setUnderstood(checked === true)
										}
									/>
									<label
										htmlFor='terms'
										className=' max-sm:text-xs text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
									>
										I understand and confirm that this medical consultation
										report is accurate and complete to the best of my knowledge.
									</label>
								</div>

								<p className='text-muted-foreground text-sm px-3'>
									By submitting, you confirm that this medical consultation
									report is accurate and complete to the best of your knowledge.
									You understand that inaccurate or incomplete information may
									affect patient care decisions and could have legal
									implications. This submission will become part of the
									patient&apos;s permanent medical record.
								</p>

								<div className='flex justify-end gap-4'>
									<Button
										type='submit'
										disabled={
											form.formState.isSubmitting || !understood || isPending
										}
									>
										<SendIcon className='mr-2 h-4 w-4' />
										Submit Report
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
