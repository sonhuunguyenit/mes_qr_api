import {
  EyeOutlined,
  FileExcelOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SearchOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Table,
} from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { AppTable } from "../../../components";
import { PRIMARY_COLOR } from "../../../contants";
import { useAppSelector } from "../../../store/hooks";
import { DocStatus } from "../../doc/types";
import { PartnerType } from "../types";

export const PartnerList: React.FC = () => {
  const allItems = useAppSelector((state) => state.item.items);
  // Only load NVL (RM) and Bao bì (PG)
  const items = allItems.filter(
    (item) => item.ItemType === "RM" || item.ItemType === "PG",
  );
  const partners = useAppSelector((state) => state.partner.partners);
  const mappings = useAppSelector((state) => state.partner.mappings);

  // Temp filter states
  const [tempSearchText, setTempSearchText] = useState("");
  const [tempItemType, setTempItemType] = useState<string>("ALL");
  const [tempNccId, setTempNccId] = useState<string>("ALL");
  const [tempNsxId, setTempNsxId] = useState<string>("ALL");

  // Active filter states
  const [searchText, setSearchText] = useState("");
  const [selectedItemType, setSelectedItemType] = useState<string>("ALL");
  const [selectedNccId, setSelectedNccId] = useState<string>("ALL");
  const [selectedNsxId, setSelectedNsxId] = useState<string>("ALL");

  const handleSearch = () => {
    setSearchText(tempSearchText);
    setSelectedItemType(tempItemType);
    setSelectedNccId(tempNccId);
    setSelectedNsxId(tempNsxId);
  };

  const handleReset = () => {
    setTempSearchText("");
    setTempItemType("ALL");
    setTempNccId("ALL");
    setTempNsxId("ALL");
    setSearchText("");
    setSelectedItemType("ALL");
    setSelectedNccId("ALL");
    setSelectedNsxId("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  const getMockPartnerHistoryData = (record: any) => {
    const itemName = record.ItemName || "Vật tư";
    return [
      {
        key: "1",
        time: "2026-07-01 09:00",
        user: "Trần Anh Dũng (QA Specialist)",
        type: "Liên kết NCC",
        details: `Cấu hình phân công Nhà cung cấp mới cho vật tư "${record.ItemCode} - ${itemName}". Phê duyệt hồ sơ đánh giá NCC ban đầu.`,
        status: "APPROVED",
        approver: "Trần Quốc Bảo (QA Manager)",
        approveTime: "2026-07-01 15:30",
      },
      {
        key: "2",
        time: "2026-07-08 14:15",
        user: "Trần Anh Dũng (QA Specialist)",
        type: "Liên kết NSX",
        details: `Phân công thêm Nhà sản xuất mới cho vật tư. Cập nhật trạng thái chuỗi cung ứng vật tư RM/PG.`,
        status: "APPROVED",
        approver: "Trần Quốc Bảo (QA Manager)",
        approveTime: "2026-07-08 16:30",
      },
      {
        key: "3",
        time: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm"),
        user: "Lê Văn Tám (Procurement Officer)",
        type: "Thay đổi trạng thái",
        details: `Đề xuất điều chỉnh liên kết nhà cung cấp do thay đổi sản lượng hợp đồng mua hàng.`,
        status: "PENDING",
        approver: "-",
        approveTime: "-",
      }
    ];
  };

  // Nested table filter states (in Details Modal)
  const [nestedSearchCode, setNestedSearchCode] = useState("");
  const [nestedSearchName, setNestedSearchName] = useState("");
  const [nestedSearchEmail, setNestedSearchEmail] = useState("");
  const [nestedSearchStatus, setNestedSearchStatus] = useState("");

  // Get NCC partners and NSX partners
  const nccPartners = partners.filter((p) => p.PartnerType === PartnerType.NCC);
  const nsxPartners = partners.filter((p) => p.PartnerType === PartnerType.NSX);

  // Helper: Get mapped partners for an item
  const getMappedPartners = (itemCode: string) => {
    const itemMappings = mappings.filter((m) => m.ItemCode === itemCode);
    const mapped = itemMappings
      .map((m) => partners.find((p) => p.PartnerId === m.PartnerId))
      .filter(Boolean);

    const nccs = mapped.filter((p) => p!.PartnerType === PartnerType.NCC);
    const nsxs = mapped.filter((p) => p!.PartnerType === PartnerType.NSX);

    return { nccs, nsxs };
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const { nccs, nsxs } = getMappedPartners(item.ItemCode);

    // 1. Text Search: matches ItemCode, ItemName, NCC Name/Code, or NSX Name/Code
    const text = searchText.toLowerCase().trim();
    const matchesSearch =
      !text ||
      item.ItemCode.toLowerCase().includes(text) ||
      item.ItemName.toLowerCase().includes(text) ||
      nccs.some(
        (ncc) =>
          ncc!.PartnerCode.toLowerCase().includes(text) ||
          ncc!.PartnerName.toLowerCase().includes(text),
      ) ||
      nsxs.some(
        (nsx) =>
          nsx!.PartnerCode.toLowerCase().includes(text) ||
          nsx!.PartnerName.toLowerCase().includes(text),
      );

    // 2. Item Type Filter
    const matchesItemType =
      selectedItemType === "ALL" || item.ItemType === selectedItemType;

    // 3. NCC Filter
    const matchesNcc =
      selectedNccId === "ALL" ||
      nccs.some((ncc) => ncc!.PartnerId === selectedNccId);

    // 4. NSX Filter
    const matchesNsx =
      selectedNsxId === "ALL" ||
      nsxs.some((nsx) => nsx!.PartnerId === selectedNsxId);

    return matchesSearch && matchesItemType && matchesNcc && matchesNsx;
  });

  const columns = [
    {
      title: "Mã Vật Tư (ItemCode)",
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
      width: 300,
    },
    {
      title: "Phân Loại",
      dataIndex: "ItemType",
      key: "ItemType",
      width: 150,
      align: "center" as const,
      render: (type: string) => {
        switch (type) {
          case "FG":
            return <Tag color="blue">Thành phẩm (FG)</Tag>;
          case "IP":
            return <Tag color="purple">Bán thành phẩm (IP)</Tag>;
          case "RM":
            return <Tag color="green">Nguyên liệu (RM)</Tag>;
          case "PG":
            return <Tag color="orange">Bao bì (PG)</Tag>;
          default:
            return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: "ĐVT",
      dataIndex: "UoM",
      key: "UoM",
      width: 100,
      align: "center" as const,
    },
    {
      title: "SL NCC",
      key: "nccCount",
      width: 100,
      align: "center" as const,
      render: (_: any, record: any) => {
        const { nccs } = getMappedPartners(record.ItemCode);
        return (
          <Tooltip
            title={
              nccs.length > 0
                ? nccs
                    .map((n) => `${n!.PartnerCode} - ${n!.PartnerName}`)
                    .join(", ")
                : "Chưa có NCC"
            }
          >
            <Badge
              count={nccs.length}
              showZero
              color={nccs.length > 0 ? "#52c41a" : "#d9d9d9"}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "SL NSX",
      key: "nsxCount",
      width: 100,
      align: "center" as const,
      render: (_: any, record: any) => {
        const { nsxs } = getMappedPartners(record.ItemCode);
        return (
          <Tooltip
            title={
              nsxs.length > 0
                ? nsxs
                    .map((n) => `${n!.PartnerCode} - ${n!.PartnerName}`)
                    .join(", ")
                : "Chưa có NSX"
            }
          >
            <Badge
              count={nsxs.length}
              showZero
              color={nsxs.length > 0 ? "#2db7f5" : "#d9d9d9"}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space size="middle">
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
          <Tooltip title="Lịch sử thay đổi">
            <Button
              icon={
                <HistoryOutlined
                  style={{ fontSize: "16px", color: PRIMARY_COLOR }}
                />
              }
              onClick={() => {
                setSelectedHistoryItem(record);
                setIsHistoryModalVisible(true);
              }}
            />
          </Tooltip>
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
                Tìm kiếm:
              </div>
              <Input
                placeholder="Mã/tên vật tư, NCC, NSX..."
                value={tempSearchText}
                onChange={(e) => setTempSearchText(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Phân loại vật tư:
              </div>
              <Select
                value={tempItemType}
                onChange={(val) => setTempItemType(val)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">
                  Tất cả phân loại (NVL & Bao bì)
                </Select.Option>
                <Select.Option value="RM">Nguyên liệu (RM)</Select.Option>
                <Select.Option value="PG">Bao bì (PG)</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Nhà cung cấp (NCC):
              </div>
              <Select
                value={tempNccId}
                onChange={(val) => setTempNccId(val)}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "ALL", label: "Tất cả NCC" },
                  ...nccPartners.map((ncc) => ({
                    value: ncc.PartnerId,
                    label: `${ncc.PartnerCode} - ${ncc.PartnerName}`,
                  })),
                ]}
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Nhà sản xuất (NSX):
              </div>
              <Select
                value={tempNsxId}
                onChange={(val) => setTempNsxId(val)}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "ALL", label: "Tất cả NSX" },
                  ...nsxPartners.map((nsx) => ({
                    value: nsx.PartnerId,
                    label: `${nsx.PartnerCode} - ${nsx.PartnerName}`,
                  })),
                ]}
              />
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
                  icon={<FileExcelOutlined />}
                  style={{ background: "#107c41", borderColor: "#107c41" }}
                  onClick={() =>
                    message.info(
                      "Chức năng tải lên Excel đang được phát triển!",
                    )
                  }
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
        scroll={{ x: 980 }}
      />

      {/* Detail Modal */}
      <Modal
        title={
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: PRIMARY_COLOR,
            }}
          >
            <EyeOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Chi tiết phân công đối tác NCC & NSX
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedItem(null);
          setNestedSearchCode("");
          setNestedSearchName("");
          setNestedSearchEmail("");
          setNestedSearchStatus("");
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsModalVisible(false);
              setSelectedItem(null);
              setNestedSearchCode("");
              setNestedSearchName("");
              setNestedSearchEmail("");
              setNestedSearchStatus("");
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        {selectedItem &&
          (() => {
            const { nccs: modalNccs, nsxs: modalNsxs } = getMappedPartners(
              selectedItem.ItemCode,
            );

            const filteredNccs = modalNccs.filter((partner) => {
              if (!partner) return false;
              const matchesCode =
                !nestedSearchCode ||
                partner.PartnerCode.toLowerCase().includes(
                  nestedSearchCode.toLowerCase().trim(),
                );
              const matchesName =
                !nestedSearchName ||
                partner.PartnerName.toLowerCase().includes(
                  nestedSearchName.toLowerCase().trim(),
                );
              const matchesEmail =
                !nestedSearchEmail ||
                (partner.Email || "")
                  .toLowerCase()
                  .includes(nestedSearchEmail.toLowerCase().trim());
              const partnerStatus = partner.Status || DocStatus.APPROVED;
              const matchesStatus =
                !nestedSearchStatus || partnerStatus === nestedSearchStatus;
              return (
                matchesCode && matchesName && matchesEmail && matchesStatus
              );
            });

            const filteredNsxs = modalNsxs.filter((partner) => {
              if (!partner) return false;
              const matchesCode =
                !nestedSearchCode ||
                partner.PartnerCode.toLowerCase().includes(
                  nestedSearchCode.toLowerCase().trim(),
                );
              const matchesName =
                !nestedSearchName ||
                partner.PartnerName.toLowerCase().includes(
                  nestedSearchName.toLowerCase().trim(),
                );
              const matchesEmail =
                !nestedSearchEmail ||
                (partner.Email || "")
                  .toLowerCase()
                  .includes(nestedSearchEmail.toLowerCase().trim());
              const partnerStatus = partner.Status || DocStatus.APPROVED;
              const matchesStatus =
                !nestedSearchStatus || partnerStatus === nestedSearchStatus;
              return (
                matchesCode && matchesName && matchesEmail && matchesStatus
              );
            });

            const partnerColumns = [
              {
                title: (
                  <div style={{ fontWeight: "bold", padding: "4px 0" }}>
                    STT
                  </div>
                ),
                key: "stt",
                width: "8%",
                align: "center" as const,
                render: (_: any, __: any, index: number) => index + 1,
              },
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Mã Đối Tác</div>
                    <Input
                      placeholder="Lọc mã..."
                      prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                      value={nestedSearchCode}
                      onChange={(e) => setNestedSearchCode(e.target.value)}
                      style={{
                        marginTop: 6,
                        fontWeight: "normal",
                        borderRadius: "4px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      allowClear
                    />
                  </div>
                ),
                dataIndex: "PartnerCode",
                key: "PartnerCode",
                width: "18%",
                align: "center" as const,
                render: (code: string) => <strong>{code}</strong>,
              },
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Tên Đối Tác</div>
                    <Input
                      placeholder="Lọc tên..."
                      prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                      value={nestedSearchName}
                      onChange={(e) => setNestedSearchName(e.target.value)}
                      style={{
                        marginTop: 6,
                        fontWeight: "normal",
                        borderRadius: "4px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      allowClear
                    />
                  </div>
                ),
                dataIndex: "PartnerName",
                key: "PartnerName",
                width: "34%",
              },
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Email</div>
                    <Input
                      placeholder="Lọc email..."
                      prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                      value={nestedSearchEmail}
                      onChange={(e) => setNestedSearchEmail(e.target.value)}
                      style={{
                        marginTop: 6,
                        fontWeight: "normal",
                        borderRadius: "4px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      allowClear
                    />
                  </div>
                ),
                dataIndex: "Email",
                key: "Email",
                width: "25%",
                render: (email: string) =>
                  email || <span style={{ color: "#bfbfbf" }}>-</span>,
              },
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Trạng thái duyệt</div>
                    <Select
                      placeholder="Lọc..."
                      value={nestedSearchStatus || undefined}
                      onChange={(val) => setNestedSearchStatus(val || "")}
                      style={{
                        marginTop: 6,
                        fontWeight: "normal",
                        width: "100%",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      allowClear
                    >
                      <Select.Option value={DocStatus.APPROVED}>
                        Đã duyệt
                      </Select.Option>
                      <Select.Option value={DocStatus.PENDING}>
                        Chờ duyệt
                      </Select.Option>
                      <Select.Option value={DocStatus.REJECTED}>
                        Từ chối
                      </Select.Option>
                    </Select>
                  </div>
                ),
                key: "Status",
                width: "15%",
                align: "center" as const,
                render: (record: any) => {
                  const val = record.Status || DocStatus.APPROVED;
                  switch (val) {
                    case DocStatus.APPROVED:
                      return <Tag color="success">Đã duyệt</Tag>;
                    case DocStatus.REJECTED:
                      return <Tag color="error">Từ chối</Tag>;
                    default:
                      return <Tag color="warning">Chờ duyệt</Tag>;
                  }
                },
              },
            ];

            return (
              <div>
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
                    {selectedItem.ItemType === "FG" && (
                      <Tag color="blue">Thành phẩm (FG)</Tag>
                    )}
                    {selectedItem.ItemType === "IP" && (
                      <Tag color="purple">Bán thành phẩm (IP)</Tag>
                    )}
                    {selectedItem.ItemType === "RM" && (
                      <Tag color="green">Nguyên liệu (RM)</Tag>
                    )}
                    {selectedItem.ItemType === "PG" && (
                      <Tag color="orange">Bao bì (PG)</Tag>
                    )}
                    {!["FG", "IP", "RM", "PG"].includes(
                      selectedItem.ItemType,
                    ) && <Tag>{selectedItem.ItemType}</Tag>}
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
                </Descriptions>

                <Divider
                  orientation={"left" as any}
                  style={{ margin: "24px 0 16px 0" }}
                >
                  <span style={{ fontWeight: 600 }}>
                    Danh sách Nhà Cung Cấp (NCC)
                  </span>
                  <Badge
                    count={filteredNccs.length}
                    showZero
                    color="#52c41a"
                    style={{ marginLeft: "8px" }}
                  />
                </Divider>
                <AppTable
                  dataSource={filteredNccs}
                  columns={partnerColumns}
                  rowKey="PartnerId"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20"],
                    showTotal: (total) => `Tổng cộng ${total} đối tác`,
                  }}
                  bordered
                  size="small"
                  locale={{
                    emptyText: "Chưa có Nhà cung cấp nào khớp với bộ lọc",
                  }}
                  style={{ marginBottom: "24px" }}
                />

                <Divider
                  orientation={"left" as any}
                  style={{ margin: "24px 0 16px 0" }}
                >
                  <span style={{ fontWeight: 600 }}>
                    Danh sách Nhà Sản Xuất (NSX)
                  </span>
                  <Badge
                    count={filteredNsxs.length}
                    showZero
                    color="#1890ff"
                    style={{ marginLeft: "8px" }}
                  />
                </Divider>
                <AppTable
                  dataSource={filteredNsxs}
                  columns={partnerColumns}
                  rowKey="PartnerId"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20"],
                    showTotal: (total) => `Tổng cộng ${total} đối tác`,
                  }}
                  bordered
                  size="small"
                  locale={{
                    emptyText: "Chưa có Nhà sản xuất nào khớp với bộ lọc",
                  }}
                />
              </div>
            );
          })()}
      </Modal>

      {/* Partner Revision History Modal */}
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
              Lịch sử Phân công & Đánh giá Đối tác - {selectedHistoryItem?.ItemCode}
            </span>
          </div>
        }
        open={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setSelectedHistoryItem(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsHistoryModalVisible(false);
              setSelectedHistoryItem(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        {selectedHistoryItem && (
          <div style={{ marginTop: "15px" }}>
            <Descriptions
              bordered
              size="small"
              column={2}
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Mã Vật Tư">
                <strong>{selectedHistoryItem.ItemCode}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Vật Tư / Sản Phẩm">
                <strong>{selectedHistoryItem.ItemName || "-"}</strong>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation={"left" as any} style={{ fontSize: "14px", fontWeight: 600, color: PRIMARY_COLOR }}>
              Nhật ký thay đổi phân công đối tác
            </Divider>

            <Table
              dataSource={getMockPartnerHistoryData(selectedHistoryItem)}
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
                  width: 140,
                  render: (text: string) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: "Chi tiết thay đổi",
                  dataIndex: "details",
                  key: "details",
                  render: (text: string) => <span style={{ fontSize: "13px" }}>{text}</span>,
                },
                {
                  title: "Lịch sử phê duyệt",
                  key: "status",
                  width: 240,
                  render: (record: any) => {
                    if (record.status === "APPROVED") {
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

export default PartnerList;
