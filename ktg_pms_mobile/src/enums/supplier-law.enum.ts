export enum SupplierLawStatus {
  NEW = "NEW",
  WAIT_APPROVE = "WAIT_APPROVE",
  APPROVED = "APPROVED",
  CANCEL = "CANCEL",
  DESTROY = "DESTROY",
}

export const SUPPLIER_LAW_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [SupplierLawStatus.NEW]: {
    label: "Mới tạo",
    color: "#0063D8",
    bgColor: "#DCEEFF",
    borderColor: "#2A7DDF",
  },
  [SupplierLawStatus.WAIT_APPROVE]: {
    label: "Đang duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
  [SupplierLawStatus.APPROVED]: {
    label: "Đã duyệt",
    color: "#0A915B",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  [SupplierLawStatus.CANCEL]: {
    label: "Từ chối",
    color: "#AA0808",
    bgColor: "#E9BFBF",
    borderColor: "#AA0808",
  },
  [SupplierLawStatus.DESTROY]: {
    label: "Hủy",
    color: "#64748B",
    bgColor: "#F1F5F9",
    borderColor: "#CBD5E1",
  },
};

export const SUPPLIER_LAW_STATUS_OPTIONS = [
  { id: "ALL", name: "Tất cả" },
  { id: SupplierLawStatus.NEW, name: "Mới tạo" },
  { id: SupplierLawStatus.WAIT_APPROVE, name: "Đang duyệt" },
  { id: SupplierLawStatus.APPROVED, name: "Đã duyệt" },
  { id: SupplierLawStatus.CANCEL, name: "Từ chối" },
];

