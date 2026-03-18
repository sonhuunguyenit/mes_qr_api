export interface ApprovalItem {
  typeName: string;
  totalApprove: number;
  type: string;
  level: number;
  children?: ApprovalItem[];
  open?: boolean;
}

export interface HomeApprovalResponse {
  data: ApprovalItem[];
}
