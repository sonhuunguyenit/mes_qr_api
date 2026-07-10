import { RecallDecision } from "../features/recall/types";
import { RecallStatus } from "../enums";

export const mockRecallDecisions: RecallDecision[] = [
  {
    RecallId: "RECALL-001",
    ItemCode: "FG-002",
    LotNumber: "LOT-20260701-01",
    Reason:
      "Phát hiện dư lượng kim loại nặng vượt quá quy chuẩn kỹ thuật cho phép",
    RecallDate: "2026-07-01",
    Status: RecallStatus.INITIATED,
  },
  {
    RecallId: "RECALL-002",
    ItemCode: "FG-005",
    LotNumber: "LOT-20260705-02",
    Reason: "Lỗi đóng gói gây hở màng co làm ảnh hưởng chất lượng bảo quan",
    RecallDate: "2026-07-05",
    Status: RecallStatus.INITIATED,
  },
  {
    RecallId: "RECALL-003",
    ItemCode: "FG-007",
    LotNumber: "LOT-20260710-03",
    Reason: "Phát hiện nấm men mốc vượt chỉ tiêu vi sinh quy định trong TCCS",
    RecallDate: "2026-07-10",
    Status: RecallStatus.INITIATED,
  },
  {
    RecallId: "RECALL-004",
    ItemCode: "FG-012",
    LotNumber: "LOT-20260715-04",
    Reason:
      "Phụ gia tạo ngọt vượt quá nồng độ công bố tại Cục An toàn thực phẩm",
    RecallDate: "2026-07-15",
    Status: RecallStatus.INITIATED,
  },
];
