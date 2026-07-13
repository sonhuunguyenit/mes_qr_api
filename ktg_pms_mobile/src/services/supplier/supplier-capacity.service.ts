import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  SupplierCapacityDetail,
  SupplierCapacityFilterParams,
  SupplierCapacityItem,
} from "./supplier-capacity.type";

const ENDPOINTS = {
  PAGINATION: "/request_update_supplier/pagination_request_capacity",
  DETAIL: "/request_update_supplier/find_detail_supplier_law",
  APPROVE: "/request_update_supplier/approve_update_data_capacity",
  REFUSE: "/request_update_supplier/refuse_request_update_supplier",
};

export const supplierCapacityService = {
  getSupplierCapacityList: async (
    params: SupplierCapacityFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<SupplierCapacityItem>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      supplierName,
      supplierCode,
      code,
      status,
      createdAt,
      isNotifyApprove,
      listTargetId,
    } = params;

    const where: any = { isDeleted: false };

    if (supplierName) where.supplierName = supplierName.trim();
    if (supplierCode) where.supplierCode = supplierCode.trim();
    if (code) where.code = code.trim();
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

  getSupplierCapacityDetail: async (
    id: string,
  ): Promise<AxiosResponse<SupplierCapacityDetail>> => {
    return await apiClient.post(ENDPOINTS.DETAIL, { id });
  },

  approveSupplierCapacity: async (data: {
    requestUpdateSupplierId: string;
    supplierId: string;
    jsonCapacity: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.APPROVE, data);
  },

  rejectSupplierCapacity: async (data: {
    id: string;
    status: string;
    supplierId?: string;
    level?: number;
    type?: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.REFUSE, data);
  },
};
