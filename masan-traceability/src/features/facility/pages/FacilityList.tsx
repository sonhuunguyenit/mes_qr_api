import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Space,
  Tag,
  Tooltip,
  Divider,
  message,
  Row,
  Col,
  Descriptions,
  Drawer,
  Collapse,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  FilePdfOutlined,
  InboxOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  SearchOutlined,
  ReloadOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AppTable } from "../../../components";
import { PRIMARY_COLOR } from "../../../contants";
import {
  Facility,
  Facility_License,
  FacilityType,
  LicenseType,
} from "../types";
import { addFacility, updateFacility } from "../store/facilitySlice";

export const FacilityList: React.FC = () => {
  const dispatch = useAppDispatch();
  const facilities = useAppSelector((state) => state.facility.facilities);

  // Filter states
  const [tempCode, setTempCode] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempType, setTempType] = useState<string>("ALL");

  const [filterCode, setFilterCode] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // PDF Preview states
  const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");

  const handleSearch = () => {
    setFilterCode(tempCode);
    setFilterName(tempName);
    setFilterType(tempType);
  };

  const handleReset = () => {
    setTempCode("");
    setTempName("");
    setTempType("ALL");
    setFilterCode("");
    setFilterName("");
    setFilterType("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };

  // Filter logic
  const filteredFacilities = facilities.filter((f) => {
    const matchesCode = f.FacilityCode.toLowerCase().includes(filterCode.toLowerCase().trim());
    const matchesName = f.FacilityName.toLowerCase().includes(filterName.toLowerCase().trim());
    const matchesType = filterType === "ALL" || f.FacilityType === filterType;
    return matchesCode && matchesName && matchesType;
  });

  // Large Modal states (Facility)
  const [isLargeModalVisible, setIsLargeModalVisible] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "update">("create");
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [tempLicenses, setTempLicenses] = useState<Facility_License[]>([]);
  const [largeForm] = Form.useForm();

  const [selectedHistoryFacility, setSelectedHistoryFacility] = useState<Facility | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  const getMockFacilityHistoryData = (record: Facility) => {
    return [
      {
        key: "1",
        time: "2026-06-15 08:30",
        user: "Phạm Minh Trí (Legal Counsel)",
        type: "Khởi tạo Pháp nhân",
        details: `Đăng ký hồ sơ pháp lý doanh nghiệp cho cơ sở "${record.FacilityName}" (Mã: ${record.FacilityCode}). Đính kèm bản quét Giấy phép kinh doanh GPKD.`,
        status: "APPROVED",
        approver: "Hồ Hoàng Long (QA Officer)",
        approveTime: "2026-06-15 11:30",
      },
      {
        key: "2",
        time: "2026-07-05 15:45",
        user: "Phạm Minh Trí (Legal Counsel)",
        type: "Cập nhật Giấy phép",
        details: `Cập nhật Giấy chứng nhận An toàn vệ sinh thực phẩm ATVSTP hết hạn. Thay đổi ngày hết hiệu lực giấy phép.`,
        status: "APPROVED",
        approver: "Hồ Hoàng Long (QA Officer)",
        approveTime: "2026-07-05 17:30",
      },
      {
        key: "3",
        time: dayjs().subtract(10, "hour").format("YYYY-MM-DD HH:mm"),
        user: "Phạm Minh Trí (Legal Counsel)",
        type: "Điều chỉnh thông tin",
        details: `Đề xuất điều chỉnh thông tin địa chỉ đăng ký kinh doanh chi tiết trên giấy phép kinh doanh của pháp nhân.`,
        status: "PENDING",
        approver: "-",
        approveTime: "-",
      }
    ];
  };

  // Small Modal states (License)
  const [isSmallModalVisible, setIsSmallModalVisible] = useState(false);
  const [licenseEditMode, setLicenseEditMode] = useState<"create" | "update">(
    "create",
  );
  const [editingLicense, setEditingLicense] = useState<Facility_License | null>(
    null,
  );
  const [smallForm] = Form.useForm();
  const [licenseFileList, setLicenseFileList] = useState<any[]>([]);

  // Main table columns
  const mainColumns = [
    {
      title: "Mã Cơ sở",
      dataIndex: "FacilityCode",
      key: "FacilityCode",
      width: 150,
      render: (text: string) => (
        <strong style={{ color: PRIMARY_COLOR }}>{text}</strong>
      ),
    },
    {
      title: "Tên doanh nghiệp / Tên nhà máy",
      dataIndex: "FacilityName",
      key: "FacilityName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Phân loại",
      dataIndex: "FacilityType",
      key: "FacilityType",
      width: 160,
      align: "center" as const,
      render: (type: FacilityType) => {
        if (type === FacilityType.CONG_TY) {
          return (
            <Tag color="blue" icon={<BankOutlined />}>
              Công ty
            </Tag>
          );
        }
        return (
          <Tag color="green" icon={<SafetyCertificateOutlined />}>
            Nhà máy
          </Tag>
        );
      },
    },
    {
      title: "Số lượng giấy phép",
      key: "LicenseCount",
      width: 180,
      align: "center" as const,
      render: (record: Facility) => (
        <Tag color="purple">{record.Licenses?.length || 0} giấy phép</Tag>
      ),
    },
    {
      title: "Tài liệu giấy phép",
      key: "LicensesDocuments",
      width: 320,
      render: (record: Facility) => {
        if (!record.Licenses || record.Licenses.length === 0) return "-";
        return (
          <Space size="small" wrap>
            {record.Licenses.map((lic) => {
              const today = dayjs().startOf("day");
              const validFrom = dayjs(lic.ValidFrom).startOf("day");
              const validTo = lic.ValidTo ? dayjs(lic.ValidTo).startOf("day") : null;
              
              let statusText = "Đang hiệu lực";
              let statusColor = "green";
              
              if (validFrom.isAfter(today)) {
                statusText = "Chưa hiệu lực";
                statusColor = "blue";
              } else if (validTo) {
                if (validTo.isBefore(today)) {
                  statusText = "Đã hết hạn";
                  statusColor = "red";
                } else if (validTo.diff(today, "day") <= 30) {
                  statusText = "Sắp hết hạn";
                  statusColor = "orange";
                }
              }
              
              const label = `${lic.LicenseType === LicenseType.GPKD ? "GPKD" : "ATVSTP"} (${statusText})`;
              return (
                <Tooltip key={lic.LicenseId} title={`Số: ${lic.LicenseNo} | Hiệu lực: ${lic.ValidFrom} ~ ${lic.ValidTo || "Vô thời hạn"}`}>
                  <Tag
                    color={statusColor}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    onClick={() => {
                      setPdfUrl(lic.FileURL || "/files/license_placeholder.pdf");
                      setPdfTitle(`Giấy phép ${lic.LicenseType === LicenseType.GPKD ? "GPKD" : "ATVSTP"}: ${lic.LicenseNo}`);
                      setIsPdfDrawerOpen(true);
                    }}
                  >
                    <FilePdfOutlined />
                    {label}
                  </Tag>
                </Tooltip>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      align: "center" as const,
      render: (record: Facility) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => handleOpenEditFacility(record)}
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
                setSelectedHistoryFacility(record);
                setIsHistoryModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Licenses sub-table columns in Large Modal
  const subColumns = [
    {
      title: "Loại giấy phép",
      dataIndex: "LicenseType",
      key: "LicenseType",
      width: 140,
      render: (type: LicenseType) => (
        <Tag color={type === LicenseType.GPKD ? "orange" : "cyan"}>
          {type === LicenseType.GPKD ? "GPKD" : "ATVSTP"}
        </Tag>
      ),
    },
    {
      title: "Số giấy phép",
      dataIndex: "LicenseNo",
      key: "LicenseNo",
      width: 160,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Địa chỉ trên giấy phép",
      dataIndex: "Address",
      key: "Address",
      ellipsis: true,
      render: (text: string) => (
        <span>
          <EnvironmentOutlined style={{ color: "#bfbfbf", marginRight: 4 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Hiệu lực",
      key: "Validity",
      width: 220,
      render: (record: Facility_License) => {
        const from = record.ValidFrom;
        const to = record.ValidTo ? record.ValidTo : "Vô thời hạn";
        return (
          <span style={{ fontSize: "12px" }}>
            {from} ~ {to}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "ValidityStatus",
      width: 140,
      align: "center" as const,
      render: (record: Facility_License) => {
        const today = dayjs().startOf("day");
        const validFrom = dayjs(record.ValidFrom).startOf("day");
        const validTo = record.ValidTo ? dayjs(record.ValidTo).startOf("day") : null;

        if (validFrom.isAfter(today)) {
          return <Tag color="blue">Chưa hiệu lực</Tag>;
        }
        if (validTo) {
          if (validTo.isBefore(today)) {
            return <Tag color="red">Đã hết hạn</Tag>;
          }
          if (validTo.diff(today, "day") <= 30) {
            return <Tag color="orange">Sắp hết hạn</Tag>;
          }
        }
        return <Tag color="green">Đang hiệu lực</Tag>;
      },
    },
    {
      title: "Tài liệu",
      dataIndex: "FileURL",
      key: "FileURL",
      width: 120,
      align: "center" as const,
      render: (url: string, record: Facility_License) => (
        <Button
          type="link"
          icon={<FilePdfOutlined style={{ color: "#ff4d4f" }} />}
          onClick={() => {
            setPdfUrl(url || "/files/license_placeholder.pdf");
            setPdfTitle(`Giấy phép ${record.LicenseType === LicenseType.GPKD ? "GPKD" : "ATVSTP"}: ${record.LicenseNo}`);
            setIsPdfDrawerOpen(true);
          }}
          style={{ padding: 0 }}
        >
          PDF
        </Button>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (record: Facility_License) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => handleOpenEditLicense(record)}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteLicense(record.LicenseId)}
          />
        </Space>
      ),
    },
  ];

  // Facility handlers
  const handleOpenAddFacility = () => {
    setEditMode("create");
    setEditingFacility(null);
    setTempLicenses([]);
    largeForm.resetFields();
    setIsLargeModalVisible(true);
  };

  const handleOpenEditFacility = (record: Facility) => {
    setEditMode("update");
    setEditingFacility(record);
    setTempLicenses(record.Licenses || []);
    largeForm.setFieldsValue({
      FacilityCode: record.FacilityCode,
      FacilityName: record.FacilityName,
      FacilityType: record.FacilityType,
    });
    setIsLargeModalVisible(true);
  };

  const handleSaveFacility = (values: any) => {
    const payload: Facility = {
      FacilityId: editingFacility
        ? editingFacility.FacilityId
        : `FAC-${Date.now()}`,
      FacilityCode: values.FacilityCode,
      FacilityName: values.FacilityName,
      FacilityType: values.FacilityType,
      Licenses: tempLicenses,
    };

    if (editMode === "create") {
      dispatch(addFacility(payload));
      message.success("Thêm mới cơ sở pháp lý thành công!");
    } else {
      dispatch(updateFacility(payload));
      message.success("Cập nhật cơ sở pháp lý thành công!");
    }
    setIsLargeModalVisible(false);
    largeForm.resetFields();
  };

  // License handlers
  const handleOpenAddLicense = () => {
    setLicenseEditMode("create");
    setEditingLicense(null);
    setLicenseFileList([]);
    smallForm.resetFields();
    setIsSmallModalVisible(true);
  };

  const handleOpenEditLicense = (record: Facility_License) => {
    setLicenseEditMode("update");
    setEditingLicense(record);
    setLicenseFileList(
      record.FileURL
        ? [
            {
              uid: "-1",
              name: record.FileURL.split("/").pop() || "document.pdf",
              status: "done",
              url: record.FileURL,
            },
          ]
        : [],
    );
    smallForm.setFieldsValue({
      LicenseType: record.LicenseType,
      LicenseNo: record.LicenseNo,
      Address: record.Address,
      ValidFrom: record.ValidFrom ? dayjs(record.ValidFrom) : null,
      ValidTo: record.ValidTo ? dayjs(record.ValidTo) : null,
    });
    setIsSmallModalVisible(true);
  };

  const handleDeleteLicense = (licenseId: string) => {
    setTempLicenses(tempLicenses.filter((l) => l.LicenseId !== licenseId));
    message.success("Đã xóa giấy phép khỏi danh sách tạm!");
  };

  const handleSaveLicense = (values: any) => {
    let fileUrl = "";
    if (values.fileUpload && values.fileUpload.length > 0) {
      const fileObj = values.fileUpload[0].originFileObj;
      fileUrl = fileObj
        ? URL.createObjectURL(fileObj)
        : `/files/${values.fileUpload[0].name}`;
    } else if (licenseFileList.length > 0) {
      fileUrl = licenseFileList[0].url || `/files/${licenseFileList[0].name}`;
    } else {
      fileUrl = "/files/license_placeholder.pdf";
    }

    if (licenseEditMode === "create") {
      const newLicense: Facility_License = {
        LicenseId: `LIC-${Date.now()}`,
        FacilityId: editingFacility ? editingFacility.FacilityId : "",
        LicenseType: values.LicenseType,
        LicenseNo: values.LicenseNo,
        Address: values.Address,
        ValidFrom: values.ValidFrom.format("YYYY-MM-DD"),
        ValidTo: values.ValidTo ? values.ValidTo.format("YYYY-MM-DD") : null,
        FileURL: fileUrl,
      };
      setTempLicenses([...tempLicenses, newLicense]);
      message.success("Đã thêm giấy phép vào danh sách!");
    } else if (editingLicense) {
      const updated = tempLicenses.map((lic) => {
        if (lic.LicenseId === editingLicense.LicenseId) {
          return {
            ...lic,
            LicenseType: values.LicenseType,
            LicenseNo: values.LicenseNo,
            Address: values.Address,
            ValidFrom: values.ValidFrom.format("YYYY-MM-DD"),
            ValidTo: values.ValidTo
              ? values.ValidTo.format("YYYY-MM-DD")
              : null,
            FileURL: fileUrl,
          };
        }
        return lic;
      });
      setTempLicenses(updated);
      message.success("Đã cập nhật giấy phép!");
    }

    setIsSmallModalVisible(false);
    smallForm.resetFields();
  };

  return (
    <div>
      {/* Search and Toolbar */}
      <div
        style={{
          background: "#ffffff",
          padding: "16px 24px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{ fontWeight: "bold", fontSize: "16px", color: PRIMARY_COLOR }}
        >
          Danh sách Cơ sở Pháp nhân / Nhà máy Masan
        </span>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAddFacility}
          style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
        >
          Thêm Pháp Nhân / Nhà Máy
        </Button>
      </div>

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
                Mã Cơ sở:
              </div>
              <Input
                placeholder="Nhập mã cơ sở..."
                value={tempCode}
                onChange={(e) => setTempCode(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={8}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Tên doanh nghiệp / Tên nhà máy:
              </div>
              <Input
                placeholder="Nhập tên doanh nghiệp hoặc nhà máy..."
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={8}>
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
                <Select.Option value="ALL">Tất cả phân loại</Select.Option>
                <Select.Option value="CONG_TY">Công ty</Select.Option>
                <Select.Option value="NHA_MAY">Nhà máy</Select.Option>
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
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* Main Table */}
      <AppTable
        dataSource={filteredFacilities}
        columns={mainColumns}
        rowKey="FacilityId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} dòng`,
        }}
        bordered
        size="middle"
        scroll={{ x: 1200 }}
      />

      {/* STEP 2: Large Modal (Add/Edit Facility) */}
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
            <SafetyCertificateOutlined style={{ fontSize: "18px" }} />
            <span style={{ fontWeight: "bold" }}>
              {editMode === "create"
                ? "Thêm Mới Cơ Sở Pháp Lý"
                : "Cập Nhật Thông Tin Cơ Sở Pháp Lý"}
            </span>
          </div>
        }
        open={isLargeModalVisible}
        onCancel={() => setIsLargeModalVisible(false)}
        width={1400}
        footer={[
          <Button key="cancel" onClick={() => setIsLargeModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => largeForm.submit()}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form
          form={largeForm}
          layout="vertical"
          onFinish={handleSaveFacility}
          style={{ marginTop: "16px" }}
        >
          {/* Top Form Input */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="FacilityCode"
                label="Mã Cơ sở / Nhà máy"
                rules={[{ required: true, message: "Vui lòng nhập Mã cơ sở!" }]}
              >
                <Input placeholder="Ví dụ: VCF, MSD, NMBINHHUONG..." />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="FacilityName"
                label="Tên doanh nghiệp / Tên nhà máy"
                rules={[
                  { required: true, message: "Vui lòng nhập Tên cơ sở!" },
                ]}
              >
                <Input placeholder="Ví dụ: Nhà máy Masan Bình Dương..." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="FacilityType"
                label="Loại Cơ sở"
                rules={[
                  { required: true, message: "Vui lòng chọn loại cơ sở!" },
                ]}
              >
                <Select placeholder="Chọn loại...">
                  <Select.Option value={FacilityType.CONG_TY}>
                    Công ty
                  </Select.Option>
                  <Select.Option value={FacilityType.NHA_MAY}>
                    Nhà máy
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider
            orientation={"left" as any}
            style={{
              margin: "24px 0 16px 0",
              color: "#595959",
              fontSize: "14px",
            }}
          >
            Danh sách Giấy phép liên quan (GPKD & ATVSTP)
          </Divider>

          {/* Sub-table Container */}
          <div style={{ marginBottom: "16px", textAlign: "right" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleOpenAddLicense}
              style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
            >
              Thêm Giấy Phép
            </Button>
          </div>

          <Table
            dataSource={tempLicenses}
            columns={subColumns}
            rowKey="LicenseId"
            pagination={false}
            bordered
            size="small"
            locale={{ emptyText: "Chưa có giấy phép nào được thêm." }}
          />
        </Form>
      </Modal>

      {/* STEP 3: Small Modal (Add/Edit License) */}
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
            <PlusOutlined style={{ fontSize: "16px" }} />
            <span style={{ fontWeight: "bold" }}>
              {licenseEditMode === "create"
                ? "Thêm Mới Giấy Phép"
                : "Cập Nhật Giấy Phép"}
            </span>
          </div>
        }
        open={isSmallModalVisible}
        onCancel={() => setIsSmallModalVisible(false)}
        width={500}
        footer={[
          <Button
            key="cancelLicense"
            onClick={() => setIsSmallModalVisible(false)}
          >
            Hủy
          </Button>,
          <Button
            key="submitLicense"
            type="primary"
            onClick={() => smallForm.submit()}
          >
            Lưu
          </Button>,
        ]}
        zIndex={1050} // Ensure it shows on top of the large modal
      >
        <Form
          form={smallForm}
          layout="vertical"
          onFinish={handleSaveLicense}
          style={{ marginTop: "16px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="LicenseType"
                label="Loại giấy phép"
                rules={[{ required: true, message: "Chọn loại giấy phép!" }]}
              >
                <Select placeholder="Chọn loại...">
                  <Select.Option value={LicenseType.GPKD}>
                    GPKD (Giấy phép ĐKKD)
                  </Select.Option>
                  <Select.Option value={LicenseType.ATVSTP}>
                    ATVSTP (An toàn vệ sinh thực phẩm)
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="LicenseNo"
                label="Số giấy phép"
                rules={[{ required: true, message: "Nhập số giấy phép!" }]}
              >
                <Input placeholder="Ví dụ: 0305001234..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="Address"
            label="Địa chỉ (ghi trên giấy phép)"
            rules={[
              { required: true, message: "Nhập địa chỉ trên giấy phép!" },
            ]}
          >
            <Input placeholder="Địa chỉ chi tiết..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ValidFrom"
                label="Có hiệu lực từ"
                rules={[{ required: true, message: "Chọn ngày hiệu lực!" }]}
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
            name="fileUpload"
            label="Tải lên bản quét PDF"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload.Dragger
              name="files"
              accept=".pdf"
              maxCount={1}
              beforeUpload={() => false}
              defaultFileList={licenseFileList}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Nhấp hoặc kéo thả tệp PDF vào đây
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Facility Revision History Modal */}
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
              Lịch sử Thay đổi & Phê duyệt Pháp nhân - {selectedHistoryFacility?.FacilityCode}
            </span>
          </div>
        }
        open={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setSelectedHistoryFacility(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsHistoryModalVisible(false);
              setSelectedHistoryFacility(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        {selectedHistoryFacility && (
          <div style={{ marginTop: "15px" }}>
            <Descriptions
              bordered
              size="small"
              column={2}
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Mã Cơ Sở">
                <strong>{selectedHistoryFacility.FacilityCode}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Doanh nghiệp / Nhà máy">
                <strong>{selectedHistoryFacility.FacilityName || "-"}</strong>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation={"left" as any} style={{ fontSize: "14px", fontWeight: 600, color: PRIMARY_COLOR }}>
              Nhật ký thay đổi hồ sơ pháp lý & giấy phép
            </Divider>

            <Table
              dataSource={getMockFacilityHistoryData(selectedHistoryFacility)}
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

      {/* PDF Document Preview Drawer */}
      <Drawer
        title={
          <span style={{ fontWeight: "bold" }}>
            <FilePdfOutlined style={{ color: "#ff4d4f", marginRight: "8px" }} />
            Tài Liệu: {pdfTitle}
          </span>
        }
        placement="right"
        width="60%"
        onClose={() => {
          setIsPdfDrawerOpen(false);
          setPdfUrl("");
          setPdfTitle("");
        }}
        open={isPdfDrawerOpen}
        footer={null}
        zIndex={1200}
      >
        {pdfUrl && (
          <div style={{ height: "100%", width: "100%" }}>
            <iframe
              src={pdfUrl}
              title="PDF Document Viewer"
              width="100%"
              height="100%"
              style={{ border: "none", minHeight: "calc(100vh - 120px)" }}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default FacilityList;
