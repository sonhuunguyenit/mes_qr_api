import { Barcode } from "../features/barcode/types";

export const mockBarcodes: Barcode[] = [
  {
    BarcodeId: "BARCODE-001",
    BarcodeNumber: "8934563123456",
    SpecId: "SPEC-FG001-V1",
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-001",
        BarcodeId: "BARCODE-001",
        ItemCode: "FG-001",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-002",
    BarcodeNumber: "8934563789012",
    SpecId: "SPEC-FG002-V1",
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-002",
        BarcodeId: "BARCODE-002",
        ItemCode: "FG-002",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-003",
    BarcodeNumber: "8934563112233",
    SpecId: "SPEC-FG003-V1",
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-003",
        BarcodeId: "BARCODE-003",
        ItemCode: "FG-003",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-004",
    BarcodeNumber: "8934563114455",
    SpecId: "SPEC-FG004-V1",
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-004",
        BarcodeId: "BARCODE-004",
        ItemCode: "FG-004",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-005",
    BarcodeNumber: "8934563115566",
    SpecId: "SPEC-FG005-V1",
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-005",
        BarcodeId: "BARCODE-005",
        ItemCode: "FG-005",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-006",
    BarcodeNumber: "8934563116677",
    SpecId: "SPEC-FG006-V1",
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-006",
        BarcodeId: "BARCODE-006",
        ItemCode: "FG-006",
      },
    ],
  },

  // 7-12 (Double size!)
  {
    BarcodeId: "BARCODE-007",
    BarcodeNumber: "8934563117788",
    SpecId: "SPEC-FG007-V1", // FK -> SPEC-FG007-V1
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-007",
        BarcodeId: "BARCODE-007",
        ItemCode: "FG-007",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-008",
    BarcodeNumber: "8934563118899",
    SpecId: "SPEC-FG008-V1", // FK -> SPEC-FG008-V1
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-008",
        BarcodeId: "BARCODE-008",
        ItemCode: "FG-008",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-009",
    BarcodeNumber: "8934563119900",
    SpecId: "SPEC-FG009-V1", // FK -> SPEC-FG009-V1
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-009",
        BarcodeId: "BARCODE-009",
        ItemCode: "FG-009",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-010",
    BarcodeNumber: "8934563120011",
    SpecId: "SPEC-FG010-V1", // FK -> SPEC-FG010-V1
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-010",
        BarcodeId: "BARCODE-010",
        ItemCode: "FG-010",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-011",
    BarcodeNumber: "8934563121122",
    SpecId: "SPEC-FG011-V1", // FK -> SPEC-FG011-V1
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-011",
        BarcodeId: "BARCODE-011",
        ItemCode: "FG-011",
      },
    ],
  },
  {
    BarcodeId: "BARCODE-012",
    BarcodeNumber: "8934563122233",
    SpecId: "SPEC-FG012-V1", // FK -> SPEC-FG012-V1
    BarcodeItems: [
      {
        BarcodeItemId: "BARCODE-ITEM-012",
        BarcodeId: "BARCODE-012",
        ItemCode: "FG-012",
      },
    ],
  },
];
