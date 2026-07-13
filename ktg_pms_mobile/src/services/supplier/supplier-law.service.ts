import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  SupplierLawDetail,
  SupplierLawFilterParams,
  SupplierLawItem,
} from "./supplier-law.type";

const ENDPOINTS = {
  PAGINATION: "/request_update_supplier/pagination_request_law",
  DETAIL: "/request_update_supplier/find_detail_supplier_law",
  APPROVE: "/request_update_supplier/approve_update_data_law",
  REFUSE: "/request_update_supplier/refuse_request_update_supplier",
};

export const supplierLawService = {
  getSupplierLawList: async (
    params: SupplierLawFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<SupplierLawItem>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      supplierName,
      code,
      taxCode,
      status,
      createdAt,
      isNotifyApprove,
      listTargetId,
    } = params;

    const where: any = { isDeleted: false };

    if (supplierName) where.supplierName = supplierName.trim();
    if (code) where.code = code.trim();
    if (taxCode) where.supplierCode = taxCode.trim();
    if (status) where.status = status;
    if (createdAt && createdAt.length === 2) where.createdAt = createdAt;
    if (isNotifyApprove) where.isNotifyApprove = true;
    if (listTargetId && listTargetId.length > 0)
      where.listTargetId = listTargetId;

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

    return await apiClient.post(ENDPOINTS.PAGINATION, body);
  },

  getSupplierLawDetail: async (
    id: string,
  ): Promise<AxiosResponse<SupplierLawDetail>> => {
    return await apiClient.post(ENDPOINTS.DETAIL, { id });
  },

  getBankCountryList: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post("country/load_data_select", {});
  },

  getBankRegionList: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post("region/load_data_select", {});
  },

  getBankList: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post("bank/load_data_select", {});
  },

  getBankBranchList: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post("bank_branch/load_data_select", {});
  },

  approveSupplierLaw: async (data: {
    requestUpdateSupplierId: string;
    supplierId: string;
    jsonLaw: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.APPROVE, data);
  },

  rejectSupplierLaw: async (data: {
    id: string;
    status: string;
    supplierId?: string;
    level?: number;
    type?: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.REFUSE, data);
  },
};
