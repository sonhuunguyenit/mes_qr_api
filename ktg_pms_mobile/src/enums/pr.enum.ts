export enum PR_STATUS {
  DRAFT = "H", // Lưu tạm
  SAVED = "S", // Saved
  WAITING_APPROVAL = "W_A", // Chờ duyệt
  APPROVED = "A", // Đã duyệt
  REJECTED = "R", // Từ chối duyệt
  CHECK_AGAIN = "C_A", // Kiểm tra lại
  CANCELLED = "C", // Hủy
  ERROR = "C_PR", // PR lỗi
}

export const PR_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [PR_STATUS.DRAFT]: {
    label: "Lưu tạm",
    color: "#8898AA",
    bgColor: "rgb(136 152 170 / 15%)",
    borderColor: "#8898AA",
  },
  [PR_STATUS.SAVED]: {
    label: "Saved",
    color: "#0063D8",
    bgColor: "rgb(0 99 216 / 15%)",
    borderColor: "#0063D8",
  },
  [PR_STATUS.WAITING_APPROVAL]: {
    label: "Chờ duyệt",
    color: "#F3AF2B",
    bgColor: "rgb(243 175 43 / 15%)",
    borderColor: "#F3AF2B",
  },
  [PR_STATUS.APPROVED]: {
    label: "Đã duyệt",
    color: "#0A915B",
    bgColor: "rgb(10 145 91 / 15%)",
    borderColor: "#0A915B",
  },
  [PR_STATUS.REJECTED]: {
    label: "Từ chối duyệt",
    color: "#F80D53",
    bgColor: "rgb(248 13 83 / 15%)",
    borderColor: "#F80D53",
  },
  [PR_STATUS.CHECK_AGAIN]: {
    label: "Kiểm tra lại",
    color: "#FF49CC",
    bgColor: "rgb(255 73 204 / 15%)",
    borderColor: "#FF49CC",
  },
  [PR_STATUS.CANCELLED]: {
    label: "Hủy",
    color: "#AA0808",
    bgColor: "rgb(170 8 8 / 15%)",
    borderColor: "#AA0808",
  },
  [PR_STATUS.ERROR]: {
    label: "Đóng",
    color: "#1D2D3E",
    bgColor: "rgb(255 255 255 / 15%)",
    borderColor: "#1D2D3E",
  },
};

export const PR_STATUS_DISPLAY = Object.values(PR_STATUS).map((value) => ({
  value,
  label: PR_STATUS_CONFIG[value]?.label || value,
}));

export enum PR_TYPE {
  MRP = "ZPR1", // Yêu cầu mua NVL, vật tư sản xuất (MRP)
  PM = "ZPR2", // Yêu cầu mua hàng bảo trì (PM)
  SPECULATIVE = "ZPR3", // Yêu cầu mua đầu cơ
  MANUAL = "ZPR4", // Yêu cầu mua hàng thủ công
  SO = "ZPR5", // Yêu cầu mua hàng từ SO
  INTEGRATED = "ZPR6", // Yêu cầu mua hàng tích hợp
  SERVICE = "ZPR7", // YC mua DV CT
}

export const PR_TYPE_DISPLAY = [
  {
    value: PR_TYPE.MRP,
    label: "ZPR1 - Yêu cầu mua NVL, vật tư sản xuất (MRP)",
  },
  { value: PR_TYPE.PM, label: "ZPR2 - Yêu cầu mua hàng bảo trì (PM)" },
  { value: PR_TYPE.SPECULATIVE, label: "ZPR3 - Yêu cầu mua đầu cơ" },
  { value: PR_TYPE.MANUAL, label: "ZPR4 - Yêu cầu mua hàng thủ công" },
  { value: PR_TYPE.SO, label: "ZPR5 - Yêu cầu mua hàng từ SO" },
  { value: PR_TYPE.INTEGRATED, label: "ZPR6 - Yêu cầu mua hàng tích hợp" },
  { value: PR_TYPE.SERVICE, label: "ZPR7 - YC mua DV CT" },
];

export enum PR_SOURCE_TYPE {
  PMS = "PMS",
  SAP = "SAP",
}

export const PR_SOURCE_TYPE_DISPLAY = [
  { value: PR_SOURCE_TYPE.PMS, label: "Tạo từ PMS" },
  { value: PR_SOURCE_TYPE.SAP, label: "Đồng bộ từ SAP" },
];

export enum BUDGET_STATUS {
  NEW = "NEW",
  WAIT_EPAY = "WAIT_EPAY",
  REJECT = "REJECT",
  APPROVED = "APPROVED",
}

export const BUDGET_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [BUDGET_STATUS.NEW]: {
    label: "Mới tạo",
    color: "#0063D8",
    bgColor: "rgb(24 144 255 / 15%)",
    borderColor: "#0063D8",
  },
  [BUDGET_STATUS.WAIT_EPAY]: {
    label: "Chờ duyệt",
    color: "#E48617",
    bgColor: "rgb(243 210 36 / 15%)",
    borderColor: "#E48617",
  },
  [BUDGET_STATUS.REJECT]: {
    label: "Từ chối",
    color: "#F6489C",
    bgColor: "rgb(246 72 156 / 15%)",
    borderColor: "#F6489C",
  },
  [BUDGET_STATUS.APPROVED]: {
    label: "Đã duyệt",
    color: "#0A915B",
    bgColor: "rgb(176 245 192 / 15%)",
    borderColor: "#0A915B",
  },
};

export enum PR_CATEGORY_ITEM {
  STOCK = "0", // Tồn kho
  SERVICE = "1", // Dịch vụ
  ASSET = "2", // Tài sản
  OUTSOURCING = "3", // Gia công
}

export const PR_CATEGORY_ITEM_DISPLAY = [
  { value: PR_CATEGORY_ITEM.STOCK, label: "Tồn kho" },
  { value: PR_CATEGORY_ITEM.SERVICE, label: "Dịch vụ" },
  { value: PR_CATEGORY_ITEM.ASSET, label: "Tài sản" },
  { value: PR_CATEGORY_ITEM.OUTSOURCING, label: "Gia công" },
];

export enum VALUATION_TYPE {
  NULL = "Null",
  V15X = "V15X",
  V150 = "V150",
  V155 = "V155",
}

export enum PR_ITEM_CLOSED {
  HOLD = "H", // hold
  CLOSED = "X", // Closed
  DELETE = "L", // Delete
}

export enum PR_TYPE_CONT {
  SUMMARY = "SUMMARY", // PR Tổng hợp
  NORMAL = "NORMAL", // PR Thường
}
