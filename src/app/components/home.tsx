"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { useHomePage } from "../use-home-page";
import Create from "./create";
import HistoriesTable from "./histories-table";
import { Statistics } from "./statistics";

export const HomePage = () => {
  const { statistics, histories } = useHomePage();

  if (!statistics || !histories)
    return (
      <div className="flex h-screen w-screen items-center justify-center text-2xl text-blue-500">
        <LoadingOutlined />
      </div>
    );

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Statistics statistics={statistics} />
        <Create />
      </div>
      <HistoriesTable historiesData={histories} />
    </div>
  );
};
