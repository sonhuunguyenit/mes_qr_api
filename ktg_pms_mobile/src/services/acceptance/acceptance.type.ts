export interface AcceptanceItem {
  id: string;
  acceptanceNumber: string;
  acceptanceObject: string;
  handoverTime: Date;
  employeeName: string;
  acceptanceResults: string;
  poId: string;
  status?: string;
  statusName?: string;
  createdAt?: string;
}

export interface AcceptanceFilterParams {
  pageIndex?: number;
  pageSize?: number;
  acceptanceNumber?: string;
  acceptanceObject?: string;
  employeeName?: string;
  poId?: string;
}
