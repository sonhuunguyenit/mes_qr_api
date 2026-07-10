import { Hscb } from "../features/hscb/types";
import { DocStatus } from "../features/doc/types";

export const mockHscbs: Hscb[] = [
  {
    HscbId: "HSCB-001",
    HscbCode: "HSCB-FG001",
    SpecId: "SPEC-FG001-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-001",
        HscbId: "HSCB-001",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg001.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: "2026-05-31",
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-001",
            HscbVersionId: "HSCB-VERSION-001",
            ItemCode: "FG-001",
          },
        ],
      },
      {
        HscbVersionId: "HSCB-VERSION-001-V2",
        HscbId: "HSCB-001",
        VersionName:
          "Cập nhật bổ sung tỏi khô sấy Lý Sơn và điều chỉnh nhãn phụ Tết 2026",
        FileURL: "/files/hscb_fg001_v2.pdf",
        ValidFrom: "2026-06-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-001-V2",
            HscbVersionId: "HSCB-VERSION-001-V2",
            ItemCode: "FG-001",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-002",
    HscbCode: "HSCB-FG002",
    SpecId: "SPEC-FG002-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-002",
        HscbId: "HSCB-002",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg002.pdf",
        ValidFrom: "2026-02-01",
        ValidTo: "2026-06-30",
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-002",
            HscbVersionId: "HSCB-VERSION-002",
            ItemCode: "FG-002",
          },
        ],
      },
      {
        HscbVersionId: "HSCB-VERSION-002-V2",
        HscbId: "HSCB-002",
        VersionName: "Cập nhật điều chỉnh tỷ lệ chất béo trong gói xốt bò hầm",
        FileURL: "/files/hscb_fg002_v2.pdf",
        ValidFrom: "2026-07-01",
        ValidTo: null,
        Status: DocStatus.PENDING,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-002-V2",
            HscbVersionId: "HSCB-VERSION-002-V2",
            ItemCode: "FG-002",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-003",
    HscbCode: "HSCB-FG003",
    SpecId: "SPEC-FG003-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-003",
        HscbId: "HSCB-003",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg003.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-003",
            HscbVersionId: "HSCB-VERSION-003",
            ItemCode: "FG-003",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-004",
    HscbCode: "HSCB-FG004",
    SpecId: "SPEC-FG004-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-004",
        HscbId: "HSCB-004",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg004.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: "2026-04-30",
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-004",
            HscbVersionId: "HSCB-VERSION-004",
            ItemCode: "FG-004",
          },
        ],
      },
      {
        HscbVersionId: "HSCB-VERSION-004-V2",
        HscbId: "HSCB-004",
        VersionName:
          "Cập nhật thay đổi chất làm dày tự nhiên và nhãn xuất khẩu Nhật Bản",
        FileURL: "/files/hscb_fg004_v2.pdf",
        ValidFrom: "2026-05-01",
        ValidTo: null,
        Status: DocStatus.REJECTED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-004-V2",
            HscbVersionId: "HSCB-VERSION-004-V2",
            ItemCode: "FG-004",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-005",
    HscbCode: "HSCB-FG005",
    SpecId: "SPEC-FG005-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-005",
        HscbId: "HSCB-005",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg005.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-005",
            HscbVersionId: "HSCB-VERSION-005",
            ItemCode: "FG-005",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-006",
    HscbCode: "HSCB-FG006",
    SpecId: "SPEC-FG006-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-006",
        HscbId: "HSCB-006",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg006.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-006",
            HscbVersionId: "HSCB-VERSION-006",
            ItemCode: "FG-006",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-007",
    HscbCode: "HSCB-FG007",
    SpecId: "SPEC-FG007-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-007",
        HscbId: "HSCB-007",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg007.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-007",
            HscbVersionId: "HSCB-VERSION-007",
            ItemCode: "FG-007",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-008",
    HscbCode: "HSCB-FG008",
    SpecId: "SPEC-FG008-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-008",
        HscbId: "HSCB-008",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg008.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.PENDING,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-008",
            HscbVersionId: "HSCB-VERSION-008",
            ItemCode: "FG-008",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-009",
    HscbCode: "HSCB-FG009",
    SpecId: "SPEC-FG009-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-009",
        HscbId: "HSCB-009",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg009.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-009",
            HscbVersionId: "HSCB-VERSION-009",
            ItemCode: "FG-009",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-010",
    HscbCode: "HSCB-FG010",
    SpecId: "SPEC-FG010-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-010",
        HscbId: "HSCB-010",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg010.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-010",
            HscbVersionId: "HSCB-VERSION-010",
            ItemCode: "FG-010",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-011",
    HscbCode: "HSCB-FG011",
    SpecId: "SPEC-FG011-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-011",
        HscbId: "HSCB-011",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg011.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-011",
            HscbVersionId: "HSCB-VERSION-011",
            ItemCode: "FG-011",
          },
        ],
      },
    ],
  },
  {
    HscbId: "HSCB-012",
    HscbCode: "HSCB-FG012",
    SpecId: "SPEC-FG012-V1",
    HscbVersions: [
      {
        HscbVersionId: "HSCB-VERSION-012",
        HscbId: "HSCB-012",
        VersionName: "Bản tự công bố gốc - 2026",
        FileURL: "/files/hscb_fg012.pdf",
        ValidFrom: "2026-01-01",
        ValidTo: null,
        Status: DocStatus.APPROVED,
        HscbItems: [
          {
            HscbItemId: "HSCB-ITEM-012",
            HscbVersionId: "HSCB-VERSION-012",
            ItemCode: "FG-012",
          },
        ],
      },
    ],
  },
];
