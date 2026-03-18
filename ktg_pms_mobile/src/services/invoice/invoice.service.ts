import { AxiosResponse } from "axios";
import { apiClient } from "../axios/client";
import { InvoiceFilterParams, InvoiceItem } from "./invoice.type";
import { PAGE_SIZE } from "~/constants";
import { ApiPaginationResponse } from "../axios/api.types";

const ENDPOINTS = {
  PAGINATION: "bill/pagination",
};

export const invoiceService = {
  getInvoiceList: async (
    params: InvoiceFilterParams,
  ): Promise<AxiosResponse<ApiPaginationResponse<InvoiceItem>>> => {
    const { pageIndex = 1, pageSize = PAGE_SIZE, ...rest } = params;
    const where: any = {
      ...rest,
    };

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
