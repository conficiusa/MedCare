"use client";
import { FormBuilder } from "@/components/blocks/formBuilder";
import SelectComponent from "@/components/blocks/selectComponent";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
	certifications,
	languages,
	regions,
	specializations,
} from "@/lib/data";
import { fullDoctorSchema } from "@/lib/schema";
import { getFilteredValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DatePickerForm from "@/components/blocks/dobpicker";
import MultiSelector from "@/components/blocks/multipleSelector";
import { toast } from "sonner";
import { Doctor } from "@/lib/definitions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ProfileForm = ({ user }: { user: Doctor }) => {
	const form = useForm<z.output<typeof fullDoctorSchema>>({
		resolver: zodResolver(fullDoctorSchema),
		defaultValues: {
			address_1: user?.address_1 ?? "",
			address_2: user?.address_2 ?? "",
			city: user?.city ?? "",
			country: "Ghana",
			dob: new Date(user?.dob as Date) ?? undefined,
			gender: user?.gender ?? "",
			phone: user?.phone ?? "",
			role: "patient",
			region: user?.region ?? "",
			languages: getFilteredValues(user?.languages, languages),
			name: user?.name ?? "",
			image: user?.image ?? "",
			thumbnail: user?.thumbnail ?? "",
			bio: user?.doctorInfo?.bio ?? "",
			certifications: getFilteredValues(
				user?.doctorInfo?.certifications,
				certifications
			),
			current_facility: user?.doctorInfo?.current_facility ?? "",
			specialities: getFilteredValues(
				user?.doctorInfo?.specialities,

				specializations
			),
		},
	});

	return (
		<>
			<div className='mb-8 flex items-start justify-between'>
				<div>
					<h1 className='text-2xl font-semibold'>Profile</h1>
					<p className='text-sm text-muted-foreground'>
						Update your photo and personal details
					</p>
				</div>
				<Button className='w-[200px]' disabled={!form.formState.isDirty}>
					Save
				</Button>
			</div>
			<Form {...form}>
				<form className='space-y-8'>
					<div className='dark:bg-muted/40 bg-muted/70 p-10 max-sm:px-4 rounded-2xl shadow-md flex gap-20'>
						<div className='grid gap-4 flex-1'>
							<h2 className='text-xs uppercase text-muted-foreground'>
								Basic Information
							</h2>
							<FormBuilder name='name' label='Full Name' message>
								<Input id='name' placeholder='Name' />
							</FormBuilder>
							<SelectComponent
								name='gender'
								label='Select Your Gender'
								placeholder='Select Your Gender'
								items={[
									{ label: "Male", value: "Male" },
									{ label: "Female", value: "Female" },
								]}
							/>
							<MultiSelector
								defaultOptions={languages}
								form={form}
								name='languages'
								empty='No languages found'
								label='What languages do you speak?'
								placeholder='Select languages'
								groupBy='group'
								maxSelected={4}
								onMaxSelected={(maxlimit) => {
									toast.info(
										`you have reached the maximum limit of ${maxlimit}`
									);
								}}
							/>
							<FormBuilder name='phone' label='Enter your Contact '>
								<PhoneInput
									type='text'
									placeholder='Phone number'
									className='duration-300'
									defaultCountry='GH'
									international={false}
									initialValueFormat='national'
								/>
							</FormBuilder>
							<DatePickerForm
								name='dob'
								control={form.control}
								label='Choose your date of birth'
							/>
						</div>
					</div>
					<div className='dark:bg-muted/40 bg-muted/70 p-10 max-sm:px-4 rounded-2xl shadow-md grid gap-4'>
						<h2 className='text-xs uppercase text-muted-foreground'>
							Location and address details
						</h2>
						<FormBuilder name='address_1' label='Address Line 1' message>
							<Input id='address_1' placeholder='Address Line 1' />
						</FormBuilder>
						<FormBuilder name='address_2' label='Address Line 2' message>
							<Input id='address_2' placeholder='Address Line 2' />
						</FormBuilder>
						<FormBuilder name='city' label='City' message>
							<Input id='city' placeholder='City' />
						</FormBuilder>
						<SelectComponent
							name='region'
							label='Choose your region'
							placeholder='Select region'
							items={regions}
							control={form.control}
						/>
					</div>
					<div className='dark:bg-muted/40 bg-muted/70 p-10 max-sm:px-4 rounded-2xl shadow-md grid gap-4'>
						<h2 className='text-xs uppercase text-muted-foreground'>
							Professional Information
						</h2>
						<FormBuilder
							name='current_facility'
							label='Your current facility'
							className='sm:-mt-4'
						>
							<Input placeholder='Where do you currently work' />
						</FormBuilder>

						<MultiSelector
							defaultOptions={specializations}
							form={form}
							name='specialities'
							empty='No specialities'
							label='Choose your Specialities (for Specialists only)'
							description='If your speciality is not in the dropdown. you can create you by typing it in'
							placeholder='Select Speciality'
							maxSelected={2}
							onMaxSelected={(maxlimit) => {
								toast.info(`you have reached the maximum limit of ${maxlimit}`);
							}}
						/>
						<MultiSelector
							defaultOptions={certifications}
							form={form}
							name='certifications'
							empty='No certifications'
							label='Choose your certifications (Optional but recommended)'
							description='If you you have certifications not included in the list. you can type them in'
							placeholder='Choose your certifications'
							maxSelected={4}
							onMaxSelected={(maxlimit) => {
								toast.info(`you have reached the maximum limit of ${maxlimit}`);
							}}
						/>
						<FormBuilder
							control={form.control}
							name='bio'
							label='Tell us about your self'
							description={`Tell us about us as a person, your education, experience and approach, this is allows patients to know more about you`}
						>
							<Textarea
								placeholder='additional relevant information about your self'
								maxLength={1000}
								rows={9}
								className='resize-none'
							/>
						</FormBuilder>
					</div>
				</form>
			</Form>
		</>
	);
};

export default ProfileForm;
