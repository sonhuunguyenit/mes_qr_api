import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  SupplierSapApproveRequest,
  SupplierSapFilterParams,
  SupplierSapItem,
  SupplierSapRecheckRequest,
} from "./supplier.type";

const ENDPOINTS = {
  PAGINATION: "/supplier_number/pagination",
  LOAD_DETAIL: "/supplier_number/load_detail_request_approve",
  APPROVE: "/supplier_number/update_approved",
  REQUEST_APPROVE: "/supplier_number/request_approve",
  RECHECK: "/supplier_number/recheck_info",
  DELETE: "/supplier_number/delete_data",
  SUPPLIER_DETAIL: "/suppliers/find_detail",
  GL_ACCOUNT: "/gl_account/load_data_select",
  COMPANIES: "/employee/find_list_company",
  VENDORS_NOT_SAP: "/suppliers/load_data_select_not_have_sap_code",
  BUSINESS_PARTNER_GROUP: "/business_partner_group/load_data_select",
  TITLE: "/title/data_select_box",
  STAKEHOLDER_CATEGORY: "/stakeholder_category/data_select_box",
};

export const supplierService = {
  getSupplierSapList: async (
    params: SupplierSapFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<SupplierSapItem>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      supplierName,
      name,
      code,
      supplierCode,
      companyId,
      status,
      createdAt,
      isNotifyApprove,
    } = params;

    const where: any = {};

    if (supplierName) {
      where.supplierName = supplierName.trim();
      where.name = supplierName.trim();
    }
    if (name) where.name = name.trim();
    if (code) where.code = code.trim();
    if (supplierCode) where.supplierCode = supplierCode.trim();
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (createdAt && createdAt.length === 2) where.createdAt = createdAt;
    if (isNotifyApprove) where.isNotifyApprove = true;
    if (params.createdBy) where.createdBy = params.createdBy.trim();
    if (params.businessPartnerGroupName)
      where.businessPartnerGroupName = params.businessPartnerGroupName.trim();

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

  getSupplierSapDetail: async (
    supplierNumberId: string,
  ): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.LOAD_DETAIL, { supplierNumberId });
  },

  getSupplierDetail: async (id: string): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.SUPPLIER_DETAIL, { id });
  },

  getGLAccounts: async (companyId: string): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.GL_ACCOUNT, { companyId });
  },

  getBusinessPartnerGroup: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.BUSINESS_PARTNER_GROUP, {});
  },

  getTitle: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.TITLE, {});
  },

  getStakeholderCategory: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.STAKEHOLDER_CATEGORY, {});
  },

  approveSupplierSap: async (
    data: SupplierSapApproveRequest,
  ): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.APPROVE, data);
  },

  requestApproveSupplierSap: async (
    id: string,
  ): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.REQUEST_APPROVE, { id });
  },

  recheckSupplierSap: async (
    data: SupplierSapRecheckRequest,
  ): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.RECHECK, data);
  },

  deleteSupplierSap: async (id: string): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.DELETE, { id });
  },

  getCompanies: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.COMPANIES, {});
  },

  getVendorsWithoutSapCode: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.VENDORS_NOT_SAP, {});
  },
};
