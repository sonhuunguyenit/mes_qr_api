export interface PRFilterParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  prType?: string;
  plantId?: string;
  purchaseGroup?: string;
  pmsNo?: string;
  sapNo?: string;
  externalMaterialGroupId?: string;
  createdBy?: string;
  pageIndex?: number;
  pageSize?: number;
  isParentItem?: number;
  listTargetId?: string;
  moduleType?: string;

  // Extra fields from Admin
  uses?: string;
  totalValueFrom?: number | string;
  totalValueTo?: number | string;
  budgetShortageFrom?: number | string;
  budgetShortageTo?: number | string;
  budgetStatus?: string;
  sourceType?: string;
}

export interface PRMediaFile {
  id?: string;
  fileUrl: string;
  fileName?: string;
  dataType?: string;
}

export interface PRReleaseItem {
  id: string;
  level: number;
  title: string;
  employeeName: string;
  approved: boolean;
  reject: boolean;
  comment?: string;
  status?: string;
  employeeId?: string;
  employeePositionId?: string;
}

export interface PRReleaseLevel {
  level: number;
  lstApprove: PRReleaseItem[];
}

export interface PRHistoryItem {
  id: string;
  createdAt: string;
  createdByName: string;
  description: string;
}

export interface PRBudgetReceiptItem {
  id: string;
  budgetReceiptCode: string;
  budgetPeriod: string;
  createdAt: string;
  moneyPropose: number | string;
  status?: string;
  statusName?: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  employeeName?: string;
  fund?: string;
  fc?: string;
  fp?: string;
  ci?: string;
}

export interface PRDetailItem {
  id: string;
  itemNo: string;
  materialCode: string;
  shortText: string;
  quantity: number;
  unitName: string;
  valuationPrice: number;
  total: number;
  budget: number;
  plantCode?: string;
  plantName?: string;
  deliveryDate?: string;
  itemClosed?: string | null;
  itemDeleted?: string | null;
  costCenterCode?: string;
  assetCode?: string;
  assetDesc?: string;
  orderCode?: string;
  ioName?: string;
  glAccountCode?: string;
  glAccountName?: string;
  fund?: string;
  fc?: string;
  fp?: string;
  ci?: string;
  aufc?: string;
  fileList?: PRMediaFile[];
  acccate?: string;
  category?: string;
  materialGroupCode?: string;
  materialGroupName?: string;
  externalMaterialGroupCode?: string;
  externalMaterialGroupName?: string;
  ounName?: string;
  purchasingGroupCode?: string;
  purchasingGroupName?: string;
  purchasingOrgCode?: string;
  purchasingOrgName?: string;
  requisitioner?: string;
  mrp_areas?: string;
  omrp?: string;
  fix_vendor?: string;
  trackingNumber?: string;
  sloc?: string;
  coa?: string;
  subNoAset?: number | string;
  puorg?: string;
  pugroup?: string;
  pugrp?: string;
  fmcontrol?: string;
  sku?: string;
  skuCode?: string;
  companyCode?: string;
}

export interface PRItemData {
  id: string;
  code: string;
  sapCode?: string;
  creator: string;
  createdByName?: string;
  createdByCode?: string;
  date: string;
  createdAt: string;
  createdTimeAt?: string;
  status: string;
  statusName: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  totalValue?: string | number;
  budget?: number;
  description: string;
  prType?: string;
  prTypeName?: string;
  plant?: string;
  plantCode?: string;
  plantId?: string;
  plantName?: string;
  plantLable?: string;
  uses?: string;
  budgetStatus?: string;
  listTargetId?: string;
  purchasingGroupCode?: string;
  purchasingGroupName?: string;
  sourceTypeName?: string;
  headerNote?: string;
  approvalProgress?: string;
  sourceType?: string;
  budgetMissing?: number;
  externalMaterialGroupName?: string;
  externalMatGroupCode?: string;
  externalMatGroupName?: string;
  lstExternalMaterialGroup?: { code?: string; name?: string }[];
  budgetStatusName?: string;
  budgetStatusColor?: string;
  budgetStatusBgColor?: string;
  departmentName?: string;
  requisitionerName?: string;
  prParentCode?: string;
  sumTotal?: number;
  companyCode?: string;
  subNoAset?: number | string;
  canApprove?: boolean;
  lstMediaFile?: PRMediaFile[];
  lstDetail?: PRDetailItem[];
  lstApprovalProgress?: PRReleaseLevel[];
  lstBudgetReceiptItem?: PRBudgetReceiptItem[];
  lstHistories?: PRHistoryItem[];
}

export interface PRFilterOption {
  value: string;
  label: string;
  color?: string;
}

export interface PRActionRequest {
  id: string;
  [key: string]: any; // Fallback for various data fields sent in complex actions
}

export interface PRUpdateStatusRequest extends PRItemData {
  lstDetail?: PRDetailItem[];
  subNoAset?: number | string;
}

export interface PRFilterOptionsResponse {
  statuses: PRFilterOption[];
  prTypes: PRFilterOption[];
  plants: PRFilterOption[];
  purchaseGroups: PRFilterOption[];
  externalMaterialGroups?: PRFilterOption[];
}
