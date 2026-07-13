import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  SupplierLockDetail,
  SupplierLockFilterParams,
  SupplierLockItem,
} from "./supplier-lock.type";

const ENDPOINTS = {
  PAGINATION_LS: "/request_update_supplier/pagination_lock_supplier",
  PAGINATION_LSS: "/request_update_supplier/pagination_lock_supplier_service",
  DETAIL: "/request_update_supplier/find_detail_supplier_law",
  APPROVE: "/request_update_supplier/approve_lock_supplier",
  APPROVE_SERVICE: "/request_update_supplier/approve_lock_supplier_service",
  REFUSE: "/request_update_supplier/refuse_request_update_supplier",
};

export const supplierLockService = {
  getSupplierLockList: async (
    params: SupplierLockFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<SupplierLockItem>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      type = "LS",
      supplierName,
      code,
      status,
      createdAt,
      isNotifyApprove,
      listTargetId,
      adjustmentType,
    } = params;

    const where: any = { isDeleted: false };

    if (supplierName) where.supplierName = supplierName.trim();
    if (code) where.code = code.trim();
    if (status) where.status = status;
    if (adjustmentType) where.adjustmentType = adjustmentType;
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
    const endpoint =
      type === "LSS" ? ENDPOINTS.PAGINATION_LSS : ENDPOINTS.PAGINATION_LS;

    return await apiClient.post(endpoint, body);
  },

  getSupplierLockDetail: async (
    id: string,
  ): Promise<AxiosResponse<SupplierLockDetail>> => {
    return await apiClient.post(ENDPOINTS.DETAIL, { id });
  },

  approveSupplierLock: async (data: {
    requestUpdateSupplierId: string;
    supplierId: string;
    supplierServiceId: string;
  }): Promise<AxiosResponse<any>> => {
    const endpoint = data.supplierServiceId
      ? ENDPOINTS.APPROVE_SERVICE
      : ENDPOINTS.APPROVE;
    return await apiClient.post(endpoint, data);
  },

  rejectSupplierLock: async (data: {
    id: string;
    status: string;
    supplierServiceId?: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.REFUSE, data);
  },
};
