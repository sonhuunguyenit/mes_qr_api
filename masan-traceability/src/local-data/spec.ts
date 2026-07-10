import { Spec, SpecType } from "../features/spec/types";

export const mockSpecs: Spec[] = [
  {
    SpecId: "SPEC-FG001-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-001-V1",
    SpecName: "Tiêu chuẩn Cơ sở gốc - Nước tương Chinsu Tỏi Ớt",
    FileURL: "/files/spec_fg001_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: "2026-05-31",
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG001-1",
        ItemCode: "FG-001",
        SpecId: "SPEC-FG001-V1",
      },
      {
        SpecItemId: "SPEC-ITEM-FG001-1-extra1",
        ItemCode: "FG-002",
        SpecId: "SPEC-FG001-V1",
      },
      {
        SpecItemId: "SPEC-ITEM-FG001-1-extra2",
        ItemCode: "FG-003",
        SpecId: "SPEC-FG001-V1",
      },
      {
        SpecItemId: "SPEC-ITEM-FG001-1-extra3",
        ItemCode: "FG-004",
        SpecId: "SPEC-FG001-V1",
      },
      {
        SpecItemId: "SPEC-ITEM-FG001-1-extra4",
        ItemCode: "FG-005",
        SpecId: "SPEC-FG001-V1",
      },
      {
        SpecItemId: "SPEC-ITEM-FG001-1-extra5",
        ItemCode: "FG-006",
        SpecId: "SPEC-FG001-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG001-V2",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-001-V2",
    SpecName:
      "Tiêu chuẩn Cơ sở cập nhật - Bổ sung hàm lượng tỏi khô sấy tẩm và giảm tỷ lệ đường tinh",
    FileURL: "/files/spec_fg001_v2.pdf",
    ValidFrom: "2026-06-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG001-2",
        ItemCode: "FG-001",
        SpecId: "SPEC-FG001-V2",
      },
      {
        SpecItemId: "SPEC-ITEM-FG001-2-extra1",
        ItemCode: "FG-002",
        SpecId: "SPEC-FG001-V2",
      },
    ],
  },
  {
    SpecId: "SPEC-FG002-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-002-V1",
    SpecName: "Tiêu chuẩn Cơ sở gốc - Mì Omachi Xốt Bò Hầm",
    FileURL: "/files/spec_fg002_v1.pdf",
    ValidFrom: "2026-02-01",
    ValidTo: "2026-06-30",
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG002-1",
        ItemCode: "FG-002",
        SpecId: "SPEC-FG002-V1",
      },
      {
        SpecItemId: "SPEC-ITEM-FG002-1-extra1",
        ItemCode: "FG-004",
        SpecId: "SPEC-FG002-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG002-V2",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-002-V2",
    SpecName:
      "Tiêu chuẩn Cơ sở cập nhật - Điều chỉnh hàm lượng chất béo bão hòa trong vắt mì",
    FileURL: "/files/spec_fg002_v2.pdf",
    ValidFrom: "2026-07-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG002-2",
        ItemCode: "FG-002",
        SpecId: "SPEC-FG002-V2",
      },
      {
        SpecItemId: "SPEC-ITEM-FG002-2-extra1",
        ItemCode: "FG-004",
        SpecId: "SPEC-FG002-V2",
      },
    ],
  },
  {
    SpecId: "SPEC-FG003-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-003-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Nước mắm Nam Ngư Đệ Nhị 900ml (v1)",
    FileURL: "/files/spec_fg003_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG003-1",
        ItemCode: "FG-003",
        SpecId: "SPEC-FG003-V1",
      },
      {
        SpecItemId: "SPEC-ITEM-FG003-1-extra1",
        ItemCode: "FG-005",
        SpecId: "SPEC-FG003-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-IP101-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-101-V1",
    SpecName: "Tiêu chuẩn kiểm định gốc - Nước cốt hầm xương bò đặc chế",
    FileURL: "/files/spec_ip101_v1.pdf",
    ValidFrom: "2026-01-10",
    ValidTo: "2026-05-31",
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP101-1",
        ItemCode: "IP-101",
        SpecId: "SPEC-IP101-V1",
      },
    ],
    QloneCode: "QL1-SPEC-101-V1",
  },
  {
    SpecId: "SPEC-IP101-V2",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-101-V2",
    QloneCode: "QL1-SPEC-101-V2",
    SpecName:
      "Tiêu chuẩn kiểm định cập nhật - Tăng thời gian cô đặc nhiệt độ thấp để giữ hương tủy bò",
    FileURL: "/files/spec_ip101_v2.pdf",
    ValidFrom: "2026-06-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP101-2",
        ItemCode: "IP-101",
        SpecId: "SPEC-IP101-V2",
      },
    ],
  },
  {
    SpecId: "SPEC-IP102-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-102-V1",
    SpecName: "Tiêu chuẩn kiểm định gốc - Bột gia vị mì ăn liền",
    FileURL: "/files/spec_ip102_v1.pdf",
    ValidFrom: "2026-01-15",
    ValidTo: "2026-04-30",
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP102-1",
        ItemCode: "IP-102",
        SpecId: "SPEC-IP102-V1",
      },
    ],
    QloneCode: "QL1-SPEC-102-V1",
  },
  {
    SpecId: "SPEC-IP102-V2",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-102-V2",
    QloneCode: "QL1-SPEC-102-V2",
    SpecName:
      "Tiêu chuẩn kiểm định cập nhật - Bổ sung bột hành sấy và điều chỉnh độ ẩm vắt mì",
    FileURL: "/files/spec_ip102_v2.pdf",
    ValidFrom: "2026-05-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP102-2",
        ItemCode: "IP-102",
        SpecId: "SPEC-IP102-V2",
      },
    ],
  },
  {
    SpecId: "SPEC-IP103-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-103-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Mỡ heo sơ chế (v1)",
    FileURL: "/files/spec_ip103_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP103-1",
        ItemCode: "IP-103",
        SpecId: "SPEC-IP103-V1",
      },
    ],
    QloneCode: "QL1-SPEC-103-V1",
  },
  {
    SpecId: "SPEC-RM201-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-201-V1",
    SpecName: "Tiêu chuẩn kiểm định gốc - Hành lá sấy khô nguyên chất",
    FileURL: "/files/spec_rm201_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: "2026-04-30",
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM201-1",
        ItemCode: "RM-201",
        SpecId: "SPEC-RM201-V1",
      },
    ],
    QloneCode: "QL1-SPEC-201-V1",
  },
  {
    SpecId: "SPEC-RM201-V2",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-201-V2",
    QloneCode: "QL1-SPEC-201-V2",
    SpecName:
      "Tiêu chuẩn kiểm định cập nhật - Bổ sung chỉ tiêu kiểm soát dư lượng thuốc bảo vệ thực vật",
    FileURL: "/files/spec_rm201_v2.pdf",
    ValidFrom: "2026-05-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM201-2",
        ItemCode: "RM-201",
        SpecId: "SPEC-RM201-V2",
      },
    ],
  },
  {
    SpecId: "SPEC-RM202-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-202-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Ớt tươi chỉ thiên (v1)",
    FileURL: "/files/spec_rm202_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM202-1",
        ItemCode: "RM-202",
        SpecId: "SPEC-RM202-V1",
      },
    ],
    QloneCode: "QL1-SPEC-202-V1",
  },
  {
    SpecId: "SPEC-RM203-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-203-V1",
    SpecName: "Tiêu chuẩn kiểm định gốc - Bột mì cao cấp nhập khẩu",
    FileURL: "/files/spec_rm203_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: "2026-07-31",
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM203-1",
        ItemCode: "RM-203",
        SpecId: "SPEC-RM203-V1",
      },
    ],
    QloneCode: "QL1-SPEC-203-V1",
  },
  {
    SpecId: "SPEC-RM203-V2",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-203-V2",
    QloneCode: "QL1-SPEC-203-V2",
    SpecName:
      "Tiêu chuẩn kiểm định cập nhật - Tăng cường kiểm soát hàm lượng Gluten khô tối thiểu 11.5%",
    FileURL: "/files/spec_rm203_v2.pdf",
    ValidFrom: "2026-08-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM203-2",
        ItemCode: "RM-203",
        SpecId: "SPEC-RM203-V2",
      },
    ],
  },
  {
    SpecId: "SPEC-PG301-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-301-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Màng co OPP bọc gói mì Omachi (v1)",
    FileURL: "/files/spec_pg301_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG301-1",
        ItemCode: "PG-301",
        SpecId: "SPEC-PG301-V1",
      },
    ],
    QloneCode: "QL1-SPEC-301-V1",
  },
  {
    SpecId: "SPEC-PG302-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-302-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Thùng carton 30 gói mì Omachi (v1)",
    FileURL: "/files/spec_pg302_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG302-1",
        ItemCode: "PG-302",
        SpecId: "SPEC-PG302-V1",
      },
    ],
    QloneCode: "QL1-SPEC-302-V1",
  },
  {
    SpecId: "SPEC-PG303-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-303-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Vỏ chai PET đựng nước tương 250ml (v1)",
    FileURL: "/files/spec_pg303_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG303-1",
        ItemCode: "PG-303",
        SpecId: "SPEC-PG303-V1",
      },
    ],
    QloneCode: "QL1-SPEC-303-V1",
  },
  {
    SpecId: "SPEC-FG004-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-004-V1",
    SpecName: "Tiêu chuẩn Cơ sở gốc - Tương ớt Chinsu Siêu Cay",
    FileURL: "/files/spec_fg004_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: "2026-04-30",
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG004-1",
        ItemCode: "FG-004",
        SpecId: "SPEC-FG004-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG004-V2",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-004-V2",
    SpecName:
      "Tiêu chuẩn Cơ sở cập nhật - Tăng tỷ lệ ớt chỉ thiên và thay đổi chất làm dày tự nhiên",
    FileURL: "/files/spec_fg004_v2.pdf",
    ValidFrom: "2026-05-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG004-2",
        ItemCode: "FG-004",
        SpecId: "SPEC-FG004-V2",
      },
    ],
  },
  {
    SpecId: "SPEC-FG005-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-005-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Mì Kokomi Đại 90g (v1)",
    FileURL: "/files/spec_fg005_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG005-1",
        ItemCode: "FG-005",
        SpecId: "SPEC-FG005-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG006-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-006-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Nước khoáng thiên nhiên Vĩnh Hảo 500ml (v1)",
    FileURL: "/files/spec_fg006_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG006-1",
        ItemCode: "FG-006",
        SpecId: "SPEC-FG006-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-IP104-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-104-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Nước cốt ớt lên men tự nhiên (v1)",
    FileURL: "/files/spec_ip104_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP104-1",
        ItemCode: "IP-104",
        SpecId: "SPEC-IP104-V1",
      },
    ],
    QloneCode: "QL1-SPEC-104-V1",
  },
  {
    SpecId: "SPEC-IP105-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-105-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Gói súp gia vị Kokomi bán thành phẩm (v1)",
    FileURL: "/files/spec_ip105_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP105-1",
        ItemCode: "IP-105",
        SpecId: "SPEC-IP105-V1",
      },
    ],
    QloneCode: "QL1-SPEC-105-V1",
  },
  {
    SpecId: "SPEC-RM204-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-204-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Tỏi Lý Sơn sơ chế sạch vỏ (v1)",
    FileURL: "/files/spec_rm204_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM204-1",
        ItemCode: "RM-204",
        SpecId: "SPEC-RM204-V1",
      },
    ],
    QloneCode: "QL1-SPEC-204-V1",
  },
  {
    SpecId: "SPEC-RM205-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-205-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Bột ớt cay chỉ thiên sấy khô (v1)",
    FileURL: "/files/spec_rm205_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM205-1",
        ItemCode: "RM-205",
        SpecId: "SPEC-RM205-V1",
      },
    ],
    QloneCode: "QL1-SPEC-205-V1",
  },
  {
    SpecId: "SPEC-RM206-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-206-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Muối tinh khiết sấy khô công nghiệp (v1)",
    FileURL: "/files/spec_rm206_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM206-1",
        ItemCode: "RM-206",
        SpecId: "SPEC-RM206-V1",
      },
    ],
    QloneCode: "QL1-SPEC-206-V1",
  },
  {
    SpecId: "SPEC-RM207-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-207-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Đường tinh luyện Biên Hòa thượng hạng (v1)",
    FileURL: "/files/spec_rm207_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM207-1",
        ItemCode: "RM-207",
        SpecId: "SPEC-RM207-V1",
      },
    ],
    QloneCode: "QL1-SPEC-207-V1",
  },
  {
    SpecId: "SPEC-PG304-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-304-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Vỏ chai PET đựng tương ớt 250g (v1)",
    FileURL: "/files/spec_pg304_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG304-1",
        ItemCode: "PG-304",
        SpecId: "SPEC-PG304-V1",
      },
    ],
    QloneCode: "QL1-SPEC-304-V1",
  },
  {
    SpecId: "SPEC-PG305-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-305-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Màng co OPP Kokomi (v1)",
    FileURL: "/files/spec_pg305_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG305-1",
        ItemCode: "PG-305",
        SpecId: "SPEC-PG305-V1",
      },
    ],
    QloneCode: "QL1-SPEC-305-V1",
  },
  {
    SpecId: "SPEC-PG306-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-306-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Thùng carton 30 gói mì Kokomi (v1)",
    FileURL: "/files/spec_pg306_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG306-1",
        ItemCode: "PG-306",
        SpecId: "SPEC-PG306-V1",
      },
    ],
    QloneCode: "QL1-SPEC-306-V1",
  },
  {
    SpecId: "SPEC-FG007-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-007-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Tương cà Chinsu thơm ngọt 250g (v1)",
    FileURL: "/files/spec_fg007_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG007-1",
        ItemCode: "FG-007",
        SpecId: "SPEC-FG007-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG008-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-008-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Mì Kokomi Xốt Cay 90g (v1)",
    FileURL: "/files/spec_fg008_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG008-1",
        ItemCode: "FG-008",
        SpecId: "SPEC-FG008-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG009-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-009-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Nước mắm Nam Ngư Nhãn Vàng 650ml (v1)",
    FileURL: "/files/spec_fg009_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG009-1",
        ItemCode: "FG-009",
        SpecId: "SPEC-FG009-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG010-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-010-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Cháo sen bát bảo Minh Trung 365g (v1)",
    FileURL: "/files/spec_fg010_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG010-1",
        ItemCode: "FG-010",
        SpecId: "SPEC-FG010-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG011-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-011-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Hạt nêm Chinsu Ngọt Tôm Thơm Thịt 400g (v1)",
    FileURL: "/files/spec_fg011_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG011-1",
        ItemCode: "FG-011",
        SpecId: "SPEC-FG011-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-FG012-V1",
    SpecType: SpecType.TCCS,
    SpecCode: "TCCS-FG-012-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Nước tăng lực Compact Hoa Anh Đào 330ml (v1)",
    FileURL: "/files/spec_fg012_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-FG012-1",
        ItemCode: "FG-012",
        SpecId: "SPEC-FG012-V1",
      },
    ],
  },
  {
    SpecId: "SPEC-IP106-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-106-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Nước cốt cà chua cô đặc (v1)",
    FileURL: "/files/spec_ip106_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP106-1",
        ItemCode: "IP-106",
        SpecId: "SPEC-IP106-V1",
      },
    ],
    QloneCode: "QL1-SPEC-106-V1",
  },
  {
    SpecId: "SPEC-IP107-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-107-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Hành tỏi băm nhuyễn xào thơm gia vị (v1)",
    FileURL: "/files/spec_ip107_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP107-1",
        ItemCode: "IP-107",
        SpecId: "SPEC-IP107-V1",
      },
    ],
    QloneCode: "QL1-SPEC-107-V1",
  },
  {
    SpecId: "SPEC-IP108-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-108-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Dịch cá cơm nguyên chất thủy phân (v1)",
    FileURL: "/files/spec_ip108_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP108-1",
        ItemCode: "IP-108",
        SpecId: "SPEC-IP108-V1",
      },
    ],
    QloneCode: "QL1-SPEC-108-V1",
  },
  {
    SpecId: "SPEC-IP109-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-109-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Hạt sen hầm đường phèn bán thành phẩm (v1)",
    FileURL: "/files/spec_ip109_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP109-1",
        ItemCode: "IP-109",
        SpecId: "SPEC-IP109-V1",
      },
    ],
    QloneCode: "QL1-SPEC-109-V1",
  },
  {
    SpecId: "SPEC-IP110-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-IP-110-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Xốt gia vị hạt nêm sấy chân không (v1)",
    FileURL: "/files/spec_ip110_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-IP110-1",
        ItemCode: "IP-110",
        SpecId: "SPEC-IP110-V1",
      },
    ],
    QloneCode: "QL1-SPEC-110-V1",
  },
  {
    SpecId: "SPEC-RM208-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-208-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Cà chua tươi hữu cơ Lâm Đồng (v1)",
    FileURL: "/files/spec_rm208_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM208-1",
        ItemCode: "RM-208",
        SpecId: "SPEC-RM208-V1",
      },
    ],
    QloneCode: "QL1-SPEC-208-V1",
  },
  {
    SpecId: "SPEC-RM209-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-209-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Hạt tiêu đen Phú Quốc chín tự nhiên (v1)",
    FileURL: "/files/spec_rm209_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM209-1",
        ItemCode: "RM-209",
        SpecId: "SPEC-RM209-V1",
      },
    ],
    QloneCode: "QL1-SPEC-209-V1",
  },
  {
    SpecId: "SPEC-RM210-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-210-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Hạt sen tươi Đồng Tháp loại A (v1)",
    FileURL: "/files/spec_rm210_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM210-1",
        ItemCode: "RM-210",
        SpecId: "SPEC-RM210-V1",
      },
    ],
    QloneCode: "QL1-SPEC-210-V1",
  },
  {
    SpecId: "SPEC-RM211-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-211-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Bột tôm sú sấy khô nguyên chất (v1)",
    FileURL: "/files/spec_rm211_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM211-1",
        ItemCode: "RM-211",
        SpecId: "SPEC-RM211-V1",
      },
    ],
    QloneCode: "QL1-SPEC-211-V1",
  },
  {
    SpecId: "SPEC-RM212-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-212-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Hương hoa anh đào tự nhiên nhập khẩu (v1)",
    FileURL: "/files/spec_rm212_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM212-1",
        ItemCode: "RM-212",
        SpecId: "SPEC-RM212-V1",
      },
    ],
    QloneCode: "QL1-SPEC-212-V1",
  },
  {
    SpecId: "SPEC-RM213-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-213-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Acid citric chất điều chỉnh độ acid (v1)",
    FileURL: "/files/spec_rm213_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM213-1",
        ItemCode: "RM-213",
        SpecId: "SPEC-RM213-V1",
      },
    ],
    QloneCode: "QL1-SPEC-213-V1",
  },
  {
    SpecId: "SPEC-RM214-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-RM-214-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Cá cơm tươi đại dương Phan Thiết (v1)",
    FileURL: "/files/spec_rm214_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-RM214-1",
        ItemCode: "RM-214",
        SpecId: "SPEC-RM214-V1",
      },
    ],
    QloneCode: "QL1-SPEC-214-V1",
  },
  {
    SpecId: "SPEC-PG307-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-307-V1",
    SpecName: "Tiêu chuẩn chất lượng gốc cho Vỏ chai PET tương cà 250g (v1)",
    FileURL: "/files/spec_pg307_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG307-1",
        ItemCode: "PG-307",
        SpecId: "SPEC-PG307-V1",
      },
    ],
    QloneCode: "QL1-SPEC-307-V1",
  },
  {
    SpecId: "SPEC-PG308-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-308-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Nắp chai nhựa có vòi cắt Chinsu (v1)",
    FileURL: "/files/spec_pg308_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG308-1",
        ItemCode: "PG-308",
        SpecId: "SPEC-PG308-V1",
      },
    ],
    QloneCode: "QL1-SPEC-308-V1",
  },
  {
    SpecId: "SPEC-PG309-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-309-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Lon nhôm hai mảnh đựng cháo 365g (v1)",
    FileURL: "/files/spec_pg309_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG309-1",
        ItemCode: "PG-309",
        SpecId: "SPEC-PG309-V1",
      },
    ],
    QloneCode: "QL1-SPEC-309-V1",
  },
  {
    SpecId: "SPEC-PG310-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-310-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Màng nhôm phức hợp túi hạt nêm 400g (v1)",
    FileURL: "/files/spec_pg310_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG310-1",
        ItemCode: "PG-310",
        SpecId: "SPEC-PG310-V1",
      },
    ],
    QloneCode: "QL1-SPEC-310-V1",
  },
  {
    SpecId: "SPEC-PG311-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-311-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Vỏ chai nhựa PET Compact 330ml (v1)",
    FileURL: "/files/spec_pg311_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG311-1",
        ItemCode: "PG-311",
        SpecId: "SPEC-PG311-V1",
      },
    ],
    QloneCode: "QL1-SPEC-311-V1",
  },
  {
    SpecId: "SPEC-PG312-V1",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-PG-312-V1",
    SpecName:
      "Tiêu chuẩn chất lượng gốc cho Thùng carton đựng nước tăng lực Compact (v1)",
    FileURL: "/files/spec_pg312_v1.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-PG312-1",
        ItemCode: "PG-312",
        SpecId: "SPEC-PG312-V1",
      },
    ],
    QloneCode: "QL1-SPEC-312-V1",
  },
  {
    SpecId: "SPEC-SHARED-SALT-SUGAR",
    SpecType: SpecType.SPEC,
    SpecCode: "SPEC-SHARED-SALT-SUGAR",
    SpecName:
      "Tiêu chuẩn kỹ thuật liên kết - Kiểm soát chỉ tiêu cảm quan và kim loại nặng của Muối & Đường",
    FileURL: "/files/spec_shared_salt_sugar.pdf",
    ValidFrom: "2026-01-01",
    ValidTo: null,
    SpecItems: [
      {
        SpecItemId: "SPEC-ITEM-SHARED-SALT",
        ItemCode: "RM-206",
        SpecId: "SPEC-SHARED-SALT-SUGAR",
      },
      {
        SpecItemId: "SPEC-ITEM-SHARED-SUGAR",
        ItemCode: "RM-207",
        SpecId: "SPEC-SHARED-SALT-SUGAR",
      },
    ],
  },
];
