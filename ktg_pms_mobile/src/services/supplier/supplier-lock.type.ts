import { Factory, BusinessArea } from "./supplier-law.type";

export interface SupplierLockItem {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  taxCode: string;
  businessTypeName: string;
  businessAreaNames: string;
  createdAt: string;
  status: string;
  statusName: string;
  adjustmentType: "LOCK" | "UNLOCK";
  adjustmentTypeName: string;
  canApprove: boolean;
  supplierCode?: string;
  supplierInfo?: {
    name: string;
    code: string;
  };
  lockTypeName?: string;
  lockType?: string;
  serviceName?: string;
}

export interface SupplierLockDetail {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  taxCode: string;
  businessTypeName: string;
  address: string;
  adjustmentType: string;
  adjustmentTypeName: string;
  status: string;
  statusName: string;
  reasonUpdate: string;
  lstFactory: Factory[];
  lstBusinessArea: BusinessArea[];
  isLockSupplierService: boolean;
  isLockSupplier: boolean;
  isPL: boolean;
  isNL: boolean;
  isUpgradeSupplier: boolean;
  canApprove: boolean;
  supplierInfo: {
    name: string;
    code: string;
    businessTypeName: string;
    address: string;
    lstFactorySupplier: any[];
    lstSupplierService: any[];
  };
  supplierCode?: string;
  lockTypeName?: string;
}

export interface SupplierLockFilterParams {
  pageIndex: number;
  pageSize: number;
  type?: "LS" | "LSS";
  status?: string;
  supplierName?: string;
  code?: string;
  taxCode?: string;
  createdAt?: (string | undefined)[];
  isNotifyApprove?: boolean;
  listTargetId?: string;
  adjustmentType?: "LOCK" | "UNLOCK";
}
