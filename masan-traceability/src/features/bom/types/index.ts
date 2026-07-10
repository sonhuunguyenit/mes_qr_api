export interface Bom {
  BomId: string; // PK
  ItemCode: string; // Mã ERP Thành phẩm (BOM Cha)
  ErpVersion: string;
  Version: string;
  Selected_HscbVersionId?: string; // FK -> Hscb_Version (HSCB của cha, chỉ có ở TP)
  ValidFrom: string | Date;       // Ngày hiệu lực
  ValidTo?: string | Date | null;  // Ngày hết hiệu lực
  BomLines?: Bom_Line[]; // 1 BOM có nhiều Nguyên liệu (BOM Con)
}

export interface Bom_Line {
  BomLineId: string; // PK
  BomId: string; // FK -> Bom
  ErpItemCode: string; // Mã NVL/Bao bì đổ vào nồi
  Selected_SpecId: string;
  Selected_SpecCode: string;
  Selected_HscbVersionId?: string;
  Bom?: Bom;
}
