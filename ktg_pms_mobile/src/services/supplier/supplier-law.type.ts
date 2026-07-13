export interface LegalRepresentative {
  name: string;
  position: string;
  phone: string;
  fax: string;
  email: string;
  taxType: string;
  taxCode: string;
  idType: string;
  idNumber: string;
  note: string;
}

export interface BankAccount {
  countryId: string;
  countryName?: string;
  regionId: string;
  regionName?: string;
  bankId: string;
  bankName?: string;
  bankBranchId: string;
  bankBranchName?: string;
  bankNumber: string;
  accountNumber: string;
  bankUsername: string;
  swiftCode: string;
  iban: string;
  fileAccount: string;
  isRemove?: boolean;
}

export interface RevenueHistory {
  year: string;
  revenue: number;
}

export interface Factory {
  name: string;
  address: string;
  phone: string;
  fax: string;
}

export interface BusinessArea {
  id: string;
  name: string;
}

export interface SupplierLawData {
  name: string;
  dealName: string;
  abbreviation: string;
  businessTypeName: string;
  countryId: string;
  countryName: string;
  regionId: string;
  regionName: string;
  regionCode: string;
  address: string;
  postalCode: string;
  dealAddress: string;
  dealAddress2: string;
  dealAddress3: string;
  dealAddress4: string;
  dealAddress5: string;
  note: string;
  phone: string;
  email: string;
  fax: string;
  website: string;
  dateFound: string;
  capital: number;
  assets: number;
  dateStart: string;
  chief: string;
  contactName: string;
  description: string;
  fileBill: string;
  fileInfoBill: string;
  fileMST: string;
  conditionalBusinessLicense: string;
  lstLegalRepresentative: LegalRepresentative[];
  lstBank: BankAccount[];
  revenueHistory: RevenueHistory[];
  lstFactory?: Factory[];
  lstBusinessArea?: BusinessArea[];
  taxCode?: string;
  createYear?: string;
  isInternal?: boolean;
  isClient?: boolean;
}

export interface SupplierLawItem {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  supplierInfo?: { name: string; code?: string };
  taxCode: string;
  businessTypeName: string;
  createdAt: string;
  status: string;
  statusName: string;
  jsonLaw?: string;
  objPermissionApprove: {
    RUSL: boolean;
    RUSC: boolean;
    SPL: boolean;
    SNL: boolean;
  };
  canApprove: boolean;
  level: number;
}

export interface SupplierLawDetail {
  taxCode?: string;
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  status: string;
  reasonUpdate: string;
  fileAttachment: string;
  oldJson: string;
  newJson: string;
  supplierInfo: any;
  jsonNew: {
    lstBank: BankAccount[];
  };
  level: number;
  isPL?: boolean;
  isNL?: boolean;
  isLockSupplier?: boolean;
  isLockSupplierService?: boolean;
  isUpgradeSupplier?: boolean;
  objPermissionApprove?: {
    RUSL: boolean;
    RUSC: boolean;
    SPL: boolean;
    SNL: boolean;
  };
  canApprove?: boolean;
}

export interface SupplierLawFilterParams {
  pageIndex: number;
  pageSize: number;
  status?: string;
  supplierName?: string;
  code?: string;
  taxCode?: string;
  createdAt?: (string | undefined)[];
  isNotifyApprove?: boolean;
  listTargetId?: string;
}
