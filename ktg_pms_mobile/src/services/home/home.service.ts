import { AxiosResponse } from "axios";
import { apiClient } from "../axios/client";
import { ApprovalItem } from "./home.type";

const ENDPOINTS = {
  LOAD_APPROVE_LIST: "/flow_approve/load_approve_list_by_org_position",
};

export const homeService = {
  getApprovalCounts: async (): Promise<AxiosResponse<ApprovalItem[]>> => {
    const response = await apiClient.post(ENDPOINTS.LOAD_APPROVE_LIST, {});
    return response;
  },
};
