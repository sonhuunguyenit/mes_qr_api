// =============================================================================
// ERP LOT SERVICE — Mock API calls cho Module Truy Xuất Thành Phẩm (Trace Backward)
// =============================================================================
//
// KIẾN TRÚC RÕ RÀNG:
//   - Data đã có trong Redux (BOM, Item Master, HSCB, Partners) → DÙNG TRỰC TIẾP, KHÔNG gọi API
//   - Data KHÔNG có trong local → GỌI API ERP
//
// Có 2 API calls thực sự cần thiết:
//   1. getFgLotInfo(itemCode, lotCode)
//      Input : ItemCode của Thành Phẩm + LotCode của mẻ
//      Output: FactoryVersionBOM (để tra BOM tương ứng), FactoryCode, NSX, HSD, số lượng
//
//   2. getNvlLotDetails(fgLotCode, nvlItemCode)
//      Input : LotCode của Thành Phẩm + ItemCode của NVL/BTP/Bao bì (lấy từ BomLine.ErpItemCode)
//      Output: LotCode NVL thực tế dùng trong mẻ đó, qty, HSD, ngày giao, quy cách đóng gói
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Response từ API ERP khi truy vấn thông tin lô Thành Phẩm */
export interface FgLotApiResponse {
  status: "success" | "error";
  data: {
    ItemCode: string;
    LotCode: string;
    FactoryVersionBOM: string;   // Version BOM thực tế đã dùng để nấu mẻ này
    FactoryCode: string;         // Mã nhà máy sản xuất (tra trong Facility table)
    NSX_ThanhPham: string;       // Ngày sản xuất (yyyy-mm-dd)
    HSD: string;                 // Hạn sử dụng (yyyy-mm-dd)
    SoLuongDaSanXuat: number;    // Tổng SL Thành Phẩm đã sản xuất
    SoLuongDaTieuThu: number;    // Tổng SL Thành Phẩm đã xuất bán
    SoLuongNhapKhau: number;     // SL NVL nhập khẩu (0 nếu không nhập khẩu)
  };
}

/** Response từ API ERP khi truy vấn lot NVL/BTP/Bao bì đã dùng trong 1 mẻ sản xuất */
export interface NvlLotApiResponse {
  status: "success" | "error";
  data: {
    FgLotCode: string;           // Lot Thành Phẩm mẻ đó
    NvlItemCode: string;         // ItemCode của NVL/BTP/Bao bì
    NvlLotCode: string;          // Số lô NVL thực tế đã dùng (format: YYMMDD + PartnerAbbrev + VendorLot)
    QtyUsed: string;             // Khối lượng / số lượng đã dùng (kèm đơn vị)
    HSD: string;                 // Hạn sử dụng của lô NVL đó
    DeliveryDate: string;        // Ngày giao nhận vào kho (yyyy-mm-dd HH:mm)
    Packaging: string;           // Quy cách đóng gói
  };
}

// ---------------------------------------------------------------------------
// Mock data — key: `${fgLotCode}` cho FG Lot API
// ---------------------------------------------------------------------------

