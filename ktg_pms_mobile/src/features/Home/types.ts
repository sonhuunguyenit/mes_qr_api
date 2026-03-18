import { ColorValue } from "react-native";

export interface ModuleItem {
  title: string;
  subtitle?: string;
  count?: number;
  icon?: string;
  bgColor?: ColorValue;
  iconColor?: ColorValue;
  type?: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  iconType?: string;
  iconColor?: ColorValue;
  bgColor?: ColorValue;
  count?: number;
  badgeText?: string;
  isGroup?: boolean;
  items?: ModuleItem[];
  forceExpand?: boolean;
}

export type ApproveType =
  | "PR"
  | "SUPPLIER"
  | "SAP_CODE"
  | "RUSL"
  | "RUSC"
  | "LS"
  | "LSS"
  | "SUPPLIER_UPGRADE"
  | "LSMH"
  | "BID"
  | "EVALUATE_RESULT_CAPACITY"
  | "EVALUATE_RESULT_TRADE"
  | "SUPPLIER_WIN_BID"
  | "FINISH_BID"
  | "PAYMENT"
  | "CONTRACT"
  | "CONTRACT_APPENDIX"
  | "PO"
  | "BUSINESSPLAN"
  | "APPROVED_RECOMMEND_PURCHASE";

export interface ApproveItem {
  id: string;
  targetId: string;
  level: number;
  mustApproveAll: boolean;
  approved: boolean;
}

export interface ApprovalGroup {
  type: string; // Hoặc dùng ApproveType
  typeName: string;
  totalApprove: number;

  // Mảng các item duyệt (chỉ có ở group cha và một số group con)
  lstApprove?: ApproveItem[];

  // Mảng các ID đích (thường là danh sách targetId từ lstApprove)
  listTargetId?: string[];

  // Mảng con (chỉ xuất hiện ở group cha, ví dụ: SUPPLIER)
  children?: ApprovalGroup[];
}
