"use client";

import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import type { TableProps } from "antd";
import {
  FieldType,
  listAssignees,
  listMembers,
  maxModalWidth,
  SaveForm,
} from "./create";
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

const HistoriesTable: React.FC = () => {
  const [historiesData, setHistoriesData] = useState<DataType[]>([]);
  const [historyItemSelected, setHistoryItemSelected] = useState<DataType>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/histories");
      const result = await response.json();
      setHistoriesData(result);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   historiesData.forEach((item) => {
  //     fetch("/api/save", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ...item,
  //         assignee: ["Hung", "Tuan"],
  //       }),
  //     });
  //   });
  // }, [historiesData]);

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
      <Modal
        open={!!historyItemSelected}
        footer={null}
        onCancel={() => setHistoryItemSelected(undefined)}
        width={Math.min(maxModalWidth, 800)}
      >
        <SaveForm />
      </Modal>
    </>
  );
};

export default HistoriesTable;
