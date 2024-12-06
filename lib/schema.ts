import { string, z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const multiSelectSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "Please enter your full name.")
      .min(2, { message: "Please enter a valid name." }),
    email: z
      .string()
      .min(1, "please enter your email")
      .email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "please enter your email")
    .email("Please enter a valid email"),
});

export const PatientOnboardingSchema = z.object({
  languages: z
    .array(multiSelectSchema)
    .min(1, "Please select a language")
    .max(4, "You can only select up to 4 languages"),
  gender: z.string().min(1, "Please enter your gender"),
  phone: z.string(),
  image: z
    .string()
    .nullable()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        // Determine the Base64 prefix length dynamically
        const base64Prefix = file.substring(0, file.indexOf(",") + 1);
        const base64Length = file.length - base64Prefix.length;
        const sizeInBytes = (base64Length * 3) / 4;
        return sizeInBytes < 4000000; // 4MB
      },
      {
        message: "File size must be less than 4MB",
        path: ["image"],
      }
    ),
  dob: z
    .date({
      required_error: "Please enter your date of birth",
    })
    .nullable()
    .refine(
      (date) => date && date <= new Date(),
      "Please enter a valid date of birth"
    )
    .refine(
      (date) => !date || date >= new Date(1900, 1, 1),
      "Please enter a valid date of birth"
    ),
  role: z.string().min(1, "Please enter your role"),
  region: z.string().min(1, "Please enter your region"),
  city: z.string().min(1, "Please enter your city/town"),
  country: z.string().min(1, "Please enter your country"),
  conditions: z
    .array(multiSelectSchema)
    .max(6, "You can only select up to 6 conditions"),
  medicalHistory: z
    .string()
    .max(900, "Medical history must be less than 300 characters"),
});

export const onDoctorBoardingSchema1 = z.object({
  languages: z
    .array(multiSelectSchema)
    .min(1, "Please select a language")
    .max(4, "You can only select up to 4 languages"),
  gender: z.string().min(1, "Please enter your gender"),
  phone: z.string(),
  dob: z
    .date({
      required_error: "Please enter your date of birth",
    })
    .optional()
    .refine(
      (date) => date && date <= new Date(),
      "Please enter a valid date of birth"
    )
    .refine(
      (date) => !date || date >= new Date(1900, 1, 1),
      "Please enter a valid date of birth"
    ),
  role: z.enum(["patient", "doctor"]),
});
export const onDoctorBoardingSchema2 = z.object({
  region: z.string().min(1, "Please enter your region"),
  city: z.string().min(1, "Please enter your city/town"),
  country: z.string().min(1, "Please enter your country"),
  address_1: z.string(),
  address_2: z.string(),
});
export const onDoctorBoardingSchema3 = z
  .object({
    license_number: z.string().min(1, "Please enter your Registration number "),
    bio: z.string().min(1, "Please tell us about yourself"),
    experience: z.coerce.number({
      required_error: "Experience level is required",
      invalid_type_error: "Experience must be a number",
    }),
    current_facility: z.string().min(1, "Please enter your current facility "),
    certifications: z
      .array(multiSelectSchema)
      .max(4, "You can only select up to 4 certifications"),
    specialities: z
      .array(multiSelectSchema)
      .max(4, "You can only select up to 4 specialities"),
  })
  .refine(
    (data) => {
      if (!data?.experience) {
        return false;
      }
      return true;
    },
    {
      message: "experience level is required",
      path: ["experience"],
    }
  );
export const onDoctorBoardingSchema4 = z.object({
  media: z.array(string()).min(1, "Please select at least one medium"),
  rate: z.coerce
    .number({
      required_error: "Experience level is required",
      invalid_type_error: "Experience must be a number",
    })
    .refine((value) => value > 0, {
      message: "Rate must be greater than 0",
    }),
  bank: z.string().min(1, "Please Select a provider "),
  payment_channel: z.string().min(1, "Please select your payment channel "),
  account_number: z.string().min(1, "Please enter account number"),
  account_name: z.string().min(1, "Please enter the name on the account"),
});
export const onDoctorBoardingSchema5 = z.object({
  image: z.string().min(1, "Failed to get image url"),
});

