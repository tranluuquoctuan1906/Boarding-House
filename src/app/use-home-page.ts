"use client";

import { useQuery } from "@tanstack/react-query";
import { App, Form, FormProps } from "antd";
import React from "react";
import dayjs from "dayjs";

export type StatisticsType = {
  label: string;
  total: number;
};

export type FieldType = {
  content?: string;
  date?: number;
  amount?: string;
  assignee?: string[];
  creator?: string;
};

export type DataType = {
  _id: string;
  updateAt: number;
} & FieldType;

export const maxModalWidth =
  typeof window !== "undefined" ? window.innerWidth : 800;

export const listMembers = [
  { label: "Hùng", value: "Hung" },
  { label: "Tuấn", value: "Tuan" },
];

export const listAssignees = [
  {
    label: "Tất cả",
    value: listMembers.map((member) => member.value).join(","),
  },
  { label: "Hùng", value: "Hung" },
  { label: "Tuấn", value: "Tuan" },
];

export const useHomePage = () => {
  const [openModal, setOpenModal] = React.useState(false);

  const [form] = Form.useForm<FieldType>();
  const { message } = App.useApp();

  const assignee = Form.useWatch("assignee", form);

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

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        assignee: values.assignee?.flatMap((item) => item.split(",")),
        updateAt: dayjs().valueOf(),
      }),
    });
    const data = await response.json();
    if (data.ok) {
      message.success("Lưu lại thành công!");
      form.resetFields();
    } else {
      message.error("Lưu lại thất bại!");
    }
  };

  React.useEffect(() => {
    if (assignee && assignee.length > 1) {
      const allValues = listAssignees
        .filter((item) => item.value !== "all")
        .map((item) => item.value);
      const hasAllValues = allValues.every((value) => assignee.includes(value));
      if (hasAllValues || assignee.at(-1) === "all") {
        form.setFieldValue("assignee", ["all"]);
      } else {
        if (assignee.includes("all")) {
          const newAssignees = assignee.filter((item) => item !== "all");
          form.setFieldValue("assignee", newAssignees);
        }
      }
    }
  }, [assignee, form]);

  return { statistics, histories, openModal, setOpenModal, form, onFinish };
};

//  React.useEffect(() => {
//     histories?.forEach((history) => {
//       fetch("/api/save", {
//         method: "PATCH",
//         body: JSON.stringify({
//           ...history,
//           date: dayjs(history.date).valueOf(),
//           updateAt: dayjs(history.date).valueOf(),
//         }),
//       });
//     });
//   }, [histories]);

// useEffect(() => {
//   const newstatistics = historiesData.reduce(
//     (prev, curr) => {
//       const assignees = curr.assignee || [];
//       const assigneesLength = assignees.length;
//       const creator = curr.creator;
//       const amount = curr.amount ? parseFloat(curr.amount) : 0;
//       const reverseAmountCreator = assignees.includes(creator || "")
//         ? (amount / assigneesLength) * (assigneesLength - 1)
//         : amount;
//       const updateCreator = prev
//         .filter((item) => item.value === creator)
//         .map((item) => ({
//           ...item,
//           total: (item.total || 0) + reverseAmountCreator,
//         }));
//       const updateAssignees = prev
//         .filter(
//           (item) =>
//             assignees.includes(item.value || "") && item.value !== creator
//         )
//         .map((item) => ({
//           ...item,
//           total: (item.total || 0) - amount / assigneesLength,
//         }));
//       return [
//         ...prev.filter(
//           (item) =>
//             item.value !== creator && !assignees.includes(item.value || "")
//         ),
//         ...updateCreator,
//         ...updateAssignees,
//       ];
//     },
//     listMembers.map((assignee) => ({ ...assignee, total: 0 }))
//   );
//   newstatistics.forEach(async (statistic) => {
//     await fetch("/api/statistics", {
//       method: "POST",
//       body: JSON.stringify(statistic),
//     });
//   });
// }, [historiesData]);
