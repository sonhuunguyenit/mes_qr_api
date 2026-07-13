import { ItemType } from '../../../enums';

export interface Item {
  ItemCode: string;       // PK
  ItemName: string;
  ItemType: ItemType;     // Thành phẩm, Bán thành phẩm, Nguyên liệu, Bao bì
  UoM: string;            // Đơn vị tính
  VersionERP?: number;
  VersionStorage?: number;
}

export interface ItemVersion {
  ItemVersionId: string;  // PK
  ItemCode: string;       // FK -> Item
  Version: number;        // Số phiên bản
  ItemName: string;       // Tên vật tư tại phiên bản này
  ItemType: ItemType;     // Phân loại tại phiên bản này
  UoM: string;            // Đơn vị tính tại phiên bản này
  Substitute?: string;    // Thông tin thay thế nguyên liệu cùng loại
  Status: string;         // Trạng thái phê duyệt
  ValidFrom: string;      // Ngày bắt đầu hiệu lực
  ValidTo?: string | null; // Ngày hết hiệu lực
  ModifiedBy?: string;
  ModifiedAt?: string;
  IsSyncERP: boolean;
}
