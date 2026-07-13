import { BID_STATUS } from "~/enums";

export interface BidItemData {
  id: string;
  code: string;
  name: string;
  // Company
  companyId?: string;
  companyName?: string;
  companyCode?: string;
  plantName?: string;
  plantCode?: string;
  purchasingOrgName?: string;
  purchasingGroupName?: string;
  // Reference
  reference?: string;
  referenceName?: string;
  // People
  techName?: string;
  tradeName?: string;
  lstMemmberName?: string;
  // Project
  projectId?: string;
  projectName?: string;
  projectCode?: string;
  // Bid info
  purposeName?: string;
  bidTypeName?: string;
  bidGuaranteeName?: string;
  formContractName?: string;
  // Dates
  createdAt: string;
  acceptEndDate?: string;
  submitEndDate?: string;
  // Status
  status: BID_STATUS;
  statusName?: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  submittedCount?: number;
  invitedCount?: number;
  // Approval
  approvalProgress?: string;
  canApprove?: boolean;
  isCanApprove?: boolean;
  level?: number;
  maxLevel?: number;
}

export interface BidFilterParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  code?: string;
  status?: BID_STATUS | "ALL";
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface BidActionRequest {
  id: string;
  reason?: string;
  note?: string;
}

export interface BidUpdateStatusRequest extends BidActionRequest {
  status: string;
}

export interface ApprovalProgressItem {
  tile: string;
  employeeName: string;
  status: string;
  comment?: string;
}

export interface ApprovalProgress {
  level: string;
  lstApprove: ApprovalProgressItem[];
}

export interface BidDetailItem {
  itemNo: string | number;
  acccateName: string;
  materialCode: string;
  materialGroupName: string;
  externalMaterialGroupTitle: string;
  assetCode: string;
  subNoAset: string;
  orderCode: string;
  shortText: string;
  glAccountCode: string;
  costCenterCode: string;
  quantity: number;
  unitCode: string;
  deliveryDate: string;
}

export interface BidSupplier {
  supplierSapCode: string;
  supplierCode: string;
  supplierName: string;
  supplierAddress: string;
  checkBoxStatus?: boolean;
  checkBoxJoin?: boolean;
  name?: string;
  externalMaterialGroupName?: string;
}

export interface BidCondition {
  level: number;
  sort: number;
  name: string;
  percent: number;
  percentRule: number;
  type: string;
  isRequired: boolean;
  __childs__?: BidCondition[];
}

export interface BidMediaFile {
  fileUrl: string;
  fileName?: string;
}

export interface BidDetailData extends BidItemData {
  nameEnglish?: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  statusName?: string;
  company?: string;
  plant?: string;
  purchasingOrgT?: string;
  purchasingGroupT?: string;
  purposeName?: string;
  bidTypeName: string;
  scopeBiddingPackage?: string;
  locationBidExecution?: string;
  projectT?: string;
  lstMediaFileBid?: BidMediaFile[];
  lstMediaFileBidOther?: BidMediaFile[];
  lstBidMemberName?: string;
  isMergeBidCouncel?: boolean;
  techName?: string;
  lstTechnicalCommitteeName?: string;
  tradeName?: string;
  lstTradeCommitteeName?: string;
  lstMemmberAllName?: string;
  timeTechDate?: string;
  timePriceDate?: string;
  acceptEndDate?: string;
  submitEndDate?: string;
  estimatedBidOpeningDate?: string;
  timeCheckTechDate?: string;
  timeCheckPriceDate?: string;
  estimatedBidClosedDate?: string;
  formContractName?: string;
  timeserving?: number;
  bidGuaranteeName?: string;
  moneyGuarantee?: number;
  timeGuarantee?: number;
  techPrecent?: number;
  pricePrecent?: number;
  tradePrecent?: number;
  lstApprovalProgress?: ApprovalProgress[];
  lstDetail?: BidDetailItem[];
  lstSupplier?: BidSupplier[];
  listTech?: BidCondition[];
  lstPaymentTermCode?: string;
  paymentTermCode?: string;
  lstIncotermCode?: string;
  incotermVersion?: string;
  listTrade?: BidCondition[];
  // Price Table data
  listPrice?: any[];
  listPriceCol?: any[];
  // Bid Rate — chọn NCC thắng thầu
  // Admin: bid-rate.component.html:298 → *ngIf="item.isMemeberApproved"
  isMemeberApproved?: boolean;
}
