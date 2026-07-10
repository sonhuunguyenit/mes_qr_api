import { Bom } from '../../bom/types';
import { Spec } from '../../spec/types';
import { Hscb } from '../../hscb/types';
import { Doc } from '../../doc/types';
import { Hscb_Shtt } from '../../shtt/types';
import { TraceabilityDirection } from '../../../enums';

export interface TraceabilityResult {
  ItemCode: string;
  LotNumber: string;
  Direction: TraceabilityDirection;
  ProductionDate: string;
  QtyProduced: number;
  WoPoNo: string;
  Bom?: Bom;
  Specs?: Spec[];
  Hscbs?: Hscb[];
  Docs?: Doc[];
  ShttMappings?: Hscb_Shtt[];
  GeneratedAt: string;
}
