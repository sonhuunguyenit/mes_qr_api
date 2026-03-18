import { AxiosResponse } from "axios";
import { apiClient } from "../axios/client";
import { AcceptanceFilterParams, AcceptanceItem } from "./acceptance.type";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";

const ENDPOINTS = {
  PAGINATION: "po/pagination_acceptance_po",
};

export const acceptanceService = {
  getAcceptanceList: async (
    params: AcceptanceFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<AcceptanceItem>>> => {
    const { pageIndex = 1, pageSize = PAGE_SIZE, ...rest } = params;

    const where: any = {
      ...rest,
    };

    // Clean up empty filters
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

    const response = await apiClient.post<any>(ENDPOINTS.PAGINATION, body);

    return response;
  },
};
