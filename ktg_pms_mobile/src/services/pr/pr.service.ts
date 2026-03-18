import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  PRActionRequest,
  PRFilterOption,
  PRFilterOptionsResponse,
  PRFilterParams,
  PRItemData,
  PRUpdateStatusRequest,
} from "./pr.type";

const ENDPOINTS = {
  PAGINATION: "/pr/pagination",
  FILTER_OPTIONS: "/purchase-requisition/filter-options",
  APPROVE: "/pr/update_approved",
  REJECT: "/pr/update_reject",
  EXTERNAL_MATERIAL_GROUP_FIND: "/external_material_group/find",
  PLANT_FIND: "/plant/find",
  PURCHASING_GROUP_FIND: "/purchasing_group/find",
};

export const prService = {
  getPRList: async (
    params: PRFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<PRItemData>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      startDate,
      endDate,
      keyword,
      plantId,
      pmsNo,
      sapNo,
      createdBy,
      totalValueFrom,
      totalValueTo,
      budgetShortageFrom,
      budgetShortageTo,
      purchaseGroup,
      ...rest
    } = params;

    const where: any = {
      isParentItem: 0,
      ...rest,
    };

    // Mapping fields to match Admin's where conditions
    if (startDate && endDate) {
      where.createdAt = [startDate, endDate];
    }
    if (keyword) where.uses = keyword;
    if (pmsNo) where.code = pmsNo;
    if (sapNo) where.sapCode = sapNo;
    if (createdBy) where.createdBy = createdBy;
    if (plantId) where.plantId = plantId;
    if (purchaseGroup) where.purchasingGroupCode = purchaseGroup;

    // Numeric ranges
    const parseNum = (val: any) => {
      if (val === undefined || val === null || val === "") return undefined;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : parsed;
    };

    if (totalValueFrom != null) where.totalValueFrom = parseNum(totalValueFrom);
    if (totalValueTo != null) where.totalValueTo = parseNum(totalValueTo);
    if (budgetShortageFrom != null)
      where.budgetShortageFrom = parseNum(budgetShortageFrom);
    if (budgetShortageTo != null)
      where.budgetShortageTo = parseNum(budgetShortageTo);

    // Clean up "ALL" or empty values so the backend doesn't filter by them
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

    const response = await apiClient.post(ENDPOINTS.PAGINATION, body);
    return response;
  },

  getPRApproveList: async (
    params: PRFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<PRItemData>>> => {
    return prService.getPRList(params);
  },

  getFilterOptions: async (): Promise<
    AxiosResponse<PRFilterOptionsResponse>
  > => {
    const response = await apiClient.get(ENDPOINTS.FILTER_OPTIONS);
    return response;
  },

  approvePR: async (
    data: PRUpdateStatusRequest,
  ): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.APPROVE, data);
    return response;
  },

  rejectPR: async (data: PRActionRequest): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.REJECT, data);
    return response;
  },

  getPRDetail: async (id: string): Promise<AxiosResponse<PRItemData>> => {
    const response = await apiClient.post("/pr/find_detail", { id });
    return response;
  },

  rejectRule: async (data: PRActionRequest): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post("/pr/update_reject_rule", data);
    return response;
  },

  sendCheckAgain: async (
    data: PRActionRequest,
  ): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post("/pr/send_check_again", data);
    return response;
  },

  getExternalMaterialGroups: async (): Promise<
    AxiosResponse<PRFilterOption[]>
  > => {
    const response = await apiClient.post(
      ENDPOINTS.EXTERNAL_MATERIAL_GROUP_FIND,
      {},
    );
    return response;
  },
  getPlants: async (): Promise<AxiosResponse<PRFilterOption[]>> => {
    const response = await apiClient.post(ENDPOINTS.PLANT_FIND, {});
    return response;
  },
  getPurchaseGroups: async (): Promise<AxiosResponse<PRFilterOption[]>> => {
    const response = await apiClient.post(ENDPOINTS.PURCHASING_GROUP_FIND, {});
    return response;
  },
};
