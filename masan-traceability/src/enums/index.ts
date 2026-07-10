export enum ItemType {
  FG = "FG",
  IP = "IP",
  RM = "RM",
  PG = "PG",
}

export const ItemTypeConfig: Record<
  ItemType,
  { label: string; color: string }
> = {
  [ItemType.FG]: { label: "Thành phẩm (FG)", color: "blue" },
  [ItemType.IP]: { label: "Bán thành phẩm (IP)", color: "purple" },
  [ItemType.RM]: { label: "Nguyên liệu (RM)", color: "green" },
  [ItemType.PG]: { label: "Bao bì (PG)", color: "orange" },
};

export enum ShttType {
  PRIMARY_BRAND = "PRIMARY_BRAND",
  SECONDARY_BRAND = "SECONDARY_BRAND",
  INDUSTRIAL_DESIGN = "INDUSTRIAL_DESIGN",
}

export const ShttTypeConfig: Record<
  ShttType,
  { label: string; color: string }
> = {
  [ShttType.PRIMARY_BRAND]: { label: "Nhãn chính", color: "purple" },
  [ShttType.SECONDARY_BRAND]: { label: "Nhãn phụ", color: "magenta" },
  [ShttType.INDUSTRIAL_DESIGN]: {
    label: "Kiểu dáng công nghiệp",
    color: "orange",
  },
};

export enum TraceabilityDirection {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export const TraceabilityDirectionConfig: Record<
  TraceabilityDirection,
  { label: string; color: string }
> = {
  [TraceabilityDirection.FORWARD]: { label: "Truy xuất xuôi", color: "blue" },
  [TraceabilityDirection.BACKWARD]: {
    label: "Truy xuất ngược",
    color: "green",
  },
};

export enum RecallStatus {
  INITIATED = "INITIATED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const RecallStatusConfig: Record<
  RecallStatus,
  { label: string; color: string }
> = {
  [RecallStatus.INITIATED]: { label: "Đã khởi tạo", color: "blue" },
  [RecallStatus.COMPLETED]: { label: "Đã hoàn thành", color: "green" },
  [RecallStatus.CANCELLED]: { label: "Đã hủy", color: "red" },
};

export enum IpmsStatus {
  VALID = "Valid",
  INVALID = "Invalid",
}

export const IpmsStatusConfig: Record<
  IpmsStatus,
  { label: string; color: string }
> = {
  [IpmsStatus.VALID]: { label: "Valid", color: "success" },
  [IpmsStatus.INVALID]: { label: "Invalid", color: "error" },
};
