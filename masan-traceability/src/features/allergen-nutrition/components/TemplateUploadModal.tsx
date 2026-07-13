import React, { useState } from "react";
import { Modal, Form, Input, Select, Upload, Drawer, Table, Tag, Space, message } from "antd";
import { InboxOutlined, FileExcelOutlined } from "@ant-design/icons";
import { AppTable } from "../../../components";

import { PRIMARY_COLOR } from "../../../contants";

interface TemplateUploadModalProps {
  open: boolean;
  onCancel: () => void;
}

import { allergenTemplateData, nutritionTemplateData } from "../../../local-data/allergen-nutrition";

export const TemplateUploadModal: React.FC<TemplateUploadModalProps> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  
  // Drawer visibility and detail states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<
    "DI_UNG" | "DINH_DUONG" | null
  >(null);

  // Watch form fields
  const selectedType = Form.useWatch("templateType", form);

  const handleFinish = (values: any) => {
    message.success(
      `Đã lưu cấu hình Template ${
        values.templateType === "DI_UNG" ? "Cảnh báo dị ứng" : "Thông tin dinh dưỡng"
      } thành công vào cơ sở dữ liệu!`
    );
    setIsDrawerOpen(false);
    setSelectedTemplateType(null);
    form.resetFields();
    onCancel(); // Close modal
  };

  // Table Columns Setup
  const allergenColumns = [
    {
      title: "Chỉ tiêu dị ứng",
      dataIndex: "allergenName",
      key: "allergenName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Tọa độ ô Excel",
      dataIndex: "cell",
      key: "cell",
      render: (cell: string) =>
        cell ? (
          <Tag color="blue">{cell}</Tag>
        ) : (
          <span style={{ color: "#d9d9d9" }}>Chung</span>
        ),
    },
  ];

  const nutritionColumns = [
    {
      title: "Chỉ tiêu dinh dưỡng",
      dataIndex: "index",
      key: "index",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
      render: (unit: string) => <Tag color="default">{unit}</Tag>,
    },
    {
      title: "Tọa độ ô Excel",
      dataIndex: "cell",
      key: "cell",
      render: (cell: string) => <Tag color="blue">{cell}</Tag>,
    },
  ];

  return (
    <>
      {/* 1. Modal Select and Upload */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <FileExcelOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Tải lên Template Dị ứng - Dinh dưỡng
          </span>
        }
        open={open}
        onCancel={() => {
          form.resetFields();
          setIsDrawerOpen(false);
          setSelectedTemplateType(null);
          onCancel();
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={550}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="templateType"
            label="Loại Template"
            rules={[
              { required: true, message: "Vui lòng chọn loại template!" },
            ]}
          >
            <Select placeholder="Chọn loại template...">
              <Select.Option value="DI_UNG">Cảnh báo dị ứng</Select.Option>
              <Select.Option value="DINH_DUONG">
                Thông tin dinh dưỡng
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="templateCode"
            label="Mã Template"
            rules={[
              { required: true, message: "Vui lòng nhập mã template!" },
            ]}
          >
            <Input placeholder="Ví dụ: TEMPLATE_DI_UNG" />
          </Form.Item>

          <Form.Item
            name="templateName"
            label="Tên Template"
            rules={[
              { required: true, message: "Vui lòng nhập tên template!" },
            ]}
          >
            <Input placeholder="Ví dụ: Template Cấu hình Chỉ tiêu Dị ứng" />
          </Form.Item>

          <Form.Item
            name="fileUpload"
            label="File Excel Template (.xlsx, .xls)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
            rules={[
              {
                required: true,
                message: "Vui lòng đính kèm file Excel template!",
              },
            ]}
          >
            <Upload.Dragger
              name="files"
              accept=".xlsx,.xls"
              beforeUpload={() => false}
              maxCount={1}
              disabled={!selectedType}
              onChange={(info) => {
                const fileList = info.fileList || [];
                if (fileList.length > 0) {
                  setSelectedTemplateType(selectedType);

                  message.loading({
                    content: "Đang đọc cấu trúc file Excel...",
                    key: "read-excel",
                  });
                  setTimeout(() => {
                    message.success({
                      content: "Đọc file Excel thành công!",
                      key: "read-excel",
                      duration: 2,
                    });
                    setIsDrawerOpen(true);
                  }, 500);
                } else {
                  setIsDrawerOpen(false);
                  setSelectedTemplateType(null);
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined
                  style={{ color: selectedType ? "#52c41a" : "#d9d9d9" }}
                />
              </p>
              <p className="ant-upload-text">
                {selectedType
                  ? "Kéo thả file Excel template (.xlsx, .xls) hoặc nhấp chọn để tải lên"
                  : "Vui lòng chọn loại template trước khi tải lên"}
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* 2. Drawer Detail View (Right Sidebar Panel) */}
      <Drawer
        title={
          <span style={{ fontWeight: "bold" }}>
            <FileExcelOutlined
              style={{ color: "#52c41a", marginRight: "8px" }}
            />
            Đọc File Excel: Template{" "}
            {selectedTemplateType === "DI_UNG" ? "Cảnh báo dị ứng" : "Thông tin dinh dưỡng"} (Gốc)
          </span>
        }
        placement="right"
        width={650}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTemplateType(null);
        }}
        open={isDrawerOpen}
        footer={null}
      >
        {selectedTemplateType && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <h3 style={{ margin: "10px 0 0 0" }}>Cấu trúc ánh xạ chỉ tiêu:</h3>

            <AppTable
              dataSource={
                (selectedTemplateType === "DI_UNG"
                  ? allergenTemplateData
                  : nutritionTemplateData) as any[]
              }
              columns={
                (selectedTemplateType === "DI_UNG"
                  ? allergenColumns
                  : nutritionColumns) as any[]
              }
              pagination={false}
              bordered
              size="small"
            />
          </Space>
        )}
      </Drawer>
    </>
  );
};

export default TemplateUploadModal;
