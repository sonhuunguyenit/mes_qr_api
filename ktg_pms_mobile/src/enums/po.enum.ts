export enum PO_STATUS {
  HOLD = "HOLD",
  PARK = "PARK",
  SAVED = "SAVED",
  DELIVERYREFUSE = "DELIVERYREFUSE",
  DELIVERY = "DELIVERY",
  CHECK_AGAIN = "CHECK_AGAIN",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  COMPLETE = "COMPLETE",
  CANCEL = "CANCEL",
  CLOSED = "CLOSED",
  APPROVED = "APPROVED",
  REJECT = "REJECT",
}

export const PO_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [PO_STATUS.HOLD]: {
    label: "Lưu tạm",
    color: "#0063D8",
    bgColor: "#DCEEFF",
    borderColor: "#2A7DDF",
  },
  [PO_STATUS.PARK]: {
    label: "Parked",
    color: "darkorange",
    bgColor: "#F5CA89",
    borderColor: "#EFCE22",
  },
  [PO_STATUS.SAVED]: {
    label: "Saved",
    color: "#0A915B",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  [PO_STATUS.WAITING_APPROVAL]: {
    label: "Chờ duyệt",
    color: "#EFCE22",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
  [PO_STATUS.APPROVED]: {
    label: "Đã duyệt",
    color: "#008000",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  [PO_STATUS.REJECT]: {
    label: "Từ chối",
    color: "#cf1322",
    bgColor: "#ffa39e",
    borderColor: "#E11F1F",
  },
  [PO_STATUS.CHECK_AGAIN]: {
    label: "Kiểm tra lại",
    color: "orangered",
    bgColor: "#FCF0DD",
    borderColor: "orangered",
  },
  [PO_STATUS.CANCEL]: {
    label: "Hủy",
    color: "#cf1322",
    bgColor: "#ffa39e",
    borderColor: "#E11F1F",
  },
  [PO_STATUS.CLOSED]: {
    label: "Đóng",
    color: "#008000",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  [PO_STATUS.COMPLETE]: {
    label: "Hoàn thành",
    color: "#008000",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  [PO_STATUS.DELIVERYREFUSE]: {
    label: "NCC từ chối giao hàng",
    color: "orangered",
    bgColor: "#FCF0DD",
    borderColor: "orangered",
  },
  [PO_STATUS.DELIVERY]: {
    label: "NCC giao hàng",
    color: "#ff409c",
    bgColor: "#ffeff7",
    borderColor: "#ff409c",
  },
};

export enum PO_BUDGET_STATUS {
  NEW = "NEW",
  WAIT_EPAY = "WAIT_EPAY",
  APPROVED = "APPROVED",
  REJECT = "REJECT",
}

export enum PO_REFERENCE_SOURCE {
  CONTRACT = "CONTRACT",
  PR = "PR",
  RECOMMENDED_PURCHASE = "RECOMMENDED_PURCHASE",
  RESERVATION = "RESERVATION",
  BID = "BID",
  AUCTION = "AUCTION",
  NONE = "NONE",
  SHIPMENT_COST = "SHIPMENT_COST",
}

export const PO_STATUS_DISPLAY = Object.values(PO_STATUS).map((value) => ({
  value,
  label: PO_STATUS_CONFIG[value]?.label || value,
}));

export const PO_REFERENCE_SOURCE_DISPLAY = [
  { label: "Tất cả", value: undefined },
  { label: "Hợp đồng", value: PO_REFERENCE_SOURCE.CONTRACT },
  { label: "Đấu thầu", value: PO_REFERENCE_SOURCE.BID },
  { label: "Đấu giá", value: PO_REFERENCE_SOURCE.AUCTION },
  { label: "Yêu Cầu Mua Hàng", value: PO_REFERENCE_SOURCE.PR },
  { label: "Nhu cầu sử dụng", value: PO_REFERENCE_SOURCE.RESERVATION },
  {
    label: "Đề nghị mua hàng",
    value: PO_REFERENCE_SOURCE.RECOMMENDED_PURCHASE,
  },
  { label: "Shipment cost", value: PO_REFERENCE_SOURCE.SHIPMENT_COST },
  { label: "Không tham chiếu", value: PO_REFERENCE_SOURCE.NONE },
];

export const PO_BUDGET_STATUS_DISPLAY = [
  { label: "Tất cả", value: undefined },
  { label: "Mới tạo", value: PO_BUDGET_STATUS.NEW },
  { label: "Chờ duyệt", value: PO_BUDGET_STATUS.WAIT_EPAY },
  { label: "Đã duyệt", value: PO_BUDGET_STATUS.APPROVED },
  { label: "Từ chối", value: PO_BUDGET_STATUS.REJECT },
];

/** Map typePO code → display name (matches Angular enumData.POType) */
export const PO_TYPE_DISPLAY: Record<string, string> = {
  ZPO1: "ĐH trong nước",
  ZPO2: "ĐH Nhập khẩu",
  ZPO3: "Đơn hàng nội bộ",
  ZPO4: "Đơn hàng điều chuyển",
  ZPO5: "ĐH trả",
  ZPO6: "ĐH trả nội bộ",
  ZPO7: "ĐH gia công",
  ZPO8: "ĐH mua TSXDCB, DA",
  ZPO9: "ĐH Dịch vụ",
  ZP11: "ĐH bổ sung",
  ZP13: "ĐH mua thu hồi Rulo",
  ZP14: "Điều chuyển hàng gửi",
  ZP15: "ĐH Third Party",
  ZP16: "ĐH vật tư bảo hành",
  ZP17: "Đơn hàng đặt nội bộ",
  ZP18: "Đơn hàng mua qua hợp đồng",
  ZP19: "ĐH điều chuyển KES",
  ZP20: "ĐH DV ngoài ĐM-CTSK",
  ZP21: "ĐH nội bộ (E)",
};

/** Map partnerFunctionCode → display name (matches Angular enumData.POFunction) */
export const PO_FUNCTION_DISPLAY: Record<string, string> = {
  VN: "Vendor",
  PI: "Invoicing Party",
  GS: "Goods supplier",
  Z1: "Manufacturer",
  Z2: "NV Mua hàng",
  Z8: "Trưởng phòng",
  Z9: "Nhà sản xuất",
};

/** Map partnerType code → display name (matches Angular enumData.PoPartnerType) */
export const PO_PARTNER_TYPE_DISPLAY: Record<string, string> = {
  EMPLOYEE: "Nhân viên",
  SUPPLIER: "Nhà cung cấp",
};

export enum PO_PAYMENT_STATUS {
  PAID = "PAID",
  UNPAIND = "UNPAIND",
  PARTIAL = "PARTIAL",
}

export const PO_PAYMENT_STATUS_DISPLAY = [
  { label: "Tất cả", value: undefined },
  { label: "Đã thanh toán", value: PO_PAYMENT_STATUS.PAID },
  { label: "Chưa thanh toán", value: PO_PAYMENT_STATUS.UNPAIND },
  { label: "Thanh toán một phần", value: PO_PAYMENT_STATUS.PARTIAL },
];

export enum PO_ORDER_STATUS {
  REVICED = "REVICED", // Đã nhận đơn
  DOING = "DOING", // Đang sản xuất
  EXPECT_COMPLETE = "EXPECT_COMPLETE", // Dự kiến hoàn thành
  INVENTORY = "INVENTORY", // Đang tồn kho
  WAIT_REPLY = "WAIT_REPLY", // Chờ NCC phản hồi
  COMPLETE = "COMPLETE", // Hoàn thành
}

export const PO_ORDER_STATUS_DISPLAY = [
  { label: "Tất cả", value: undefined },
  { label: "Đã nhận đơn", value: PO_ORDER_STATUS.REVICED },
  { label: "Đang sản xuất", value: PO_ORDER_STATUS.DOING },
  { label: "Dự kiến hoàn thành", value: PO_ORDER_STATUS.EXPECT_COMPLETE },
  { label: "Đang tồn kho", value: PO_ORDER_STATUS.INVENTORY },
  { label: "Chờ NCC phản hồi", value: PO_ORDER_STATUS.WAIT_REPLY },
  { label: "Hoàn thành", value: PO_ORDER_STATUS.COMPLETE },
];

export enum PO_ROLE_CODE {
  VIEW = "VIEW",
  EDIT = "EDIT",
  CONFIRM = "COMFIRM",
  PAYMENT = "PURCHASEORDERPAYMENT",
  CANCEL = "CANCEL",
}