export const onDoctorBoardingSchema6 = z.object({
  verification: z.enum(["not_started", "verifying", "approved", "failed"]),
});

export const CheckoutSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name."),
  appointment: z.string().min(1, "Invalid appointment id."),
  email: z
    .string()
    .min(1, "please enter your email")
    .email("Please enter a valid email address."),
  channel: z.enum(["mobile_money", "card"]),
  amount: z.number().int().positive("Amount must be greater than zero"),
});

//patient onboarding

export const PatientOnboardingSchema1 = z.object({
  languages: z
    .array(multiSelectSchema)
    .min(1, "Please select a language")
    .max(4, "You can only select up to 4 languages"),
  gender: z.string().min(1, "Please enter your gender"),
  phone: z.string(),
  dob: z
    .date({
      required_error: "Please enter your date of birth",
    })
    .refine(
      (date) => date && date <= new Date(),
      "Please enter a valid date of birth"
    )
    .refine(
      (date) => !date || date >= new Date(1900, 1, 1),
      "Please enter a valid date of birth"
    ),
  role: z.enum(["patient", "doctor"]),
});

export const PatientOnboardingSchema2 = z.object({
  region: z.string().min(1, "Please enter your region"),
  city: z.string().min(1, "Please enter your city/town"),
  country: z.string().min(1, "Please enter your country"),
  address_1: z.string(),
  address_2: z.string(),
});

export const PatientOnboardingSchema3 = z.object({
  conditions: z
    .array(multiSelectSchema)
    .max(6, "You can only select up to 6 conditions"),
  medicalHistory: z
    .string()
    .max(900, "Medical history must be less than 900 characters"),
});

export const patientOnBoardingSchema4 = z.object({
  verification: z.enum(["not_started", "verifying", "approved", "failed"]),
});

export const IAppointmentSchema = z
  .object({
    doctor: z.object({
      doctorId: z.string().min(1, "Doctor's User id is required."),
      name: z.string().min(1, "Doctor's full name is required."),
      image: z.string().optional(),
    }),
    patient: z.object({
      patientId: z.string().min(1, "Patient's User id is required."),
      name: z.string().min(1, "Patient's full name is required."),
      image: z.string().optional(),
    }),
    date: z.string().min(1, "Date is required."),
    timeSlot: z.object({
      startTime: z.string().min(1, "Start time is required."),
      endTime: z.string().min(1, "End time is required."),
      slotId: z.string().min(1, "Slot id is required."),
    }),
    mode: z.enum(["online", "in-person"]),
    paid: z.boolean(),
    status: z.enum(["pending", "completed", "cancelled"]),
    online_medium: z.enum(["video", "audio", "chat"]).optional(),
  })
  .refine(
    (data) => {
      if (data.mode === "online") {
        return data.online_medium !== undefined;
      }
      return true;
    },
    {
      message: "Online medium is required when mode is online",
      path: ["online_medium"],
    }
  );

export const subaccountDataSchema = z.object({
  bank_code: z.string().min(1, "bank code required"),

  settlement_bank: z.string().min(1, "settlement bank required"),

  account_number: z.string().min(1, "account number required"),

  percentage_charge: z.number().min(1, "percentage charge required"),

  primary_contact_email: z.string().email("valid email required"),

  primary_contact_name: z.string().min(1, "primary contact name required"),

  primary_contact_phone: z.string().min(1, "primary contact phone required"),
});

const timeSlotSchema = z.object({
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  isBooked: z.boolean().optional(),
  patientId: z.string().nullable().optional(),
});

export const availabilitySchema = z.object({
  doctorId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid doctorId")
    .min(1, "Doctor ID is required."),
  date: z.date(),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required."),
});
