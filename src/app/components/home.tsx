"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { maxModalWidth, useHomePage } from "../use-home-page";
import HistoriesTable from "./histories-table";
import { Statistics } from "./statistics";
import { Button, Modal } from "antd";
import SaveForm from "./save-form";

export const HomePage = () => {
  const {
    statistics,
    histories,
    openModal,
    setOpenModal,
    form,
    onFinish,
    historyItemSelected,
    setHistoryItemSelected,
  } = useHomePage();

  if (!statistics || !histories)
    return (
      <div className="flex h-screen w-screen items-center justify-center text-2xl text-blue-500">
        <LoadingOutlined />
      </div>
    );

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Statistics statistics={statistics} />
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Tạo mới
          </Button>
        </div>
        <HistoriesTable
          historiesData={histories}
          onRowDoubleClick={(record) => {
            setOpenModal(true);
            setHistoryItemSelected(record);
          }}
        />
      </div>
      <Modal
        open={openModal}
        footer={null}
        onCancel={() => {
          setOpenModal(false);
          setHistoryItemSelected(undefined);
          form.resetFields();
        }}
        width={Math.min(maxModalWidth, 800)}
      >
        <SaveForm form={form} onFinish={onFinish} initValues={historyItemSelected} />
      </Modal>
    </>
  );
};
