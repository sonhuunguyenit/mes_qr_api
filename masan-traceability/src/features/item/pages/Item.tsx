import {
  EyeOutlined,
  HistoryOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import { AppTable } from "../../../components";
import { PRIMARY_COLOR } from "../../../contants";
import { ItemType, ItemTypeConfig } from "../../../enums";
import { mockItemVersions } from "../../../local-data/item-version";
import { useAppSelector } from "../../../store/hooks";
import { Item } from "../types";

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
  const [historyItem, setHistoryItem] = useState<Item | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

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
            <Tooltip title={`ERP v${erpVal}`}>
              <Badge
                count={erpVal}
                showZero
                color={isMismatch ? "#fa8c16" : "#1677ff"}
                style={{ cursor: "default" }}
              />
            </Tooltip>
            {isMismatch && (
              <Tooltip
                title={`Chênh lệch: Phiên bản hệ thống là ${storageVal}`}
              >
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
      render: (val: number) => {
        const v = val ?? 1;
        return (
          <Tooltip title={`Hệ thống v${v}`}>
            <Badge
              count={v}
              showZero
              color="#52c41a"
              style={{ cursor: "default" }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Substitute",
      key: "Substitute",
      width: 350,
      render: (record: Item) => {
        const versions = mockItemVersions.filter(
          (v) => v.ItemCode === record.ItemCode,
        );
        if (versions.length === 0) {
          return <span style={{ color: "#bfbfbf" }}>Không có</span>;
        }
        const sorted = [...versions].sort((a, b) => b.Version - a.Version);
        const latestSub = sorted[0]?.Substitute;
        if (
          !latestSub ||
          latestSub === "Không có" ||
          latestSub === "Không có nguyên liệu thay thế"
        ) {
          return <span style={{ color: "#bfbfbf" }}>Không có</span>;
        }
        return (
          <Tooltip title={latestSub}>
            <span style={{ fontSize: "13px" }}>{latestSub}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 150,
      render: (_: any, record: Item) => (
        <Space size="small">
          <Tooltip title="Điều chỉnh">
            <Button
              type="primary"
              icon={<EditOutlined style={{ fontSize: "16px" }} />}
              onClick={() => {
                setSelectedItem(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Lịch sử phiên bản">
            <Button
              type="default"
              icon={<HistoryOutlined style={{ fontSize: "16px" }} />}
              onClick={() => {
                setHistoryItem(record);
                setIsHistoryModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
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
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} sm={12} md={5}>
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

            <Col xs={24} sm={12} md={6}>
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

            <Col xs={24} sm={12} md={5}>
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

            <Col xs={24} sm={24} md={8}>
              <Space size="small" wrap>
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
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: PRIMARY_COLOR,
            }}
          >
            <EditOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Điều chỉnh vật tư / sản phẩm
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
        width={900}
      >
        {selectedItem && (
          <div style={{ marginTop: "15px" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                color: PRIMARY_COLOR,
                marginBottom: "12px",
              }}
            >
              Phiên bản hệ thống hiện tại (v{selectedItem.VersionStorage})
            </div>
            <Descriptions
              bordered
              size="small"
              column={2}
              style={{ marginBottom: "24px" }}
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
              <Descriptions.Item label="Substitute" span={2}>
                {(() => {
                  const currentVer = mockItemVersions.find(
                    (v) =>
                      v.ItemCode === selectedItem.ItemCode &&
                      v.IsSyncERP &&
                      v.Version === selectedItem.VersionStorage,
                  );
                  return currentVer?.Substitute || "Không có";
                })()}
              </Descriptions.Item>
            </Descriptions>

            {/* Nếu lệch ERP, hiển thị thông tin phiên bản ERP (IsSyncERP === false) */}
            {(() => {
              const isMismatch =
                selectedItem.VersionERP !== selectedItem.VersionStorage;
              if (!isMismatch) return null;

              const erpVer = mockItemVersions.find(
                (v) =>
                  v.ItemCode === selectedItem.ItemCode &&
                  !v.IsSyncERP &&
                  v.Version === selectedItem.VersionERP,
              );
              if (!erpVer) return null;

              return (
                <div style={{ marginTop: "24px" }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "#fa8c16",
                      marginBottom: "12px",
                    }}
                  >
                    ⚠️ Phiên bản mới từ ERP chưa đồng bộ (v{erpVer.Version})
                  </div>
                  <Descriptions
                    bordered
                    size="small"
                    column={2}
                    style={{ marginBottom: "10px" }}
                  >
                    <Descriptions.Item label="Mã Vật Tư">
                      <strong style={{ color: "#fa8c16" }}>
                        {erpVer.ItemCode}
                      </strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đồng bộ">
                      <Tag color="warning">Cần xác nhận</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên Vật Tư / Sản Phẩm" span={2}>
                      {erpVer.ItemName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Đơn Vị Tính">
                      {erpVer.UoM}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phiên bản ERP">
                      {erpVer.Version}
                    </Descriptions.Item>
                    <Descriptions.Item label="Substitute" span={2}>
                      {erpVer.Substitute || "Không có"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian cập nhật ERP" span={2}>
                      {erpVer.ModifiedAt} bởi{" "}
                      {erpVer.ModifiedBy || "Hệ thống ERP"}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* History Modal */}
      <Modal
        title={
          <span
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              color: PRIMARY_COLOR,
            }}
          >
            <HistoryOutlined style={{ marginRight: "8px" }} />
            Lịch sử phiên bản: {historyItem?.ItemName} ({historyItem?.ItemCode})
          </span>
        }
        open={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setHistoryItem(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsHistoryModalVisible(false);
              setHistoryItem(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {historyItem && (
          <div style={{ marginTop: "15px" }}>
            {(() => {
              const versions = mockItemVersions.filter(
                (v) =>
                  v.ItemCode === historyItem.ItemCode && v.IsSyncERP === true,
              );

              if (versions.length === 0) {
                return (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#8c8c8c",
                      padding: "20px",
                    }}
                  >
                    Chưa ghi nhận thông tin lịch sử phiên bản hệ thống nào cho
                    vật tư này.
                  </div>
                );
              }

              const sorted = [...versions].sort(
                (a, b) => b.Version - a.Version,
              );

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {sorted.map((v) => {
                    const isCurrent = v.Version === historyItem.VersionStorage;
                    return (
                      <div
                        key={v.ItemVersionId}
                        style={{
                          border: "1px solid #d9d9d9",
                          borderRadius: "8px",
                          padding: "16px",
                          background: "#fafafa",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: "bold",
                              color: PRIMARY_COLOR,
                            }}
                          >
                            Phiên bản v{v.Version}
                          </span>
                          <Tag color={isCurrent ? "success" : "default"}>
                            {isCurrent ? "Hiện tại" : "Cũ"}
                          </Tag>
                        </div>
                        <Descriptions
                          bordered
                          size="small"
                          column={2}
                          style={{ background: "#ffffff" }}
                        >
                          <Descriptions.Item label="Mã Vật Tư">
                            {v.ItemCode}
                          </Descriptions.Item>
                          <Descriptions.Item label="Phân Loại">
                            {(() => {
                              const config =
                                ItemTypeConfig[v.ItemType as ItemType];
                              return config ? (
                                <Tag color={config.color}>{config.label}</Tag>
                              ) : (
                                <Tag>{v.ItemType}</Tag>
                              );
                            })()}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="Tên Vật Tư / Sản Phẩm"
                            span={2}
                          >
                            {v.ItemName}
                          </Descriptions.Item>
                          <Descriptions.Item label="Đơn Vị Tính">
                            {v.UoM}
                          </Descriptions.Item>
                          <Descriptions.Item label="Trạng thái phê duyệt">
                            <Tag color="success">Đã duyệt</Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Substitute" span={2}>
                            {v.Substitute || "Không có"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Hiệu lực" span={2}>
                            {v.ValidFrom}{" "}
                            {v.ValidTo ? `đến ${v.ValidTo}` : "đến nay"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Cập nhật bởi" span={2}>
                            {v.ModifiedBy || "Hệ thống"} vào lúc{" "}
                            {v.ModifiedAt || "N/A"}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ItemList;
