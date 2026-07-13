import { SupplierNumberAprovalStatus } from "../../enums/supplier.enum";

export interface SupplierSapItem {
  id: string;
  name: string;
  code: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  companyId: string;
  companyName: string;
  approvalStatus: SupplierNumberAprovalStatus;
  createdAt: string;
  createdBy: string;
  modifiedAt?: string;
  modifiedBy?: string;
  bpnumber?: string;
  businessTypeName?: string;
  canApprove?: boolean;
  createdByName?: string;
  __supplierNumberRequestApprove__?: {
    isLockBusinessPartner?: boolean;
    isLockSupplier?: boolean;
    isLockFISupplier?: boolean;
  };
}

export interface SupplierSapDetail {
  id: string;
  supplierNumberId: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  bpnumber?: string;
  approvalStatus: SupplierNumberAprovalStatus;
  businessPartnerGroupId?: string;
  companyId?: string;
  // Nhiều trường hơn trên Admin nhưng tập trung vào luồng phê duyệt cốt lõi
  lstRoleFISupplier: any[];
  lstRoleSupplier: any[];
}

export interface SupplierSapFilterParams {
  pageIndex?: number;
  pageSize?: number;
  supplierName?: string;
  name?: string;
  code?: string;
  supplierCode?: string;
  companyId?: string;
  status?: string;
  createdAt?: [string | undefined, string | undefined];
  isNotifyApprove?: boolean;
  createdBy?: string;
  businessPartnerGroupName?: string;
}

export interface SupplierSapApproveRequest {
  id: string;
  supplierId: string;
  businessPartnerGroupId?: string;
}

export interface SupplierSapRecheckRequest {
  id: string;
  listRole: any[];
  objectNote?: any;
}

export interface SupplierPotentialItem {
  id: string;
  name: string;
  code: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  sapCode?: string;
  sapStatus?: string;
  sapStatusName?: string;
  businessTypeName?: string;
  companyCode?: string;
  purchasingGroupName?: string;
  totalSupplierService?: number;
  releaseStatus?: string;
  score?: number;
  supplierGrade?: string;
  status: string;
  statusName?: string;
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
  handlerName?: string; // Tên người đang thực hiện
  canApprove?: boolean;
}

export interface SupplierPotentialFilterParams {
  pageIndex?: number;
  pageSize?: number;
  supplierName?: string;
  name?: string;
  code?: string;
  supplierCode?: string;
  companyCode?: string;
  purchasingGroupName?: string;
  status?: string;
  sapStatus?: string;
  createdAt?: [string, string] | string[];
  createdByName?: string;
  businessTypeName?: string;
  supplierGrade?: string;
  isNotifyApprove?: boolean;
}

export interface SupplierPotentialDetail {
  id: string;
  name: string;
  code: string;
  isPass?: boolean;
  status?: string;
  canApprove?: boolean;
  // Các phần từ screenshot
  generalInfo?: any;
  strategicVision?: any;
  personnel?: any;
  finance?: any;
  rAndD?: any;
  businessAreas?: any[];
}
