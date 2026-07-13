export enum MaterialStatus {
  TEMPORARY = "TEMPORARY",
  NEW = "NEW",
  INPUTTING = "INPUTTING",
  WAIT_APPROVE = "WAIT_APPROVE",
  RECHECK = "RECHECK",
  ACTIVE = "ACTIVE",
  LOCKED = "LOCKED",
}

export const MATERIAL_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [MaterialStatus.TEMPORARY]: {
    label: "Lưu tạm",
    color: "#ED9A1F",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
  [MaterialStatus.NEW]: {
    label: "Mới tạo",
    color: "#0063D8",
    bgColor: "#DCEEFF",
    borderColor: "#2A7DDF",
  },
  [MaterialStatus.INPUTTING]: {
    label: "Đang nhập liệu",
    color: "#2F54EB",
    bgColor: "#F0F5FF",
    borderColor: "#ADC6FF",
  },
  [MaterialStatus.WAIT_APPROVE]: {
    label: "Đang duyệt",
    color: "#ED9A1F",
    bgColor: "#FCF0DD",
    borderColor: "#F5CA89",
  },
  [MaterialStatus.RECHECK]: {
    label: "Đang kiểm tra lại",
    color: "#AA0808",
    bgColor: "#E9BFBF",
    borderColor: "#AA0808",
  },
  [MaterialStatus.ACTIVE]: {
    label: "Hoạt động",
    color: "#0A915B",
    bgColor: "#DEF2E0",
    borderColor: "#0A915B",
  },
  [MaterialStatus.LOCKED]: {
    label: "Đang khóa",
    color: "#AA0808",
    bgColor: "#FFF1F0",
    borderColor: "#FFA39E",
  },
};

export const MATERIAL_ACTIVE_STATUS_CONFIG = {
  active: {
    label: "Hoạt động",
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#52c41a",
  },
  inactive: {
    label: "Không hoạt động",
    color: "#ff4d4f",
    bgColor: "#fff1f0",
    borderColor: "#ff4d4f",
  },
};
