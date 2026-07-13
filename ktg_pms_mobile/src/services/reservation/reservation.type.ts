import { RESERVATION_STATUS } from "~/enums/reservation.enum";

export interface ReservationFilterParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  notiDate?: string;         // Ngày lập phiếu (Maintenance only - single date)
  keyword?: string;
  plantId?: string;
  departmentId?: string;
  requisitionerId?: string;
  pageIndex?: number;
  pageSize?: number;
  sourceType?: string; // HangHoa or DichVu
  code?: string;
  reservationNo?: string;
  sapCode?: string;
  companyId?: string;
  moduleType?: string; // REPAIR_DEMAND or USAGE_DEMAND
  requisitionerName?: string;
  createdByName?: string;    // Người tạo (Maintenance only)
  order_id?: string;
  equipment?: string;
  order_des?: string;
  orderType?: string;
  departmentName?: string;
  currentApprover?: string;
}

export interface ReservationDetailItem {
  id?: string;
  itemNo: string;
  materialId?: string;
  materialCode?: string;
  materialName?: string;
  shortText?: string;
  quantity: number;
  quantityAlternative?: number;
  uomId?: string;
  uomCode?: string;
  uomName?: string;
  uomAlternativeCode?: string;
  uomAlternativeName?: string;
  expiryDate?: string;
  requirementDate?: string; // Ngày yêu cầu
  requestDate?: string; // Ngày yêu cầu (new)
  batch?: string;
  warehouseIssueSloc?: string;
  warehouseIssueSlocCode?: string;
  warehouseIssueSlocName?: string;
  quota?: string; // Định mức
  norm?: number; // Định mức (new)
  remark?: string; // Ghi chú
  description?: string;

  // Internal helper for UI
  lstUnit?: any[];
  lstMaterial?: any[];
  lstWarehouseIssueSloc?: any[];
}

export interface ReservationApprovalItem {
  id?: string;
  tile?: string; // Vị trí / nhân viên duyệt
  employeeName?: string; // Người duyệt
  approved?: boolean;
  reject?: boolean;
  status?: string;
  comment?: string;
}

export interface ReservationApprovalLevel {
  level?: number;
  lstApprove?: ReservationApprovalItem[];
}

export interface ReservationHistoryItem {
  id?: string;
  createdAt: string;
  createdByName: string;
  description: string;
}

export interface ReservationDetailData {
  id?: string;
  code?: string;
  reservationNo?: string;
  sapCode?: string;
  companyId?: string;
  companyName?: string;
  companyCode?: string;
  companyLabel?: string;
  plantId?: string;
  plantCode?: string;
  plantName?: string;
  plantLabel?: string;
  departmentId?: string;
  departmentCode?: string;
  departmentName?: string;
  departmentLabel?: string;
  requisitionerLabel?: string;
  sourceType?: string; // HangHoa or DichVu
  sourceTypeName?: string;
  requisitionerId?: string;
  requisitionerCode?: string;
  requisitionerName?: string;
  baseDate?: string;
  glAccountId?: string;
  glAccountCode?: string;
  glAccountName?: string;
  glAccountLabel?: string;
  order?: string;
  uses?: string;
  description?: string; // Ghi chú định mức
  status?: RESERVATION_STATUS;
  statusName?: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  createdAt?: string;
  // sync from reservation-detail.component.html:36 → *ngIf="dataObject.isCanApprove && dataObject.status === enumDataStatus.W_A.code"
  isCanApprove?: boolean;
  // sync from reservation.component.html:392 → data.isCreatedItem
  isCreatedItem?: boolean;
  // sync from reservation.component.html:424 → data.canRevert && data.status === W_A
  canRevert?: boolean;

  // Maintenance fields (Nhu cầu sửa chữa)
  createdByName?: string;
  order_des?: string;
  orderType?: string;
  equipmentName?: string;
  notiDate?: string;
  settle_order?: string;
  order_id?: string;
  req_d_start?: string;
  req_h_start?: string;
  req_d_end?: string;
  req_h_end?: string;
  mal_d_start?: string;
  mal_h_start?: string;
  textItem?: string;
  textCauses?: string;
  textActivities?: string;

  lstDetail?: ReservationDetailItem[];
  lstApprovalProgress?: ReservationApprovalLevel[];
  lstHistory?: ReservationHistoryItem[];
  history?: ReservationHistoryItem[];
  employeeName?: string;
}

export interface ReservationItemData {
  id: string;
  code: string;
  reservationNo?: string;
  sapCode?: string;
  sourceType?: string;
  sourceTypeName?: string;
  createdAt: string;

  plantName?: string;
  plantCode?: string;
  requisitionerName?: string;
  requisitionerCode?: string;
  departmentName?: string;
  departmentCode?: string;
  companyCode?: string;
  quantity?: number;
  approvalProgress?: string;
  uses?: string;

  // Maintenance fields (Nhu cầu sửa chữa)
  createdByName?: string;
  order_des?: string;
  orderType?: string;
  equipmentName?: string;
  equipment?: string; // Mã thiết bị trong list
  notiDate?: string;
  order?: string;
  order_id?: string; // Mã PM trong list
  currentApprover?: string; // Người duyệt hiện tại trong list
  currentApprovalName?: string;

  // UI Styles
  status: string;
  statusName: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  // sync from reservation.component.html:377 → *ngIf="data.canApprove && data.status === enumDataStatus.W_A.code"
  canApprove?: boolean;
  // sync from reservation.component.html:424 → data.canRevert && data.status === W_A
  canRevert?: boolean;
}
