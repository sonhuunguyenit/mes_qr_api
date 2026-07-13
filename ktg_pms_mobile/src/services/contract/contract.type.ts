export interface ContractFilterParams {
  pageIndex?: number;
  pageSize?: number;
  contractNumber?: string;
  sapCode?: string;
  name?: string;
  contractType?: string;
  supplierName?: string;
  status?: string;
  isNotifyApprove?: boolean;
  listTargetId?: string[];
  companyCode?: string;
  effectiveDateStart?: string;
  effectiveDateEnd?: string;
  expiredDateStart?: string;
  expiredDateEnd?: string;
  createdDateStart?: string;
  createdDateEnd?: string;
}

export interface ContractItemDto {
  id: string;
  code: string;
  contractNumber: string;
  contractTypeName: string;
  name: string;
  sapCode?: string;
  companyCode?: string;
  recommendedPurchaseName?: string;
  createdByName?: string;
  supplierName: string;
  contractValueAfterTax?: number;
  currencyName?: string;
  effectiveDate?: string;
  expiredDate?: string;
  status: string;
  createdAt: string;
  canApprove?: boolean;
}

export interface ContractItem {
  id: string;
  itemNo: string;
  acccateName?: string;
  code?: string;
  technicalSpec?: string;
  materialGroupName?: string;
  assetCode?: string;
  assetDesc?: string;
  orderCode?: string;
  ioName?: string;
  shortText?: string;
  plantName?: string;
  quantity?: number;
  ounName?: string;
  price?: number;
  unitName?: string;
  totalPrice?: number;
  totalPriceVND?: number;
  taxCodeName?: string;
  taxRate?: number;
  totalPriceAfterTax?: number;
  origin?: string;
  factorySupplierName?: string;
  latestDeliveryDate?: string;
  underDeliveryTolerance?: number;
  overDeliveryTolerance?: number;
  stockType?: string;
  valuationType?: string;

  // For NT contracts
  externalMaterialGroupName?: string;
  uomText?: string;
  specificationType?: string;
  estimatedMonthlyQuantity?: number;
  note?: string;
}

export interface ContractPaymentProgress {
  id: string;
  name?: string;
  percent?: number;
  paymentMethodName?: string;
  money?: number;
  time?: string;
  description?: string;
}

export interface LotItem {
  itemNo: string;
  shortText: string;
  quantityTotal: number;
  quantity: number;
}

export interface ContractLot {
  id: string;
  title: string;
  lotDate?: string;
  quantityTotal: number;
  lstLotItem: LotItem[];
}

export interface ContractDetail {
  id: string;
  contractId?: string;
  contractNumber: string;
  foreignContractCode?: string;
  name: string;
  nameEN?: string;
  contractType: string;
  contractTypeName: string;
  createdAt: string;
  contractReferenceFrom: string;
  contractReferenceFromName: string;
  recommendedPurchaseName?: string;
  recommendedPurchaseId?: string;
  referenceSourceNumber?: string;
  purchasingOrgCode?: string;
  purchasingOrgName?: string;
  purchasingGroupCode?: string;
  purchasingGroupName?: string;
  contractDate?: string;
  effectiveDate?: string;
  expiredDate?: string;

  // Buyer Info
  companyCode?: string;
  companyName?: string;
  plantCode?: string;
  plantName?: string;
  addressBuyer?: string;
  telBuyer?: string;
  emailBuyer?: string;
  supplierDeliveryDate?: string;

  // Seller Info
  supplierName: string;
  addressSeller?: string;
  emailSeller?: string;
  telSeller?: string;
  representativeSeller?: string;
  postionSeller?: string;

  // Payment Info
  contractAmountBeforeTax?: number;
  contractAmountBeforeTaxText?: string;
  contractValueAfterTax?: number;
  contractAmountAfterTaxText?: string;
  currencyName?: string;
  paymentDays?: number;
  exchangeRate?: number;
  contractValueBeforeTaxInVND?: number;
  contractValueAfterTaxInVND?: number;
  paymentTermName?: string;
  paymentMethodName?: string;
  description?: string;

  // Lists
  lstItem?: ContractItem[];
  lstPaymentProgress?: ContractPaymentProgress[];
  lstLot?: ContractLot[];

  // Bank Info
  bankNumber?: string;
  bankUsername?: string;
  bankName?: string;
  bankBranchName?: string;
  swiftCode?: string;
  iban?: string;

  // Shipping Info
  incotermName?: string;
  incotermVersion?: string;
  incotermLocation1?: string;
  incotermLocation2?: string;
  polName?: string;
  podName?: string;
  deliveryPlaceName?: string;

  // Control Properties
  canApprove?: boolean;
  status: string;
  templateId?: string;

  // Print Template fields
  freightPaymentTerm?: string;
  qualityClaimTime?: string;
  isShowLot?: boolean;
  incotermLocationEn?: string;
  partialDeliveryEn?: string;
  transshipmentEn?: string;
  quality?: string;
  packaging?: string;
  deliveryPoint?: string;
  destination?: string;
  warrantyTerms?: string;
  otherTerms?: string;

  // Other Terms fields for Principle Contracts (NT)
  goodsDescription?: string;
  maxDeliveryTime?: number;
  lateDeliveryPenaltyAmount?: string;
  changeNoticeTime?: number;
  deliveryLocation?: string;
  briberyPenaltyPercent?: number;
}

export interface TemplateDto {
  id: string;
  name: string;
  type?: string;
}
