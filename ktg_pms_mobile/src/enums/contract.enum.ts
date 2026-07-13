// sync from enumData.ts:1071
export enum ContractStatus {
  TEMPORARY = "TEMPORARY",
  NEW = "NEW",
  WAIT_APPROVE = "WAIT_APPROVE",
  REQUEST_RE_CHECK = "REQUEST_RE_CHECK",
  CANCEL = "CANCEL",
  WAIT_ACTIVE = "WAIT_ACTIVE",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
  REJECT = "REJECT",
}

// sync from enumData.ts:1071
export const ContractStatusConfig = {
  [ContractStatus.TEMPORARY]: { name: "Lưu tạm", color: "#ED9A1F", bgColor: "#FCF0DD", borderColor: "#F5CA89" },
  [ContractStatus.NEW]: { name: "Mới tạo", color: "#0063D8", bgColor: "#DCEEFF", borderColor: "#2A7DDF" },
  [ContractStatus.WAIT_APPROVE]: { name: "Đang duyệt", color: "#ED9A1F", bgColor: "#FCF0DD", borderColor: "#F5CA89" },
  [ContractStatus.REQUEST_RE_CHECK]: { name: "Yêu cầu kiểm tra lại", color: "#AA0808", bgColor: "#E9BFBF", borderColor: "#AA0808" },
  [ContractStatus.CANCEL]: { name: "Hủy", color: "red", bgColor: "#fff1f0", borderColor: "#ffa39e" },
  [ContractStatus.WAIT_ACTIVE]: { name: "Chờ kích hoạt", color: "#ED9A1F", bgColor: "#FCF0DD", borderColor: "#F5CA89" },
  [ContractStatus.PROCESSING]: { name: "Đang thực hiện", color: "#0A915B", bgColor: "#DEF2E0", borderColor: "#0A915B" },
  [ContractStatus.DONE]: { name: "Đóng", color: "#0A915B", bgColor: "#DEF2E0", borderColor: "#0A915B" },
  [ContractStatus.REJECT]: { name: "Từ chối duyệt", color: "#F80D53", bgColor: "rgb(248 13 83 / 15%)", borderColor: "#F80D53" },
};

// sync from enumData.ts:3265
export enum ContractType {
  MK = "MK",
  NT = "NT",
  WK = "WK",
  ZGC1 = "ZGC1",
  ZMB1 = "ZMB1",
  ZMB2 = "ZMB2",
  ZMB3 = "ZMB3",
  ZMB4 = "ZMB4",
  ZNT1 = "ZNT1",
  ZNT2 = "ZNT2",
  ZNT3 = "ZNT3",
  ZNT4 = "ZNT4",
  ZNT5 = "ZNT5",
  ZVC1 = "ZVC1",
}

// sync from enumData.ts:3265
export const ContractTypeConfig = {
  [ContractType.MK]: { name: "Quantity Contract" },
  [ContractType.NT]: { name: "Hợp đồng nguyên tắc" },
  [ContractType.WK]: { name: "Value Contract" },
  [ContractType.ZGC1]: { name: "Hợp đồng gia công" },
  [ContractType.ZMB1]: { name: "Hợp đồng MB NK" },
  [ContractType.ZMB2]: { name: "Hợp đồng MB Nội địa" },
  [ContractType.ZMB3]: { name: "HĐ mua máy móc - CCDC1" },
  [ContractType.ZMB4]: { name: "HĐ mua máy móc - CCDC2" },
  [ContractType.ZNT1]: { name: "Hợp đồng NT NK" },
  [ContractType.ZNT2]: { name: "Hợp đồng NT Nội địa" },
  [ContractType.ZNT3]: { name: "Hợp đồng NT nPL" },
  [ContractType.ZNT4]: { name: "Hợp đồng NT với FW" },
  [ContractType.ZNT5]: { name: "Hợp đồng NT Củi" },
  [ContractType.ZVC1]: { name: "Hợp đồng VC Đường bộ" },
};
