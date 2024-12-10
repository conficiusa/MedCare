"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchBanks = (type: string) => {
  return useQuery({
    queryKey: ["banks", type],
    queryFn: async () => await axios.get(`/api/paystack/bank-list/${type}/`),
    refetchOnWindowFocus: false,
    enabled: !!type,
    staleTime: Infinity,
    select: (data) => data?.data?.data,
  });
};
export const useResolveAccount = (querys: {
  account_number: string;
  bank_code: string;
}) => {
  return useQuery({
    queryKey: ["resolve"],
    queryFn: async () =>
      await axios.get(`/api/paystack/resolve/`, {
        params: querys,
        timeout: 20000,
        timeoutErrorMessage: "Request timed out",
      }),
    refetchOnWindowFocus: false,
    enabled: !!querys?.account_number && !!querys?.bank_code,
    staleTime: Infinity,
    select: (data) => data?.data?.data,
  });
};