const mockFgLotApiData: Record<string, FgLotApiResponse["data"]> = {
  // FG-001 - Nước tương Chinsu Tỏi Ớt 250ml
  "FG-001_260526NSX00601": {
    ItemCode: "FG-001",
    LotCode: "260526NSX00601",
    FactoryVersionBOM: "1",
    FactoryCode: "FAC-001",
    NSX_ThanhPham: "2026-05-26",
    HSD: "2027-05-26",
    SoLuongDaSanXuat: 25000,
    SoLuongDaTieuThu: 22000,
    SoLuongNhapKhau: 0,
  },
  "FG-001_260526NSX00602": {
    ItemCode: "FG-001",
    LotCode: "260526NSX00602",
    FactoryVersionBOM: "1",
    FactoryCode: "FAC-001",
    NSX_ThanhPham: "2026-05-26",
    HSD: "2027-05-26",
    SoLuongDaSanXuat: 18000,
    SoLuongDaTieuThu: 16000,
    SoLuongNhapKhau: 0,
  },

  // FG-002 - Mì Omachi Xốt Bò Hầm 80g
  "FG-002_260701NSX00601": {
    ItemCode: "FG-002",
    LotCode: "260701NSX00601",
    FactoryVersionBOM: "2",    // BOM-002, ValidFrom 2026-02-01
    FactoryCode: "FAC-002",
    NSX_ThanhPham: "2026-07-01",
    HSD: "2027-01-01",
    SoLuongDaSanXuat: 50000,
    SoLuongDaTieuThu: 45000,
    SoLuongNhapKhau: 10000,
  },
  "FG-002_260701NSX00602": {
    ItemCode: "FG-002",
    LotCode: "260701NSX00602",
    FactoryVersionBOM: "2",
    FactoryCode: "FAC-002",
    NSX_ThanhPham: "2026-07-01",
    HSD: "2027-01-01",
    SoLuongDaSanXuat: 30000,
    SoLuongDaTieuThu: 28000,
    SoLuongNhapKhau: 5000,
  },

  // FG-003 - Nước mắm Nam Ngư Đệ Nhị 900ml
  "FG-003_260601NSX00601": {
    ItemCode: "FG-003",
    LotCode: "260601NSX00601",
    FactoryVersionBOM: "1",
    FactoryCode: "FAC-003",
    NSX_ThanhPham: "2026-06-01",
    HSD: "2027-06-01",
    SoLuongDaSanXuat: 60000,
    SoLuongDaTieuThu: 55000,
    SoLuongNhapKhau: 0,
  },

  // FG-004 - Tương ớt Chinsu Siêu Cay 250g
  "FG-004_260615NSX00601": {
    ItemCode: "FG-004",
    LotCode: "260615NSX00601",
    FactoryVersionBOM: "1",
    FactoryCode: "FAC-001",
    NSX_ThanhPham: "2026-06-15",
    HSD: "2027-06-15",
    SoLuongDaSanXuat: 35000,
    SoLuongDaTieuThu: 31000,
    SoLuongNhapKhau: 0,
  },

  // FG-005 - Mì Kokomi Đại 90g
  "FG-005_260705NSX00602": {
    ItemCode: "FG-005",
    LotCode: "260705NSX00602",
    FactoryVersionBOM: "1",
    FactoryCode: "FAC-002",
    NSX_ThanhPham: "2026-07-05",
    HSD: "2027-01-05",
    SoLuongDaSanXuat: 40000,
    SoLuongDaTieuThu: 38000,
    SoLuongNhapKhau: 8000,
  },

  // FG-007 - Tương cà Chinsu thơm ngọt 250g
  "FG-007_260710NSX00603": {
    ItemCode: "FG-007",
    LotCode: "260710NSX00603",
    FactoryVersionBOM: "1",
    FactoryCode: "FAC-001",
    NSX_ThanhPham: "2026-07-10",
    HSD: "2027-07-10",
    SoLuongDaSanXuat: 20000,
    SoLuongDaTieuThu: 18000,
    SoLuongNhapKhau: 0,
  },

  // FG-012 - Nước tăng lực Compact Hoa Anh Đào 330ml
  "FG-012_260715NSX00604": {
    ItemCode: "FG-012",
    LotCode: "260715NSX00604",
    FactoryVersionBOM: "1",
    FactoryCode: "FAC-004",
    NSX_ThanhPham: "2026-07-15",
    HSD: "2027-01-15",
    SoLuongDaSanXuat: 15000,
    SoLuongDaTieuThu: 12000,
    SoLuongNhapKhau: 0,
  },
};

// ---------------------------------------------------------------------------
// Mock data — key: `${fgLotCode}_${nvlItemCode}` cho NVL Lot API
// (Mỗi cặp FG lot + NVL item → 1 lot NVL thực tế đã dùng trong mẻ đó)
// ---------------------------------------------------------------------------

