import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Checkbox,
  Space,
  Tag,
  Divider,
  Input,
  Modal,
  Form,
  message,
} from "antd";
import {
  SafetyOutlined,
  SaveOutlined,
  PlusOutlined,
  KeyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { PRIMARY_COLOR } from "../../../contants";

interface RoleItem {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
}

interface PermissionRow {
  key: string;
  moduleName: string;
  read: boolean;
  create: boolean;
  edit: boolean;
  approve: boolean;
  delete: boolean;
}

export const PermissionList: React.FC = () => {
  const [roleForm] = Form.useForm();
  
  // List of roles
  const [roles, setRoles] = useState<RoleItem[]>([
    {
      id: "role_1",
      name: "System Admin",
      code: "ADMIN",
      description: "Quản trị viên tối cao hệ thống. Có toàn quyền quản trị tài khoản, phân quyền, cấu hình hệ thống.",
      userCount: 1,
    },
    {
      id: "role_2",
      name: "QA Manager",
      code: "QA_MANAGER",
      description: "Trưởng phòng Quản lý Chất lượng Masan. Xem, rà soát, kiểm soát tất cả hồ sơ, phê duyệt cuối cùng.",
      userCount: 1,
    },
    {
      id: "role_3",
      name: "QA Officer",
      code: "QA_OFFICER",
      description: "Chuyên viên QA thực hiện rà soát hồ sơ tự công bố, tiêu chuẩn kỹ thuật, chứng từ nhà cung cấp.",
      userCount: 1,
    },
    {
      id: "role_4",
      name: "Procurement",
      code: "PROCUREMENT",
      description: "Nhân viên bộ phận Mua hàng. Thực hiện quản lý thông tin nhà cung cấp và phân bổ sản lượng mua hàng.",
      userCount: 1,
    },
    {
      id: "role_5",
      name: "Đối tác (Partner)",
      code: "PARTNER",
      description: "Tài khoản đối tác nhà cung cấp/nhà sản xuất. Chỉ xem các vật tư liên kết, tải lên chứng từ, tự công bố.",
      userCount: 2,
    },
  ]);

  const [selectedRoleId, setSelectedRoleId] = useState<string>("role_2");
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);

  // Permission states for each role (Indexed by role code)
  const [rolePermissions, setRolePermissions] = useState<Record<string, PermissionRow[]>>({
    ADMIN: [
      { key: "item", moduleName: "0. Danh mục Vật tư / Sản phẩm", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "hscb", moduleName: "1. Hồ sơ tự công bố sản phẩm", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "spec", moduleName: "2. Tiêu chuẩn kỹ thuật (Spec)", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "doc", moduleName: "3. Chứng từ nhà cung cấp", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "partner", moduleName: "4. Nhà cung cấp & Nhà sản xuất", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "bom", moduleName: "5. Cấu trúc sản phẩm (BOM)", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "trace", moduleName: "6. Truy xuất lô thành phẩm", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "barcode", moduleName: "8. Mã vạch GS1", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "allergen", moduleName: "Template Dị ứng & Dinh dưỡng", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "facility", moduleName: "Pháp lý doanh nghiệp", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "account", moduleName: "Quản lý tài khoản", read: true, create: true, edit: true, approve: true, delete: true },
      { key: "permission", moduleName: "Quản lý phân quyền", read: true, create: true, edit: true, approve: true, delete: true },
    ],
    QA_MANAGER: [
      { key: "item", moduleName: "0. Danh mục Vật tư / Sản phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "hscb", moduleName: "1. Hồ sơ tự công bố sản phẩm", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "spec", moduleName: "2. Tiêu chuẩn kỹ thuật (Spec)", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "doc", moduleName: "3. Chứng từ nhà cung cấp", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "partner", moduleName: "4. Nhà cung cấp & Nhà sản xuất", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "bom", moduleName: "5. Cấu trúc sản phẩm (BOM)", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "trace", moduleName: "6. Truy xuất lô thành phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "barcode", moduleName: "8. Mã vạch GS1", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "allergen", moduleName: "Template Dị ứng & Dinh dưỡng", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "facility", moduleName: "Pháp lý doanh nghiệp", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "account", moduleName: "Quản lý tài khoản", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "permission", moduleName: "Quản lý phân quyền", read: false, create: false, edit: false, approve: false, delete: false },
    ],
    QA_OFFICER: [
      { key: "item", moduleName: "0. Danh mục Vật tư / Sản phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "hscb", moduleName: "1. Hồ sơ tự công bố sản phẩm", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "spec", moduleName: "2. Tiêu chuẩn kỹ thuật (Spec)", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "doc", moduleName: "3. Chứng từ nhà cung cấp", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "partner", moduleName: "4. Nhà cung cấp & Nhà sản xuất", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "bom", moduleName: "5. Cấu trúc sản phẩm (BOM)", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "trace", moduleName: "6. Truy xuất lô thành phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "barcode", moduleName: "8. Mã vạch GS1", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "allergen", moduleName: "Template Dị ứng & Dinh dưỡng", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "facility", moduleName: "Pháp lý doanh nghiệp", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "account", moduleName: "Quản lý tài khoản", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "permission", moduleName: "Quản lý phân quyền", read: false, create: false, edit: false, approve: false, delete: false },
    ],
    PROCUREMENT: [
      { key: "item", moduleName: "0. Danh mục Vật tư / Sản phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "hscb", moduleName: "1. Hồ sơ tự công bố sản phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "spec", moduleName: "2. Tiêu chuẩn kỹ thuật (Spec)", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "doc", moduleName: "3. Chứng từ nhà cung cấp", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "partner", moduleName: "4. Nhà cung cấp & Nhà sản xuất", read: true, create: true, edit: true, approve: true, delete: false },
      { key: "bom", moduleName: "5. Cấu trúc sản phẩm (BOM)", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "trace", moduleName: "6. Truy xuất lô thành phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "barcode", moduleName: "8. Mã vạch GS1", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "allergen", moduleName: "Template Dị ứng & Dinh dưỡng", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "facility", moduleName: "Pháp lý doanh nghiệp", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "account", moduleName: "Quản lý tài khoản", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "permission", moduleName: "Quản lý phân quyền", read: false, create: false, edit: false, approve: false, delete: false },
    ],
    PARTNER: [
      { key: "item", moduleName: "0. Danh mục Vật tư / Sản phẩm", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "hscb", moduleName: "1. Hồ sơ tự công bố sản phẩm", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "spec", moduleName: "2. Tiêu chuẩn kỹ thuật (Spec)", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "doc", moduleName: "3. Chứng từ nhà cung cấp", read: true, create: true, edit: true, approve: false, delete: false },
      { key: "partner", moduleName: "4. Nhà cung cấp & Nhà sản xuất", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "bom", moduleName: "5. Cấu trúc sản phẩm (BOM)", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "trace", moduleName: "6. Truy xuất lô thành phẩm", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "barcode", moduleName: "8. Mã vạch GS1", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "allergen", moduleName: "Template Dị ứng & Dinh dưỡng", read: true, create: false, edit: false, approve: false, delete: false },
      { key: "facility", moduleName: "Pháp lý doanh nghiệp", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "account", moduleName: "Quản lý tài khoản", read: false, create: false, edit: false, approve: false, delete: false },
      { key: "permission", moduleName: "Quản lý phân quyền", read: false, create: false, edit: false, approve: false, delete: false },
    ],
  });

  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const currentPermissions = selectedRole ? rolePermissions[selectedRole.code] || [] : [];

  const handleCheckboxChange = (rowKey: string, field: "read" | "create" | "edit" | "approve" | "delete", checked: boolean) => {
    if (!selectedRole) return;
    const roleCode = selectedRole.code;
    setRolePermissions((prev) => {
      const list = prev[roleCode] || [];
      const updated = list.map((row) => {
        if (row.key === rowKey) {
          return { ...row, [field]: checked };
        }
        return row;
      });
      return { ...prev, [roleCode]: updated };
    });
  };

  const handleSaveConfig = () => {
    message.success(`Đã cập nhật cấu hình phân quyền cho vai trò ${selectedRole?.name} thành công!`);
  };

  const handleCreateRole = (values: any) => {
    const newCode = values.code.toUpperCase().replace(/\s+/g, "_");
    const newRole: RoleItem = {
      id: `role_${Date.now()}`,
      name: values.name,
      code: newCode,
      description: values.description,
      userCount: 0,
    };
    
    // Copy permissions from QA_OFFICER as base
    const basePermissions = rolePermissions["QA_OFFICER"].map((p) => ({ ...p }));
    
    setRoles((prev) => [...prev, newRole]);
    setRolePermissions((prev) => ({
      ...prev,
      [newCode]: basePermissions,
    }));
    
    setIsRoleModalVisible(false);
    roleForm.resetFields();
    message.success(`Thêm mới vai trò ${values.name} thành công!`);
  };

  const columns = [
    {
      title: "Module / Phân hệ",
      dataIndex: "moduleName",
      key: "moduleName",
      width: "35%",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Xem (Read)",
      key: "read",
      align: "center" as const,
      render: (record: PermissionRow) => (
        <Checkbox
          checked={record.read}
          onChange={(e) => handleCheckboxChange(record.key, "read", e.target.checked)}
        />
      ),
    },
    {
      title: "Thêm mới (Create)",
      key: "create",
      align: "center" as const,
      render: (record: PermissionRow) => (
        <Checkbox
          checked={record.create}
          onChange={(e) => handleCheckboxChange(record.key, "create", e.target.checked)}
        />
      ),
    },
    {
      title: "Chỉnh sửa (Edit)",
      key: "edit",
      align: "center" as const,
      render: (record: PermissionRow) => (
        <Checkbox
          checked={record.edit}
          onChange={(e) => handleCheckboxChange(record.key, "edit", e.target.checked)}
        />
      ),
    },
    {
      title: "Phê duyệt (Approve)",
      key: "approve",
      align: "center" as const,
      render: (record: PermissionRow) => (
        <Checkbox
          checked={record.approve}
          onChange={(e) => handleCheckboxChange(record.key, "approve", e.target.checked)}
        />
      ),
    },
    {
      title: "Xóa (Delete)",
      key: "delete",
      align: "center" as const,
      render: (record: PermissionRow) => (
        <Checkbox
          checked={record.delete}
          onChange={(e) => handleCheckboxChange(record.key, "delete", e.target.checked)}
        />
      ),
    },
  ];

  return (
    <div>
      <Row gutter={24}>
        {/* Left Column: Roles list */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <span style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>
                <KeyOutlined style={{ marginRight: 8 }} />
                Vai trò & Nhóm người dùng
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                onClick={() => setIsRoleModalVisible(true)}
              >
                Thêm vai trò
              </Button>
            }
            style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)" }}
            bodyStyle={{ padding: "12px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {roles.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <Card
                    key={role.id}
                    hoverable
                    onClick={() => setSelectedRoleId(role.id)}
                    style={{
                      borderRadius: "6px",
                      border: isSelected ? `2px solid ${PRIMARY_COLOR}` : "1px solid #f0f0f0",
                      background: isSelected ? "#f4f6fc" : "#ffffff",
                    }}
                    bodyStyle={{ padding: "12px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", color: isSelected ? PRIMARY_COLOR : "#262626", fontSize: "14px" }}>
                        {role.name}
                      </span>
                      <Tag color={isSelected ? "blue" : "default"}>{role.userCount} users</Tag>
                    </div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "8px", lineHeight: "1.5" }}>
                      {role.description}
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* Right Column: Permission Matrix */}
        <Col xs={24} lg={16}>
          {selectedRole && (
            <Card
              title={
                <div>
                  <span style={{ fontWeight: "bold", color: PRIMARY_COLOR, fontSize: "16px" }}>
                    Cấu hình quyền: <Tag color="red" style={{ fontSize: "14px" }}>{selectedRole.name}</Tag>
                  </span>
                  <div style={{ fontSize: "12px", fontWeight: "normal", color: "#8c8c8c", marginTop: "4px" }}>
                    {selectedRole.description}
                  </div>
                </div>
              }
              extra={
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                  onClick={handleSaveConfig}
                >
                  Lưu phân quyền
                </Button>
              }
              style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)" }}
            >
              <Table
                dataSource={currentPermissions}
                columns={columns}
                pagination={false}
                bordered
                size="middle"
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* Add Role Modal */}
      <Modal
        title={
          <span style={{ fontSize: "17px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <PlusOutlined style={{ marginRight: 8 }} />
            Thêm mới vai trò / nhóm người dùng
          </span>
        }
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={() => roleForm.submit()}
        okText="Thêm vai trò"
        cancelText="Hủy"
        width={500}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleCreateRole} style={{ marginTop: "15px" }}>
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[{ required: true, message: "Nhập tên vai trò!" }]}
          >
            <Input placeholder="Ví dụ: Supplier R&D, Auditor..." />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã vai trò (Code)"
            rules={[{ required: true, message: "Nhập mã vai trò!" }]}
            extra="Mã định danh không dấu, ví dụ: SUPPLIER_RD"
          >
            <Input placeholder="Ví dụ: SUPPLIER_RD" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả quyền hạn"
            rules={[{ required: true, message: "Nhập mô tả vai trò!" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả chi tiết vai trò..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
