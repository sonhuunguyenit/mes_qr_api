import { RecallStatus } from '../../../enums';

export interface RecallDecision {
  RecallId: string;

  ItemCode: string;
  LotNumber: string;
  Reason: string;
  RecallDate: string;
  Status: RecallStatus;
}
