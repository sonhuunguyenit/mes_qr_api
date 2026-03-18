import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import { POActionRequest, POFilterParams, POItemData } from "./po.type";

const ENDPOINTS = {
  PAGINATION: "/po/pagination",
  DETAIL: "/po/find_detail",
  APPROVE: "/po/update_status_approved",
  UPDATE_WAIT_APPROVED: "/po/update_wait_approved",
  REJECT_RULE: "/po/update_reject_rule",
  REVERT_STATUS: "/po/update_revert_status",
  COMPANY_FIND: "/company/find",
  UOM_SELECT_BOX: "/uom/data_select_box",
};

export const poService = {
  getCompanies: async (): Promise<AxiosResponse<any[]>> => {
    const response = await apiClient.post(ENDPOINTS.COMPANY_FIND, {});
    return response;
  },

  getUoms: async (): Promise<AxiosResponse<any[]>> => {
    const response = await apiClient.post(ENDPOINTS.UOM_SELECT_BOX, {});
    return response;
  },

  getPOList: async (
    params: POFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<POItemData>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      startDate,
      endDate,
      listTargetId,
      ...rest
    } = params;

    const where: any = {
      ...rest,
      isDeleted: false,
    };

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

    // Mapping dates like in Admin searchData()
    if (startDate && endDate) {
      where.dateStart = startDate;
      where.dateEnd = endDate;
    }

    // Filter by specific IDs if coming from a notification
    if (listTargetId && listTargetId.length > 0) {
      where.id = listTargetId;
    }

    const body = {
      where,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    };

    const response = await apiClient.post<ApiPaginationResponse<POItemData>>(
      ENDPOINTS.PAGINATION,
      body,
    );

    return response;
  },

  getPODetail: async (id: string): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.DETAIL, { id });
    return response;
  },

  approvePO: async (data: POActionRequest): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.APPROVE, data);
    return response;
  },

  rejectPO: async (data: POActionRequest): Promise<AxiosResponse<any>> => {
    const response = await apiClient.post(ENDPOINTS.REJECT_RULE, data);
    return response;
  },
};
