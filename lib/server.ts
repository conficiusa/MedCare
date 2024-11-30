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
