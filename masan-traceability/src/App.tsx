import React, { useState } from "react";
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
  SearchOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  KeyOutlined,
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
  Popover,
  List,
  Spin,
  Tag,
  Button,
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
import { FacilityList } from "./features/facility";
import { TraceBackwardList, PublicTracePage } from "./features/trace-backward";
import { AccountList } from "./features/account";
import { PermissionList } from "./features/permission";
import { PRIMARY_COLOR } from "./contants";
import { MOCK_NOTIFICATIONS, NotificationItem } from "./local-data";

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
    key: "/trace-backward",
    icon: <SearchOutlined />,
    label: "6. Truy xuất từ thành phẩm",
    fullTitle: "6. Quy trình thực hiện truy xuất nguồn gốc từ lô thành phẩm",
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
  {
    key: "/facility",
    icon: <SafetyCertificateOutlined />,
    label: "Pháp lý doanh nghiệp",
    fullTitle: "Quản lý Pháp lý doanh nghiệp (Legal Entity)",
  },
  {
    key: "/account",
    icon: <UserOutlined />,
    label: "Quản lý tài khoản",
    fullTitle: "Hệ thống quản lý tài khoản người dùng",
  },
  {
    key: "/permission",
    icon: <KeyOutlined />,
    label: "Quản lý phân quyền",
    fullTitle: "Bảng cấu hình phân quyền và vai trò hệ thống",
  },
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(MOCK_NOTIFICATIONS.length > 8);

  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  const getTagColor = (module: string) => {
    switch (module) {
      case "/item": return "blue";
      case "/hscb": return "green";
      case "/spec": return "orange";
      case "/doc": return "purple";
      case "/partner": return "magenta";
      case "/bom": return "cyan";
      case "/allergen-nutrition": return "gold";
      case "/facility": return "red";
      case "/account": return "purple";
      case "/permission": return "red";
      default: return "geekblue";
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          color: "#52c41a",
          backgroundColor: "#f6ffed",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        };
      case "warning":
        return {
          color: "#faad14",
          backgroundColor: "#fffbe6",
          icon: <WarningOutlined style={{ color: "#faad14" }} />,
        };
      case "error":
        return {
          color: "#ff4d4f",
          backgroundColor: "#fff2f0",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        };
      case "info":
      default:
        return {
          color: "#1890ff",
          backgroundColor: "#e6f7ff",
          icon: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
        };
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    handleMarkAsRead(item.id);
    navigate(item.module);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10 && !loading && hasMore) {
      setLoading(true);
      setTimeout(() => {
        setVisibleCount(prev => {
          const next = prev + 5;
          if (next >= notifications.length) {
            setHasMore(false);
          }
          return next;
        });
        setLoading(false);
      }, 800);
    }
  };

  const unreadCount = notifications.filter(item => !item.read).length;
  const visibleNotifications = notifications.slice(0, visibleCount);

  const popoverContent = (
    <div style={{ width: "450px" }}>
      <Flex justify="space-between" align="center" style={{ padding: "8px 16px 12px 16px", borderBottom: "1px solid #f0f0f0" }}>
        <span style={{ fontWeight: 600, fontSize: "16px", color: PRIMARY_COLOR }}>Thông báo</span>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
            style={{ padding: 0, height: "auto", fontSize: "12px" }}
          >
            Đọc tất cả
          </Button>
        )}
      </Flex>
      <div
        onScroll={handleScroll}
        style={{
          maxHeight: "350px",
          overflowY: "auto",
          padding: "8px 0",
        }}
      >
        <List
          dataSource={visibleNotifications}
          renderItem={(item) => {
            const styles = getTypeStyles(item.type);
            return (
              <List.Item
                onClick={() => handleNotificationClick(item)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  backgroundColor: item.read ? "transparent" : "#f6f8ff",
                  borderBottom: "1px solid #f0f0f0",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
                className="notification-item-hover"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: styles.backgroundColor,
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {styles.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Flex justify="space-between" align="baseline" gap={8}>
                    <span style={{ fontWeight: item.read ? 500 : 600, fontSize: "13.5px", color: item.read ? "#595959" : PRIMARY_COLOR }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: "11px", color: "#8c8c8c", flexShrink: 0 }}>
                      {getRelativeTime(item.createdAt)}
                    </span>
                  </Flex>
                  <p style={{ margin: "4px 0", fontSize: "12px", color: "#595959", lineHeight: "1.4" }}>
                    {item.content}
                  </p>
                  <Tag color={getTagColor(item.module)} style={{ margin: 0, fontSize: "10px" }}>
                    {item.moduleLabel}
                  </Tag>
                </div>
                {!item.read && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: PRIMARY_COLOR,
                      marginTop: "6px",
                      flexShrink: 0,
                    }}
                  />
                )}
              </List.Item>
            );
          }}
        />
        {loading && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <Spin size="small" />
          </div>
        )}
        {!hasMore && (
          <div style={{ textAlign: "center", padding: "12px 0", color: "#bfbfbf", fontSize: "12px" }}>
            Đã hiển thị tất cả thông báo
          </div>
        )}
      </div>
    </div>
  );

  const isPublicRoute = location.pathname.startsWith("/fg/");

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/fg/:itemCode" element={<PublicTracePage />} />
      </Routes>
    );
  }

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
                : location.pathname.startsWith("/trace-backward")
                  ? "/trace-backward"
                  : location.pathname.startsWith("/facility")
                    ? "/facility"
                    : location.pathname.startsWith("/account")
                      ? "/account"
                      : location.pathname.startsWith("/permission")
                        ? "/permission"
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
              display: "flex",
              flexDirection: "column",
              lineHeight: "1.4",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "bold",
                color: "#1f1f1f",
                fontSize: "15px",
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
            </div>
            {currentMenu?.fullTitle && (
              <span style={{ fontSize: "11px", color: "#8c8c8c", fontWeight: "normal" }}>
                {currentMenu.fullTitle}
              </span>
            )}
          </div>

          <Space size={20}>
            <Popover
              content={popoverContent}
              trigger="click"
              placement="bottomRight"
              overlayInnerStyle={{ padding: 0 }}
            >
              <Badge count={unreadCount} size="small" offset={[-2, 4]}>
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
            </Popover>
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
            <Route path="/trace-backward" element={<TraceBackwardList />} />
            <Route path="/facility" element={<FacilityList />} />
            <Route path="/barcode" element={<BarcodeList />} />
            <Route path="/account" element={<AccountList />} />
            <Route path="/permission" element={<PermissionList />} />
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
