"use client";

import React, { useState } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { DataType, listAssignees, listMembers } from "../use-home-page";

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
      if (value?.length == listMembers.length) {
        return "Tất cả";
      }
      return (
        listMembers
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
      return value ? dayjs(value).format("DD/MM/YYYY") : "-";
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

interface HistoriesTableProps {
  historiesData: DataType[];
}

const HistoriesTable: React.FC<HistoriesTableProps> = ({ historiesData }) => {
  const [historyItemSelected, setHistoryItemSelected] = useState<DataType>();

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={historiesData}
        pagination={false}
        rowKey={"_id"}
        onRow={(data) => {
          return {
            onDoubleClick: () => {
              setHistoryItemSelected(data);
            },
          };
        }}
      />
    </>
  );
};

export default HistoriesTable;