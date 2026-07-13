export enum RESERVATION_STATUS {
  NEW = "N", // Mới tạo
  WAITING_APPROVAL = "W_A", // Chờ duyệt
  CANCELLED = "C", // Hủy
  APPROVED = "A", // Đã duyệt
  REJECTED = "R", // Từ chối duyệt
  PENDING = "PENDING", // Đang duyệt (Maintenance)
}

// sync from enumData.ts:2944-2957
export const RESERVATION_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [RESERVATION_STATUS.NEW]: {
    label: "Mới tạo",
    color: "#0063D8",
    bgColor: "#DCEEFF", // sync from enumData.ts:2945
    borderColor: "#2A7DDF",
  },
  [RESERVATION_STATUS.WAITING_APPROVAL]: {
    label: "Chờ duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD", // sync from enumData.ts:2946
    borderColor: "#F5CA89",
  },
  [RESERVATION_STATUS.CANCELLED]: {
    label: "Hủy",
    color: "red",
    bgColor: "#fff1f0", // sync from enumData.ts:2947
    borderColor: "#ffa39e",
  },
  [RESERVATION_STATUS.APPROVED]: {
    label: "Đã duyệt",
    color: "#0A915B",
    bgColor: "#DEF2E0", // sync from enumData.ts:2948
    borderColor: "#0A915B",
  },
  [RESERVATION_STATUS.REJECTED]: {
    label: "Từ chối duyệt",
    color: "#F80D53",
    bgColor: "rgb(248 13 83 / 15%)", // sync from enumData.ts:2953
    borderColor: "#F80D53",
  },
  [RESERVATION_STATUS.PENDING]: {
    label: "Đang duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD", // sync from enumData.ts:2946 (same as W_A)
    borderColor: "#F5CA89",
  },
};

export const RESERVATION_STATUS_DISPLAY = Object.values(RESERVATION_STATUS).map(
  (value) => ({
    value,
    label: RESERVATION_STATUS_CONFIG[value]?.label || value,
  }),
);

export enum RESERVATION_TYPE {
  COMMODITY = "HangHoa", // Hàng hóa
  SERVICE = "DichVu", // Dịch vụ
}

export const RESERVATION_TYPE_DISPLAY = [
  { value: RESERVATION_TYPE.COMMODITY, label: "Hàng hóa" },
  { value: RESERVATION_TYPE.SERVICE, label: "Dịch vụ" },
];

// --- Reservation Maintenance (Nhu cầu sửa chữa) Enums (1:1 with Web Admin enumData.ReservationMaintenanceStatus) ---
export enum RESERVATION_MAINTENANCE_STATUS {
  NEW = "NEW",
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  REQUEST_REVIEW = "REQUEST_REVIEW",
}

export const RESERVATION_MAINTENANCE_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [RESERVATION_MAINTENANCE_STATUS.NEW]: {
    label: "Mới tạo",
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
  },
  [RESERVATION_MAINTENANCE_STATUS.DRAFT]: {
    label: "Lưu Tạm",
    color: "#d9d9d9",
    bgColor: "#fafafa",
    borderColor: "#d9d9d9",
  },
  [RESERVATION_MAINTENANCE_STATUS.PENDING]: {
    label: "Đang duyệt",
    color: "#faad14",
    bgColor: "#fffbe6",
    borderColor: "#ffe58f",
  },
  [RESERVATION_MAINTENANCE_STATUS.APPROVED]: {
    label: "Đã duyệt",
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  [RESERVATION_MAINTENANCE_STATUS.REJECTED]: {
    label: "Từ chối",
    color: "#f5222d",
    bgColor: "#fff1f0",
    borderColor: "#ffa39e",
  },
  [RESERVATION_MAINTENANCE_STATUS.REQUEST_REVIEW]: {
    label: "Yêu cầu kiểm tra lại",
    color: "#ff9800",
    bgColor: "#fff3e0",
    borderColor: "#ffb74d",
  },
};

export const RESERVATION_MAINTENANCE_STATUS_DISPLAY = Object.values(
  RESERVATION_MAINTENANCE_STATUS,
).map((value) => ({
  value,
  label: RESERVATION_MAINTENANCE_STATUS_CONFIG[value]?.label || value,
}));

// // sync from enumData.ts:5091-5113
export const MAINTENANCE_NOTIFICATION_TYPES = [
  { label: "Bảo dưỡng xe Sản xuất", value: "X1", type: "xe" },
  { label: "Bảo dưỡng xe Bán hàng", value: "X2", type: "xe" },
  { label: "Bảo dưỡng xe Quản lý", value: "X3", type: "xe" },
  { label: "Sửa chữa xe Sản xuất", value: "X4", type: "xe" },
  { label: "Sửa chữa xe Bán hàng", value: "X5", type: "xe" },
  { label: "Sửa chữa xe Quản lý", value: "X6", type: "xe" },
  { label: "Thay vỏ xe Sản xuất", value: "X7", type: "xe" },
  { label: "Thay vỏ xe Bán hàng", value: "X8", type: "xe" },
  { label: "Thay vỏ xe Quản lý", value: "X9", type: "xe" },
  { label: "Xuất BTBD CSHT SX", value: "M6", type: "none" },
  { label: "Xuất BTBD CSHT BH", value: "CB", type: "none" },
  { label: "Xuất BTBD CSHT QL", value: "CQ", type: "none" },
  { label: "BTBD CNTT Chung", value: "I0", type: "none" },
  { label: "BTBD CNTT PB Ngắn hạn", value: "I1", type: "none" },
  { label: "BTBD CNTT PB Dài hạn", value: "I2", type: "none" },
  { label: "BTBD Máy In, photo SX", value: "H1", type: "none" },
  { label: "BTBD Máy In, photo BH", value: "H2", type: "none" },
  { label: "BTBD Máy In, photo QL", value: "H3", type: "none" },
  { label: "BTBD HC khác Sản xuất", value: "H4", type: "none" },
  { label: "BTBD HC khác Bán hàng", value: "H5", type: "none" },
  { label: "BTBD HC khác Quản lý", value: "H6", type: "none" },
];
