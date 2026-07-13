export enum SupplierNumberAprovalStatus {
  NEW = "NEW",
  IMPORTING = "IMPORTING",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  RECHECK = "RECHECK",
  ERROR = "ERROR",
}

export const SUPPLIER_NUMBER_APPROVAL_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [SupplierNumberAprovalStatus.NEW]: {
    label: "Mới tạo",
    color: "#0063D8",
    bgColor: "#DCEEFF",
    borderColor: "#2A7DDF",
  },
  [SupplierNumberAprovalStatus.IMPORTING]: {
    label: "Đang nhập liệu",
    color: "#99e2f9",
    bgColor: "#e6fcf9",
    borderColor: "#99e2f9",
  },
  [SupplierNumberAprovalStatus.PENDING]: {
    label: "Chờ duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
  [SupplierNumberAprovalStatus.APPROVED]: {
    label: "Đã duyệt",
    color: "#0A915B",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  [SupplierNumberAprovalStatus.RECHECK]: {
    label: "Kiểm tra lại",
    color: "red",
    bgColor: "#fff1f0",
    borderColor: "#ffa39e",
  },
  [SupplierNumberAprovalStatus.ERROR]: {
    label: "Lỗi đồng bộ",
    color: "#AA0808",
    bgColor: "#E9BFBF",
    borderColor: "#AA0808",
  },
};

export enum SupplierPotentialUpgradeStatus {
  New = "New",
  SentSupplier = "SentSupplier",
  SupplierRespond = "SupplierRespond",
  ReCheck = "ReCheck",
  WaitSapCode = "WaitSapCode",
  WaitApprove = "WaitApprove",
  Approved = "Approved",
}

export const SUPPLIER_POTENTIAL_UPGRADE_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [SupplierPotentialUpgradeStatus.New]: {
    label: "Mới tạo",
    color: "#0063D8",
    bgColor: "#DCEEFF",
    borderColor: "#2A7DDF",
  },
  [SupplierPotentialUpgradeStatus.SentSupplier]: {
    label: "Đã gửi NCC",
    color: "#FF49CC",
    bgColor: "#FFCDF1",
    borderColor: "#FF5BD0",
  },
  [SupplierPotentialUpgradeStatus.SupplierRespond]: {
    label: "NCC đã phản hồi",
    color: "red",
    bgColor: "#fff1f0",
    borderColor: "#ffa39e",
  },
  [SupplierPotentialUpgradeStatus.ReCheck]: {
    label: "Yêu cầu kiểm tra lại",
    color: "#556B81",
    bgColor: "#E5E9EC",
    borderColor: "#556B81",
  },
  [SupplierPotentialUpgradeStatus.WaitSapCode]: {
    label: "Chờ tạo mã SAP",
    color: "#0D16F8",
    bgColor: "#DBDCFE",
    borderColor: "#0D16F8",
  },
  [SupplierPotentialUpgradeStatus.WaitApprove]: {
    label: "Chờ duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
  [SupplierPotentialUpgradeStatus.Approved]: {
    label: "Đã duyệt",
    color: "#0A915B",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  // PENDING is used in the mobile app's default filters
  PENDING: {
    label: "Chờ duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
  InReview: {
    label: "Đang duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
};

export enum SupplierExpertiseStatus {
  DangThamDinh = "DangThamDinh",
  DaThamDinh = "DaThamDinh",
  KhongDuyetQT2 = "KhongDuyetQT2",
}

export enum SupplierExpertiseLawStatus {
  ChuaThamDinh = "ChuaThamDinh",
  KhongThamDinh = "KhongThamDinh",
  DaThamDinh = "DaThamDinh",
}

export enum SupplierExpertiseCapacityStatus {
  ChuaThamDinh = "ChuaThamDinh",
  GuiDuyet = "GuiDuyet",
  DaThamDinh = "DaThamDinh",
}
