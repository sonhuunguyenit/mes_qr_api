export type ApiPaginationRequest = {
  pageIndex: number;
  pageSize: number;
};

export type ApiPaginationResponse<T = any> = [T[], number];
