export interface NotificationItem {
  id: string;
  module: "/item" | "/hscb" | "/spec" | "/doc" | "/partner" | "/bom" | "/allergen-nutrition" | "/facility" | "/trace-backward" | "/barcode";
  moduleLabel: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  content: string;
  createdAt: string; // ISO string
  read: boolean;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    module: "/item",
    moduleLabel: "Master Item",
    type: "warning",
    title: "Sai lệch thông tin ERP",
    content: "Vật tư MST-092 (Bột gia vị mì ăn liền) có sự sai lệch thông tin phiên bản so với ERP (Hệ thống: v2, ERP: v3).",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    read: false,
  },
  {
    id: "notif-2",
    module: "/hscb",
    moduleLabel: "HSCB",
    type: "success",
    title: "Phê duyệt hồ sơ tự công bố",
    content: "Bộ hồ sơ tự công bố sản phẩm Tương ớt CHIN-SU siêu cay (HSCB-2026-CHILISAUCE) đã được duyệt bởi Ban Giám Đốc QA.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    read: false,
  },
  {
    id: "notif-3",
    module: "/spec",
    moduleLabel: "TCCS/Spec",
    type: "warning",
    title: "Spec sắp hết hiệu lực",
    content: "Tiêu chuẩn kỹ thuật TCCS-2024-SUGAR (Đường tinh luyện Masan) sẽ hết hiệu lực sau 15 ngày nữa (ngày 28/07/2026).",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "notif-4",
    module: "/doc",
    moduleLabel: "Chứng từ NCC",
    type: "info",
    title: "Nhà cung cấp bổ sung chứng từ",
    content: "NCC Mekong Food đã tải lên bổ sung Giấy chứng nhận ISO 22000 mới cho sản phẩm Bột ngọt Monosodium.",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    read: false,
  },
  {
    id: "notif-5",
    module: "/partner",
    moduleLabel: "NCC & NSX",
    type: "error",
    title: "NCC hết hiệu lực chứng từ",
    content: "Vật tư Bột ớt cay Masan có nhà cung cấp NCC-012 (Hải Đăng Foods) đã hết hạn chứng chỉ HALAL từ ngày 10/07/2026.",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hours ago
    read: false,
  },
  {
    id: "notif-6",
    module: "/bom",
    moduleLabel: "Cấu trúc BOM",
    type: "success",
    title: "Phiên bản BOM mới",
    content: "Đã cập nhật cấu trúc BOM phiên bản v3.1 áp dụng cho sản phẩm Nước mắm CHIN-SU Hương cá hồi.",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
    read: true,
  },
  {
    id: "notif-7",
    module: "/allergen-nutrition",
    moduleLabel: "Template Dị ứng",
    type: "warning",
    title: "Yêu cầu duyệt Template mới",
    content: "Template Dị ứng & Dinh dưỡng mới (Mẫu TPL-094) của dòng Mì Omachi sườn hầm ngũ quả đang chờ duyệt.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: "notif-8",
    module: "/facility",
    moduleLabel: "Pháp lý DN",
    type: "warning",
    title: "Hồ sơ pháp lý chờ duyệt",
    content: "Hồ sơ cập nhật Giấy phép xả thải mới của nhà máy Masan Bình Dương đã được tải lên và chờ Ban Pháp chế phê duyệt.",
    createdAt: new Date(Date.now() - 1.5 * 24 * 3600 * 1000).toISOString(), // 1.5 days ago
    read: true,
  },
  {
    id: "notif-9",
    module: "/item",
    moduleLabel: "Master Item",
    type: "success",
    title: "Đồng bộ ERP hoàn tất",
    content: "Hệ thống đã đồng bộ thành công 45 danh mục Vật tư và Bao bì mới từ hệ thống SAP ERP tập đoàn.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
    read: true,
  },
  {
    id: "notif-10",
    module: "/hscb",
    moduleLabel: "HSCB",
    type: "info",
    title: "Cập nhật phiên bản HSCB",
    content: "Hồ sơ tự công bố sản phẩm nước tương Nam Ngư đệ nhị có phiên bản cập nhật v1.2 bổ sung chỉ tiêu kim loại nặng.",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-11",
    module: "/spec",
    moduleLabel: "TCCS/Spec",
    type: "info",
    title: "Điều chỉnh chỉ tiêu Spec",
    content: "Đã cập nhật điều chỉnh một số chỉ tiêu lý hóa (độ ẩm, cỡ hạt) của Spec-NVL-2026-SALT (Muối tinh khiết).",
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-12",
    module: "/doc",
    moduleLabel: "Chứng từ NCC",
    type: "success",
    title: "Phê duyệt chứng từ COA",
    content: "Chứng từ COA kiểm nghiệm chất lượng của nhà cung cấp Hải Đăng cho lô Tinh bột sắn TBS-092 đã được thông qua.",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-13",
    module: "/doc",
    moduleLabel: "Chứng từ NCC",
    type: "warning",
    title: "Chứng từ sắp hết hiệu lực",
    content: "Giấy chứng nhận ATVSTP của nhà cung cấp Visan sẽ hết hạn vào ngày 10/08/2026 (còn 28 ngày nữa).",
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-14",
    module: "/doc",
    moduleLabel: "Chứng từ NCC",
    type: "error",
    title: "Chứng từ đã hết hiệu lực",
    content: "Chứng nhận ISO 9001 của nhà cung cấp Đồng Xanh Foods đã chính thức hết hiệu lực từ ngày 01/07/2026.",
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-15",
    module: "/bom",
    moduleLabel: "Cấu trúc BOM",
    type: "info",
    title: "Điều chỉnh liên kết Spec trong BOM",
    content: "BOM của sản phẩm Tương ớt Chinsu siêu cay v2.0 đã được điều chỉnh liên kết mã Spec bao bì chai từ v1 sang v2.",
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-16",
    module: "/facility",
    moduleLabel: "Pháp lý DN",
    type: "warning",
    title: "Pháp lý nhà máy sắp hết hạn",
    content: "Giấy chứng nhận cơ sở đủ điều kiện ATVSTP của nhà máy Masan Nghệ An sắp hết hạn vào ngày 15/08/2026.",
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-17",
    module: "/facility",
    moduleLabel: "Pháp lý DN",
    type: "error",
    title: "Pháp lý đã hết hiệu lực",
    content: "Giấy phép phòng cháy chữa cháy của Kho trung chuyển Masan Sóng Thần đã hết hạn vào ngày 30/06/2026.",
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-18",
    module: "/allergen-nutrition",
    moduleLabel: "Template Dị ứng",
    type: "success",
    title: "Phê duyệt Template thành công",
    content: "Template Dị ứng & Dinh dưỡng của dòng sản phẩm mì Omachi sườn hầm đã được Ban Giám Đốc duyệt áp dụng chính thức.",
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-19",
    module: "/facility",
    moduleLabel: "Pháp lý DN",
    type: "success",
    title: "Cập nhật Đăng ký Doanh nghiệp",
    content: "Đã cập nhật thành công Giấy phép Đăng ký Doanh nghiệp Masan Consumer Holdings mới thay đổi vốn điều lệ.",
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-20",
    module: "/item",
    moduleLabel: "Master Item",
    type: "warning",
    title: "Sai lệch chỉ số độ ẩm vật tư",
    content: "Vật tư hạt tiêu đen xay thô MST-389 có sai lệch chỉ số độ ẩm tiêu chuẩn (12% so với 13% trên ERP).",
    createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    read: true,
  }
];
