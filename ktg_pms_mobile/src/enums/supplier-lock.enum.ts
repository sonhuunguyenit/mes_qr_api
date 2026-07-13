export enum SupplierLockType {
  LOCK = "LOCK",
  UNLOCK = "UNLOCK",
}

export const SUPPLIER_LOCK_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [SupplierLockType.LOCK]: {
    label: "Khóa",
    color: "#AA0808",
    bgColor: "#E9BFBF",
    borderColor: "#AA0808",
  },
  [SupplierLockType.UNLOCK]: {
    label: "Mở Khóa",
    color: "#0A915B",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
};

export const SUPPLIER_LOCK_TYPE_OPTIONS = [
  { id: undefined, name: "Tất cả" },
  { id: SupplierLockType.LOCK, name: "Khóa" },
  { id: SupplierLockType.UNLOCK, name: "Mở Khóa" },
];
