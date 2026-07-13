import React, { useState } from "react";
import {
  Input,
  Select,
  Space,
  Button,
  Row,
  Col,
  Tag,
  Descriptions,
  Divider,
  Tooltip,
  Drawer,
  Collapse,
  message,
  Table,
  Modal,
} from "antd";
import { AppTable } from "../../../components";
import {
  FileExcelOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UploadOutlined,
  EyeOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { TemplateUploadModal } from "../components/TemplateUploadModal";
import {
  allergenTemplateData,
  nutritionTemplateData,
} from "../../../local-data/allergen-nutrition";
import { DocStatus } from "../../doc/types";
import { PRIMARY_COLOR } from "../../../contants";

interface TemplateItem {
  templateId: string;
  code: string;
  name: string;
  type: "DI_UNG" | "DINH_DUONG";
  itemCount: number;
  lastUpdated: string;
  fileUrl: string;
  status: DocStatus;
}

export const AllergenNutritionList: React.FC = () => {
  // Local state list of configured templates
  const [templates, setTemplates] = useState<TemplateItem[]>([
    {
      templateId: "TPL_001",
      code: "TEMPLATE_DI_UNG",
      name: "Template Cấu hình Chỉ tiêu Dị ứng",
      type: "DI_UNG",
      itemCount: 10,
      lastUpdated: "2026-07-08",
      fileUrl: "/files/Template_Allergen.xlsx",
      status: DocStatus.PENDING,
    },
    {
      templateId: "TPL_002",
      code: "TEMPLATE_DINH_DUONG",
      name: "Template Cấu hình Thành phần Dinh dưỡng",
      type: "DINH_DUONG",
      itemCount: 8,
      lastUpdated: "2026-07-08",
      fileUrl: "/files/Template_Nutrition.xlsx",
      status: DocStatus.APPROVED,
    },
  ]);

  const handleApproveTemplate = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.templateId === templateId ? { ...t, status: DocStatus.APPROVED } : t
      )
    );
    message.success("Phê duyệt cấu hình Template thành công!");
  };

  const handleRejectTemplate = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.templateId === templateId ? { ...t, status: DocStatus.REJECTED } : t
      )
    );
    message.error("Từ chối cấu hình Template thành công!");
  };

  // Temp filter states
  const [tempCode, setTempCode] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempType, setTempType] = useState<string>("ALL");
  const [tempStatus, setTempStatus] = useState<string>("ALL");

  // Filter states
  const [filterCode, setFilterCode] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const handleSearch = () => {
    setFilterCode(tempCode);
    setFilterName(tempName);
    setFilterType(tempType);
    setFilterStatus(tempStatus);
  };

  const handleReset = () => {
    setTempCode("");
    setTempName("");
    setTempType("ALL");
    setTempStatus("ALL");
    setFilterCode("");
    setFilterName("");
    setFilterType("ALL");
    setFilterStatus("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };

  // Modals state
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDetailTemplate, setSelectedDetailTemplate] =
    useState<TemplateItem | null>(null);

  const [selectedHistoryTemplate, setSelectedHistoryTemplate] = useState<TemplateItem | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  const getMockTemplateHistoryData = (record: TemplateItem) => {
    return [
      {
        key: "1",
        time: "2026-07-01 10:00",
        user: "Nguyễn Thị Mai (QA Specialist)",
        type: "Khởi tạo Template",
        details: `Đăng tải tệp Excel mẫu cấu hình và khai báo cấu trúc thuộc tính cho template "${record.name}". Gán tọa độ ô dòng cột ban đầu.`,
        status: "APPROVED",
        approver: "Hồ Hoàng Long (QA Officer)",
        approveTime: "2026-07-01 14:00",
      },
      {
        key: "2",
        time: "2026-07-08 11:30",
        user: "Nguyễn Thị Mai (QA Specialist)",
        type: "Điều chỉnh cấu trúc",
        details: `Cập nhật bổ sung chỉ tiêu thuộc tính Excel, thay đổi cell coordinate từ cột C sang cột D để đồng bộ với định dạng báo cáo mới.`,
        status: record.status,
        approver: record.status === DocStatus.APPROVED ? "Hồ Hoàng Long (QA Officer)" : "-",
        approveTime: record.status === DocStatus.APPROVED ? "2026-07-08 15:45" : "-",
      }
    ];
  };

  // Filter Logic
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCode = !filterCode || tpl.code.toLowerCase().includes(filterCode.toLowerCase().trim());
    const matchesName = !filterName || tpl.name.toLowerCase().includes(filterName.toLowerCase().trim());
    const matchesType = filterType === "ALL" || tpl.type === filterType;
    const matchesStatus = filterStatus === "ALL" || tpl.status === filterStatus;

    return matchesCode && matchesName && matchesType && matchesStatus;
  });

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

  const columns = [
    {
      title: "Mã Template",
      dataIndex: "code",
      key: "code",
      width: 200,
      align: "center" as const,
      render: (code: string) => (
        <strong style={{ color: "#096dd9" }}>{code}</strong>
      ),
    },
    {
      title: "Tên Template",
      dataIndex: "name",
      key: "name",
      width: 320,
    },
    {
      title: "Phân Loại",
      dataIndex: "type",
      key: "type",
      width: 180,
      align: "center" as const,
      render: (type: string) =>
        type === "DI_UNG" ? (
          <Tag color="purple">Cảnh báo dị ứng</Tag>
        ) : (
          <Tag color="magenta">Thông tin dinh dưỡng</Tag>
        ),
    },
    {
      title: "Số lượng chỉ tiêu",
      dataIndex: "itemCount",
      key: "itemCount",
      width: 150,
      align: "center" as const,
      render: (count: number) => <Tag color="blue">{count} chỉ tiêu</Tag>,
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (record: TemplateItem) => {
        switch (record.status) {
          case DocStatus.APPROVED:
            return <Tag color="success">Đã duyệt</Tag>;
          case DocStatus.REJECTED:
            return <Tag color="error">Từ chối</Tag>;
          default:
            return <Tag color="warning">Chờ duyệt</Tag>;
        }
      },
    },
    {
      title: "Hành động",
      key: "Actions",
      width: 160,
      align: "center" as const,
      fixed: "right" as const,
      render: (record: TemplateItem) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined style={{ fontSize: "16px" }} />}
              onClick={() => {
                setSelectedDetailTemplate(record);
                setIsDetailDrawerOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Lịch sử thay đổi">
            <Button
              icon={
                <HistoryOutlined
                  style={{ fontSize: "16px", color: PRIMARY_COLOR }}
                />
              }
              onClick={() => {
                setSelectedHistoryTemplate(record);
                setIsHistoryModalVisible(true);
              }}
            />
          </Tooltip>
          <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
            <Tooltip title="Tải file mẫu Excel">
              <Button
                type="primary"
                style={{ backgroundColor: "#107c41", borderColor: "#107c41" }}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              />
            </Tooltip>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Collapsible Filter Panel */}
      <Collapse
        defaultActiveKey={["filterPanel"]}
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
        }}
      >
        <Collapse.Panel
          key="filterPanel"
          header={
            <span
              style={{
                color: PRIMARY_COLOR,
                fontWeight: "bold",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MenuUnfoldOutlined
                style={{ marginRight: 8, fontSize: "14px" }}
              />
              Tìm kiếm và chức năng
            </span>
          }
          style={{ background: "#ffffff", border: "none" }}
        >
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Mã Template:
              </div>
              <Input
                placeholder="Nhập mã template..."
                value={tempCode}
                onChange={(e) => setTempCode(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Tên Template:
              </div>
              <Input
                placeholder="Nhập tên template..."
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Phân Loại:
              </div>
              <Select
                value={tempType}
                onChange={(val) => setTempType(val)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả loại</Select.Option>
                <Select.Option value="DI_UNG">Cảnh báo dị ứng</Select.Option>
                <Select.Option value="DINH_DUONG">Thông tin dinh dưỡng</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Trạng thái duyệt:
              </div>
              <Select
                value={tempStatus}
                onChange={(val) => setTempStatus(val)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                <Select.Option value={DocStatus.PENDING}>Chờ duyệt</Select.Option>
                <Select.Option value={DocStatus.APPROVED}>Đã duyệt</Select.Option>
                <Select.Option value={DocStatus.REJECTED}>Từ chối</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={24} lg={24}>
              <Space size="middle" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                  }}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  style={{ background: "#107c41", borderColor: "#107c41" }}
                  onClick={() => setIsTemplateModalVisible(true)}
                >
                  Upload Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* Main Table */}
      <AppTable
        dataSource={filteredTemplates}
        columns={columns}
        rowKey="templateId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} dòng`,
        }}
        bordered
        size="middle"
        scroll={{ x: 1100 }}
      />

      {/* Detail Drawer (Right Sidebar Panel) */}
      <Drawer
        title={
          <span style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>
            <InfoCircleOutlined
              style={{ color: PRIMARY_COLOR, marginRight: "8px" }}
            />
            Cấu trúc Template: {selectedDetailTemplate?.name}
          </span>
        }
        placement="right"
        width={800}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedDetailTemplate(null);
        }}
        open={isDetailDrawerOpen}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <div>
              {selectedDetailTemplate &&
                selectedDetailTemplate.status === DocStatus.PENDING && (
                  <Space>
                    <Button
                      type="primary"
                      style={{ background: "#52c41a", borderColor: "#52c41a" }}
                      onClick={() => {
                        handleApproveTemplate(selectedDetailTemplate.templateId);
                        setSelectedDetailTemplate((prev) =>
                          prev ? { ...prev, status: DocStatus.APPROVED } : null,
                        );
                      }}
                    >
                      Duyệt Template
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
                        handleRejectTemplate(selectedDetailTemplate.templateId);
                        setSelectedDetailTemplate((prev) =>
                          prev ? { ...prev, status: DocStatus.REJECTED } : null,
                        );
                      }}
                    >
                      Từ chối Template
                    </Button>
                  </Space>
                )}
            </div>
            <Button
              onClick={() => {
                setIsDetailDrawerOpen(false);
                setSelectedDetailTemplate(null);
              }}
            >
              Đóng
            </Button>
          </div>
        }
      >
        {selectedDetailTemplate && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã Template" span={2}>
                <strong>{selectedDetailTemplate.code}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Template" span={2}>
                {selectedDetailTemplate.name}
              </Descriptions.Item>
              <Descriptions.Item label="Phân Loại">
                {selectedDetailTemplate.type === "DI_UNG" ? (
                  <Tag color="purple">Cảnh báo dị ứng</Tag>
                ) : (
                  <Tag color="magenta">Thông tin dinh dưỡng</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng chỉ tiêu">
                {selectedDetailTemplate.itemCount} chỉ tiêu
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">
                {selectedDetailTemplate.lastUpdated}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {(() => {
                  switch (selectedDetailTemplate.status) {
                    case DocStatus.APPROVED:
                      return <Tag color="success">Đã duyệt</Tag>;
                    case DocStatus.REJECTED:
                      return <Tag color="error">Từ chối</Tag>;
                    default:
                      return <Tag color="warning">Chờ duyệt</Tag>;
                  }
                })()}
              </Descriptions.Item>
            </Descriptions>

            <Divider
              orientation={"left" as any}
              style={{ margin: "15px 0 5px 0" }}
            >
              Xem trước cấu trúc (Template preview)
            </Divider>

            <AppTable
              dataSource={
                (selectedDetailTemplate.type === "DI_UNG"
                  ? allergenTemplateData
                  : nutritionTemplateData) as any[]
              }
              columns={
                (selectedDetailTemplate.type === "DI_UNG"
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

      <TemplateUploadModal
        open={isTemplateModalVisible}
        onCancel={() => setIsTemplateModalVisible(false)}
      />

      {/* Template Revision History Modal */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: PRIMARY_COLOR,
            }}
          >
            <HistoryOutlined style={{ fontSize: "18px", color: PRIMARY_COLOR }} />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Lịch sử Cấu trúc & Phê duyệt Template - {selectedHistoryTemplate?.code}
            </span>
          </div>
        }
        open={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setSelectedHistoryTemplate(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsHistoryModalVisible(false);
              setSelectedHistoryTemplate(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        {selectedHistoryTemplate && (
          <div style={{ marginTop: "15px" }}>
            <Descriptions
              bordered
              size="small"
              column={2}
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Mã Template">
                <strong>{selectedHistoryTemplate.code}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Template">
                <strong>{selectedHistoryTemplate.name || "-"}</strong>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation={"left" as any} style={{ fontSize: "14px", fontWeight: 600, color: PRIMARY_COLOR }}>
              Nhật ký thay đổi cấu hình Excel coordinate mapping
            </Divider>

            <Table
              dataSource={getMockTemplateHistoryData(selectedHistoryTemplate)}
              columns={[
                {
                  title: "Thời gian chỉnh",
                  dataIndex: "time",
                  key: "time",
                  width: 150,
                  render: (text: string) => <span style={{ color: "#595959" }}>{text}</span>,
                },
                {
                  title: "Người thực hiện",
                  dataIndex: "user",
                  key: "user",
                  width: 220,
                  render: (text: string) => <strong>{text}</strong>,
                },
                {
                  title: "Phân loại",
                  dataIndex: "type",
                  key: "type",
                  width: 150,
                  render: (text: string) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: "Nội dung thay đổi",
                  dataIndex: "details",
                  key: "details",
                  render: (text: string) => <span style={{ fontSize: "13px" }}>{text}</span>,
                },
                {
                  title: "Lịch sử phê duyệt",
                  key: "status",
                  width: 240,
                  render: (record: any) => {
                    if (record.status === DocStatus.APPROVED) {
                      return (
                        <div>
                          <Tag color="green" style={{ marginBottom: 4 }}>Đã phê duyệt</Tag>
                          <div style={{ fontSize: "11px", color: "#8c8c8c" }}>
                            Bởi: <strong>{record.approver}</strong>
                          </div>
                          <div style={{ fontSize: "11px", color: "#8c8c8c" }}>
                            Lúc: {record.approveTime}
                          </div>
                        </div>
                      );
                    } else if (record.status === DocStatus.REJECTED) {
                      return <Tag color="error">Từ chối phê duyệt</Tag>;
                    } else {
                      return <Tag color="gold">Chờ phê duyệt</Tag>;
                    }
                  },
                },
              ]}
              pagination={false}
              bordered
              size="middle"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllergenNutritionList;
