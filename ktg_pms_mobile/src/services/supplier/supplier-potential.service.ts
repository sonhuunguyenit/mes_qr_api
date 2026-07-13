import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  SupplierPotentialItem,
  SupplierPotentialDetail,
} from "./supplier.type";

const ENDPOINTS = {
  PAGINATION: "/suppliers/supplier_pagination",
  LOAD_DETAIL: "/suppliers/find_detail",
  LOAD_SUPPLIER_SERVICE: "/suppliers/load_supplier_service",
  APPROVE: "/suppliers/approve_supplier_company",
  RECHECK: "/suppliers/request_recheck",
  BUSINESS_TYPE_FIND: "/business_type/find",
};

export const supplierPotentialService = {
  getSupplierPotentialList: async (
    params: any,
  ): Promise<AxiosResponse<ApiPaginationResponse<SupplierPotentialItem>>> => {
    const { pageIndex = 1, pageSize = PAGE_SIZE, ...filters } = params;

    const where: any = { ...filters };
    if (where.supplierName) {
      where.supplierName = where.supplierName.trim();
      where.name = where.supplierName;
    }

    // Clean up empty values to match Admin portal behavior
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

  getSupplierPotentialDetail: async (
    id: string,
  ): Promise<AxiosResponse<SupplierPotentialDetail>> => {
    return await apiClient.post(ENDPOINTS.LOAD_DETAIL, { id });
  },

  getSupplierPotentialServices: async (
    supplierId: string,
  ): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.LOAD_SUPPLIER_SERVICE, {
      supplierId,
      isDeleted: false,
    });
  },

  approveSupplierPotential: async (data: any): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.APPROVE, data);
  },

  recheckSupplierPotential: async (data: any): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.RECHECK, data);
  },

  getBusinessTypes: async (): Promise<AxiosResponse<any[]>> => {
    return await apiClient.post(ENDPOINTS.BUSINESS_TYPE_FIND, {});
  },
};
