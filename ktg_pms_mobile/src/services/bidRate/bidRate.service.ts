import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  BidEvaluationApproveRequest,
  BidEvaluationData,
  BidEvaluationRejectRequest,
  BidRateFilterParams,
  BidRateItemData,
} from "./bidRate.type";

const ENDPOINTS = {
  PAGINATION: "/bidRates/pagination",
  SEND_REQUEST_FINISH_BID: "/bidRates/send_request_finish_bid",
  APPROVE_FINISH_BID: "/bidRates/approve_finish_bid",
  LOAD_SUPPLIER_DATA: "/bid_evaluation/load_supplier_data",
  EVALUATION_BID_SUPPLIER: "/bid_evaluation/evaluation_bid_supplier",
  APPROVE_SUPPLIER_WIN_BID: "/bid_evaluation/approve_supplier_win_bid",
  REJECT_SUPPLIER_WIN_BID: "/bid_evaluation/reject_supplier_win_bid",
  RECHECK_SUPPLIER_WIN_BID: "/bid_evaluation/recheck_supplier_win_bid",
};

export const bidRateService = {
  getBidRateList: async (
    params: BidRateFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<BidRateItemData>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      keyword,
      status,
      code,
      createdAt,
      acceptEndDate,
      submitEndDate,
      ...rest
    } = params;

    const where: any = {
      isDeleted: false,
      isSurvey: false,
      ...rest,
    };

    if (keyword) where.name = keyword;
    if (code) where.code = code;
    if (status) where.status = status; // Could be an array of allowed statuses
    if (createdAt && createdAt.length > 0) where.createdAt = createdAt;
    if (acceptEndDate && acceptEndDate.length > 0)
      where.acceptEndDate = acceptEndDate;
    if (submitEndDate && submitEndDate.length > 0)
      where.submitEndDate = submitEndDate;

    // Clean up empty values
    Object.keys(where).forEach((key) => {
      if (
        where[key] === "ALL" ||
        where[key] === "" ||
        where[key] === undefined ||
        where[key] === null
      ) {
        delete where[key];
      }
    });

    const body = {
      where,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    };

    const response = await apiClient.post<
      ApiPaginationResponse<BidRateItemData>
    >(ENDPOINTS.PAGINATION, body);
    return response;
  },

  loadSupplierData: async (
    bidId: string,
  ): Promise<AxiosResponse<BidEvaluationData>> => {
    const response = await apiClient.post<BidEvaluationData>(
      ENDPOINTS.LOAD_SUPPLIER_DATA,
      { bidId },
    );
    return response;
  },

  evaluationBidSupplier: async (
    data: BidEvaluationApproveRequest,
  ): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(
      ENDPOINTS.EVALUATION_BID_SUPPLIER,
      data,
    );
    return response;
  },

  approveSupplierWinBid: async (
    data: BidEvaluationApproveRequest,
  ): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(
      ENDPOINTS.APPROVE_SUPPLIER_WIN_BID,
      data,
    );
    return response;
  },

  rejectSupplierWinBid: async (
    data: BidEvaluationRejectRequest,
  ): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(
      ENDPOINTS.REJECT_SUPPLIER_WIN_BID,
      data,
    );
    return response;
  },

  recheckSupplierWinBid: async (
    data: BidEvaluationRejectRequest, // Assuming same payload as reject for recheck
  ): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(
      ENDPOINTS.RECHECK_SUPPLIER_WIN_BID,
      data,
    );
    return response;
  },

  sendRequestFinishBid: async (data: {
    id: string;
    fileScan?: string;
    noteFinishBidMPO?: string;
  }): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(
      ENDPOINTS.SEND_REQUEST_FINISH_BID,
      data,
    );
    return response;
  },

  approveFinishBid: async (data: {
    id: string;
  }): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.APPROVE_FINISH_BID, data);
    return response;
  },
};
