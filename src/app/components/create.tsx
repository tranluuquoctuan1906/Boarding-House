"use client";

import React from "react";
import type { FormProps } from "antd";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  App,
} from "antd";
import dayjs from "dayjs";

export const listAssignees = [
  { label: "Tất cả", value: "all" },
  { label: "Hùng", value: "Hung" },
  { label: "Tuấn", value: "Tuan" },
  // { label: "Thế", value: "The" },
];

export type FieldType = {
  content?: string;
  date?: string;
  amount?: string;
  assignee?: string[];
  creator?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Create: React.FC = () => {
  const [form] = Form.useForm<FieldType>();
  const assignee = Form.useWatch("assignee", form);
  const { message } = App.useApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
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

  return (
    <Form
      form={form}
      name="CreateForm"
      layout="vertical"
      initialValues={{ date: dayjs() }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="grid grid-cols-2 gap-x-4 max-md:grid-cols-1"
    >
      <Form.Item<FieldType>
        label="Nội dung"
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Ngày tháng"
        name="date"
        rules={[{ required: true, message: "Vui lòng nhập ngày tháng!" }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Số tiền"
        name="amount"
        rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
      >
        <InputNumber className="!w-full" suffix="VNĐ" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Người chỉ định"
        name="assignee"
        rules={[{ required: true, message: "Vui lòng chọn người chỉ định!" }]}
      >
        <Select mode="multiple" placeholder="Chọn người chỉ định">
          {listAssignees.map((assignee) => (
            <Select.Option key={assignee.value} value={assignee.value}>
              {assignee.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item<FieldType>
        label="Người tạo"
        name="creator"
        rules={[{ required: true, message: "Vui lòng chọn người tạo!" }]}
      >
        <Select placeholder="Chọn người tạo">
          {listAssignees.filter((assignee) => assignee.value !== "all").map((assignee) => (
            <Select.Option key={assignee.value} value={assignee.value}>
              {assignee.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={null} className="col-span-2 max-md:col-span-1">
        <Button type="primary" htmlType="submit" className="w-full">
          Lưu lại
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Create;
