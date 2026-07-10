import { Partner } from "../../partner/types";

export enum DocType {
  COA = "COA", // Giấy chứng nhận phân tích chất lượng của từng lô hàng nhập thực tế (COA)
  SPECIFICATION = "SPECIFICATION", // Bản đặc tính kỹ thuật/tiêu chuẩn của NVL do nhà cung cấp ban hành (Specification)
  HSCB = "HSCB", // Tài liệu pháp lý lưu hành sản phẩm của NCC (HSCB)
  TCCS = "TCCS", // Tiêu chuẩn cơ sở (TCCS) của nhà cung cấp
  DI_UNG = "DI_UNG", // Biểu mẫu thông tin dị ứng do nhà cung cấp điền và cập nhật (Cảnh báo dị ứng)
  DINH_DUONG = "DINH_DUONG", // Bảng thông tin hàm lượng dinh dưỡng của nguyên liệu (Thông tin dinh dưỡng)
  HDSD = "HDSD", // Hướng dẫn sử dụng
  HD_BAO_QUAN = "HD_BAO_QUAN", // Hướng dẫn bảo quản
  CERTIFICATE = "CERTIFICATE", // Các chứng chỉ hệ thống của đối tác như ISO, HACCP, HALAL... (Các chứng nhận chất lượng)
  CO_KQKN = "CO_KQKN", // Chứng nhận C/O hoặc Kết quả kiểm nghiệm tại nước xuất xứ (KQ KN)
  KIEM_DICH = "KIEM_DICH", // Giấy kiểm dịch / kiểm định
  OTHER = "OTHER", // Loại giấy tờ khác (OTHER)
}

export enum DocStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Doc {
  DocId: string;
  PartnerId: string;
  DocCode: string;
  Version: string;
  DocType: DocType;
  DocName: string;
  FileURL: string;
  ValidFrom: Date | string;
  ValidTo?: Date | string | null;

  Status: DocStatus;
  Partner?: Partner;
  DocItems?: Doc_Item[];
}

export interface Doc_Item {
  DocItemId: string; // PK
  DocId: string; // FK -> Doc
  ItemCode: string;
  Doc?: Doc;
}
