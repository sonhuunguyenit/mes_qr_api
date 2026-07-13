import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  BidActionRequest,
  BidDetailData,
  BidFilterParams,
  BidItemData,
} from "./bid.type";

const ENDPOINTS = {
  PAGINATION: "/bids/pagination",
  DETAIL: "/bids/find_detail",
  GET_TECH: "/bids/get_tech",
  GET_TRADE: "/bids/get_trade",
  GET_PRICE: "/bids/get_price",
  LOAD_PRICE: "/bids/load_price",
  GET_ITEMS: "/bid-item/find",
  GET_HISTORY: "/audit-logs/pagination",
  APPROVE: "/bids/update_approved_bid", // sync from api.service.ts:1299
  REJECT: "/bids/update_reject_rule_bid", // sync from api.service.ts:1309
  SEND_CHECK_AGAIN: "/bids/send_check_again", // sync from api.service.ts:1311
  GET_LIST_APPROVED: "/bids/find_list_approved_bid",
};

export const bidService = {
  getBidList: async (
    params: BidFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<BidItemData>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      startDate,
      endDate,
      keyword,
      status,
      code,
      listTargetId,
      ...rest
    } = params;

    const where: any = {
      isDeleted: false,
      isSurvey: false,
      ...rest,
    };

    if (listTargetId && listTargetId.length > 0) {
      where.id = [listTargetId];
    }

    if (startDate && endDate) {
      where.createdAt = [startDate, endDate];
    }
    if (keyword) where.name = keyword;
    if (code) where.code = code;
    if (status && status !== "ALL") where.status = status;

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

    const response = await apiClient.post<ApiPaginationResponse<BidItemData>>(
      ENDPOINTS.PAGINATION,
      body,
    );
    return response;
  },

  getBidDetail: async (id: string): Promise<AxiosResponse<BidDetailData>> => {
    const response = await apiClient.post<BidDetailData>(ENDPOINTS.DETAIL, {
      id,
    });
    return response;
  },

  getBidTech: async (id: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.get(`${ENDPOINTS.GET_TECH}/${id}`);
    return response;
  },

  getBidTrade: async (id: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.get(`${ENDPOINTS.GET_TRADE}/${id}`);
    return response;
  },

  getBidPrice: async (id: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.get(`${ENDPOINTS.GET_PRICE}/${id}`);
    return response;
  },

  getBidItems: async (bidId: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.GET_ITEMS, {
      where: { bidId },
    });
    return response;
  },

  getBidHistory: async (id: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.GET_HISTORY, {
      where: { targetId: id, module: "BID" },
      skip: 0,
      take: 100,
    });
    return response;
  },

  getBidApprovalProgress: async (id: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.GET_LIST_APPROVED, { id });
    return response;
  },

  approveBid: async (data: BidActionRequest): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.APPROVE, data);
    return response;
  },

  rejectBid: async (data: BidActionRequest): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.REJECT, data);
    return response;
  },

  sendCheckAgain: async (
    data: BidActionRequest,
  ): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.SEND_CHECK_AGAIN, data);
    return response;
  },

  getProjects: async (): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post("/project/find", {});
    return response;
  },

  getCompanies: async (): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post("/employee/find_list_company", {});
    return response;
  },

  getSettingString: async (type: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post("settingStrings/find", { type });
    return response;
  },
};
