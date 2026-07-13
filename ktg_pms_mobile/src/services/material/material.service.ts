import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  MaterialFilterParams,
  MaterialItemData,
  MaterialDropdownOption,
  MaterialApprovalDto,
  MaterialRejectSyncDto,
} from "./material.type";

const ENDPOINTS = {
  // PAGINATION: "/material/material-approvals",
  PAGINATION: "/material/material-approvals-sync-sap",
  DETAIL: "/material/load_detail",
  APPROVE: "/material/update_approved",
  APPROVE_SYNC: "/material/update_material_approval",
  REJECT_SYNC: "/material/reject_material_sync",
  MATERIAL_GROUP: "/material_group/find",
  EXTERNAL_MATERIAL_GROUP: "/external_material_group/find",
  PLANT: "/employee/find_list_plant",
  DIVISION: "/division/load_data_select_all",
};

export const materialService = {
  getMaterialList: async (
    params: MaterialFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<MaterialItemData>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      startDate,
      endDate,
      keyword,
      status,
      isDeleted,
      code,
      name,
      materialGroupId,
      externalMaterialGroupId,
      plantId,
      divisionId,
      createdByName,
      blockAllDate,
      ...rest
    } = params;

    // Default status to WAIT_APPROVE as requested: "chỉ sử dụng WAIT_APPROVE"
    const where: Record<
      string,
      string | number | boolean | string[] | null | undefined
    > = {
      status: status || "WAIT_APPROVE",
      ...rest,
    };

    if (code) where.code = code;
    if (name) where.name = name;
    if (materialGroupId) where.materialGroupId = materialGroupId;
    if (externalMaterialGroupId)
      where.externalMaterialGroupId = externalMaterialGroupId;
    if (plantId) where.plantId = plantId;
    if (divisionId) where.divisionId = divisionId;
    if (createdByName) where.createdByName = createdByName;

    // Activity status (isDeleted filter)
    if (isDeleted !== undefined && isDeleted !== "ALL" && isDeleted !== "") {
      where.isDeleted = isDeleted === "true" || isDeleted === true;
    }

    // Created At Date Range
    if (startDate && endDate) {
      where.createdAt = [startDate, endDate];
    }

    // Block All Date Range (if blockAllDate is provided as [start, end])
    if (blockAllDate && blockAllDate.length === 2) {
      where.blockAllDate = blockAllDate;
    }

    // Clean up empty values so the backend doesn't filter by them
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

  getMaterialDetail: async (
    id: string,
  ): Promise<AxiosResponse<MaterialItemData>> => {
    const response = await apiClient.post(ENDPOINTS.DETAIL, { id });
    return response;
  },

  approveMaterial: async (
    id: string,
  ): Promise<AxiosResponse<{ message?: string }>> => {
    const response = await apiClient.post(ENDPOINTS.APPROVE, { id });
    return response;
  },

  approveMaterialSync: async (
    payload: MaterialApprovalDto,
  ): Promise<AxiosResponse<{ message?: string }>> => {
    const response = await apiClient.post(ENDPOINTS.APPROVE_SYNC, payload);
    return response;
  },

  rejectMaterialSync: async (
    payload: MaterialRejectSyncDto,
  ): Promise<AxiosResponse<{ message?: string }>> => {
    const response = await apiClient.post(ENDPOINTS.REJECT_SYNC, payload);
    return response;
  },

  getMaterialGroups: async (): Promise<
    AxiosResponse<MaterialDropdownOption[]>
  > => {
    return apiClient.post(ENDPOINTS.MATERIAL_GROUP, {});
  },

  getExternalMaterialGroups: async (): Promise<
    AxiosResponse<MaterialDropdownOption[]>
  > => {
    return apiClient.post(ENDPOINTS.EXTERNAL_MATERIAL_GROUP, {});
  },

  getPlants: async (): Promise<AxiosResponse<MaterialDropdownOption[]>> => {
    return apiClient.post(ENDPOINTS.PLANT, {});
  },

  getDivisions: async (): Promise<AxiosResponse<MaterialDropdownOption[]>> => {
    return apiClient.post(ENDPOINTS.DIVISION, {});
  },
};
