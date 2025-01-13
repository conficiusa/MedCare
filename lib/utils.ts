import { clsx, type ClassValue } from "clsx";
import { Query } from "mongoose";
import { twMerge } from "tailwind-merge";

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
