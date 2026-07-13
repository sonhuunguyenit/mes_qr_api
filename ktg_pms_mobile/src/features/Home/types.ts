import { ColorValue } from "react-native";

export interface ModuleItem {
  title: string;
  subtitle?: string;
  count?: number;
  icon?: string;
  type?: string;
  iconType?: string;
  iconSize?: number;
  iconContainerColor?: ColorValue;
  iconColor?: ColorValue;
  permissionCode?: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  iconType?: string;
  iconSize?: number;
  iconColor?: ColorValue;
  iconContainerColor?: ColorValue;
  count?: number;
  badgeText?: string;
  isGroup?: boolean;
  items?: ModuleItem[];
  forceExpand?: boolean;
  permissionCode?: string;
  type?: string;
}

export enum ApproveFlowCode {
  PR = "PR",
  SUPPLIER = "SUPPLIER",
  SAP_CODE = "SAP_CODE",
  RUSL = "RUSL",
  RUSC = "RUSC",
  LS = "LS",
  LSS = "LSS",
  SUPPLIER_UPGRADE = "SUPPLIER_UPGRADE",
  LSMH = "LSMH",
  BID = "BID",
  EVALUATE_RESULT_CAPACITY = "EVALUATE_RESULT_CAPACITY",
  EVALUATE_RESULT_TRADE = "EVALUATE_RESULT_TRADE",
  SUPPLIER_WIN_BID = "SUPPLIER_WIN_BID",
  FINISH_BID = "FINISH_BID",
  PAYMENT = "PAYMENT",
  CONTRACT = "CONTRACT",
  CONTRACT_APPENDIX = "CONTRACT_APPENDIX",
  PO = "PO",
  BUSINESSPLAN = "BUSINESSPLAN",
  APPROVED_RECOMMEND_PURCHASE = "APPROVED_RECOMMEND_PURCHASE",
  USAGE_DEMAND = "USAGE_DEMAND",
  USAGE_DEMAND_SUB = "USAGE_DEMAND_SUB",
  REPAIR_DEMAND = "REPAIR_DEMAND",
  SUPPLIER_POTENTIAL = "SUPPLIER_POTENTIAL",
  MATERIAL_APPROVAL = "MATERIAL_APPROVAL",
}

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
