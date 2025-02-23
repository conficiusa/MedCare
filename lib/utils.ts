import { clsx, type ClassValue } from "clsx";
import { Query } from "mongoose";
import { twMerge } from "tailwind-merge";
import { validatePhoneNumber } from "@/lib/carrierValidate";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector("meta[name=viewport]");

  if (el !== null) {
    let content = el.getAttribute("content");
    let re = /maximum\-scale=[0-9\.]+/g;

    if (content && re.test(content)) {
      content = content.replace(re, "maximum-scale=1.0");
    } else if (content) {
      content = [content, "maximum-scale=1.0"].join(", ");
    }

    if (content !== null) {
      el.setAttribute("content", content);
    }
  }
};
export const checkIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

export const applyQueryOptions = (
  query: Query<any, any>,
  options: {
    filter?: Record<string, any>; // Filter can be any valid Mongoose filter object
    sort?: Record<string, 1 | -1>; // Sort is a key-value pair, e.g., { age: 1 } or { name: -1 }
    limit?: number; // Maximum number of results
    page?: number;
  }
) => {
  const { filter, sort, limit, page } = options;

  if (filter) query.find(filter); // Apply filtering
  if (sort) query.sort(sort); // Apply sorting
  if (limit) query.limit(limit); // Limit results
  if (page && limit) query.skip((page - 1) * limit); // Pagination

  return query;
};
export const applyCaseInsensitiveRegex = (filter: Record<string, any>) => {
  const newFilter = { ...filter };

  for (const key in newFilter) {
    if (typeof newFilter[key] === "string") {
      // Apply regex to string fields
      newFilter[key] = { $regex: newFilter[key], $options: "i" };
    }
  }

  return newFilter;
};

export const formatCurrency = (amount: number) => {
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "GHS",
  });
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
    throw new Error("Payment verification failed");
  }
};

export const getFilteredValues = (
  field: string[] | undefined,
  availableOptions: { value: string; label: string }[]
) => {
  if (!field || field.length === 0) return [];
  return availableOptions.filter((option) => field.includes(option.value));
};

const mobile_money_codes = ["29", "28", "66"];
const carriers = ["AirtelTigo", "MTN", "Vodafone"];

export const resolveAccountDetails = async ({
  bank,
  account_number,
  banks,
  setAccountDetails,
  setResolveError,
  setIsSubmitting,
  form,
}: {
  bank: string;
  account_number: string;
  banks: any[];
  setAccountDetails: (accountDetails: any) => void;
  setResolveError: (resolveError: any) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  form: any;
}) => {
  setResolveError(null);
  setAccountDetails(null);
  if (bank && account_number) {
    const isValid = await form.trigger(["account_number", "bank"]);
    if (!isValid) return;
    const carrierIndex = mobile_money_codes.indexOf(bank);
    if (mobile_money_codes.includes(bank)) {
      const carrierValidation = validatePhoneNumber(
        carriers[carrierIndex],
        account_number
      );
      if (!carrierValidation) {
        toast.error(
          "*Enter a valid number, Phone number should match selected Provider"
        );
        form.setError("account_number", {
          message:
            "Enter a valid number, Phone number should match selected Provider",
        });
        return;
      }
    }
    setIsSubmitting(true);
    const bankCode = banks?.find((b: any) => b.bank_id === bank);
    const res = await fetch(
      `/api/paystack/resolve/?bank_code=${
        bankCode?.code
      }&account_number=${Number(account_number)}`
    );
    const data = await res.json();
    if (res?.status !== 200) {
      toast.error("Failed to verify account number", {
        description: data?.error,
      });
      setIsSubmitting(false);
      setAccountDetails(null);
      setResolveError(data?.error);
      return;
    }
    setAccountDetails(data?.data?.data);
    form.setValue("account_name", data?.data?.data?.account_name);
    setIsSubmitting(false);
  }
};
