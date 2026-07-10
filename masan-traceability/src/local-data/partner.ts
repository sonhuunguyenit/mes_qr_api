import {
  Partner,
  PartnerType,
  PartnerItemMapping,
} from "../features/partner/types";

import { DocStatus } from "../features/doc/types";

export const mockPartners: Partner[] = [
  // 1-8
  {
    PartnerId: "PARTNER-001",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-001",
    PartnerName: "Công ty TNHH Cung cấp Gia vị Việt Nam",
    Email: "qa@ncc001.com.vn",
  },
  {
    PartnerId: "PARTNER-002",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-002",
    PartnerName: "Hợp tác xã Nông nghiệp Ớt Sạch Đà Lạt",
    Email: "qa@nsx002.com.vn",
  },
  {
    PartnerId: "PARTNER-003",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-003",
    PartnerName: "Tổng công ty Nhựa và Bao bì Thành Phát",
    Email: "qa@ncc003.com.vn",
  },
  {
    PartnerId: "PARTNER-004",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-004",
    PartnerName: "Nhà máy Bột mì Cầu Tre",
    Email: "qa@nsx004.com.vn",
  },
  {
    PartnerId: "PARTNER-005",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-005",
    PartnerName: "Công ty TNHH Bao bì Minh Phát",
    Email: "qa@ncc005.com.vn",
  },
  {
    PartnerId: "PARTNER-006",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-006",
    PartnerName: "Công ty Cổ phần Nông nghiệp Masan High-Tech",
    Email: "qa@nsx006.com.vn",
  },
  {
    PartnerId: "PARTNER-007",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-007",
    PartnerName: "Tổng công ty Đường cát và Muối tinh Khánh Hòa",
    Email: "qa@ncc007.com.vn",
  },
  {
    PartnerId: "PARTNER-008",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-008",
    PartnerName: "Hợp tác xã Hành tỏi và Đặc sản Đảo Lý Sơn",
    Email: "qa@nsx008.com.vn",
  },

  // 9-16 (Double size!)
  {
    PartnerId: "PARTNER-009",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-009",
    PartnerName: "Công ty Cổ phần Cơ khí và Nhôm Việt Nam",
    Email: "qa@ncc009.com.vn",
  },
  {
    PartnerId: "PARTNER-010",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-010",
    PartnerName: "Hợp tác xã Cà chua hữu cơ Lâm Đồng",
    Email: "qa@nsx010.com.vn",
  },
  {
    PartnerId: "PARTNER-011",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-011",
    PartnerName: "Nhà máy Hương liệu thực phẩm Givaudan Việt Nam",
    Email: "qa@ncc011.com.vn",
    Status: DocStatus.PENDING,
  },
  {
    PartnerId: "PARTNER-012",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-012",
    PartnerName: "Hợp tác xã Sen vàng Tháp Mười (Đồng Tháp)",
    Email: "qa@nsx012.com.vn",
    Status: DocStatus.PENDING,
  },
  {
    PartnerId: "PARTNER-013",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-013",
    PartnerName: "Công ty Cổ phần Hạt tiêu Việt Nam (Vietpepper)",
    Email: "qa@ncc013.com.vn",
  },
  {
    PartnerId: "PARTNER-014",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-014",
    PartnerName: "Nhà máy chế biến thủy sản Phan Thiết",
    Email: "qa@nsx014.com.vn",
  },
  {
    PartnerId: "PARTNER-015",
    PartnerType: PartnerType.NCC,
    PartnerCode: "NCC-015",
    PartnerName: "Công ty Bao bì màng nhôm phức hợp Hải Phòng",
    Email: "qa@ncc015.com.vn",
  },
  {
    PartnerId: "PARTNER-016",
    PartnerType: PartnerType.NSX,
    PartnerCode: "NSX-016",
    PartnerName: "Công ty TNHH Phụ gia thực phẩm và Hóa chất miền Nam",
    Email: "qa@nsx016.com.vn",
  },
];

