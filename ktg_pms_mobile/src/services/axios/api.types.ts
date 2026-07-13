export type ApiPaginationRequest = {
  pageIndex: number;
  pageSize: number;
};

export type ApiPaginationResponse<T = any> = [T[], number];

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  errors?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}