const mockNvlLotApiData: Record<string, NvlLotApiResponse["data"]> = {
  // === FG-001 lot 260526NSX00601 ===
  // BOM-001: IP-103, RM-202, PG-303
  "260526NSX00601_IP-103": {
    FgLotCode: "260526NSX00601",
    NvlItemCode: "IP-103",
    NvlLotCode: "260510NSX006103",     // Bán thành phẩm nội bộ: dùng format NSX nội bộ
    QtyUsed: "500 kg",
    HSD: "2026-11-10",
    DeliveryDate: "2026-05-20 08:00",
    Packaging: "Thùng nhựa chuyên dụng",
  },
  "260526NSX00601_RM-202": {
    FgLotCode: "260526NSX00601",
    NvlItemCode: "RM-202",
    NvlLotCode: "260510NCC002123",
    QtyUsed: "120 kg",
    HSD: "2027-01-05",
    DeliveryDate: "2026-05-24 07:30",
    Packaging: "Sọt nhựa thoáng khí",
  },
  "260526NSX00601_PG-303": {
    FgLotCode: "260526NSX00601",
    NvlItemCode: "PG-303",
    NvlLotCode: "260501NCC005456",
    QtyUsed: "25,000 cái",
    HSD: "2028-01-01",
    DeliveryDate: "2026-05-18 10:00",
    Packaging: "Cuộn màng OPP",
  },

  // === FG-001 lot 260526NSX00602 ===
  "260526NSX00602_IP-103": {
    FgLotCode: "260526NSX00602",
    NvlItemCode: "IP-103",
    NvlLotCode: "260515NSX006104",
    QtyUsed: "420 kg",
    HSD: "2026-11-15",
    DeliveryDate: "2026-05-21 08:00",
    Packaging: "Thùng nhựa chuyên dụng",
  },
  "260526NSX00602_RM-202": {
    FgLotCode: "260526NSX00602",
    NvlItemCode: "RM-202",
    NvlLotCode: "260512NCC002124",
    QtyUsed: "95 kg",
    HSD: "2027-01-12",
    DeliveryDate: "2026-05-25 07:30",
    Packaging: "Sọt nhựa thoáng khí",
  },
  "260526NSX00602_PG-303": {
    FgLotCode: "260526NSX00602",
    NvlItemCode: "PG-303",
    NvlLotCode: "260501NCC005457",
    QtyUsed: "18,000 cái",
    HSD: "2028-01-01",
    DeliveryDate: "2026-05-18 10:00",
    Packaging: "Cuộn màng OPP",
  },

  // === FG-002 lot 260701NSX00601 ===
  // BOM-002: IP-101, RM-201, PG-301
  "260701NSX00601_IP-101": {
    FgLotCode: "260701NSX00601",
    NvlItemCode: "IP-101",
    NvlLotCode: "260620MSN001001",     // Bán thành phẩm nội bộ: format NSX nội bộ
    QtyUsed: "1,200 Lít",
    HSD: "2026-12-20",
    DeliveryDate: "2026-06-25 08:30",
    Packaging: "Bồn chuyên dụng 1000L",
  },
  "260701NSX00601_RM-201": {
    FgLotCode: "260701NSX00601",
    NvlItemCode: "RM-201",
    NvlLotCode: "260526NCC001123",
    QtyUsed: "2,500 kg",
    HSD: "2027-12-31",
    DeliveryDate: "2026-06-25 08:30",
    Packaging: "Bao PE 25kg",
  },
  "260701NSX00601_PG-301": {
    FgLotCode: "260701NSX00601",
    NvlItemCode: "PG-301",
    NvlLotCode: "260526NCC005234",
    QtyUsed: "50,000 cái",
    HSD: "2028-05-15",
    DeliveryDate: "2026-06-20 10:15",
    Packaging: "Cuộn màng OPP",
  },

  // === FG-002 lot 260701NSX00602 ===
  "260701NSX00602_IP-101": {
    FgLotCode: "260701NSX00602",
    NvlItemCode: "IP-101",
    NvlLotCode: "260625MSN001002",
    QtyUsed: "800 Lít",
    HSD: "2026-12-25",
    DeliveryDate: "2026-06-28 08:30",
    Packaging: "Bồn chuyên dụng 1000L",
  },
  "260701NSX00602_RM-201": {
    FgLotCode: "260701NSX00602",
    NvlItemCode: "RM-201",
    NvlLotCode: "260602NCC001124",
    QtyUsed: "1,800 kg",
    HSD: "2027-12-31",
    DeliveryDate: "2026-06-28 08:30",
    Packaging: "Bao PE 25kg",
  },
  "260701NSX00602_PG-301": {
    FgLotCode: "260701NSX00602",
    NvlItemCode: "PG-301",
    NvlLotCode: "260605NCC005235",
    QtyUsed: "30,000 cái",
    HSD: "2028-05-15",
    DeliveryDate: "2026-06-22 10:15",
    Packaging: "Cuộn màng OPP",
  },

  // === FG-003 lot 260601NSX00601 ===
  // BOM-003: FG-001, FG-002, PG-302
  "260601NSX00601_FG-001": {
    FgLotCode: "260601NSX00601",
    NvlItemCode: "FG-001",
    NvlLotCode: "260526NSX00601",      // Thành phẩm FG-001 dùng làm BTP cho FG-003
    QtyUsed: "5,000 Thùng",
    HSD: "2027-05-26",
    DeliveryDate: "2026-05-28 09:00",
    Packaging: "Thùng carton 24 chai",
  },
  "260601NSX00601_FG-002": {
    FgLotCode: "260601NSX00601",
    NvlItemCode: "FG-002",
    NvlLotCode: "260701NSX00601",
    QtyUsed: "3,000 Thùng",
    HSD: "2027-01-01",
    DeliveryDate: "2026-07-02 08:00",
    Packaging: "Thùng carton 30 gói",
  },
  "260601NSX00601_PG-302": {
    FgLotCode: "260601NSX00601",
    NvlItemCode: "PG-302",
    NvlLotCode: "260510NCC006789",
    QtyUsed: "10,000 cái",
    HSD: "2028-12-31",
    DeliveryDate: "2026-05-25 14:00",
    Packaging: "Cuộn màng co",
  },

  // === FG-004 lot 260615NSX00601 ===
  // BOM-004: IP-104, RM-204, RM-206, RM-207, PG-304
  "260615NSX00601_IP-104": {
    FgLotCode: "260615NSX00601",
    NvlItemCode: "IP-104",
    NvlLotCode: "260601NSX004101",
    QtyUsed: "800 kg",
    HSD: "2026-12-01",
    DeliveryDate: "2026-06-10 07:30",
    Packaging: "Thùng nhựa IBC",
  },
  "260615NSX00601_RM-204": {
    FgLotCode: "260615NSX00601",
    NvlItemCode: "RM-204",
    NvlLotCode: "260520NCC003111",
    QtyUsed: "300 kg",
    HSD: "2027-05-20",
    DeliveryDate: "2026-06-10 09:00",
    Packaging: "Bao PE 20kg",
  },
  "260615NSX00601_RM-206": {
    FgLotCode: "260615NSX00601",
    NvlItemCode: "RM-206",
    NvlLotCode: "260522NCC004222",
    QtyUsed: "150 kg",
    HSD: "2027-05-22",
    DeliveryDate: "2026-06-11 09:00",
    Packaging: "Bao PE 10kg",
  },
  "260615NSX00601_RM-207": {
    FgLotCode: "260615NSX00601",
    NvlItemCode: "RM-207",
    NvlLotCode: "260525NCC007333",
    QtyUsed: "50 kg",
    HSD: "2026-11-25",
    DeliveryDate: "2026-06-12 08:00",
    Packaging: "Hộp carton 5kg",
  },
  "260615NSX00601_PG-304": {
    FgLotCode: "260615NSX00601",
    NvlItemCode: "PG-304",
    NvlLotCode: "260501NCC008444",
    QtyUsed: "35,000 cái",
    HSD: "2028-01-01",
    DeliveryDate: "2026-06-08 10:00",
    Packaging: "Cuộn màng OPP",
  },

  // === FG-005 lot 260705NSX00602 ===
  // BOM-005: IP-105, RM-203, RM-206, PG-305, PG-306
  "260705NSX00602_IP-105": {
    FgLotCode: "260705NSX00602",
    NvlItemCode: "IP-105",
    NvlLotCode: "260620NSX005102",
    QtyUsed: "2,000 kg",
    HSD: "2026-12-20",
    DeliveryDate: "2026-06-28 09:00",
    Packaging: "Thùng carton PE trong",
  },
  "260705NSX00602_RM-203": {
    FgLotCode: "260705NSX00602",
    NvlItemCode: "RM-203",
    NvlLotCode: "260812NCC007334",
    QtyUsed: "18,000 kg",
    HSD: "2027-08-05",
    DeliveryDate: "2026-06-25 11:30",
    Packaging: "Bao tải 50kg",
  },
  "260705NSX00602_RM-206": {
    FgLotCode: "260705NSX00602",
    NvlItemCode: "RM-206",
    NvlLotCode: "260630NCC004555",
    QtyUsed: "500 kg",
    HSD: "2027-06-30",
    DeliveryDate: "2026-06-26 08:00",
    Packaging: "Bao PE 10kg",
  },
  "260705NSX00602_PG-305": {
    FgLotCode: "260705NSX00602",
    NvlItemCode: "PG-305",
    NvlLotCode: "260610NCC009666",
    QtyUsed: "40,000 cái",
    HSD: "2028-06-01",
    DeliveryDate: "2026-06-24 10:00",
    Packaging: "Cuộn màng OPP đục",
  },
  "260705NSX00602_PG-306": {
    FgLotCode: "260705NSX00602",
    NvlItemCode: "PG-306",
    NvlLotCode: "260610NCC009667",
    QtyUsed: "40,000 cái",
    HSD: "2028-06-01",
    DeliveryDate: "2026-06-24 10:30",
    Packaging: "Thùng carton 30 gói",
  },

  // === FG-007 lot 260710NSX00603 ===
  // BOM-006: IP-106, RM-204, PG-307, PG-308
  "260710NSX00603_IP-106": {
    FgLotCode: "260710NSX00603",
    NvlItemCode: "IP-106",
    NvlLotCode: "260628NSX006103",
    QtyUsed: "600 kg",
    HSD: "2026-12-28",
    DeliveryDate: "2026-07-05 08:00",
    Packaging: "Thùng nhựa IBC 500L",
  },
  "260710NSX00603_RM-204": {
    FgLotCode: "260710NSX00603",
    NvlItemCode: "RM-204",
    NvlLotCode: "260625NCC003112",
    QtyUsed: "200 kg",
    HSD: "2027-06-25",
    DeliveryDate: "2026-07-05 09:00",
    Packaging: "Bao PE 20kg",
  },
  "260710NSX00603_PG-307": {
    FgLotCode: "260710NSX00603",
    NvlItemCode: "PG-307",
    NvlLotCode: "260601NCC010777",
    QtyUsed: "20,000 cái",
    HSD: "2028-06-01",
    DeliveryDate: "2026-07-03 10:00",
    Packaging: "Cuộn màng OPP trong",
  },
  "260710NSX00603_PG-308": {
    FgLotCode: "260710NSX00603",
    NvlItemCode: "PG-308",
    NvlLotCode: "260601NCC010778",
    QtyUsed: "20,000 cái",
    HSD: "2028-06-01",
    DeliveryDate: "2026-07-03 10:30",
    Packaging: "Thùng carton 24 chai",
  },

  // === FG-012 lot 260715NSX00604 ===
  "260715NSX00604_IP-109": {
    FgLotCode: "260715NSX00604",
    NvlItemCode: "IP-109",
    NvlLotCode: "260702NSX009105",
    QtyUsed: "3,000 Lít",
    HSD: "2027-01-02",
    DeliveryDate: "2026-07-10 09:00",
    Packaging: "Bồn chuyên dụng 500L",
  },
  "260715NSX00604_RM-207": {
    FgLotCode: "260715NSX00604",
    NvlItemCode: "RM-207",
    NvlLotCode: "260705NCC007888",
    QtyUsed: "100 kg",
    HSD: "2026-12-05",
    DeliveryDate: "2026-07-11 08:00",
    Packaging: "Hộp carton 5kg",
  },
  "260715NSX00604_PG-309": {
    FgLotCode: "260715NSX00604",
    NvlItemCode: "PG-309",
    NvlLotCode: "260610NCC011999",
    QtyUsed: "15,000 cái",
    HSD: "2028-06-10",
    DeliveryDate: "2026-07-09 10:00",
    Packaging: "Lon nhôm 330ml",
  },
};