export const mockPartnerItemMappings: PartnerItemMapping[] = [
  // RM-201 (Hành lá sấy khô nguyên chất) - Có 2 NCC và 2 NSX
  { MappingId: "MAP-001", ItemCode: "RM-201", PartnerId: "PARTNER-001" }, // NCC-001
  { MappingId: "MAP-001-2", ItemCode: "RM-201", PartnerId: "PARTNER-011" }, // NCC-011 (Thêm NCC)
  { MappingId: "MAP-002", ItemCode: "RM-201", PartnerId: "PARTNER-008" }, // NSX-008
  { MappingId: "MAP-002-2", ItemCode: "RM-201", PartnerId: "PARTNER-012" }, // NSX-012 (Thêm NSX)

  // RM-202 (Ớt tươi chỉ thiên) - Có 2 NCC và 2 NSX
  { MappingId: "MAP-003", ItemCode: "RM-202", PartnerId: "PARTNER-001" }, // NCC-001
  { MappingId: "MAP-003-2", ItemCode: "RM-202", PartnerId: "PARTNER-013" }, // NCC-013 (Thêm NCC)
  { MappingId: "MAP-004", ItemCode: "RM-202", PartnerId: "PARTNER-002" }, // NSX-002
  { MappingId: "MAP-004-2", ItemCode: "RM-202", PartnerId: "PARTNER-008" }, // NSX-008 (Thêm NSX)

  // RM-203 (Bột mì cao cấp nhập khẩu) - Có 2 NCC và 2 NSX
  { MappingId: "MAP-005", ItemCode: "RM-203", PartnerId: "PARTNER-007" }, // NCC-007
  { MappingId: "MAP-005-2", ItemCode: "RM-203", PartnerId: "PARTNER-001" }, // NCC-001 (Thêm NCC)
  { MappingId: "MAP-006", ItemCode: "RM-203", PartnerId: "PARTNER-004" }, // NSX-004
  { MappingId: "MAP-006-2", ItemCode: "RM-203", PartnerId: "PARTNER-014" }, // NSX-014 (Thêm NSX)

  // PG-301 (Màng co OPP bọc gói mì Omachi) - Có 2 NCC và 2 NSX
  { MappingId: "MAP-007", ItemCode: "PG-301", PartnerId: "PARTNER-005" }, // NCC-005
  { MappingId: "MAP-007-2", ItemCode: "PG-301", PartnerId: "PARTNER-003" }, // NCC-003 (Thêm NCC)
  { MappingId: "MAP-008", ItemCode: "PG-301", PartnerId: "PARTNER-006" }, // NSX-006
  { MappingId: "MAP-008-2", ItemCode: "PG-301", PartnerId: "PARTNER-016" }, // NSX-016 (Thêm NSX)

  // PG-302 (Thùng carton 30 gói mì Omachi)
  { MappingId: "MAP-009", ItemCode: "PG-302", PartnerId: "PARTNER-005" }, // NCC-005
  { MappingId: "MAP-010", ItemCode: "PG-302", PartnerId: "PARTNER-006" }, // NSX-006

  // PG-303 (Vỏ chai PET đựng nước tương 250ml) - Có 2 NCC và 2 NSX
  { MappingId: "MAP-011", ItemCode: "PG-303", PartnerId: "PARTNER-005" }, // NCC-005
  { MappingId: "MAP-011-2", ItemCode: "PG-303", PartnerId: "PARTNER-015" }, // NCC-015 (Thêm NCC)
  { MappingId: "MAP-012", ItemCode: "PG-303", PartnerId: "PARTNER-010" }, // NSX-010
  { MappingId: "MAP-012-2", ItemCode: "PG-303", PartnerId: "PARTNER-006" }, // NSX-006 (Thêm NSX)

  // RM-204 (Tỏi Lý Sơn sơ chế sạch vỏ) - Có 2 NCC và 2 NSX
  { MappingId: "MAP-013", ItemCode: "RM-204", PartnerId: "PARTNER-013" }, // NCC-013
  { MappingId: "MAP-013-2", ItemCode: "RM-204", PartnerId: "PARTNER-001" }, // NCC-001 (Thêm NCC)
  { MappingId: "MAP-014", ItemCode: "RM-204", PartnerId: "PARTNER-008" }, // NSX-008
  { MappingId: "MAP-014-2", ItemCode: "RM-204", PartnerId: "PARTNER-002" }, // NSX-002 (Thêm NSX)

  // RM-205 (Bột ớt cay chỉ thiên sấy khô)
  { MappingId: "MAP-015", ItemCode: "RM-205", PartnerId: "PARTNER-001" }, // NCC-001
  { MappingId: "MAP-016", ItemCode: "RM-205", PartnerId: "PARTNER-002" }, // NSX-002

  // RM-206 (Muối tinh khiết sấy khô công nghiệp)
  { MappingId: "MAP-017", ItemCode: "RM-206", PartnerId: "PARTNER-007" }, // NCC-007
  { MappingId: "MAP-018", ItemCode: "RM-206", PartnerId: "PARTNER-016" }, // NSX-016

  // RM-207 (Đường tinh luyện Biên Hòa thượng hạng)
  { MappingId: "MAP-019", ItemCode: "RM-207", PartnerId: "PARTNER-007" }, // NCC-007
  { MappingId: "MAP-020", ItemCode: "RM-207", PartnerId: "PARTNER-012" }, // NSX-012
];
