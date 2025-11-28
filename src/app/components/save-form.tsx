"use client";

import type { FormInstance, FormProps } from "antd";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import {
  DataType,
  FieldType,
  listAssignees,
  listMembers,
} from "../use-home-page";
import { useEffect } from "react";

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

interface SaveFormProps {
  onFinish: FormProps<FieldType>["onFinish"];
  form: FormInstance<FieldType>;
  initValues?: DataType;
}

const SaveForm = ({ onFinish, form, initValues }: SaveFormProps) => {
  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({
        amount: initValues.amount,
        assignee: initValues.assignee,
        content: initValues.content,
        creator: initValues.creator,
        date: initValues.date ? dayjs(initValues.date) : undefined,
      });
    }
  }, [initValues, form]);

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
          {listMembers.map((assignee) => (
            <Select.Option key={assignee.value} value={assignee.value}>
              {assignee.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={null} className="col-span-2 max-md:col-span-1">
        <Button type="primary" htmlType="submit" className="w-full">
          {!!initValues ? "Cập nhật" : "Lưu lại"}
        </Button>
        {!!initValues && (
          <Button type="primary" danger className="mt-2 w-full">
            Xoá
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default SaveForm;
