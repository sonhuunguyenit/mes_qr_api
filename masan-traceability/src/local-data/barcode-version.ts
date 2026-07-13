export interface BarcodeVersion {
  BarcodeVersionId: string;
  BarcodeId: string;
  Version: number;
  BarcodeNumber: string;
  SpecId: string;
  ItemCodes: string[];
  ChangeDescription: string;
  ValidFrom: string;
  ValidTo: string | null;
  ModifiedBy: string;
  ModifiedAt: string;
}

export const mockBarcodeVersions: BarcodeVersion[] = [
  {
    BarcodeVersionId: "BV-001-V1",
    BarcodeId: "BARCODE-001",
    Version: 1,
    BarcodeNumber: "8934560123456",
    SpecId: "SPEC-FG001-V1",
    ItemCodes: ["FG-001"],
    ChangeDescription:
      "Khai báo mã vạch GS1 lần đầu theo đăng ký GS1 Việt Nam.",
    ValidFrom: "2026-01-01",
    ValidTo: "2026-04-30",
    ModifiedBy: "admin@masan.com.vn",
    ModifiedAt: "2025-12-20 09:00",
  },
  {
    BarcodeVersionId: "BV-001-V2",
    BarcodeId: "BARCODE-001",
    Version: 2,
    BarcodeNumber: "8934563123456",
    SpecId: "SPEC-FG001-V1",
    ItemCodes: ["FG-001"],
    ChangeDescription:
      "Cập nhật prefix GS1: 8934560 → 8934563 theo yêu cầu tái đăng ký GS1 Việt Nam.",
    ValidFrom: "2026-05-01",
    ValidTo: null,
    ModifiedBy: "qa_manager@masan.com.vn",
    ModifiedAt: "2026-04-28 14:30",
  },
  {
    BarcodeVersionId: "BV-002-V1",
    BarcodeId: "BARCODE-002",
    Version: 1,
    BarcodeNumber: "8934563789012",
    SpecId: "SPEC-FG002-V1",
    ItemCodes: ["FG-002"],
    ChangeDescription: "Khai báo mã vạch GS1 lần đầu cho sản phẩm Mì Omachi.",
    ValidFrom: "2026-02-01",
    ValidTo: null,
    ModifiedBy: "admin@masan.com.vn",
    ModifiedAt: "2026-01-25 10:00",
  },
];
