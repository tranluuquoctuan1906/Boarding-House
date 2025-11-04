"use client";

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { FieldType, listAssignees } from "./create";
import dayjs from "dayjs";

type DataType = {
  _id: string;
} & FieldType;

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Người tạo",
    dataIndex: "creator",
    key: "creator",
    render(value) {
      return (
        listAssignees.find((assignee) => assignee.value === value)?.label ||
        value
      );
    },
  },
  {
    title: "Người chỉ định",
    dataIndex: "assignee",
    key: "assignee",
    render(value?: string[]) {
      return (
        listAssignees
          .filter((assignee) => value?.includes(assignee.value))
          .reduce((acc, curr) => acc + curr.label + ", ", "")
          .slice(0, -2) || "-"
      );
    },
  },
  {
    title: "Ngày tháng",
    dataIndex: "date",
    key: "date",
    render(value) {
      return value
        ? dayjs(value).format("DD/MM/YYYY")
        : "-";
    },
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render(value) {
      return value
        ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(value))
        : "-";
    },
  },
];

const HistoriesTable: React.FC = () => {
  const [historiesData, setHistoriesData] = useState<DataType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/histories");
      const result = await response.json();
      setHistoriesData(result);
    };
    fetchData();
  }, []);

  return <Table<DataType> columns={columns} dataSource={historiesData} pagination={false} rowKey={'_id'} />;
};

export default HistoriesTable;
