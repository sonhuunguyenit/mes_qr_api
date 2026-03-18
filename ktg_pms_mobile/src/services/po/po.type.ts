import {
  PO_BUDGET_STATUS,
  PO_REFERENCE_SOURCE,
  PO_STATUS,
} from "~/enums/po.enum";

export interface POItemData {
  id: string;
  code: string;
  codeSap: string;
  status: PO_STATUS;
  statusName: string;
  statusColor: string;
  statusBgColor: string;
  statusBorderColor: string;
  budgetStatus: PO_BUDGET_STATUS;
  budgetStatusName: string;
  budgetStatusColor: string;
  budgetStatusBgColor: string;
  referenceSourceType: PO_REFERENCE_SOURCE;
  referenceSourceTypeName: string;
  referenceSourceNumbers: string;
  currencyCode: string;
  companyId: string;
  companyCode: string;
  companyName: string;
  totalPO: number;
  supplierName: string;
  approvalProgress: string;
  createdAt: string;
  createdByName: string;
  createdBy: string;
  plantId: string;
  plantCode: string;
  plantName: string;
  purchasingGroupId: string;
  purchasingGroupCode: string;
  purchasingGroupName: string;
}

export interface POPartner {
  id: string;
  partnerFunctionCode: string; // e.g. "VN", "PI"
  partnerFunctionName?: string; // resolved from enum on mobile side
  partnerType: string; // e.g. "SUPPLIER"
  partnerCode: string;
  partnerName: string;
  supplier?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface POContact {
  id?: string;
  employeeCode?: string;
  employeeName?: string;
  positionName?: string;
  position?: string;
  costCenter?: string;
  phone?: string;
  phoneNumber?: string;
}

export interface PODetailData extends POItemData {
  // Reference section - API fields
  referenceSourceName?: string; // e.g. "(0)2A00.2202.2603.015-TEMPLATE..."
  referenceDocumentId?: string;
  referenceDocuments?: Array<{
    id: string;
    title: string;
    code: string;
    businessPlanId?: string | null;
    templateId?: string;
  }>;

  // General Info extra
  typePO?: string; // from API "typePO"
  poTypeName?: string;
  purchasingOrgCode?: string;
  purchasingOrgName?: string;
  purchasingOrganizationName?: string;
  fileAttachment?: string;

  // Supplier info
  paymentTermName?: string;
  currencyName?: string;
  grbInv?: boolean;
  exchangeRate?: number;
  excRate?: number; // from API "excRate"
  schemaGroupName?: string;
  supplierSchemaName?: string; // from API "supplierSchemaName"
  supplierEmail?: string;
  supplierPhone?: string;
  supplierFax?: string;
  supplierAddress?: string;
  // Supplier bank info (flat fields from API)
  supplierBankNumber?: string;
  supplierBankUsername?: string;
  supplierBankName?: string;
  supplierBankBranchName?: string;
  supplierSwiftCode?: string;
  supplierIban?: string;

  // Collections - use actual API array names
  lstPartner?: POPartner[]; // was poPartners
  lstMenber?: POContact[]; // was poContacts (note: API typo 'Menber' not 'Member')
  lstItemPo?: any[]; // added for PO details table usage

  // Notes & Details
  headerText?: string;
  headerNote?: string;
  pricingTypes?: string;
  completeDate?: string;
  paymentsDate?: string;
  termDeli?: string;
  retail?: string;
  numberForeignTradeContract?: string;
  contractNumber?: string;
  guarantees?: string;
  contractRiders?: string;
  asset?: string;
  otherContractualStipulations?: string;
  inboundDeli?: string;
  vendorMemo?: string;
  cup?: string;
  cig?: string;
  mgo?: string;
  size?: string;
  orginin?: string;
  origin?: string;
  manufacturer?: string;
  quality?: string;
  quality2?: string;
  tradeTerms?: string;
  standard?: string;
  packing?: string;
  pack?: string;
  marking?: string;
  symbol?: string;
  shipmentTime?: string;
  badPort?: string;
  particalShipment?: string;
  transhipment?: string;
  noticeOfShipment?: string;
  payment?: string;
  documentsRequired?: string;
  documentsRequried?: string;
  receivingDelivery?: string;
  tel?: string;
  fax?: string;
  signedCommercialInvoice?: string;
  detailPackingList?: string;
  millTestCertificate?: string;
  claimForQualityDiscrepancy?: string;
  qualityClaim?: string;
  quantityClaimWithin?: string;
  forceMajeure?: string;
  lawAndArbitrition?: string;
  penaltyValue?: string;
  penaltyDeadline?: string;
  coilWeight?: string;
  coilWeight2?: string;
  standard2?: string;
  contractAnnexNumber?: string;
  contractAnnexNumberDate?: string;
  contractAnnexNumberDisplay?: string;
  quanityClaimWithin?: string;
  shippingMark?: string;

  // Customer Data
  numberVotes?: string;
  completeDateCustomer?: string;
  paymentDateCustomer?: string;
  contractAnnexPaid?: boolean;
  order?: string;
  notification?: string;
  numberForeignTradeContractCustomer?: string;
  deliSupplierDate?: string;
  region?: string;
  insuranceContractNumber?: string;
  mixtureRatio?: string;
  vehicleType?: string;
  customerData?: {
    numberVotes?: string;
    completeDateCustomer?: string;
    paymentDateCustomer?: string;
    isRetail?: boolean;
    order?: string;
    notification?: string;
    numberForeignTradeContractCustomer?: string;
    deliSupplierDate?: string;
    region?: string;
    insuranceContractNumber?: string;
    mixtureRatio?: string;
    vehicleType?: string;
  };

  // Shipping
  incotermName?: string;
  incotermVersionName?: string;
  incotermLocation1?: string;
  incotermLocation2?: string;
}

export interface POFilterParams {
  pageIndex?: number;
  pageSize?: number;
  status?: string;
  budgetStatus?: string;
  referenceSourceType?: string;
  code?: string;
  codeSap?: string;
  supplierName?: string;
  employeeName?: string;
  currencyCode?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string; // UI search
  listTargetId?: string[]; // For approval flow
  referenceSourceNumbers?: string;
  moduleType?: string; // moduleType for approval flow
}

export interface POActionRequest {
  id: string;
  reason?: string;
  [key: string]: any;
}
