import React, { useState } from "react";
import {
  Input,
  Select,
  Button,
  Row,
  Col,
  Tag,
  message,
  Modal,
  Descriptions,
  Collapse,
  Flex,
  Space,
  Tooltip,
} from "antd";
import { AppTable } from "../../../components";
import {
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../store/hooks";
import { Item } from "../types";
import { ItemType, ItemTypeConfig } from "../../../enums";
import { PRIMARY_COLOR } from "../../../contants";

export const ItemList: React.FC = () => {
  const items = useAppSelector((state) => state.item.items);

  // Temp states for filtering
  const [tempItemCode, setTempItemCode] = useState("");
  const [tempItemName, setTempItemName] = useState("");
  const [tempItemType, setTempItemType] = useState<string>("ALL");

  // Active search states
  const [filterItemCode, setFilterItemCode] = useState("");
  const [filterItemName, setFilterItemName] = useState("");
  const [filterItemType, setFilterItemType] = useState<string>("ALL");

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = () => {
    setFilterItemCode(tempItemCode);
    setFilterItemName(tempItemName);
    setFilterItemType(tempItemType);
  };

  const handleReset = () => {
    setTempItemCode("");
    setTempItemName("");
    setTempItemType("ALL");
    setFilterItemCode("");
    setFilterItemName("");
    setFilterItemType("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesCode = item.ItemCode.toLowerCase().includes(
      filterItemCode.toLowerCase(),
    );
    const matchesName = item.ItemName.toLowerCase().includes(
      filterItemName.toLowerCase(),
    );
    const matchesType =
      filterItemType === "ALL" || item.ItemType === filterItemType;
    return matchesCode && matchesName && matchesType;
  });

  const columns = [
    {
      title: "ItemCode",
      dataIndex: "ItemCode",
      key: "ItemCode",
      width: 150,
      align: "center" as const,
      render: (code: string) => (
        <strong style={{ color: "#096dd9" }}>{code}</strong>
      ),
    },
    {
      title: "Tên Vật Tư / Sản Phẩm",
      dataIndex: "ItemName",
      key: "ItemName",
      width: 400,
      ellipsis: true,
    },
    {
      title: "Phân Loại",
      dataIndex: "ItemType",
      key: "ItemType",
      width: 160,
      align: "center" as const,
      render: (type: string) => {
        const config = ItemTypeConfig[type as ItemType];
        return config ? (
          <Tag color={config.color}>{config.label}</Tag>
        ) : (
          <Tag>{type}</Tag>
        );
      },
    },
    {
      title: "Đơn Vị Tính",
      dataIndex: "UoM",
      key: "UoM",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Phiên bản ERP",
      key: "VersionERP",
      width: 150,
      align: "center" as const,
      render: (record: Item) => {
        const erpVal = record.VersionERP ?? 1;
        const storageVal = record.VersionStorage ?? 1;
        const isMismatch = erpVal !== storageVal;
        return (
          <Space size="small">
            <span>{erpVal}</span>
            {isMismatch && (
              <Tooltip title={`Chênh lệch: Phiên bản hệ thống là ${storageVal}`}>
                <Tag color="warning" style={{ margin: 0 }}>
                  Lệch ERP
                </Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: "Phiên bản hệ thống",
      dataIndex: "VersionStorage",
      key: "VersionStorage",
      width: 160,
      align: "center" as const,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: Item) => (
        <Tooltip title="Chi tiết">
          <Button
            type="primary"
            icon={<EyeOutlined style={{ fontSize: "16px" }} />}
            onClick={() => {
              setSelectedItem(record);
              setIsModalVisible(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const handleSyncERP = () => {
    message.success("Đồng bộ thành công!");
  };

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
            <Col xs={24} md={12} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                ItemCode:
              </div>
              <Input
                placeholder="Lọc theo mã..."
                value={tempItemCode}
                onChange={(e) => setTempItemCode(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
                style={{ width: "100%", borderRadius: "6px" }}
              />
            </Col>

            <Col xs={24} md={12} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Tên Vật Tư / Sản Phẩm:
              </div>
              <Input
                placeholder="Lọc theo tên..."
                value={tempItemName}
                onChange={(e) => setTempItemName(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
                style={{ width: "100%", borderRadius: "6px" }}
              />
            </Col>

            <Col xs={24} md={12} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Phân Loại:
              </div>
              <Select
                value={tempItemType}
                onChange={(value) => setTempItemType(value)}
                style={{ width: "100%" }}
                placeholder="Tất cả phân loại"
              >
                <Select.Option value="ALL">Tất cả phân loại</Select.Option>
                <Select.Option value="FG">Thành phẩm (FG)</Select.Option>
                <Select.Option value="IP">Bán thành phẩm (IP)</Select.Option>
                <Select.Option value="RM">Nguyên liệu (RM)</Select.Option>
                <Select.Option value="PG">Bao bì (PG)</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={24} lg={24}>
              <Space size="middle" wrap style={{ width: "100%" }}>
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
                  icon={<ReloadOutlined />}
                  onClick={handleSyncERP}
                >
                  Đồng bộ ERP
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* Main Table */}
      <AppTable
        dataSource={filteredItems}
        columns={columns}
        rowKey="ItemCode"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} dòng`,
        }}
        bordered
        size="middle"
        scroll={{ x: 1220 }}
      />

      {/* Item Detail Modal */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <EyeOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Chi tiết vật tư / sản phẩm
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsModalVisible(false);
              setSelectedItem(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={750}
      >
        {selectedItem && (
          <div style={{ marginTop: "15px" }}>
            <Descriptions
              bordered
              size="small"
              column={2}
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Mã Vật Tư">
                <strong style={{ color: "#096dd9" }}>
                  {selectedItem.ItemCode}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Phân Loại">
                {(() => {
                  const config =
                    ItemTypeConfig[selectedItem.ItemType as ItemType];
                  return config ? (
                    <Tag color={config.color}>{config.label}</Tag>
                  ) : (
                    <Tag>{selectedItem.ItemType}</Tag>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Tên Vật Tư / Sản Phẩm" span={2}>
                {selectedItem.ItemName}
              </Descriptions.Item>
              <Descriptions.Item label="Đơn Vị Tính">
                {selectedItem.UoM}
              </Descriptions.Item>
              <Descriptions.Item label="Phiên bản ERP">
                {selectedItem.VersionERP || "1"}
              </Descriptions.Item>
              <Descriptions.Item label="Phiên bản hệ thống" span={2}>
                {selectedItem.VersionStorage || "1"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ItemList;