// ---------------------------------------------------------------------------
// Service functions (giả lập async API call)
// ---------------------------------------------------------------------------

/**
 * BƯỚC 1: Gọi ERP lấy thông tin lô Thành Phẩm
 * Input : ItemCode + LotCode của Thành Phẩm
 * Output: FactoryVersionBOM, FactoryCode, NSX, HSD, số lượng
 */
export function getFgLotInfo(
  itemCode: string,
  lotCode: string,
): FgLotApiResponse {
  const key = `${itemCode}_${lotCode}`;
  const found = mockFgLotApiData[key];
  if (found) {
    return { status: "success", data: found };
  }
  // Fallback generic
  return {
    status: "success",
    data: {
      ItemCode: itemCode,
      LotCode: lotCode,
      FactoryVersionBOM: "1",
      FactoryCode: "FAC-001",
      NSX_ThanhPham: `20${lotCode.substring(0, 2)}-${lotCode.substring(2, 4)}-${lotCode.substring(4, 6)}`,
      HSD: "2027-12-31",
      SoLuongDaSanXuat: 10000,
      SoLuongDaTieuThu: 8000,
      SoLuongNhapKhau: 0,
    },
  };
}

/**
 * BƯỚC 3: Gọi ERP lấy chi tiết lot NVL/BTP/Bao bì đã dùng trong 1 mẻ
 * Input : LotCode của Thành Phẩm + ItemCode của NVL (lấy từ BomLine.ErpItemCode)
 * Output: LotCode NVL thực tế, qty, HSD, ngày giao, quy cách đóng gói
 */
export function getNvlLotDetail(
  fgLotCode: string,
  nvlItemCode: string,
): NvlLotApiResponse {
  const key = `${fgLotCode}_${nvlItemCode}`;
  const found = mockNvlLotApiData[key];
  if (found) {
    return { status: "success", data: found };
  }
  // Fallback generic
  return {
    status: "success",
    data: {
      FgLotCode: fgLotCode,
      NvlItemCode: nvlItemCode,
      NvlLotCode: `${fgLotCode.substring(0, 6)}NCC000000`,
      QtyUsed: "—",
      HSD: "—",
      DeliveryDate: "—",
      Packaging: "—",
    },
  };
}
