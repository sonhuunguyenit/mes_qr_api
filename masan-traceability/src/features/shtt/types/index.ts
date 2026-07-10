import { ShttType } from '../../../enums';

export interface Hscb_Shtt {
  HscbShttId: string;      // PK
  HscbVersionId: string;  // FK -> Trỏ về đích danh phiên bản Nhãn mác/HSCB chứa cái SHTT này
  ShttCode: string;       // Số đơn SHTT (Rã ra từ file file PDF nhãn)
  ShttType: ShttType;       // PRIMARY_BRAND | SECONDARY_BRAND | INDUSTRIAL_DESIGN
}
