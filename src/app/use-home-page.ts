"use client";

import { useQuery } from "@tanstack/react-query";
import { App, Form, FormProps } from "antd";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export type StatisticsType = {
  label: string;
  total: number;
  value: string;
};

export type FieldType = {
  content?: string;
  date?: dayjs.Dayjs;
  amount?: string;
  assignee?: string[];
  creator?: string;
  isDeleted?: boolean;
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
  const [historyItemSelected, setHistoryItemSelected] =
    React.useState<DataType>();

  const [form] = Form.useForm<FieldType>();
  const { message } = App.useApp();

  const assignee = Form.useWatch("assignee", form);

  const { data: statistics, refetch: refetchStatistics } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await fetch("/api/statistics");
      return (await res.json()) as StatisticsType[];
    },
  });

  const { data: histories, refetch: refetchHistories } = useQuery({
    queryKey: ["histories"],
    queryFn: async () => {
      const res = await fetch("/api/histories");
      return (await res.json()) as DataType[];
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await refetchStatistics();
    if (!statistics) return;
    let statisticsUsed = statistics;
    if (historyItemSelected) {
      const assignees =
        historyItemSelected.assignee?.flatMap((item) => item.split(",")) || [];
      const assigneesLength = assignees.length;
      const creator = historyItemSelected.creator;
      const amount = historyItemSelected.amount
        ? parseFloat(historyItemSelected.amount)
        : 0;
      const reverseAmountCreator = assignees.includes(creator || "")
        ? (amount / assigneesLength) * (assigneesLength - 1)
        : amount;
      const updateCreator = statistics
        .filter((item) => item.value === creator)
        .map((item) => ({
          ...item,
          total: (item.total || 0) - reverseAmountCreator,
        }));
      const updateAssignees = statistics
        .filter(
          (item) =>
            assignees.includes(item.value || "") && item.value !== creator
        )
        .map((item) => ({
          ...item,
          total: (item.total || 0) + amount / assigneesLength,
        }));
      const newstatistics = [
        ...statistics.filter(
          (item) =>
            item.value !== creator && !assignees.includes(item.value || "")
        ),
        ...updateCreator,
        ...updateAssignees,
      ];
      statisticsUsed = newstatistics;
    }
    const assignees = values.assignee?.flatMap((item) => item.split(",")) || [];
    const assigneesLength = assignees.length;
    const creator = values.creator;
    const amount = values.amount ? parseFloat(values.amount) : 0;
    const reverseAmountCreator = assignees.includes(creator || "")
      ? (amount / assigneesLength) * (assigneesLength - 1)
      : amount;
    const updateCreator = statisticsUsed
      .filter((item) => item.value === creator)
      .map((item) => ({
        ...item,
        total: (item.total || 0) + reverseAmountCreator,
      }));
    const updateAssignees = statisticsUsed
      .filter(
        (item) => assignees.includes(item.value || "") && item.value !== creator
      )
      .map((item) => ({
        ...item,
        total: (item.total || 0) - amount / assigneesLength,
      }));
    const newstatistics = [
      ...statisticsUsed.filter(
        (item) =>
          item.value !== creator && !assignees.includes(item.value || "")
      ),
      ...updateCreator,
      ...updateAssignees,
    ];
    const response = await fetch("/api/save", {
      method: historyItemSelected ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(historyItemSelected ? historyItemSelected : {}),
        ...values,
        assignee: values.assignee?.flatMap((item) => item.split(",")),
        date: dayjs(values.date).valueOf(),
        updateAt: dayjs().valueOf(),
      }),
    });
    const data = await response.json();
    if (data.ok) {
      (values.isDeleted ? statisticsUsed : newstatistics).forEach(
        async (statistic) => {
          await fetch("/api/statistics", {
            method: "PATCH",
            body: JSON.stringify(statistic),
          });
        }
      );
      message.success("Lưu lại thành công!");
      form.resetFields();
      refetchStatistics();
      refetchHistories();
      if (historyItemSelected) {
        setOpenModal(false);
        setHistoryItemSelected(undefined);
      }
    } else {
      message.error("Lưu lại thất bại!");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      histories?.map((value) => ({
        ...value,
        date: dayjs(value.date).format("DD/MM/YYYY"),
        assignee:
          value.assignee
            ?.reduce((acc, curr) => {
              const member = listMembers.find((item) => item.value === curr);
              return acc + (member ? member.label : curr) + ", ";
            }, "")
            .slice(0, -2) || "",
        updateAt: dayjs(value.updateAt).format("DD/MM/YYYY HH:mm:ss"),
      })) || []
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table.xlsx");
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

  // useEffect(() => {
  //   const handleStatistics = () => {
  //     const statisticsFromHistories: StatisticsType[] = [];
  //     histories?.forEach((history) => {
  //       const assignees = history.assignee || [];
  //       const assigneesLength = assignees.length;
  //       const creator = history.creator;
  //       const amount = history.amount ? parseFloat(history.amount) : 0;
  //       const reverseAmountCreator = assignees.includes(creator || "")
  //         ? (amount / assigneesLength) * (assigneesLength - 1)
  //         : amount;
  //       const existingCreator = statisticsFromHistories.find(
  //         (item) => item.value === creator
  //       );
  //       if (existingCreator) {
  //         existingCreator.total += reverseAmountCreator;
  //       } else {
  //         statisticsFromHistories.push({
  //           label:
  //             listMembers.find((member) => member.value === creator)?.label ||
  //             creator ||
  //             "Unknown",
  //           value: creator || "Unknown",
  //           total: reverseAmountCreator,
  //         });
  //       }
  //       assignees.forEach((assignee) => {
  //         if (assignee !== creator) {
  //           const existingAssignee = statisticsFromHistories.find(
  //             (item) => item.value === assignee
  //           );
  //           if (existingAssignee) {
  //             existingAssignee.total -= amount / assigneesLength;
  //           } else {
  //             statisticsFromHistories.push({
  //               label:
  //                 listMembers.find((member) => member.value === assignee)
  //                   ?.label || assignee,
  //               value: assignee,
  //               total: -amount / assigneesLength,
  //             });
  //           }
  //         }
  //       });
  //     });
  //     console.log("🚀 ~ handleStatistics ~ statisticsFromHistories:", statisticsFromHistories)
  //   };
  //   handleStatistics();
  // }, [histories]);

  return {
    statistics,
    histories,
    openModal,
    setOpenModal,
    form,
    onFinish,
    historyItemSelected,
    setHistoryItemSelected,
    exportToExcel,
  };
};
