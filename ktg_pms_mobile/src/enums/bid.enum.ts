export enum BID_STATUS {
  /** Lưu tạm */
  TEMP = "T",
  /** Mới tạo */
  NEW = "N",
  /** Hoàn thành thiết lập tiêu chí */
  CRITERIA_COMPLETED = "TC",
  /** Chờ duyệt */
  WAITING_APPROVAL = "W_A",
  /** Đang duyệt */
  APPROVING = "P_A",
  /** Yêu cầu kiểm tra lại */
  CHECK_AGAIN = "C_A",
  /** Đang mời thầu */
  BIDDING = "P",
  /** Huỷ */
  CANCELLED = "R",
  /** Đóng */
  CLOSED = "C",
  /** Kết thúc nộp hồ sơ */
  END_SUBMISSION = "E_A",
  /** Đang đánh giá */
  EVALUATING = "E",
  /** Hoàn thành đánh giá */
  EVALUATION_COMPLETED = "F_E",
  /** Đang đấu giá */
  AUCTIONING = "A",
  /** Đang đàm phán giá */
  NEGOTIATING = "B",
  /** Hoàn thành đàm phán */
  NEGOTIATION_COMPLETED = "F_B",
  /** Đã chọn Nhà cung cấp */
  SUPPLIER_SELECTED = "S",
  /** Kiểm tra lại kết quả thầu */
  CHECK_RESULT_AGAIN = "R_C",
  /** Đang duyệt Kết quả thầu */
  APPROVING_RESULT = "D",
  /** Hoàn thành gói thầu */
  COMPLETED_BID = "F_D",
}

export enum BID_TECH_STATUS {
  CHO_DUYET = "ChoDuyet",
  DANG_TAO = "DangTao",
  DA_TAO = "DaTao",
  TU_CHOI = "TuChoi",
  DA_DUYET = "DaDuyet",
}

export enum BID_PURPOSE {
  NVL = "NVL",
  ORDER = "ORDER",
  ASSET = "ASSET",
  TRANSPORT = "TRANSPORT",
}

export const BID_PURPOSE_DISPLAY = [
  { value: BID_PURPOSE.NVL, label: "Đấu thầu mua hàng hóa/NVL" },
  { value: BID_PURPOSE.ORDER, label: "Đấu thầu mua dịch vụ" },
  { value: BID_PURPOSE.ASSET, label: "Đấu thầu mua tài sản" },
  { value: BID_PURPOSE.TRANSPORT, label: "Đấu thầu mua dịch vụ vận chuyển" },
];

export enum BID_TYPE {
  O = "O",
  C = "C",
  A = "A",
}

export const BID_TYPE_DISPLAY = [
  { value: BID_TYPE.O, label: "Đấu thầu rộng rãi" },
  { value: BID_TYPE.C, label: "Đấu thầu hạn chế" },
  { value: BID_TYPE.A, label: "Đấu thầu chỉ định" },
];

export enum BID_REFERENCE {
  PR = "PR",
  PR_TOTAL = "PR_TOTAL",
  NCSD = "NCSD",
  NCSD_TOTAL = "NCSD_TOTAL",
  PAVC = "PAVC",
  NO = "NO",
  NO_ITEM = "NO_ITEM",
}

export const BID_REFERENCE_DISPLAY = [
  { value: BID_REFERENCE.PR, label: "Tham chiếu từ PR" },
  { value: BID_REFERENCE.PR_TOTAL, label: "Tham chiếu từ PR tổng hợp" },
  { value: BID_REFERENCE.NCSD, label: "Tham chiếu từ NCSD" },
  { value: BID_REFERENCE.NCSD_TOTAL, label: "Tham chiếu từ NCSD tổng hợp" },
  { value: BID_REFERENCE.PAVC, label: "Tham chiếu từ Shipment/PAVC" },
  { value: BID_REFERENCE.NO, label: "Không tham chiếu" },
  { value: BID_REFERENCE.NO_ITEM, label: "Không theo Item" },
];

