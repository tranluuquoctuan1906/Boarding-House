"use client";

import { twMerge } from "tailwind-merge";
import { StatisticsType } from "../use-home-page";

interface StatisticsProps {
  statistics: StatisticsType[];
}

export const Statistics = ({ statistics }: StatisticsProps) => {
  return (
    <div className="flex items-center gap-4">
      {statistics?.map((stat) => (
        <div key={stat.label}>
          {stat.label}:{" "}
          <span
            className={twMerge(
              "font-medium text-green-500",
              stat.total < 0 && "text-red-500"
            )}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(stat.total))}
          </span>
        </div>
      ))}
    </div>
  );
};
