export interface ApprovalItem {
  typeName: string;
  totalApprove: number;
  type: string;
  level: number;
  listTargetId?: string[];
  lstApprove?: {
    id: string;
    targetId: string;
    level: number;
    mustApproveAll: boolean;
    approved: boolean;
  }[];
  children?: ApprovalItem[];
  open?: boolean;
}

export interface HomeApprovalResponse {
  data: ApprovalItem[];
}
