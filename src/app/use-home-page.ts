"use client";

import { useQuery } from "@tanstack/react-query";

export type StatisticsType = {
  label: string;
  total: number;
};

export type FieldType = {
  content?: string;
  date?: string;
  amount?: string;
  assignee?: string[];
  creator?: string;
};

export type DataType = {
  _id: string;
} & FieldType;

export const useHomePage = () => {
  const { data: statistics } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await fetch("/api/statistics");
      return (await res.json()) as StatisticsType[];
    },
  });

  const { data: histories } = useQuery({
    queryKey: ["histories"],
    queryFn: async () => {
      const res = await fetch("/api/histories");
      return (await res.json()) as DataType[];
    },
  });

  return { statistics, histories };
};