export const BID_STATUS_CONFIG: Record<string, any> = {
  [BID_STATUS.TEMP]: {
    code: "T",
    name: "Lưu tạm",
    color: "#8c8c8c",
    bgColor: "#f5f5f5",
    borderColor: "#d9d9d9",
  },
  [BID_STATUS.NEW]: {
    code: "N",
    name: "Mới tạo",
    color: "#1677ff",
    bgColor: "#e6f4ff",
    borderColor: "#91caff",
  },
  [BID_STATUS.CRITERIA_COMPLETED]: {
    code: "TC",
    name: "Hoàn thành thiết lập tiêu chí",
    color: "#722ed1",
    bgColor: "#f9f0ff",
    borderColor: "#d3adf7",
  },
  [BID_STATUS.WAITING_APPROVAL]: {
    code: "W_A",
    name: "Chờ duyệt",
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
  },
  [BID_STATUS.APPROVING]: {
    code: "P_A",
    name: "Đang duyệt",
    color: "#389e0d",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  [BID_STATUS.CHECK_AGAIN]: {
    code: "C_A",
    name: "Yêu cầu kiểm tra lại",
    color: "#eb2f96",
    bgColor: "#fff0f6",
    borderColor: "#ffadd2",
  },
  [BID_STATUS.BIDDING]: {
    code: "P",
    name: "Đang mời thầu",
    color: "#d4380d",
    bgColor: "#fff2e8",
    borderColor: "#ffbb96",
  },
  [BID_STATUS.CANCELLED]: {
    code: "R",
    name: "Huỷ",
    color: "#cf1322",
    bgColor: "#fff1f0",
    borderColor: "#ffa39e",
  },
  [BID_STATUS.CLOSED]: {
    code: "C",
    name: "Đóng",
    color: "#262626",
    bgColor: "#fafafa",
    borderColor: "#d9d9d9",
  },
  [BID_STATUS.END_SUBMISSION]: {
    code: "E_A",
    name: "Kết thúc nộp hồ sơ",
    color: "#13c2c2",
    bgColor: "#e6fffb",
    borderColor: "#87e8de",
  },
  [BID_STATUS.EVALUATING]: {
    code: "E",
    name: "Đang đánh giá",
    color: "#096dd9",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
  },
  [BID_STATUS.EVALUATION_COMPLETED]: {
    code: "F_E",
    name: "Hoàn thành đánh giá",
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  [BID_STATUS.AUCTIONING]: {
    code: "A",
    name: "Đang đấu giá",
    color: "#fa541c",
    bgColor: "#fff2e8",
    borderColor: "#ffbb96",
  },
  [BID_STATUS.NEGOTIATING]: {
    code: "B",
    name: "Đang đàm phán giá",
    color: "#2f54eb",
    bgColor: "#f0f5ff",
    borderColor: "#adc6ff",
  },
  [BID_STATUS.NEGOTIATION_COMPLETED]: {
    code: "F_B",
    name: "Hoàn thành đàm phán",
    color: "#237804",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  [BID_STATUS.SUPPLIER_SELECTED]: {
    code: "S",
    name: "Đã chọn Nhà cung cấp",
    color: "#a8071a",
    bgColor: "#fff1f0",
    borderColor: "#ffa39e",
  },
  [BID_STATUS.CHECK_RESULT_AGAIN]: {
    code: "R_C",
    name: "Kiểm tra lại kết quả",
    color: "#1a0033",
    bgColor: "#f9f0ff",
    borderColor: "#d3adf7",
  },
  [BID_STATUS.APPROVING_RESULT]: {
    code: "D",
    name: "Đang duyệt Kết quả thầu",
    color: "#722ed1",
    bgColor: "#f9f0ff",
    borderColor: "#d3adf7",
  },
  [BID_STATUS.COMPLETED_BID]: {
    code: "F_D",
    name: "Hoàn thành gói thầu",
    color: "#389e0d",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
};

export const BID_STATUS_DISPLAY = Object.values(BID_STATUS_CONFIG).map(
  (config) => ({
    value: config.code as BID_STATUS,
    label: config.name,
  }),
);

export enum BID_RESET_PRICE_STATUS {
  CHUA_TAO = "ChuaTao",
  DANG_TAO = "DangTao",
  DA_TAO = "DaTao",
  KET_THUC = "KetThuc",
}

export const BID_RATE_ALLOWED_STATUSES = [
  BID_STATUS.EVALUATION_COMPLETED, // F_E
  BID_STATUS.SUPPLIER_SELECTED, // S
];

export const BID_RATE_REJECT_REASONS = [
  { label: "Đánh giá NL, KT", value: "YCKT" },
  { label: "Đánh giá bảng CG, CCG & Đánh giá DKTM", value: "CCG" },
];
