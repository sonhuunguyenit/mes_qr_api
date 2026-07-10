import { ItemType } from '../../../enums';

export interface Item {
  ItemCode: string;       // PK
  ItemName: string;
  ItemType: ItemType; // Thành phẩm, Bán thành phẩm, Nguyên liệu, Bao bì
  UoM: string;            // Đơn vị tính
  VersionERP?: number;
  VersionStorage?: number;
}
