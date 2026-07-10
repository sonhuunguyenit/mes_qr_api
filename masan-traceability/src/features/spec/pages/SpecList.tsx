import {
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  InboxOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Upload,
  Collapse,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { AppTable } from "../../../components";
import { ItemType, ItemTypeConfig } from "../../../enums";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Hscb } from "../../hscb/types";
import { addSpec, approveSpec, rejectSpec } from "../store/specSlice";
import { Spec, SpecType, DocStatus } from "../types";
import { PRIMARY_COLOR } from "../../../contants";

const renderDate = (d?: Date | string | null): string => {
  if (!d) return "";
  return dayjs(d).format("YYYY-MM-DD");
};

export const SpecList: React.FC = () => {
  const specs = useAppSelector((state) => state.spec.specs);
  const items = useAppSelector((state) => state.item.items);
  const boms = useAppSelector((state) => state.bom.boms);
  const hscbs = useAppSelector((state) => state.hscb.hscbs);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // Temp states for filtering
  const [tempSpecCode, setTempSpecCode] = useState("");
  const [tempSpecName, setTempSpecName] = useState("");
  const [tempQloneCode, setTempQloneCode] = useState("");
  const [tempType, setTempType] = useState<string>("ALL");

  // Active search states
  const [searchSpecCode, setSearchSpecCode] = useState("");
  const [searchSpecName, setSearchSpecName] = useState("");
  const [searchQloneCode, setSearchQloneCode] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const handleSearch = () => {
    setSearchSpecCode(tempSpecCode);
    setSearchSpecName(tempSpecName);
    setSearchQloneCode(tempQloneCode);
    setSelectedType(tempType);
  };

  const handleReset = () => {
    setTempSpecCode("");
    setTempSpecName("");
    setTempQloneCode("");
    setTempType("ALL");
    setSearchSpecCode("");
    setSearchSpecName("");
    setSearchQloneCode("");
    setSelectedType("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Details Modal states
  const [selectedDetailSpec, setSelectedDetailSpec] = useState<Spec | null>(
    null,
  );
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [nestedSearchItemCode, setNestedSearchItemCode] = useState("");
  const [nestedSearchItemName, setNestedSearchItemName] = useState("");
  const [nestedSearchItemType, setNestedSearchItemType] = useState("");
  const [nestedSearchBom, setNestedSearchBom] = useState("");

  // PDF Drawer states
  const [selectedSpecForPdf, setSelectedSpecForPdf] = useState<Spec | null>(
    null,
  );
  const [isPdfDrawerVisible, setIsPdfDrawerVisible] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);

  // HSCB PDF Drawer states
  const [selectedHscbForPdf, setSelectedHscbForPdf] = useState<Hscb | null>(
    null,
  );
  const [isHscbPdfDrawerVisible, setIsHscbPdfDrawerVisible] = useState(false);

  // Applied BOMs details sub-modal states
  const [selectedBomsForDetailModal, setSelectedBomsForDetailModal] = useState<
    any[] | null
  >(null);
  const [isBomsDetailModalVisible, setIsBomsDetailModalVisible] =
    useState(false);

  const handleDownloadFakePdf = () => {
    message.loading("Đang chuẩn bị tệp PDF...", 1);
    setTimeout(() => {
      message.success(
        `Tải xuống thành công tệp ${
          selectedSpecForPdf?.SpecCode || "SPEC"
        }.pdf`,
      );
    }, 1000);
  };

  const handlePrintFakePdf = () => {
    message.loading("Đang kết nối máy in...", 1);
    setTimeout(() => {
      message.success("Lệnh in đã được gửi đến máy in thành công!");
    }, 1000);
  };

  const handleDownloadFakeHscbPdf = () => {
    message.loading("Đang chuẩn bị tệp PDF...", 1);
    setTimeout(() => {
      message.success(
        `Tải xuống thành công tệp ${
          selectedHscbForPdf?.HscbCode || "HSCB"
        }.pdf`,
      );
    }, 1000);
  };

  const handlePrintFakeHscbPdf = () => {
    message.loading("Đang kết nối máy in...", 1);
    setTimeout(() => {
      message.success("Lệnh in đã được gửi đến máy in thành công!");
    }, 1000);
  };

  const getLatestHscbVersion = (hscb: Hscb): any | undefined => {
    if (!hscb.HscbVersions || hscb.HscbVersions.length === 0) return undefined;
    const sorted = [...hscb.HscbVersions].sort((a, b) => {
      return dayjs(b.ValidFrom).unix() - dayjs(a.ValidFrom).unix();
    });
    return sorted[0];
  };

  const getHscbVersionStatusText = (version: any) => {
    const today = dayjs().startOf("day");
    const validFrom = dayjs(version.ValidFrom).startOf("day");
    const validTo = version.ValidTo
      ? dayjs(version.ValidTo).startOf("day")
      : null;

    if (validFrom.isAfter(today)) {
      return { text: "Chưa hiệu lực", color: "blue", status: "PENDING" };
    }
    if (validTo && validTo.isBefore(today)) {
      return { text: "Hết hiệu lực", color: "red", status: "EXPIRED" };
    }
    return { text: "Đang hiệu lực", color: "green", status: "ACTIVE" };
  };

  // Filter logic
  const filteredSpecs = specs.filter((spec) => {
    const matchesSpecCode = spec.SpecCode.toLowerCase().includes(
      searchSpecCode.toLowerCase(),
    );
    const matchesSpecName = spec.SpecName.toLowerCase().includes(
      searchSpecName.toLowerCase(),
    );
    const matchesQloneCode =
      !searchQloneCode ||
      (spec.QloneCode &&
        spec.QloneCode.toLowerCase().includes(searchQloneCode.toLowerCase()));
    const matchesType =
      selectedType === "ALL" || spec.SpecType === selectedType;

    return (
      matchesSpecCode && matchesSpecName && matchesQloneCode && matchesType
    );
  });

  const handleAddSpec = (values: any) => {
    const newSpecId = `SPEC-${Date.now()}`;

    const specItems = values.itemCodes.map((code: string, index: number) => ({
      SpecItemId: `SPEC-ITEM-${Date.now()}-${index}`,
      ItemCode: code,
      SpecId: newSpecId,
    }));

    let fileUrl = "";
    if (values.fileUpload && values.fileUpload.length > 0) {
      const fileObj = values.fileUpload[0].originFileObj;
      if (fileObj) {
        fileUrl = URL.createObjectURL(fileObj);
      } else {
        fileUrl = `/files/${values.fileUpload[0].name}`;
      }
    }

    const newSpec: Spec = {
      SpecId: newSpecId,
      SpecCode: values.SpecCode,
      SpecName: values.SpecName,
      SpecType: values.SpecType,
      QloneCode: values.QloneCode || "",
      FileURL: fileUrl,
      ValidFrom: values.ValidFrom ? values.ValidFrom.format("YYYY-MM-DD") : "",
      ValidTo: values.ValidTo ? values.ValidTo.format("YYYY-MM-DD") : null,
      SpecItems: specItems,
    };

    dispatch(addSpec(newSpec));
    message.success("Thêm tiêu chuẩn thành công!");
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Mã tiêu chuẩn",
      dataIndex: "SpecCode",
      key: "SpecCode",
      width: 180,
      align: "center" as const,
      render: (text: string) => (
        <strong style={{ color: "#096dd9" }}>{text}</strong>
      ),
    },
    {
      title: "Tên tiêu chuẩn",
      dataIndex: "SpecName",
      key: "SpecName",
      width: 450,
      ellipsis: true,
    },
    {
      title: "Phân loại",
      dataIndex: "SpecType",
      key: "SpecType",
      width: 220,
      align: "center" as const,
      render: (type: string) => {
        switch (type) {
          case "TCCS":
            return <Tag color="blue">Tiêu chuẩn cơ sở (TCCS)</Tag>;
          case "SPEC":
            return <Tag color="purple">Tiêu chuẩn kỹ thuật (SPEC)</Tag>;
          default:
            return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: "Mã QL-One",
      dataIndex: "QloneCode",
      key: "QloneCode",
      width: 180,
      align: "center" as const,
      render: (text?: string) =>
        text ? <strong style={{ color: "#096dd9" }}>{text}</strong> : "-",
    },
    {
      title: "Vật tư áp dụng",
      dataIndex: "SpecItems",
      key: "SpecItems",
      width: 300,
      render: (specItemsList?: any[]) => {
        if (!specItemsList || specItemsList.length === 0) return "-";
        if (specItemsList.length > 5) {
          return (
            <Tag
              style={{
                backgroundColor: "#096dd9",
                color: "#ffffff",
                fontWeight: "bold",
                borderRadius: "12px",
                padding: "2px 10px",
                border: "none",
              }}
            >
              {specItemsList.length} Item đang áp dụng
            </Tag>
          );
        }
        const codeString = specItemsList.map((si) => si.ItemCode).join(", ");
        return (
          <div
            style={{
              maxWidth: "280px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={codeString}
          >
            {specItemsList.map((si, idx) => (
              <React.Fragment key={si.SpecItemId}>
                <strong style={{ color: "#096dd9" }}>{si.ItemCode}</strong>
                {idx < specItemsList.length - 1 ? ", " : ""}
              </React.Fragment>
            ))}
          </div>
        );
      },
    },
    {
      title: "Có hiệu lực từ",
      dataIndex: "ValidFrom",
      key: "ValidFrom",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Hết hiệu lực vào",
      dataIndex: "ValidTo",
      key: "ValidTo",
      width: 150,
      align: "center" as const,
      render: (validTo?: string | null) =>
        validTo ? (
          validTo
        ) : (
          <span style={{ color: "green" }}>Đang hiệu lực</span>
        ),
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "Status",
      key: "Status",
      width: 150,
      align: "center" as const,
      render: (status?: DocStatus) => {
        const val = status || DocStatus.APPROVED;
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
    {
      title: "Tài liệu",
      key: "File",
      fixed: "right" as const,
      width: 120,
      align: "center" as const,
      render: (record: Spec) => {
        if (!record.FileURL) return "-";
        return (
          <Button
            type="link"
            onClick={() => {
              setSelectedSpecForPdf(record);
              setIsPdfDrawerVisible(true);
            }}
            style={{ padding: 0 }}
          >
            <Space>
              <FilePdfOutlined style={{ color: "#ff4d4f" }} />
              PDF
            </Space>
          </Button>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 120,
      render: (record: Spec) => (
        <Tooltip title="Chi tiết">
          <Button
            type="primary"
            icon={<EyeOutlined style={{ fontSize: "16px" }} />}
            onClick={() => {
              setSelectedDetailSpec(record);
              setIsDetailModalVisible(true);
            }}
          />
        </Tooltip>
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
                Mã Tiêu Chuẩn:
              </div>
              <Input
                placeholder="Nhập mã spec..."
                value={tempSpecCode}
                onChange={(e) => setTempSpecCode(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Tên Tiêu Chuẩn:
              </div>
              <Input
                placeholder="Nhập tên tiêu chuẩn..."
                value={tempSpecName}
                onChange={(e) => setTempSpecName(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Mã QL-One:
              </div>
              <Input
                placeholder="Nhập mã QL-One..."
                value={tempQloneCode}
                onChange={(e) => setTempQloneCode(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Phân loại:
              </div>
              <Select
                value={tempType}
                onChange={(value) => setTempType(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả phân loại</Select.Option>
                <Select.Option value="TCCS">
                  Tiêu chuẩn cơ sở (TCCS)
                </Select.Option>
                <Select.Option value="SPEC">
                  Tiêu chuẩn kỹ thuật (SPEC)
                </Select.Option>
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
                  onClick={() => setIsModalVisible(true)}
                >
                  Thêm tiêu chuẩn
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* 2. Load Table */}
      <AppTable
        dataSource={filteredSpecs}
        columns={columns}
        rowKey="SpecId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} dòng`,
        }}
        bordered
        size="middle"
        scroll={{ x: 1830 }}
      />

      {/* 3. Add Modal */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            Thêm Tiêu Chuẩn Mới
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSpec}
          initialValues={{ SpecType: SpecType.TCCS }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="SpecType"
                label="Phân Loại (SpecType)"
                rules={[
                  { required: true, message: "Vui lòng chọn Phân loại!" },
                ]}
              >
                <Select>
                  <Select.Option value={SpecType.TCCS}>
                    Tiêu chuẩn cơ sở (TCCS)
                  </Select.Option>
                  <Select.Option value={SpecType.SPEC}>
                    Tiêu chuẩn kỹ thuật (SPEC)
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="SpecCode"
                label="Mã Tiêu Chuẩn (SpecCode)"
                rules={[
                  { required: true, message: "Vui lòng nhập Mã tiêu chuẩn!" },
                ]}
              >
                <Input placeholder="Ví dụ: TCCS-FG-004" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="SpecName"
            label="Tên Tiêu Chuẩn"
            rules={[
              { required: true, message: "Vui lòng nhập Tên tiêu chuẩn!" },
            ]}
          >
            <Input placeholder="Ví dụ: Tiêu chuẩn cơ sở nước mắm Chinsu siêu hạng" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="QloneCode" label="Mã QL-One">
                <Input placeholder="Ví dụ: QL1-TCCS-004" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="fileUpload"
            label="Tài liệu đính kèm (PDF)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload.Dragger
              name="files"
              accept=".pdf"
              beforeUpload={() => false}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo thả file PDF vào đây hoặc nhấp để tải lên
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ValidFrom"
                label="Có hiệu lực từ"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hiệu lực!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ValidTo" label="Hết hiệu lực vào">
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="itemCodes"
            label="Vật tư áp dụng (Chọn nhiều ItemCode)"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất một vật tư!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các ItemCode..."
              allowClear
            >
              {items.map((item) => (
                <Select.Option key={item.ItemCode} value={item.ItemCode}>
                  {item.ItemCode} - {item.ItemName} ({item.ItemType})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 4. Details Modal */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <EyeOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Chi tiết Tiêu Chuẩn Sản Phẩm / TCCS
          </span>
        }
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedDetailSpec(null);
          setNestedSearchItemCode("");
          setNestedSearchItemName("");
          setNestedSearchItemType("");
          setNestedSearchBom("");
        }}
        footer={[
          selectedDetailSpec &&
            (selectedDetailSpec.Status === DocStatus.PENDING ||
              !selectedDetailSpec.Status) && (
              <React.Fragment key="qa-actions">
                <Button
                  type="primary"
                  style={{ background: "#52c41a", borderColor: "#52c41a" }}
                  onClick={() => {
                    dispatch(approveSpec(selectedDetailSpec.SpecId));
                    setIsDetailModalVisible(false);
                    setSelectedDetailSpec(null);
                    message.success("Phê duyệt tiêu chuẩn thành công!");
                  }}
                >
                  Phê duyệt
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    dispatch(rejectSpec(selectedDetailSpec.SpecId));
                    setIsDetailModalVisible(false);
                    setSelectedDetailSpec(null);
                    message.error("Từ chối tiêu chuẩn thành công!");
                  }}
                >
                  Từ chối
                </Button>
              </React.Fragment>
            ),
          <Button
            key="close"
            type="default"
            onClick={() => {
              setIsDetailModalVisible(false);
              setSelectedDetailSpec(null);
              setNestedSearchItemCode("");
              setNestedSearchItemName("");
              setNestedSearchItemType("");
              setNestedSearchBom("");
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1200}
      >
        {selectedDetailSpec &&
          (() => {
            const enrichedSpecItems = selectedDetailSpec.SpecItems
              ? selectedDetailSpec.SpecItems.map((specItem) => {
                  const itemDetail = items.find(
                    (it) => it.ItemCode === specItem.ItemCode,
                  );
                  const matchingBoms = boms.filter((bom) => {
                    // Trường hợp 1: Vật tư là một nguyên liệu con trong BOM Lines (BOM con)
                    const isComponent = bom.BomLines?.some(
                      (line) =>
                        line.Selected_SpecId === specItem.SpecId &&
                        line.ErpItemCode === specItem.ItemCode,
                    );
                    if (isComponent) return true;

                    // Trường hợp 2: Vật tư chính là sản phẩm cha của BOM đó (BOM cha - Header level)
                    if (
                      bom.ItemCode === specItem.ItemCode &&
                      bom.Selected_HscbVersionId
                    ) {
                      const parentHscb = hscbs.find((h) =>
                        h.HscbVersions?.some(
                          (v) => v.HscbVersionId === bom.Selected_HscbVersionId,
                        ),
                      );
                      if (parentHscb) {
                        // Hỗ trợ đồng bộ phiên bản (V1, V2...):
                        // 1. Lấy mã Spec cơ sở (bỏ đuôi -V1, -V2)
                        const baseSpecId = parentHscb.SpecId.replace(
                          /-V\d+$/,
                          "",
                        );

                        // 2. Lấy hậu tố phiên bản từ Selected_HscbVersionId (ví dụ: "HSCB-VERSION-002-V2" -> "-V2")
                        const versionMatch =
                          bom.Selected_HscbVersionId.match(/-V(\d+)$/);
                        const versionSuffix = versionMatch
                          ? `-V${versionMatch[1]}`
                          : "-V1";

                        // 3. Kết hợp lại thành SpecId tương ứng của phiên bản hiện hành
                        const targetSpecId = `${baseSpecId}${versionSuffix}`;

                        if (targetSpecId === specItem.SpecId) {
                          return true;
                        }
                      }
                    }
                    return false;
                  });
                  return {
                    ...specItem,
                    ItemName: itemDetail?.ItemName || "Chưa có tên vật tư",
                    ItemType: itemDetail?.ItemType || "N/A",
                    UoM: itemDetail?.UoM || "N/A",
                    matchingBoms,
                  };
                })
              : [];

            const filteredEnrichedItems = enrichedSpecItems.filter((item) => {
              const matchCode = item.ItemCode.toLowerCase().includes(
                nestedSearchItemCode.toLowerCase(),
              );
              const matchName = item.ItemName.toLowerCase().includes(
                nestedSearchItemName.toLowerCase(),
              );
              const matchType = item.ItemType.toLowerCase().includes(
                nestedSearchItemType.toLowerCase(),
              );
              const matchBom = nestedSearchBom
                ? item.matchingBoms.some(
                    (bom) =>
                      bom.BomId.toLowerCase().includes(
                        nestedSearchBom.toLowerCase(),
                      ) ||
                      bom.ItemCode.toLowerCase().includes(
                        nestedSearchBom.toLowerCase(),
                      ),
                  )
                : true;
              return matchCode && matchName && matchType && matchBom;
            });

            const matchingHscbs = hscbs.filter(
              (h) => h.SpecId === selectedDetailSpec.SpecId,
            );
            const hscbVersionsList = matchingHscbs.flatMap((hscb) => {
              return (hscb.HscbVersions || []).map((version) => ({
                ...version,
                HscbCode: hscb.HscbCode,
              }));
            });
            const sortedHscbVersions = [...hscbVersionsList].sort((a, b) => {
              return dayjs(b.ValidFrom).unix() - dayjs(a.ValidFrom).unix();
            });

            const getHscbVersionStatus = (version: any) => {
              const today = dayjs().startOf("day");
              const validFrom = dayjs(version.ValidFrom).startOf("day");
              const validTo = version.ValidTo
                ? dayjs(version.ValidTo).startOf("day")
                : null;

              if (validFrom.isAfter(today)) {
                return { text: "Chưa hiệu lực", color: "blue" };
              }
              if (validTo && validTo.isBefore(today)) {
                return { text: "Hết hiệu lực", color: "red" };
              }
              return { text: "Đang hiệu lực", color: "green" };
            };

            const hscbColumns = [
              {
                title: "Mã Hồ Sơ",
                dataIndex: "HscbCode",
                key: "HscbCode",
                width: 150,
                render: (text: string) => (
                  <strong style={{ color: "#096dd9" }}>{text}</strong>
                ),
              },
              {
                title: "Phiên Bản",
                dataIndex: "VersionName",
                key: "VersionName",
                render: (text: string) => <strong>{text}</strong>,
              },
              {
                title: "Vật tư áp dụng",
                dataIndex: "HscbItems",
                key: "HscbItems",
                render: (hscbItems?: any[]) => {
                  if (!hscbItems || hscbItems.length === 0) return "-";
                  return (
                    <Space size={[4, 4]} wrap>
                      {hscbItems.map((item) => (
                        <Tag key={item.HscbItemId} color="cyan">
                          {item.ItemCode}
                        </Tag>
                      ))}
                    </Space>
                  );
                },
              },
              {
                title: "Hiệu lực từ",
                dataIndex: "ValidFrom",
                key: "ValidFrom",
                width: 120,
                render: (date: any) => renderDate(date),
              },
              {
                title: "Hết hiệu lực vào",
                dataIndex: "ValidTo",
                key: "ValidTo",
                width: 130,
                render: (date: any) =>
                  date ? (
                    renderDate(date)
                  ) : (
                    <span style={{ color: "green" }}>
                      Đang hiệu lực / Vô thời hạn
                    </span>
                  ),
              },
              {
                title: "Trạng thái",
                key: "status",
                width: 130,
                render: (record: any) => {
                  const statusInfo = getHscbVersionStatus(record);
                  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
                },
              },
              {
                title: "Tài liệu",
                dataIndex: "FileURL",
                key: "FileURL",
                width: 150,
                render: (fileUrl: string, record: any) => {
                  if (!fileUrl) return "-";
                  const parentHscb = matchingHscbs.find(
                    (h) => h.HscbId === record.HscbId,
                  );
                  return (
                    <Button
                      type="link"
                      onClick={() => {
                        if (parentHscb) {
                          setSelectedHscbForPdf(parentHscb);
                          setIsHscbPdfDrawerVisible(true);
                        }
                      }}
                      style={{ padding: 0 }}
                    >
                      <Space>
                        <FilePdfOutlined style={{ color: "#ff4d4f" }} />
                        {fileUrl.split("/").pop()}
                      </Space>
                    </Button>
                  );
                },
              },
            ];

            const nestedColumns = [
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Mã vật tư</div>
                    <Input
                      placeholder="Lọc mã..."
                      prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                      value={nestedSearchItemCode}
                      onChange={(e) => setNestedSearchItemCode(e.target.value)}
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
                dataIndex: "ItemCode",
                key: "ItemCode",
                width: 170,
                render: (text: string) => (
                  <strong style={{ color: "#096dd9" }}>{text}</strong>
                ),
              },
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Tên vật tư</div>
                    <Input
                      placeholder="Lọc tên..."
                      prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                      value={nestedSearchItemName}
                      onChange={(e) => setNestedSearchItemName(e.target.value)}
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
                dataIndex: "ItemName",
                key: "ItemName",
                render: (text: string) => <strong>{text}</strong>,
              },
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Phân loại</div>
                    <Select
                      placeholder="Lọc loại..."
                      value={nestedSearchItemType || undefined}
                      onChange={(value) => setNestedSearchItemType(value || "")}
                      style={{
                        marginTop: 6,
                        fontWeight: "normal",
                        width: "100%",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      allowClear
                    >
                      {Object.entries(ItemTypeConfig).map(([key, config]) => (
                        <Select.Option key={key} value={key}>
                          {config.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                ),
                dataIndex: "ItemType",
                key: "ItemType",
                width: 230,
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
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>Đơn vị tính</div>
                    <div style={{ height: 32, marginTop: 6 }} />
                  </div>
                ),
                dataIndex: "UoM",
                key: "UoM",
                width: 100,
              },
              {
                title: (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>BOM đang áp dụng</div>
                    <Input
                      placeholder="Lọc BOM..."
                      prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                      value={nestedSearchBom}
                      onChange={(e) => setNestedSearchBom(e.target.value)}
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
                dataIndex: "matchingBoms",
                key: "matchingBoms",
                width: 250,
                align: "center" as const,
                render: (matchingBomsList?: any[]) => {
                  if (!matchingBomsList || matchingBomsList.length === 0)
                    return "-";
                  return (
                    <Space size="middle">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "#1890ff",
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {matchingBomsList.length}
                      </span>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          setSelectedBomsForDetailModal(matchingBomsList);
                          setIsBomsDetailModalVisible(true);
                        }}
                        style={{ padding: 0 }}
                      >
                        Chi tiết
                      </Button>
                    </Space>
                  );
                },
              },
            ];

            return (
              <div style={{ marginTop: "15px" }}>
                <Descriptions
                  bordered
                  size="small"
                  column={2}
                  style={{ marginBottom: "20px" }}
                >
                  <Descriptions.Item label="Mã Tiêu Chuẩn" span={2}>
                    <strong style={{ color: "#096dd9" }}>
                      {selectedDetailSpec.SpecCode}
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên Tiêu Chuẩn" span={2}>
                    <strong>{selectedDetailSpec.SpecName}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phân Loại">
                    {selectedDetailSpec.SpecType === "TCCS" ? (
                      <Tag color="blue">Tiêu chuẩn cơ sở (TCCS)</Tag>
                    ) : (
                      <Tag color="purple">Tiêu chuẩn kỹ thuật (SPEC)</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã QL-One">
                    {selectedDetailSpec.QloneCode ? (
                      <strong style={{ color: "#096dd9" }}>
                        {selectedDetailSpec.QloneCode}
                      </strong>
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hiệu lực từ">
                    {renderDate(selectedDetailSpec.ValidFrom)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hiệu lực đến">
                    {selectedDetailSpec.ValidTo ? (
                      renderDate(selectedDetailSpec.ValidTo)
                    ) : (
                      <span style={{ color: "green" }}>
                        Đang hiệu lực / Vô thời hạn
                      </span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái duyệt" span={2}>
                    {(() => {
                      const val =
                        selectedDetailSpec.Status || DocStatus.APPROVED;
                      switch (val) {
                        case DocStatus.APPROVED:
                          return <Tag color="success">Đã duyệt</Tag>;
                        case DocStatus.REJECTED:
                          return <Tag color="error">Từ chối</Tag>;
                        default:
                          return <Tag color="warning">Chờ duyệt</Tag>;
                      }
                    })()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tài liệu PDF" span={2}>
                    {selectedDetailSpec.FileURL ? (
                      <Button
                        type="link"
                        onClick={() => {
                          setSelectedSpecForPdf(selectedDetailSpec);
                          setIsPdfDrawerVisible(true);
                        }}
                        style={{ padding: 0 }}
                      >
                        <Space>
                          <FilePdfOutlined style={{ color: "#ff4d4f" }} />
                          Xem tài liệu tiêu chuẩn (
                          {selectedDetailSpec.FileURL.split("/").pop()})
                        </Space>
                      </Button>
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>
                </Descriptions>

                <Divider
                  orientation={"left" as any}
                  style={{ margin: "20px 0 10px 0" }}
                >
                  Danh sách vật tư áp dụng tiêu chuẩn
                </Divider>

                {enrichedSpecItems.length > 0 ? (
                  <AppTable
                    dataSource={filteredEnrichedItems}
                    columns={nestedColumns}
                    rowKey="SpecItemId"
                    size="middle"
                    bordered
                    scroll={{ x: 950 }}
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "20"],
                      showTotal: (total) => `Tổng cộng ${total} vật tư`,
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "12px", color: "#999" }}>
                    Không có vật tư nào được gán
                  </span>
                )}

                <Divider
                  orientation={"left" as any}
                  style={{ margin: "20px 0 10px 0" }}
                >
                  Danh sách Hồ sơ tự công bố (HSCB) đang áp dụng
                </Divider>

                {sortedHscbVersions.length > 0 ? (
                  <AppTable
                    dataSource={sortedHscbVersions}
                    columns={hscbColumns}
                    rowKey="HscbVersionId"
                    size="middle"
                    bordered
                    scroll={{ x: 1050 }}
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "20"],
                      showTotal: (total) => `Tổng cộng ${total} phiên bản HSCB`,
                    }}
                    style={{ marginBottom: "20px" }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      display: "block",
                      marginBottom: "20px",
                    }}
                  >
                    Không có hồ sơ công bố nào được gán cho tiêu chuẩn này
                  </span>
                )}
              </div>
            );
          })()}
      </Modal>

      {/* 4a. Applied BOMs Detail Modal */}
      <Modal
        title={
          <span style={{ fontSize: "16px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            Danh sách công thức (BOM) áp dụng cho vật tư
          </span>
        }
        open={isBomsDetailModalVisible}
        onCancel={() => {
          setIsBomsDetailModalVisible(false);
          setSelectedBomsForDetailModal(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsBomsDetailModalVisible(false);
              setSelectedBomsForDetailModal(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={650}
      >
        <AppTable
          dataSource={selectedBomsForDetailModal || []}
          columns={[
            {
              title: "Mã BOM",
              dataIndex: "BomId",
              key: "BomId",
              render: (text: string) => (
                <strong style={{ color: "#1890ff" }}>{text}</strong>
              ),
            },
            {
              title: "Sản phẩm cha",
              dataIndex: "ItemCode",
              key: "ItemCode",
              render: (text: string) => <strong>{text}</strong>,
            },
            {
              title: "Phiên bản (BOM / ERP)",
              key: "version",
              render: (record: any) =>
                `${record.Version || "N/A"} / ${record.ErpVersion || "N/A"}`,
            },
            {
              title: "Hiệu lực từ",
              dataIndex: "ValidFrom",
              key: "ValidFrom",
              render: (date: any) => renderDate(date),
            },
          ]}
          rowKey="BomId"
          pagination={false}
          size="middle"
          bordered
        />
      </Modal>

      {/* 5. PDF Viewer Drawer */}
      <Drawer
        title={
          <span style={{ display: "flex", alignItems: "center" }}>
            <FilePdfOutlined
              style={{ color: "#ff4d4f", marginRight: 8, fontSize: "20px" }}
            />
            Xem Tài Liệu Tiêu Chuẩn -{" "}
            <strong style={{ color: "#096dd9", marginLeft: 4 }}>
              {selectedSpecForPdf?.SpecCode}
            </strong>
          </span>
        }
        placement="right"
        width={750}
        onClose={() => {
          setIsPdfDrawerVisible(false);
          setSelectedSpecForPdf(null);
        }}
        open={isPdfDrawerVisible}
        destroyOnClose
        styles={{
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "#f0f2f5",
          },
        }}
      >
        {selectedSpecForPdf &&
          (() => {
            const day = dayjs(selectedSpecForPdf.ValidFrom).format("DD");
            const month = dayjs(selectedSpecForPdf.ValidFrom).format("MM");
            const year = dayjs(selectedSpecForPdf.ValidFrom).format("YYYY");
            const paperWidth = 650 * (pdfZoom / 100);

            return (
              <>
                {/* PDF Toolbar */}
                <div
                  style={{
                    background: "#ffffff",
                    padding: "10px 24px",
                    borderBottom: "1px solid #d9d9d9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#262626",
                    }}
                  >
                    {selectedSpecForPdf.SpecCode}.pdf
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      icon={<ZoomOutOutlined />}
                      onClick={() =>
                        setPdfZoom((prev) => Math.max(50, prev - 10))
                      }
                      disabled={pdfZoom <= 50}
                      size="small"
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        minWidth: "45px",
                        textAlign: "center",
                      }}
                    >
                      {pdfZoom}%
                    </span>
                    <Button
                      icon={<ZoomInOutlined />}
                      onClick={() =>
                        setPdfZoom((prev) => Math.min(150, prev + 10))
                      }
                      disabled={pdfZoom >= 150}
                      size="small"
                    />
                  </div>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleDownloadFakePdf}
                      type="primary"
                      ghost
                      size="small"
                    >
                      Tải xuống
                    </Button>
                    <Button
                      icon={<PrinterOutlined />}
                      onClick={handlePrintFakePdf}
                      size="small"
                    >
                      In
                    </Button>
                  </Space>
                </div>

                {/* PDF Canvas View Area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "40px 20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    background: "#525659",
                  }}
                >
                  {/* A4 Page Container */}
                  <div
                    style={{
                      width: `${paperWidth}px`,
                      minHeight: `${paperWidth * 1.414}px`,
                      padding: `${48 * (pdfZoom / 100)}px ${40 * (pdfZoom / 100)}px`,
                      background: "#ffffff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      transition: "all 0.1s ease",
                      fontFamily: "Times New Roman, serif",
                      position: "relative",
                      color: "#111111",
                      fontSize: `${13 * (pdfZoom / 100)}px`,
                      lineHeight: 1.5,
                    }}
                  >
                    {/* Watermark */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-35deg)",
                        fontSize: `${45 * (pdfZoom / 100)}px`,
                        color: "rgba(0, 0, 0, 0.035)",
                        fontWeight: "bold",
                        letterSpacing: "5px",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        zIndex: 1,
                        userSelect: "none",
                      }}
                    >
                      MASAN CONSUMER
                    </div>

                    {/* Header Grid */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: `${24 * (pdfZoom / 100)}px`,
                        borderBottom: `${1 * (pdfZoom / 100)}px solid #ddd`,
                        paddingBottom: `${12 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div style={{ textAlign: "center", width: "45%" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                          }}
                        >
                          CÔNG TY CỔ PHẦN HÀNG TIÊU DÙNG MASAN
                        </div>
                        <div
                          style={{
                            fontSize: `${9 * (pdfZoom / 100)}px`,
                            color: "#555",
                          }}
                        >
                          Bộ phận Quản lý Chất lượng QA
                        </div>
                        <div
                          style={{
                            width: `${60 * (pdfZoom / 100)}px`,
                            height: "1px",
                            background: "#333",
                            margin: "4px auto 0 auto",
                          }}
                        ></div>
                      </div>
                      <div style={{ textAlign: "center", width: "50%" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                          }}
                        >
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          Độc lập - Tự do - Hạnh phúc
                        </div>
                        <div
                          style={{
                            width: `${80 * (pdfZoom / 100)}px`,
                            height: "1px",
                            background: "#333",
                            margin: "4px auto 0 auto",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Document Title */}
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: `${30 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          fontSize: `${18 * (pdfZoom / 100)}px`,
                          fontFamily: "Times New Roman, serif",
                          color: "#000",
                        }}
                      >
                        {selectedSpecForPdf.SpecType === "TCCS"
                          ? "BẢN TIÊU CHUẨN CƠ SỞ"
                          : "BẢN TIÊU CHUẨN KỸ THUẬT SẢN PHẨM"}
                      </h2>
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: `${12 * (pdfZoom / 100)}px`,
                          marginTop: `${4 * (pdfZoom / 100)}px`,
                        }}
                      >
                        Số: {selectedSpecForPdf.SpecCode} / TCCS-MSN
                      </div>
                    </div>

                    {/* Section I */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        I. Quy định chung & Thông tin tiêu chuẩn
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div>
                          - Mã tiêu chuẩn:{" "}
                          <strong>{selectedSpecForPdf.SpecCode}</strong>
                        </div>
                        <div>
                          - Tên tiêu chuẩn:{" "}
                          <strong style={{ textTransform: "uppercase" }}>
                            {selectedSpecForPdf.SpecName}
                          </strong>
                        </div>
                        <div>
                          - Phân loại tiêu chuẩn:{" "}
                          <strong>
                            {selectedSpecForPdf.SpecType === "TCCS"
                              ? "Tiêu chuẩn cơ sở (TCCS)"
                              : "Tiêu chuẩn kỹ thuật (SPEC)"}
                          </strong>
                        </div>
                        {selectedSpecForPdf.QloneCode && (
                          <div>
                            - Mã quản lý QL-One:{" "}
                            <strong>{selectedSpecForPdf.QloneCode}</strong>
                          </div>
                        )}
                        <div>
                          - Ngày ban hành hiệu lực:{" "}
                          <strong>
                            {renderDate(selectedSpecForPdf.ValidFrom)}
                          </strong>{" "}
                          {selectedSpecForPdf.ValidTo
                            ? `đến ngày ${renderDate(selectedSpecForPdf.ValidTo)}`
                            : "vô thời hạn"}
                        </div>
                      </div>
                    </div>

                    {/* Section II */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        II. Danh sách nguyên vật liệu / sản phẩm áp dụng tiêu
                        chuẩn
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: `${6 * (pdfZoom / 100)}px`,
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                          }}
                        >
                          <thead>
                            <tr style={{ background: "#f5f5f5" }}>
                              <th
                                style={{
                                  border: `${1 * (pdfZoom / 100)}px solid #000`,
                                  padding: `${4 * (pdfZoom / 100)}px`,
                                  textAlign: "center",
                                  width: "8%",
                                }}
                              >
                                STT
                              </th>
                              <th
                                style={{
                                  border: `${1 * (pdfZoom / 100)}px solid #000`,
                                  padding: `${4 * (pdfZoom / 100)}px`,
                                  textAlign: "left",
                                  width: "25%",
                                }}
                              >
                                Mã vật tư
                              </th>
                              <th
                                style={{
                                  border: `${1 * (pdfZoom / 100)}px solid #000`,
                                  padding: `${4 * (pdfZoom / 100)}px`,
                                  textAlign: "left",
                                  width: "42%",
                                }}
                              >
                                Tên vật tư
                              </th>
                              <th
                                style={{
                                  border: `${1 * (pdfZoom / 100)}px solid #000`,
                                  padding: `${4 * (pdfZoom / 100)}px`,
                                  textAlign: "left",
                                  width: "15%",
                                }}
                              >
                                Phân loại
                              </th>
                              <th
                                style={{
                                  border: `${1 * (pdfZoom / 100)}px solid #000`,
                                  padding: `${4 * (pdfZoom / 100)}px`,
                                  textAlign: "center",
                                  width: "10%",
                                }}
                              >
                                ĐVT
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSpecForPdf.SpecItems &&
                            selectedSpecForPdf.SpecItems.length > 0 ? (
                              selectedSpecForPdf.SpecItems.map(
                                (specItem, index) => {
                                  const itemDetail = items.find(
                                    (it) => it.ItemCode === specItem.ItemCode,
                                  );
                                  return (
                                    <tr key={specItem.SpecItemId}>
                                      <td
                                        style={{
                                          border: `${1 * (pdfZoom / 100)}px solid #000`,
                                          padding: `${4 * (pdfZoom / 100)}px`,
                                          textAlign: "center",
                                        }}
                                      >
                                        {index + 1}
                                      </td>
                                      <td
                                        style={{
                                          border: `${1 * (pdfZoom / 100)}px solid #000`,
                                          padding: `${4 * (pdfZoom / 100)}px`,
                                        }}
                                      >
                                        <strong style={{ color: "#096dd9" }}>
                                          {specItem.ItemCode}
                                        </strong>
                                      </td>
                                      <td
                                        style={{
                                          border: `${1 * (pdfZoom / 100)}px solid #000`,
                                          padding: `${4 * (pdfZoom / 100)}px`,
                                        }}
                                      >
                                        {itemDetail?.ItemName || "N/A"}
                                      </td>
                                      <td
                                        style={{
                                          border: `${1 * (pdfZoom / 100)}px solid #000`,
                                          padding: `${4 * (pdfZoom / 100)}px`,
                                        }}
                                      >
                                        {itemDetail?.ItemType === "FG"
                                          ? "Thành phẩm (FG)"
                                          : itemDetail?.ItemType === "IP"
                                            ? "Bán thành phẩm (IP)"
                                            : itemDetail?.ItemType === "RM"
                                              ? "Nguyên liệu (RM)"
                                              : itemDetail?.ItemType === "PG"
                                                ? "Bao bì (PG)"
                                                : itemDetail?.ItemType || "N/A"}
                                      </td>
                                      <td
                                        style={{
                                          border: `${1 * (pdfZoom / 100)}px solid #000`,
                                          padding: `${4 * (pdfZoom / 100)}px`,
                                          textAlign: "center",
                                        }}
                                      >
                                        {itemDetail?.UoM || "N/A"}
                                      </td>
                                    </tr>
                                  );
                                },
                              )
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${8 * (pdfZoom / 100)}px`,
                                    textAlign: "center",
                                    color: "#888",
                                  }}
                                >
                                  Không có vật tư áp dụng
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Section III */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        III. Cam kết chất lượng
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div>
                          Chúng tôi cam kết toàn bộ nguyên vật liệu, bán thành
                          phẩm và thành phẩm được sản xuất hoặc sử dụng đều tuân
                          thủ nghiêm ngặt chỉ tiêu kiểm soát quy định trong văn
                          bản tiêu chuẩn cơ sở này. Bộ phận QA/QC có trách nhiệm
                          kiểm tra định kỳ và đột xuất chất lượng sản phẩm trước
                          khi đưa ra lưu thông trên thị trường.
                        </div>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div
                      style={{
                        marginTop: `${35 * (pdfZoom / 100)}px`,
                        display: "flex",
                        justifyContent: "flex-end",
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontStyle: "italic",
                            fontSize: `${12 * (pdfZoom / 100)}px`,
                            marginBottom: `${4 * (pdfZoom / 100)}px`,
                          }}
                        >
                          Bình Dương, ngày {day} tháng {month} năm {year}
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${13 * (pdfZoom / 100)}px`,
                            textTransform: "uppercase",
                          }}
                        >
                          TRƯỞNG BỘ PHẬN ĐẢM BẢO CHẤT LƯỢNG QA
                        </div>
                        <div
                          style={{
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                            fontStyle: "italic",
                            color: "#555",
                            marginBottom: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          (Ký tên và đóng dấu đỏ)
                        </div>

                        {/* Double border red stamp */}
                        <div
                          style={{
                            position: "relative",
                            width: `${110 * (pdfZoom / 100)}px`,
                            height: `${110 * (pdfZoom / 100)}px`,
                            border: `${2.5 * (pdfZoom / 100)}px solid #e02424`,
                            borderRadius: "50%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#e02424",
                            fontSize: `${7 * (pdfZoom / 100)}px`,
                            fontWeight: "bold",
                            textAlign: "center",
                            lineHeight: 1.2,
                            textTransform: "uppercase",
                            opacity: 0.85,
                            transform: "rotate(-3deg)",
                            marginTop: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          <div
                            style={{
                              border: `${1 * (pdfZoom / 100)}px solid #e02424`,
                              borderRadius: "50%",
                              width: "92%",
                              height: "92%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                fontSize: `${6 * (pdfZoom / 100)}px`,
                                position: "absolute",
                                top: `${8 * (pdfZoom / 100)}px`,
                                width: "80%",
                              }}
                            >
                              CÔNG TY CỔ PHẦN
                            </div>
                            <div
                              style={{
                                fontSize: `${8 * (pdfZoom / 100)}px`,
                                fontWeight: "900",
                                margin: `${2 * (pdfZoom / 100)}px 0`,
                              }}
                            >
                              MASAN CONSUMER
                            </div>
                            <div
                              style={{
                                fontSize: `${6 * (pdfZoom / 100)}px`,
                                position: "absolute",
                                bottom: `${8 * (pdfZoom / 100)}px`,
                                width: "80%",
                              }}
                            >
                              TP. HỒ CHÍ MINH
                            </div>
                          </div>
                          {/* Blue Signature */}
                          <div
                            style={{
                              position: "absolute",
                              top: `${25 * (pdfZoom / 100)}px`,
                              left: `${-10 * (pdfZoom / 100)}px`,
                              color: "#1e40af",
                              fontFamily:
                                "'Brush Script MT', 'Dancing Script', cursive",
                              fontSize: `${24 * (pdfZoom / 100)}px`,
                              transform: "rotate(-12deg)",
                              fontWeight: "normal",
                              textShadow: "1px 1px 0px rgba(255,255,255,0.8)",
                            }}
                          >
                            Quang
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
      </Drawer>

      {/* 6. HSCB PDF Viewer Drawer */}
      <Drawer
        title={
          <span style={{ display: "flex", alignItems: "center" }}>
            <FilePdfOutlined
              style={{ color: "#ff4d4f", marginRight: 8, fontSize: "20px" }}
            />
            Xem Tài Liệu Công Bố -{" "}
            <strong style={{ color: "#096dd9", marginLeft: 4 }}>
              {selectedHscbForPdf?.HscbCode}
            </strong>
          </span>
        }
        placement="right"
        width={750}
        onClose={() => {
          setIsHscbPdfDrawerVisible(false);
          setSelectedHscbForPdf(null);
        }}
        open={isHscbPdfDrawerVisible}
        destroyOnClose
        styles={{
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "#f0f2f5",
          },
        }}
      >
        {selectedHscbForPdf &&
          (() => {
            const latestVersion = getLatestHscbVersion(selectedHscbForPdf);
            const spec = specs.find(
              (s) => s.SpecId === selectedHscbForPdf.SpecId,
            );
            const statusInfo = latestVersion
              ? getHscbVersionStatusText(latestVersion)
              : { text: "Không xác định", color: "gray" };
            const validFromDate = latestVersion
              ? dayjs(latestVersion.ValidFrom)
              : dayjs();
            const day = validFromDate.format("DD");
            const month = validFromDate.format("MM");
            const year = validFromDate.format("YYYY");
            const paperWidth = 650 * (pdfZoom / 100);

            return (
              <>
                {/* PDF Toolbar */}
                <div
                  style={{
                    background: "#ffffff",
                    padding: "10px 24px",
                    borderBottom: "1px solid #d9d9d9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#262626",
                    }}
                  >
                    {selectedHscbForPdf.HscbCode}.pdf
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      icon={<ZoomOutOutlined />}
                      onClick={() =>
                        setPdfZoom((prev) => Math.max(50, prev - 10))
                      }
                      disabled={pdfZoom <= 50}
                      size="small"
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        minWidth: "45px",
                        textAlign: "center",
                      }}
                    >
                      {pdfZoom}%
                    </span>
                    <Button
                      icon={<ZoomInOutlined />}
                      onClick={() =>
                        setPdfZoom((prev) => Math.min(150, prev + 10))
                      }
                      disabled={pdfZoom >= 150}
                      size="small"
                    />
                  </div>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleDownloadFakeHscbPdf}
                      type="primary"
                      ghost
                      size="small"
                    >
                      Tải xuống
                    </Button>
                    <Button
                      icon={<PrinterOutlined />}
                      onClick={handlePrintFakeHscbPdf}
                      size="small"
                    >
                      In
                    </Button>
                  </Space>
                </div>

                {/* PDF Canvas View Area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "40px 20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    background: "#525659",
                  }}
                >
                  {/* A4 Page Container */}
                  <div
                    style={{
                      width: `${paperWidth}px`,
                      minHeight: `${paperWidth * 1.414}px`,
                      padding: `${48 * (pdfZoom / 100)}px ${40 * (pdfZoom / 100)}px`,
                      background: "#ffffff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      transition: "all 0.1s ease",
                      fontFamily: "Times New Roman, serif",
                      position: "relative",
                      color: "#111111",
                      fontSize: `${13 * (pdfZoom / 100)}px`,
                      lineHeight: 1.5,
                    }}
                  >
                    {/* Watermark */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-35deg)",
                        fontSize: `${45 * (pdfZoom / 100)}px`,
                        color: "rgba(0, 0, 0, 0.035)",
                        fontWeight: "bold",
                        letterSpacing: "5px",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        zIndex: 1,
                        userSelect: "none",
                      }}
                    >
                      MASAN CONSUMER
                    </div>

                    {/* Header Grid */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: `${24 * (pdfZoom / 100)}px`,
                        borderBottom: `${1 * (pdfZoom / 100)}px solid #ddd`,
                        paddingBottom: `${12 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div style={{ textAlign: "center", width: "45%" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                          }}
                        >
                          CÔNG TY CỔ PHẦN HÀNG TIÊU DÙNG MASAN
                        </div>
                        <div
                          style={{
                            fontSize: `${9 * (pdfZoom / 100)}px`,
                            color: "#555",
                          }}
                        >
                          Số công bố: {selectedHscbForPdf.HscbCode}
                        </div>
                        <div
                          style={{
                            width: `${60 * (pdfZoom / 100)}px`,
                            height: "1px",
                            background: "#333",
                            margin: "4px auto 0 auto",
                          }}
                        ></div>
                      </div>
                      <div style={{ textAlign: "center", width: "50%" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                          }}
                        >
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          Độc lập - Tự do - Hạnh phúc
                        </div>
                        <div
                          style={{
                            width: `${80 * (pdfZoom / 100)}px`,
                            height: "1px",
                            background: "#333",
                            margin: "4px auto 0 auto",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Document Title */}
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: `${30 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          fontSize: `${18 * (pdfZoom / 100)}px`,
                          fontFamily: "Times New Roman, serif",
                          color: "#000",
                        }}
                      >
                        BẢN TỰ CÔNG BỐ SẢN PHẨM
                      </h2>
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: `${12 * (pdfZoom / 100)}px`,
                          marginTop: `${4 * (pdfZoom / 100)}px`,
                        }}
                      >
                        Số: {selectedHscbForPdf.HscbCode} / MSN-HSCB
                      </div>
                    </div>

                    {/* Section I */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        I. Thông tin về tổ chức, cá nhân tự công bố sản phẩm
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div>
                          - Tên tổ chức, cá nhân:{" "}
                          <strong style={{ textTransform: "uppercase" }}>
                            Công ty Cổ phần Hàng tiêu dùng Masan
                          </strong>
                        </div>
                        <div>
                          - Địa chỉ: Tầng 12, Tòa nhà MPlaza Saigon, 39 Lê Duẩn,
                          Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt
                          Nam.
                        </div>
                        <div>
                          - Điện thoại: 028 6256 3862 &nbsp;&nbsp;|&nbsp;&nbsp;
                          Fax: 028 6256 3863
                        </div>
                        <div>- Email: info@masanconsumer.com</div>
                        <div>
                          - Mã số doanh nghiệp: 0305001234 do Sở Kế hoạch và Đầu
                          tư TP. Hồ Chí Minh cấp đăng ký lần đầu ngày
                          31/05/2007.
                        </div>
                      </div>
                    </div>

                    {/* Section II */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        II. Thông tin về sản phẩm
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div>
                          - Tên sản phẩm:{" "}
                          <strong>
                            {spec ? spec.SpecName : "Chưa liên kết"}
                          </strong>
                        </div>
                        <div>
                          - Tiêu chuẩn cơ sở áp dụng:{" "}
                          <strong>{spec ? spec.SpecCode : "N/A"}</strong>
                        </div>
                        <div>
                          - Phiên bản hồ sơ:{" "}
                          <strong>
                            {latestVersion ? latestVersion.VersionName : "N/A"}
                          </strong>
                        </div>
                        <div>
                          - Trạng thái hiệu lực:{" "}
                          <span
                            style={{
                              color:
                                statusInfo.color === "green"
                                  ? "#52c41a"
                                  : statusInfo.color === "red"
                                    ? "#ff4d4f"
                                    : "#1890ff",
                              fontWeight: "bold",
                            }}
                          >
                            {statusInfo.text}
                          </span>{" "}
                          (Từ{" "}
                          {latestVersion
                            ? renderDate(latestVersion.ValidFrom)
                            : ""}{" "}
                          {latestVersion?.ValidTo
                            ? `đến ${renderDate(latestVersion.ValidTo)}`
                            : "vô thời hạn"}
                          )
                        </div>

                        <div style={{ marginTop: `${10 * (pdfZoom / 100)}px` }}>
                          <div
                            style={{
                              fontWeight: "bold",
                              marginBottom: `${4 * (pdfZoom / 100)}px`,
                            }}
                          >
                            - Danh sách mã vật tư / sản phẩm liên kết áp dụng hồ
                            sơ tự công bố này:
                          </div>

                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              marginTop: `${6 * (pdfZoom / 100)}px`,
                              fontSize: `${11 * (pdfZoom / 100)}px`,
                            }}
                          >
                            <thead>
                              <tr style={{ background: "#f5f5f5" }}>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "center",
                                    width: "8%",
                                  }}
                                >
                                  STT
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "left",
                                    width: "25%",
                                  }}
                                >
                                  Mã vật tư
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "left",
                                    width: "42%",
                                  }}
                                >
                                  Tên vật tư
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "left",
                                    width: "15%",
                                  }}
                                >
                                  Phân loại
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "center",
                                    width: "10%",
                                  }}
                                >
                                  ĐVT
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {latestVersion?.HscbItems &&
                              latestVersion.HscbItems.length > 0 ? (
                                latestVersion.HscbItems.map(
                                  (hscbItem: any, index: number) => {
                                    const itemDetail = items.find(
                                      (it) => it.ItemCode === hscbItem.ItemCode,
                                    );
                                    return (
                                      <tr key={hscbItem.HscbItemId}>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                            textAlign: "center",
                                          }}
                                        >
                                          {index + 1}
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                          }}
                                        >
                                          <strong style={{ color: "#096dd9" }}>
                                            {hscbItem.ItemCode}
                                          </strong>
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                          }}
                                        >
                                          {itemDetail?.ItemName || "N/A"}
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                          }}
                                        >
                                          {ItemTypeConfig[
                                            itemDetail?.ItemType as ItemType
                                          ]?.label ||
                                            itemDetail?.ItemType ||
                                            "N/A"}
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                            textAlign: "center",
                                          }}
                                        >
                                          {itemDetail?.UoM || "N/A"}
                                        </td>
                                      </tr>
                                    );
                                  },
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan={5}
                                    style={{
                                      border: `${1 * (pdfZoom / 100)}px solid #000`,
                                      padding: `${8 * (pdfZoom / 100)}px`,
                                      textAlign: "center",
                                      color: "#888",
                                    }}
                                  >
                                    Không có vật tư áp dụng
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Section III */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        III. Ngoại quan & Bản cam kết chất lượng
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div
                          style={{
                            fontStyle: "italic",
                            marginBottom: `${4 * (pdfZoom / 100)}px`,
                          }}
                        >
                          Chúng tôi cam kết sản phẩm được sản xuất và đóng gói
                          đúng theo Tiêu chuẩn cơ sở áp dụng số{" "}
                          <strong>{spec ? spec.SpecCode : "N/A"}</strong>, tuân
                          thủ các quy định về giới hạn chỉ tiêu an toàn và vệ
                          sinh thực phẩm hiện hành của Bộ Y tế Việt Nam.
                        </div>
                        <div>
                          Chúng tôi xin hoàn toàn chịu trách nhiệm trước pháp
                          luật về tính chính xác, trung thực của hồ sơ tự công
                          bố này và cam kết đảm bảo sản phẩm lưu thông trên thị
                          trường đạt chất lượng ổn định.
                        </div>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div
                      style={{
                        marginTop: `${30 * (pdfZoom / 100)}px`,
                        display: "flex",
                        justifyContent: "flex-end",
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontStyle: "italic",
                            fontSize: `${12 * (pdfZoom / 100)}px`,
                            marginBottom: `${4 * (pdfZoom / 100)}px`,
                          }}
                        >
                          TP. Hồ Chí Minh, ngày {day} tháng {month} năm {year}
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${13 * (pdfZoom / 100)}px`,
                            textTransform: "uppercase",
                          }}
                        >
                          ĐẠI DIỆN TỔ CHỨC, CÁ NHÂN
                        </div>
                        <div
                          style={{
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                            fontStyle: "italic",
                            color: "#555",
                            marginBottom: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          (Ký tên và đóng dấu đỏ)
                        </div>

                        {/* Double border stamp */}
                        <div
                          style={{
                            position: "relative",
                            width: `${110 * (pdfZoom / 100)}px`,
                            height: `${110 * (pdfZoom / 100)}px`,
                            border: `${2.5 * (pdfZoom / 100)}px solid #e02424`,
                            borderRadius: "50%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#e02424",
                            fontSize: `${7 * (pdfZoom / 100)}px`,
                            fontWeight: "bold",
                            textAlign: "center",
                            lineHeight: 1.2,
                            textTransform: "uppercase",
                            opacity: 0.85,
                            transform: "rotate(-3deg)",
                            marginTop: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          <div
                            style={{
                              border: `${1 * (pdfZoom / 100)}px solid #e02424`,
                              borderRadius: "50%",
                              width: "92%",
                              height: "92%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                fontSize: `${6 * (pdfZoom / 100)}px`,
                                position: "absolute",
                                top: `${8 * (pdfZoom / 100)}px`,
                                width: "80%",
                              }}
                            >
                              CÔNG TY CỔ PHẦN
                            </div>
                            <div
                              style={{
                                fontSize: `${8 * (pdfZoom / 100)}px`,
                                fontWeight: "900",
                                margin: `${2 * (pdfZoom / 100)}px 0`,
                              }}
                            >
                              MASAN CONSUMER
                            </div>
                            <div
                              style={{
                                fontSize: `${6 * (pdfZoom / 100)}px`,
                                position: "absolute",
                                bottom: `${8 * (pdfZoom / 100)}px`,
                                width: "80%",
                              }}
                            >
                              TP. HỒ CHÍ MINH
                            </div>
                          </div>
                          {/* Blue Signature Overlapping */}
                          <div
                            style={{
                              position: "absolute",
                              top: `${25 * (pdfZoom / 100)}px`,
                              left: `${-10 * (pdfZoom / 100)}px`,
                              color: "#1e40af",
                              fontFamily:
                                "'Brush Script MT', 'Dancing Script', cursive",
                              fontSize: `${24 * (pdfZoom / 100)}px`,
                              transform: "rotate(-12deg)",
                              fontWeight: "normal",
                              textShadow: "1px 1px 0px rgba(255,255,255,0.8)",
                            }}
                          >
                            Quang
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
      </Drawer>
    </div>
  );
};

export default SpecList;
