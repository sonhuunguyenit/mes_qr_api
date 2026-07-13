import { AxiosResponse } from "axios";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";
import { apiClient } from "../axios/client";
import {
  ContractDetail,
  ContractFilterParams,
  ContractItemDto,
  ContractLot,
  TemplateDto,
} from "./contract.type";

const ENDPOINTS = {
  // sync from api.service.ts:1730
  PAGINATION: "contract/pagination",
  // sync from api.service.ts:1728
  DETAIL: "contract/find_detail",
  // sync from api.service.ts:1732
  APPROVE: "contract/approve_contract",
  // sync from api.service.ts:1734
  RECHECK: "contract/re_check_contract",
  // sync from api.service.ts:1752
  REJECT: "contract/update_reject_rule",
  // sync from api.service.ts:1762
  FIND_LOT: "contract/find_lot",
};

export const contractService = {
  getContractList: async (
    params: ContractFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<ContractItemDto>>> => {
    const {
      pageIndex = 1,
      pageSize = PAGE_SIZE,
      contractNumber,
      sapCode,
      name,
      contractType,
      supplierName,
      status,
      isNotifyApprove,
      listTargetId,
      companyCode,
      effectiveDateStart,
      effectiveDateEnd,
      expiredDateStart,
      expiredDateEnd,
      createdDateStart,
      createdDateEnd,
    } = params;

    const where: any = { isDeleted: false };

    if (contractNumber) where.contractNumber = contractNumber.trim();
    if (sapCode) where.sapCode = sapCode.trim();
    if (name) where.name = name.trim();
    if (contractType) where.contractType = contractType;
    if (supplierName) where.supplierName = supplierName.trim();
    if (status) where.status = status;
    if (isNotifyApprove) where.isNotifyApprove = true;
    if (listTargetId && listTargetId.length > 0)
      where.listTargetId = listTargetId;
    if (companyCode) where.companyCode = companyCode;

    if (effectiveDateStart && effectiveDateEnd) {
      where.effectiveDate = [effectiveDateStart, effectiveDateEnd];
    }
    if (expiredDateStart && expiredDateEnd) {
      where.expiredDate = [expiredDateStart, expiredDateEnd];
    }
    if (createdDateStart && createdDateEnd) {
      where.createdAt = [createdDateStart, createdDateEnd];
    }

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

  getContractDetail: async (
    id: string,
  ): Promise<AxiosResponse<ContractDetail>> => {
    return await apiClient.post(ENDPOINTS.DETAIL, { id });
  },

  getContractLots: async (contractId: string): Promise<AxiosResponse<ContractLot[]>> => {
    return await apiClient.post(ENDPOINTS.FIND_LOT, { contractId });
  },

  approveContract: async (data: {
    id: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.APPROVE, data);
  },

  rejectContract: async (data: {
    id: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.REJECT, data);
  },

  recheckContract: async (data: {
    id: string;
    reason: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post(ENDPOINTS.RECHECK, data);
  },

  getTemplates: async (type: string): Promise<AxiosResponse<TemplateDto[]>> => {
    return await apiClient.post("template/find", { type });
  },

  getTemplateKeys: async (templateId: string): Promise<AxiosResponse<string[]>> => {
    return await apiClient.post("template/keys", { templateId });
  },

  updateMissingInfo: async (data: Partial<ContractDetail>): Promise<AxiosResponse<any>> => {
    return await apiClient.post("contract/update_missing_info", data);
  },

  saveTemplate: async (data: {
    contractId: string;
    templateId: string;
  }): Promise<AxiosResponse<any>> => {
    return await apiClient.post("contract/save_template", data);
  },
};

