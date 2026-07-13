import { BID_STATUS } from "~/enums";

export interface BidRateItemData {
  id: string;
  code: string;
  name: string;
  companyId?: string;
  companyName?: string;
  companyCode?: string;
  techName?: string;
  tradeName?: string;
  lstMemmberName?: string;
  bidGuaranteeName?: string;
  projectName?: string;
  purposeName?: string;
  bidTypeName?: string;
  createdAt: string;
  acceptEndDate?: string;
  submitEndDate?: string;
  status: BID_STATUS;
  statusName?: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  approvalProgress?: string;
  // Specific to bid rate
  isShowAnalysis?: boolean;
  isShowReport?: boolean;
  isShowBidTech?: boolean;
  isShowBidTrade?: boolean;
  isShowBidDeal?: boolean;
  isShowDealAuction?: boolean;
  isMemeberApproved?: boolean;
  rateType?: string;
  tradeType?: string;
}

export interface BidRateFilterParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string; // Tên gói thầu
  code?: string;
  status?: string | string[]; // Dùng mảng allowedCodes
  companyId?: string;
  techName?: string;
  tradeName?: string;
  biddingCouncil?: string; // Hội đồng xét thầu
  masterBidGuaranteeId?: string;
  projectId?: string;
  purpose?: string;
  bidTypeCode?: string;
  createdAt?: string[];
  acceptEndDate?: string[];
  submitEndDate?: string[];
  [key: string]: any;
}

// Interfaces for Evaluation (Winning Supplier)
export interface BidSupplierEvaluation {
  id?: string;
  supplierId?: string;
  supplierSapCode?: string;
  supplierCode?: string;
  supplierName?: string;
  supplierAddress?: string;
  isSuccessBid?: boolean;
  isChoose?: boolean;
  // Điểm hệ thống
  scoreTotal?: number;
  scoreTech?: number;
  scorePrice?: number;
  scoreTrade?: number;
  // Điểm HĐXT (avgScore)
  avgScoreTotal?: number;
  avgScoreManualTech?: number;
  avgScoreManualPrice?: number;
  avgScoreManualTrade?: number;
  [key: string]: any;
}

export interface BidEvaluationData {
  id: string; // bidId
  status?: string;       // Trạng thái gói thầu (sync from dataObject.status)
  isCanApprove?: boolean; // Có quyền phê duyệt không (sync from dataObject.isCanApprove)
  reference?: string;    // Loại tham chiếu (NO_ITEM hoặc khác) — dùng để switch bảng lstDetail
  lstBidSupplier: BidSupplierEvaluation[];
  lstDetail: any[]; // Chi tiết hạng mục/item
  listItem?: any[];
  noteCloseBidMPO?: string;
  comment?: string;
}

export interface BidEvaluationApproveRequest {
  bidId: string;
  comment?: string;
  listItem: any[];
  lstBidSupplier: any[];
}

export interface BidEvaluationRejectRequest {
  bidId: string;
  comment?: string;
  listItem: any[];
  recheck: { label: string; value: string; checked: boolean }[];
}
