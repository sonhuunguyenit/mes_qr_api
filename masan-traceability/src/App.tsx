import React from "react";
import {
  DatabaseOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  SafetyCertificateOutlined,
  PartitionOutlined,
  TeamOutlined,
  AuditOutlined,
  FileExcelOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  ConfigProvider,
  Flex,
  Layout,
  Menu,
  Badge,
  Space,
  Divider,
  Tooltip,
} from "antd";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { HscbList } from "./features/hscb";
import { ItemList } from "./features/item";
import { SpecList } from "./features/spec";
import { BomList } from "./features/bom";
import { PartnerList } from "./features/partner";
import { DocList } from "./features/doc";
import { AllergenNutritionList } from "./features/allergen-nutrition";
import { BarcodeList } from "./features/barcode";
import { PRIMARY_COLOR } from "./contants";

const { Content, Sider, Header } = Layout;

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

const rawMenuItems = [
  {
    key: "/item",
    icon: <DatabaseOutlined />,
    label: "0. Danh mục Vật tư / Sản phẩm",
    fullTitle: "0. Danh mục Vật tư / Sản phẩm (MASTER_ITEM)",
  },
  {
    key: "/hscb",
    icon: <FileTextOutlined />,
    label: "1. Hồ sơ tự công bố sản phẩm",
    fullTitle: "1. Quản lý bộ hồ sơ tự công bố sản phẩm (HSCB)",
  },
  {
    key: "/spec",
    icon: <FolderOpenOutlined />,
    label: "2. Quản lý thông tin tiêu chuẩn",
    fullTitle:
      "2. Quản lý thông tin tiêu chuẩn NVL, Bao Bì, BTP, Thành phẩm (TCCS/Spec)",
  },
  {
    key: "/doc",
    icon: <AuditOutlined />,
    label: "3. Chứng từ nhà cung cấp",
    fullTitle: "3. Quản lý chứng từ NCC (COA, Specification, hồ sơ công bố...)",
  },
  {
    key: "/partner",
    icon: <TeamOutlined />,
    label: "4. Nhà cung cấp & Nhà sản xuất",
    fullTitle: "4. Quản lý thông tin NCC và NSX của các item NVL, Bao bì",
  },
  {
    key: "/bom",
    icon: <PartitionOutlined />,
    label: "5. Cấu trúc sản phẩm (BOM)",
    fullTitle: "5. Quản lý BOM — HSCB & SPEC áp dụng",
  },
  {
    key: "/barcode",
    icon: <CustomBarcodeIcon />,
    label: "8. Mã vạch GS1",
    fullTitle: "8. Quản lý thông tin Barcode theo item (Mã vạch GS1)",
  },
  {
    key: "/allergen-nutrition",
    icon: <FileExcelOutlined />,
    label: "Template Dị ứng & Dinh dưỡng",
    fullTitle: "Template Dị ứng và Dinh dưỡng",
  },
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Synchronize menu active key with current path prefix
  const selectedKey = location.pathname.startsWith("/hscb")
    ? "/hscb"
    : location.pathname.startsWith("/spec")
      ? "/spec"
      : location.pathname.startsWith("/doc")
        ? "/doc"
        : location.pathname.startsWith("/allergen-nutrition")
          ? "/allergen-nutrition"
          : location.pathname.startsWith("/bom")
            ? "/bom"
            : location.pathname.startsWith("/partner")
              ? "/partner"
              : location.pathname.startsWith("/barcode")
                ? "/barcode"
                : "/item";

  const currentMenu = rawMenuItems.find((item) => item.key === selectedKey);
  const rawTitle = currentMenu ? currentMenu.label : "Masan QA Portal";
  const pageTitle = rawTitle.replace(/^[0-9a-zA-Z.]+\s+/, "");
  const pageIcon = currentMenu ? currentMenu.icon : null;

  const menuItems = rawMenuItems.map((item) => ({
    key: item.key,
    icon: React.cloneElement(item.icon as React.ReactElement<any>, {
      style: {
        color: PRIMARY_COLOR,
        fontSize: "17px",
      },
    }),
    label: (
      <span style={{ display: "block", fontWeight: 500, fontSize: "13px" }}>
        {item.label}
      </span>
    ),
    style: {
      borderBottom: "1px solid #f0f0f0",
      margin: "4px 0",
      borderRadius: 0,
    },
  }));

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        width={300}
        theme="light"
        style={{
          height: "100vh",
          boxShadow: "2px 0 8px 0 rgba(29,35,41,0.05)",
          zIndex: 10,
        }}
      >
        <Flex vertical style={{ height: "100%" }}>
          {/* Brand Header */}
          <Flex
            align="center"
            gap={12}
            style={{
              height: "64px",
              padding: "0 24px",
              background: PRIMARY_COLOR,
              color: "#ffffff",
            }}
          >
            <Avatar
              shape="square"
              size="small"
              style={{ backgroundColor: "#ffffff" }}
              icon={
                <SafetyCertificateOutlined style={{ color: PRIMARY_COLOR }} />
              }
            />
            <Flex vertical>
              <strong
                style={{
                  color: "#ffffff",
                  lineHeight: "1.2",
                  fontSize: "14px",
                }}
              >
                Masan Traceability
              </strong>
              <small
                style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "11px" }}
              >
                Centralized Traceability System
              </small>
            </Flex>
          </Flex>

          <Divider style={{ margin: 0, borderColor: "#f0f0f0" }} />

          {/* Menu items */}
          <div style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={({ key }) => navigate(key)}
              items={menuItems}
            />
          </div>
        </Flex>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#ffffff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
            height: "64px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
            zIndex: 9,
          }}
        >
          <div
            style={{
              color: PRIMARY_COLOR,
              fontWeight: "bold",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              lineHeight: "normal",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: `2px solid ${PRIMARY_COLOR}`,
                paddingBottom: "4px",
                lineHeight: "normal",
              }}
            >
              {pageIcon && (
                <span
                  style={{
                    fontSize: "16px",
                    display: "inline-flex",
                    color: PRIMARY_COLOR,
                  }}
                >
                  {pageIcon}
                </span>
              )}
              <span>{pageTitle}</span>
            </span>
          </div>
          <Space size={20}>
            <Badge count={3} size="small" offset={[-2, 4]}>
              <BellOutlined
                style={{
                  fontSize: "22px",
                  color: PRIMARY_COLOR,
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                }}
              />
            </Badge>
            <span
              style={{
                display: "inline-block",
                width: "1px",
                height: "20px",
                background: "#f0f0f0",
                margin: "0 10px",
              }}
            />
            <Space size={8} style={{ cursor: "pointer" }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: PRIMARY_COLOR }}
              />
              <span
                style={{
                  color: PRIMARY_COLOR,
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                QA Admin
              </span>
            </Space>
          </Space>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: "12px",
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            background: "#f0f2f5",
          }}
        >
          <Routes>
            <Route path="/item" element={<ItemList />} />
            <Route path="/hscb" element={<HscbList />} />
            <Route path="/spec" element={<SpecList />} />
            <Route path="/doc" element={<DocList />} />
            <Route
              path="/allergen-nutrition"
              element={<AllergenNutritionList />}
            />
            <Route path="/partner" element={<PartnerList />} />
            <Route path="/bom" element={<BomList />} />
            <Route path="/barcode" element={<BarcodeList />} />
            <Route path="*" element={<Navigate to="/item" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <Router>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
}
