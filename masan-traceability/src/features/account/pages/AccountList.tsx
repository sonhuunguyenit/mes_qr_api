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
  Form,
  Space,
  Tooltip,
  Table,
  Avatar,
  Badge,
  Collapse,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { PRIMARY_COLOR } from "../../../contants";

interface AccountItem {
  key: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "QA_MANAGER" | "QA_OFFICER" | "PROCUREMENT" | "PARTNER";
  partnerCode?: string;
  status: "ACTIVE" | "LOCKED";
  createdAt: string;
}

export const AccountList: React.FC = () => {
  const [form] = Form.useForm();
  
  // Mock account list state
  const [accounts, setAccounts] = useState<AccountItem[]>([
    {
      key: "1",
      username: "admin",
      fullName: "Quản trị viên hệ thống",
      email: "admin@masangroup.com",
      phone: "0901234567",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: "2026-01-01",
    },
    {
      key: "2",
      username: "tqb_qa",
      fullName: "Trần Quốc Bảo",
      email: "baotq@masangroup.com",
      phone: "0912345678",
      role: "QA_MANAGER",
      status: "ACTIVE",
      createdAt: "2026-01-10",
    },
    {
      key: "3",
      username: "hhl_qa",
      fullName: "Hồ Hoàng Long",
      email: "longhh@masangroup.com",
      phone: "0987654321",
      role: "QA_OFFICER",
      status: "ACTIVE",
      createdAt: "2026-01-15",
    },
    {
      key: "4",
      username: "lvt_pro",
      fullName: "Lê Văn Tám",
      email: "tamlv@masangroup.com",
      phone: "0933445566",
      role: "PROCUREMENT",
      status: "ACTIVE",
      createdAt: "2026-02-01",
    },
    {
      key: "5",
      username: "vendor_gavi",
      fullName: "Đại diện GAVI Việt Nam",
      email: "qa@gavi.com.vn",
      phone: "0944556677",
      role: "PARTNER",
      partnerCode: "GAVI",
      status: "ACTIVE",
      createdAt: "2026-02-15",
    },
    {
      key: "6",
      username: "vendor_cholimex",
      fullName: "QA Cholimex Food",
      email: "qa@cholimex.com.vn",
      phone: "0900112233",
      role: "PARTNER",
      partnerCode: "CHOLIMEX",
      status: "LOCKED",
      createdAt: "2026-03-01",
    },
  ]);

  // Temp filter states
  const [tempUsername, setTempUsername] = useState("");
  const [tempFullName, setTempFullName] = useState("");
  const [tempRole, setTempRole] = useState<string>("ALL");
  const [tempStatus, setTempStatus] = useState<string>("ALL");

  // Active filter states
  const [filterUsername, setFilterUsername] = useState("");
  const [filterFullName, setFilterFullName] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedRecord, setSelectedRecord] = useState<AccountItem | null>(null);

  const handleSearch = () => {
    setFilterUsername(tempUsername);
    setFilterFullName(tempFullName);
    setFilterRole(tempRole);
    setFilterStatus(tempStatus);
  };

  const handleReset = () => {
    setTempUsername("");
    setTempFullName("");
    setTempRole("ALL");
    setTempStatus("ALL");
    setFilterUsername("");
    setFilterFullName("");
    setFilterRole("ALL");
    setFilterStatus("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };

  // Filter accounts logic
  const filteredAccounts = accounts.filter((acc) => {
    const matchesUsername = acc.username.toLowerCase().includes(filterUsername.toLowerCase().trim());
    const matchesFullName = acc.fullName.toLowerCase().includes(filterFullName.toLowerCase().trim());
    const matchesRole = filterRole === "ALL" || acc.role === filterRole;
    const matchesStatus = filterStatus === "ALL" || acc.status === filterStatus;
    return matchesUsername && matchesFullName && matchesRole && matchesStatus;
  });

  // Action handlers
  const handleToggleStatus = (record: AccountItem) => {
    const newStatus = record.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    setAccounts((prev) =>
      prev.map((acc) => (acc.key === record.key ? { ...acc, status: newStatus } : acc))
    );
    if (newStatus === "LOCKED") {
      message.warning(`Đã khóa tài khoản ${record.username}!`);
    } else {
      message.success(`Đã mở khóa tài khoản ${record.username}!`);
    }
  };

  const handleResetPassword = (record: AccountItem) => {
    message.success(`Đã khôi phục mật khẩu mặc định (Masan@123) cho tài khoản ${record.username}!`);
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenEdit = (record: AccountItem) => {
    setModalMode("edit");
    setSelectedRecord(record);
    form.setFieldsValue({
      username: record.username,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      role: record.role,
      partnerCode: record.partnerCode,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleSaveAccount = (values: any) => {
    if (modalMode === "create") {
      const newAcc: AccountItem = {
        key: Date.now().toString(),
        username: values.username,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        partnerCode: values.partnerCode,
        status: values.status || "ACTIVE",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAccounts((prev) => [...prev, newAcc]);
      message.success(`Tạo mới tài khoản ${values.username} thành công!`);
    } else if (selectedRecord) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.key === selectedRecord.key
            ? {
                ...acc,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                role: values.role,
                partnerCode: values.partnerCode,
                status: values.status,
              }
            : acc
        )
      );
      message.success(`Cập nhật tài khoản ${selectedRecord.username} thành công!`);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Columns setup
  const columns = [
    {
      title: "Tài khoản",
      key: "accountInfo",
      width: 250,
      render: (record: AccountItem) => {
        let avatarColor = "#1890ff";
        if (record.role === "ADMIN") avatarColor = "#ff4d4f";
        else if (record.role === "QA_MANAGER") avatarColor = "#722ed1";
        else if (record.role === "QA_OFFICER") avatarColor = "#2f54eb";
        else if (record.role === "PROCUREMENT") avatarColor = "#fa8c16";
        else if (record.role === "PARTNER") avatarColor = "#13c2c2";

        return (
          <Space>
            <Avatar style={{ backgroundColor: avatarColor }}>
              {record.fullName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <strong style={{ display: "block" }}>{record.username}</strong>
              <span style={{ fontSize: "12px", color: "#8c8c8c" }}>{record.fullName}</span>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 280,
      render: (record: AccountItem) => (
        <div>
          <div>{record.email}</div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>SĐT: {record.phone}</div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 160,
      align: "center" as const,
      render: (role: string) => {
        switch (role) {
          case "ADMIN":
            return <Tag color="red">System Admin</Tag>;
          case "QA_MANAGER":
            return <Tag color="purple">QA Manager</Tag>;
          case "QA_OFFICER":
            return <Tag color="blue">QA Officer</Tag>;
          case "PROCUREMENT":
            return <Tag color="orange">Procurement</Tag>;
          case "PARTNER":
            return <Tag color="cyan">Đối tác (Partner)</Tag>;
          default:
            return <Tag>{role}</Tag>;
        }
      },
    },
    {
      title: "Đối tác liên kết",
      dataIndex: "partnerCode",
      key: "partnerCode",
      width: 180,
      align: "center" as const,
      render: (code: string) => code ? <Tag color="blue">{code}</Tag> : <span style={{ color: "#bfbfbf" }}>Nội bộ Masan</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center" as const,
      render: (status: string) =>
        status === "ACTIVE" ? (
          <Tag color="success">Hoạt động</Tag>
        ) : (
          <Tag color="error">Đang khóa</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      align: "center" as const,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      width: 180,
      fixed: "right" as const,
      render: (record: AccountItem) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Reset Mật khẩu">
            <Button
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}>
            <Button
              danger={record.status === "ACTIVE"}
              size="small"
              icon={record.status === "ACTIVE" ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Search and Toolbar */}
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
              <MenuUnfoldOutlined style={{ marginRight: 8, fontSize: "14px" }} />
              Tìm kiếm tài khoản
            </span>
          }
          style={{ background: "#ffffff", border: "none" }}
        >
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}>Tài khoản (Username):</div>
              <Input
                placeholder="Nhập username..."
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}>Họ tên (Full Name):</div>
              <Input
                placeholder="Nhập tên..."
                value={tempFullName}
                onChange={(e) => setTempFullName(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}>Vai trò:</div>
              <Select value={tempRole} onChange={setTempRole} style={{ width: "100%" }}>
                <Select.Option value="ALL">Tất cả vai trò</Select.Option>
                <Select.Option value="ADMIN">System Admin</Select.Option>
                <Select.Option value="QA_MANAGER">QA Manager</Select.Option>
                <Select.Option value="QA_OFFICER">QA Officer</Select.Option>
                <Select.Option value="PROCUREMENT">Procurement</Select.Option>
                <Select.Option value="PARTNER">Đối tác (Partner)</Select.Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}>Trạng thái:</div>
              <Select value={tempStatus} onChange={setTempStatus} style={{ width: "100%" }}>
                <Select.Option value="ALL">Tất cả</Select.Option>
                <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                <Select.Option value="LOCKED">Đang khóa</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={24} lg={24}>
              <Space size="middle" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
                <Button type="default" icon={<ReloadOutlined />} onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                  onClick={handleOpenCreate}
                >
                  Thêm tài khoản
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>


      {/* Main Table */}
      <Table
        dataSource={filteredAccounts}
        columns={columns}
        rowKey="key"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} tài khoản`,
        }}
        bordered
        size="middle"
        scroll={{ x: 1200 }}
      />

      {/* Create / Edit Account Modal */}
      <Modal
        title={
          <span style={{ fontSize: "17px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            {modalMode === "create" ? <PlusOutlined style={{ marginRight: 8 }} /> : <EditOutlined style={{ marginRight: 8 }} />}
            {modalMode === "create" ? "Thêm mới tài khoản người dùng" : `Cập nhật thông tin: ${selectedRecord?.username}`}
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu tài khoản"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAccount} style={{ marginTop: "15px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập (Username)"
                rules={[{ required: true, message: "Nhập tên đăng nhập!" }]}
              >
                <Input placeholder="Ví dụ: hoa_qa" disabled={modalMode === "edit"} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên người dùng"
                rules={[{ required: true, message: "Nhập họ tên!" }]}
              >
                <Input placeholder="Ví dụ: Nguyễn Văn A" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Địa chỉ Email"
                rules={[
                  { required: true, message: "Nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" }
                ]}
              >
                <Input placeholder="username@masangroup.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại liên hệ"
                rules={[{ required: true, message: "Nhập số điện thoại!" }]}
              >
                <Input placeholder="Ví dụ: 090xxxxxxx" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò (Role)"
                rules={[{ required: true, message: "Chọn vai trò!" }]}
              >
                <Select placeholder="Chọn vai trò của tài khoản...">
                  <Select.Option value="ADMIN">System Admin</Select.Option>
                  <Select.Option value="QA_MANAGER">QA Manager</Select.Option>
                  <Select.Option value="QA_OFFICER">QA Officer</Select.Option>
                  <Select.Option value="PROCUREMENT">Procurement</Select.Option>
                  <Select.Option value="PARTNER">Đối tác (Partner)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
              >
                {({ getFieldValue }) => {
                  const role = getFieldValue("role");
                  return role === "PARTNER" ? (
                    <Form.Item
                      name="partnerCode"
                      label="Mã Đối Tác liên kết (Vendor Code)"
                      rules={[{ required: true, message: "Nhập mã đối tác liên kết!" }]}
                    >
                      <Input placeholder="Ví dụ: GAVI, CHOLIMEX, VEDAN..." />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>
            </Col>
          </Row>

          {modalMode === "create" && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="password"
                  label="Mật khẩu khởi tạo"
                  extra="Hệ thống tự động sử dụng mật khẩu mặc định: Masan@123"
                >
                  <Input.Password placeholder="Masan@123" disabled />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="ACTIVE">
                <Select>
                  <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                  <Select.Option value="LOCKED">Khóa tài khoản</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
