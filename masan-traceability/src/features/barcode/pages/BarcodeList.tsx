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
  Space,
  Tooltip,
  Form,
  Table,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  PlusOutlined,
  MenuUnfoldOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";

const CustomBarcodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    style={{ display: "inline-block", verticalAlign: "middle", ...props.style }}
    {...props}
  >
    <rect x="1" y="4" width="1.5" height="16" />
    <rect x="3.5" y="4" width="0.75" height="16" />
    <rect x="5.25" y="4" width="2.25" height="16" />
    <rect x="8.5" y="4" width="0.75" height="16" />
    <rect x="10.25" y="4" width="1.5" height="16" />
    <rect x="12.75" y="4" width="0.75" height="16" />
    <rect x="14.5" y="4" width="2.25" height="16" />
    <rect x="17.75" y="4" width="1.5" height="16" />
    <rect x="20.25" y="4" width="0.75" height="16" />
    <rect x="22" y="4" width="1" height="16" />
  </svg>
);
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AppTable } from "../../../components";
import { addBarcode, updateBarcode } from "../store/barcodeSlice";
import { Barcode, Barcode_Item } from "../types";
import { ItemType, ItemTypeConfig } from "../../../enums";
import { PRIMARY_COLOR } from "../../../contants";

export const BarcodeList: React.FC = () => {
  const barcodes = useAppSelector((state) => state.barcode.barcodes);
  const specs = useAppSelector((state) => state.spec.specs);
  const items = useAppSelector((state) => state.item.items);
  const dispatch = useAppDispatch();

  // Temp states for filtering
  const [tempBarcodeNumber, setTempBarcodeNumber] = useState("");
  const [tempSpecId, setTempSpecId] = useState("ALL");
  const [tempItemCode, setTempItemCode] = useState("ALL");

  // Active search states
  const [filterBarcodeNumber, setFilterBarcodeNumber] = useState("");
  const [filterSpecId, setFilterSpecId] = useState("ALL");
  const [filterItemCode, setFilterItemCode] = useState("ALL");

  // Detail Modal states
  const [selectedBarcode, setSelectedBarcode] = useState<Barcode | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Add Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [selectedSpecForAdd, setSelectedSpecForAdd] = useState<string | null>(
    null,
  );

  // Edit Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingBarcode, setEditingBarcode] = useState<Barcode | null>(null);
  const [editForm] = Form.useForm();

  const handleSearch = () => {
    setFilterBarcodeNumber(tempBarcodeNumber);
    setFilterSpecId(tempSpecId);
    setFilterItemCode(tempItemCode);
  };

  const handleReset = () => {
    setTempBarcodeNumber("");
    setTempSpecId("ALL");
    setTempItemCode("ALL");
    setFilterBarcodeNumber("");
    setFilterSpecId("ALL");
    setFilterItemCode("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };

  // Client-side filtering logic
  const filteredBarcodes = barcodes.filter((barcode) => {
    const matchesBarcodeNumber = barcode.BarcodeNumber.toLowerCase().includes(
      filterBarcodeNumber.toLowerCase(),
    );
    const matchesSpec =
      filterSpecId === "ALL" || barcode.SpecId === filterSpecId;
    const matchesItem =
      filterItemCode === "ALL" ||
      barcode.BarcodeItems?.some((bi) => bi.ItemCode === filterItemCode);

    return matchesBarcodeNumber && matchesSpec && matchesItem;
  });

  const handleAddBarcode = (values: any) => {
    const barcodeExists = barcodes.some(
      (b) => b.BarcodeNumber === values.BarcodeNumber,
    );
    if (barcodeExists) {
      message.error(
        `Số Barcode ${values.BarcodeNumber} đã tồn tại trong hệ thống!`,
      );
      return;
    }

    const newBarcodeId = `BARCODE-${Date.now()}`;
    const barcodeItems: Barcode_Item[] = values.itemCodes.map(
      (code: string, index: number) => ({
        BarcodeItemId: `BARCODE-ITEM-${Date.now()}-${index}`,
        BarcodeId: newBarcodeId,
        ItemCode: code,
      }),
    );

    const newBarcode: Barcode = {
      BarcodeId: newBarcodeId,
      BarcodeNumber: values.BarcodeNumber,
      SpecId: values.SpecId,
      BarcodeItems: barcodeItems,
    };

    dispatch(addBarcode(newBarcode));
    message.success("Thêm mới mã vạch GS1 thành công!");
    setIsAddModalVisible(false);
    addForm.resetFields();
    setSelectedSpecForAdd(null);
  };

  // Open Edit Modal and fill data
  const handleOpenEditModal = (record: Barcode) => {
    setEditingBarcode(record);
    editForm.setFieldsValue({
      BarcodeNumber: record.BarcodeNumber,
      SpecId: record.SpecId,
      itemCodes: record.BarcodeItems?.map((bi) => bi.ItemCode) || [],
    });
    setIsEditModalVisible(true);
  };

  // Save edits
  const handleUpdateBarcode = (values: any) => {
    if (!editingBarcode) return;

    const barcodeExists = barcodes.some(
      (b) =>
        b.BarcodeNumber === values.BarcodeNumber &&
        b.BarcodeId !== editingBarcode.BarcodeId,
    );
    if (barcodeExists) {
      message.error(
        `Số Barcode ${values.BarcodeNumber} đã tồn tại trong hệ thống!`,
      );
      return;
    }

    const barcodeItems: Barcode_Item[] = values.itemCodes.map(
      (code: string, index: number) => ({
        BarcodeItemId: `BARCODE-ITEM-UPDATED-${Date.now()}-${index}`,
        BarcodeId: editingBarcode.BarcodeId,
        ItemCode: code,
      }),
    );

    const updatedBarcode: Barcode = {
      ...editingBarcode,
      BarcodeNumber: values.BarcodeNumber,
      BarcodeItems: barcodeItems,
    };

    dispatch(updateBarcode(updatedBarcode));
    message.success("Cập nhật mã vạch GS1 thành công!");
    setIsEditModalVisible(false);
    setEditingBarcode(null);
    editForm.resetFields();
  };

  // Helper to sync items in creation form when a Spec is selected
  const handleSpecChangeForAdd = (specId: string) => {
    setSelectedSpecForAdd(specId);
    const selectedSpec = specs.find((s) => s.SpecId === specId);
    if (selectedSpec && selectedSpec.SpecItems) {
      const associatedItemCodes = selectedSpec.SpecItems.map(
        (si) => si.ItemCode,
      );
      addForm.setFieldsValue({
        itemCodes: associatedItemCodes,
      });
      message.info(
        `Đã tự động chọn ${associatedItemCodes.length} vật tư từ tiêu chuẩn này!`,
      );
    } else {
      addForm.setFieldsValue({
        itemCodes: [],
      });
    }
  };

  const columns = [
    {
      title: "Mã Barcode",
      dataIndex: "BarcodeId",
      key: "BarcodeId",
      width: 160,
      align: "center" as const,
      render: (id: string) => (
        <strong style={{ color: "#096dd9" }}>{id}</strong>
      ),
    },
    {
      title: "Số Barcode GS1",
      dataIndex: "BarcodeNumber",
      key: "BarcodeNumber",
      width: 220,
      render: (num: string) => (
        <span
          style={{
            fontFamily: "Courier, monospace",
            fontSize: "14px",
            fontWeight: "bold",
            letterSpacing: "1.2px",
            background: "#f5f5f5",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px dashed #d9d9d9",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <CustomBarcodeIcon style={{ marginRight: 8, color: PRIMARY_COLOR }} />
          {num}
        </span>
      ),
    },
    {
      title: "Tiêu chuẩn áp dụng (TCCS/Spec)",
      dataIndex: "SpecId",
      key: "SpecId",
      width: 260,
      align: "center" as const,
      render: (specId: string) => {
        const spec = specs.find((s) => s.SpecId === specId);
        return spec ? (
          <Tooltip title={spec.SpecName} placement="topLeft">
            <Tag color="purple" style={{ cursor: "pointer" }}>
              {spec.SpecCode}
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="default">{specId}</Tag>
        );
      },
    },
    {
      title: "Vật tư áp dụng",
      dataIndex: "BarcodeItems",
      key: "BarcodeItems",
      width: 420,
      render: (barcodeItemsList?: Barcode_Item[]) => {
        if (!barcodeItemsList || barcodeItemsList.length === 0) return "-";
        return (
          <Space wrap size={[4, 8]}>
            {barcodeItemsList.map((bi) => {
              const item = items.find((it) => it.ItemCode === bi.ItemCode);
              const type = item?.ItemType;
              const config = type ? ItemTypeConfig[type as ItemType] : null;
              return (
                <Tooltip
                  key={bi.BarcodeItemId}
                  title={item?.ItemName || bi.ItemCode}
                  placement="top"
                >
                  <Tag
                    color={config ? config.color : "default"}
                    style={{
                      fontWeight: 600,
                      borderRadius: "12px",
                    }}
                  >
                    {bi.ItemCode}
                  </Tag>
                </Tooltip>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Số lượng Vật tư",
      key: "itemCount",
      width: 140,
      align: "center" as const,
      render: (record: Barcode) => (
        <Tag color="cyan" style={{ borderRadius: "10px", fontWeight: "bold" }}>
          {record.BarcodeItems?.length || 0} Items
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 140,
      render: (record: Barcode) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined style={{ fontSize: "16px" }} />}
              onClick={() => {
                setSelectedBarcode(record);
                setIsDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="default"
              icon={
                <EditOutlined
                  style={{ fontSize: "16px", color: PRIMARY_COLOR }}
                />
              }
              onClick={() => handleOpenEditModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Helper variables for Detail Modal
  const linkedSpec = selectedBarcode
    ? specs.find((s) => s.SpecId === selectedBarcode.SpecId)
    : null;

  const linkedItemsData = selectedBarcode?.BarcodeItems
    ? selectedBarcode.BarcodeItems.map((bi) => {
        const itemDetail = items.find((it) => it.ItemCode === bi.ItemCode);
        return {
          key: bi.BarcodeItemId,
          ItemCode: bi.ItemCode,
          ItemName: itemDetail?.ItemName || "N/A",
          ItemType: itemDetail?.ItemType || "N/A",
          UoM: itemDetail?.UoM || "N/A",
        };
      })
    : [];

  return (
    <div>
      {/* Search Filter Collapse */}
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
              Tìm kiếm và bộ lọc Barcode
            </span>
          }
          style={{ background: "#ffffff", border: "none" }}
        >
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} md={12} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Số Barcode GS1:
              </div>
              <Input
                placeholder="Lọc số mã vạch..."
                value={tempBarcodeNumber}
                onChange={(e) => setTempBarcodeNumber(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<CustomBarcodeIcon style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Tiêu chuẩn áp dụng:
              </div>
              <Select
                value={tempSpecId}
                onChange={(value) => setTempSpecId(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả Tiêu chuẩn</Select.Option>
                {specs.map((s) => (
                  <Select.Option key={s.SpecId} value={s.SpecId}>
                    {s.SpecCode}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Mã vật tư áp dụng:
              </div>
              <Select
                value={tempItemCode}
                onChange={(value) => setTempItemCode(value)}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
              >
                <Select.Option value="ALL">Tất cả Vật tư</Select.Option>
                {items.map((i) => (
                  <Select.Option key={i.ItemCode} value={i.ItemCode}>
                    {i.ItemCode} - {i.ItemName}
                  </Select.Option>
                ))}
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddModalVisible(true)}
                >
                  Khai báo Barcode mới
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* Main Table */}
      <AppTable
        dataSource={filteredBarcodes}
        columns={columns}
        rowKey="BarcodeId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} mã vạch`,
        }}
        bordered
        size="middle"
        scroll={{ x: 1200 }}
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
            <CustomBarcodeIcon
              style={{ color: PRIMARY_COLOR, marginRight: "8px" }}
            />
            Chi tiết liên kết Barcode GS1
          </span>
        }
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedBarcode(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsDetailModalVisible(false);
              setSelectedBarcode(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {selectedBarcode && (
          <div style={{ marginTop: "15px" }}>
            <Descriptions
              title="1. Thông tin Barcode chính"
              bordered
              size="small"
              column={2}
            >
              <Descriptions.Item label="Mã Barcode hệ thống">
                <strong style={{ color: "#096dd9" }}>
                  {selectedBarcode.BarcodeId}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số Barcode GS1">
                <strong
                  style={{
                    fontFamily: "Courier, monospace",
                    fontSize: "15px",
                    background: "#f0f2f5",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {selectedBarcode.BarcodeNumber}
                </strong>
              </Descriptions.Item>
            </Descriptions>

            {/* Spec info */}
            <div style={{ marginTop: "24px" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                2. Tiêu chuẩn áp dụng (TCCS / Spec)
              </span>
              {linkedSpec ? (
                <Descriptions bordered size="small" column={2}>
                  <Descriptions.Item label="Mã tiêu chuẩn">
                    <Tag color="purple">{linkedSpec.SpecCode}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phân loại">
                    {linkedSpec.SpecType === "TCCS" ? (
                      <Tag color="blue">Tiêu chuẩn cơ sở (TCCS)</Tag>
                    ) : (
                      <Tag color="purple">Tiêu chuẩn kỹ thuật (SPEC)</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên tiêu chuẩn" span={2}>
                    {linkedSpec.SpecName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hiệu lực từ">
                    {linkedSpec.ValidFrom ? String(linkedSpec.ValidFrom) : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hết hiệu lực">
                    {linkedSpec.ValidTo ? (
                      String(linkedSpec.ValidTo)
                    ) : (
                      <span style={{ color: "green" }}>Đang hiệu lực</span>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <div
                  style={{
                    padding: "12px",
                    background: "#fdf6ec",
                    color: "#e6a23c",
                    borderRadius: "4px",
                  }}
                >
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Không tìm thấy thông tin tiêu chuẩn (SpecId:{" "}
                  {selectedBarcode.SpecId})
                </div>
              )}
            </div>

            {/* Applied Items List */}
            <div style={{ marginTop: "24px" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                3. Danh sách Vật tư/Sản phẩm áp dụng barcode này
              </span>
              <AppTable
                dataSource={linkedItemsData}
                columns={[
                  {
                    title: "Mã vật tư",
                    dataIndex: "ItemCode",
                    key: "ItemCode",
                    width: 150,
                    align: "center" as const,
                    render: (code: string) => (
                      <strong style={{ color: "#096dd9" }}>{code}</strong>
                    ),
                  },
                  {
                    title: "Tên vật tư / sản phẩm",
                    dataIndex: "ItemName",
                    key: "ItemName",
                  },
                  {
                    title: "Phân loại",
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
                    title: "ĐVT",
                    dataIndex: "UoM",
                    key: "UoM",
                    width: 100,
                    align: "center" as const,
                  },
                ]}
                pagination={false}
                bordered
                size="small"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Add Barcode Modal */}
      <Modal
        title={
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: PRIMARY_COLOR,
            }}
          >
            <PlusOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
            Khai báo Mã vạch GS1 mới
          </span>
        }
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
          setSelectedSpecForAdd(null);
        }}
        onOk={() => addForm.submit()}
        okText="Khai báo"
        cancelText="Hủy"
        width={750}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddBarcode}
          style={{ marginTop: "15px" }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="BarcodeNumber"
                label="Số Barcode GS1 (EAN-13 hoặc GTIN)"
                rules={[
                  { required: true, message: "Vui lòng nhập Số Barcode!" },
                  {
                    pattern: /^[0-9]{8,14}$/,
                    message: "Số Barcode phải gồm từ 8 đến 14 ký tự số!",
                  },
                ]}
              >
                <Input
                  placeholder="Ví dụ: 8934563123456"
                  maxLength={14}
                  prefix={<CustomBarcodeIcon style={{ color: "#bfbfbf" }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="SpecId"
                label="Tiêu chuẩn áp dụng (TCCS / Spec)"
                rules={[
                  { required: true, message: "Vui lòng chọn tiêu chuẩn!" },
                ]}
              >
                <Select
                  placeholder="Chọn một tiêu chuẩn..."
                  onChange={handleSpecChangeForAdd}
                  showSearch
                  optionFilterProp="children"
                >
                  {specs.map((s) => (
                    <Select.Option key={s.SpecId} value={s.SpecId}>
                      {s.SpecCode} - {s.SpecName} ({s.SpecType})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="itemCodes"
                label={
                  <span>
                    Vật tư áp dụng (Chọn nhiều ItemCode)
                    {selectedSpecForAdd && (
                      <span
                        style={{
                          marginLeft: 8,
                          color: "#52c41a",
                          fontSize: "12px",
                        }}
                      >
                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                        Đã lọc theo vật tư của Tiêu chuẩn được chọn
                      </span>
                    )}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ít nhất một vật tư!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn các ItemCode áp dụng..."
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {items
                    .filter((item) => {
                      if (!selectedSpecForAdd) return true;
                      const activeSpec = specs.find(
                        (s) => s.SpecId === selectedSpecForAdd,
                      );
                      return activeSpec?.SpecItems?.some(
                        (si) => si.ItemCode === item.ItemCode,
                      );
                    })
                    .map((item) => (
                      <Select.Option key={item.ItemCode} value={item.ItemCode}>
                        {item.ItemCode} - {item.ItemName} ({item.ItemType})
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Edit Barcode Modal */}
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
            Cập nhật Mã vạch GS1
          </span>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
          setEditingBarcode(null);
        }}
        onOk={() => editForm.submit()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={750}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateBarcode}
          style={{ marginTop: "15px" }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="BarcodeNumber"
                label="Số Barcode GS1 (EAN-13 hoặc GTIN)"
                rules={[
                  { required: true, message: "Vui lòng nhập Số Barcode!" },
                  {
                    pattern: /^[0-9]{8,14}$/,
                    message: "Số Barcode phải gồm từ 8 đến 14 ký tự số!",
                  },
                ]}
              >
                <Input
                  placeholder="Ví dụ: 8934563123456"
                  maxLength={14}
                  prefix={<CustomBarcodeIcon style={{ color: "#bfbfbf" }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="SpecId"
                label="Tiêu chuẩn áp dụng (TCCS / Spec) - Không thể thay đổi"
                tooltip="Mã tiêu chuẩn của Barcode được cố định sau khi khai báo"
              >
                <Select disabled placeholder="Chọn một tiêu chuẩn...">
                  {specs.map((s) => (
                    <Select.Option key={s.SpecId} value={s.SpecId}>
                      {s.SpecCode} - {s.SpecName} ({s.SpecType})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="itemCodes"
                label={
                  <span>
                    Vật tư áp dụng (Chọn nhiều ItemCode)
                    <span
                      style={{
                        marginLeft: 8,
                        color: "#1890ff",
                        fontSize: "12px",
                      }}
                    >
                      <CheckCircleOutlined style={{ marginRight: 4 }} />
                      Đã lọc theo vật tư của Tiêu chuẩn cố định
                    </span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ít nhất một vật tư!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn các ItemCode áp dụng..."
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {items
                    .filter((item) => {
                      const selectedSpecId = editingBarcode?.SpecId;
                      if (!selectedSpecId) return true;
                      const activeSpec = specs.find(
                        (s) => s.SpecId === selectedSpecId,
                      );
                      return activeSpec?.SpecItems?.some(
                        (si) => si.ItemCode === item.ItemCode,
                      );
                    })
                    .map((item) => (
                      <Select.Option key={item.ItemCode} value={item.ItemCode}>
                        {item.ItemCode} - {item.ItemName} ({item.ItemType})
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default BarcodeList;
