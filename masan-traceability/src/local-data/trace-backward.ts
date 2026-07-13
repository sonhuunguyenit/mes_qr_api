// ============================================================
// LOCAL MOCK DATA — MODULE TRUY XUẤT THÀNH PHẨM (TRACE BACKWARD)
// ============================================================

export interface FgLotInfo {
  LotCode: string;
}

export interface FgItemLot {
  ItemCode: string;
  ItemName: string;
  AvailableLots: FgLotInfo[];
}

export interface TraceBackwardData {
  ItemCode: string;
  LotCode: string;

  // I. PHỤ LỤC 1 (PL1) - Báo cáo kết quả thực hiện truy xuất nguồn gốc (16 trường)
  PL1: {
    productName: string;
    packaging: string;
    lotNo: string;
    mfgDateFG: string;
    mfgDateNVL: string;
    expDate: string;
    reason: string;
    safetyIssueQtyInfo: string;
    qtyProducedFG: string;
    qtyInboundNVL: string;
    qtyImported: string;
    qtyConsumedFG: string;
    qtyRecalled: string;
    qtyNotYetRecalled: string;
    assemblyPoints: string;
    handlingMethod: string;
  };

  // II. PHỤ LỤC 2 (PL2) - Thông tin truy xuất theo Điều 5 Thông tư 11 (7 nhóm)
  PL2: {
    // 1. Nhóm Cơ sở kinh doanh Thành Phẩm (TP)
    businessEntity: {
      name: string;
      address: string;
      contact: string;
      taxCode: string;
      licenseNo: string;
      attpCertificate: string;
      attpCertificateFileUrl?: string;
    };
    // 2. Nhóm Cơ sở sản xuất Thành Phẩm (TP)
    manufacturer: {
      productName: string;
      imageUrl: string;
      productImages?: string[];         // Danh sách ảnh sản phẩm (1 lớn + 3 nhỏ)
      barcode: string;
      packagingMaterials: string;
      shelfLife: string;
      standardsApplied: string;        // Text tổng hợp (legacy)
      tccsStandard?: string;            // TCCS — từ Spec.SpecCode (Redux Spec store)
      tcvnStandards?: Array<{ code: string; description: string }>;  // TCVN — từ HSCB.AppliedStandards
      qcvnStandards?: Array<{ code: string; description: string }>;  // QCVN — từ HSCB.AppliedStandards
      traceLocation: string;
      traceTime: string;
      customers: Array<{ name: string; address: string; taxCode: string }>;
      transporters: Array<{ name: string; address: string; taxCode: string }>;
      rawMaterialsUsed: Array<{
        name: string;
        lotCode: string;
        weight: string;
        deliveryTime: string;
        expDate: string;
        packaging: string;
        additives: string;
        supplier: string;
        itemCode?: string;
      }>;
    };
    // 3. Nhóm Cơ sở kinh doanh bổ sung
    additionalBusiness: {
      location: string;
      time: string;
    };
    // 4. Nhóm Thực phẩm nhập khẩu
    importedFood: {
      exporterName: string;
      exporterAddress: string;
      exporterContact: string;
      importerName: string;
      importerAddress: string;
      importerTaxCode: string;
      coNumber: string;
      testResultNo: string;
      quantityImported: string;
      lotNumber: string;
    };
    // 5. Nhóm Thực phẩm xuất khẩu
    exportedFood: {
      russiaCzCode: string;
    };
    // 6. Nhóm Xuất xứ thành phẩm
    origin: {
      country: string;
      standards: string;
    };
    // 7. Nhóm Thương Hiệu, Nhãn Hiệu Sản Phẩm
    brand: {
      name: string;
      patentNo: string;
      pdfUrl: string;
    };
  };

  // III. THÔNG TIN TRUY XUẤT THEO THÔNG TƯ (11 trường cốt lõi)
  CircularDeclaration: {
    productName: string;
    imageUrl: string;
    originCountry: string;
    producerName: string;
    producerAddress: string;
    brandName: string;
    lotCode: string;
    expDate: string;
    qualityStandard: string;
    importerName?: string;
    importerAddress?: string;
    distributorName: string;
    distributorAddress: string;
    shttPatentNo?: string;
  };
}

export const mockFgLots: FgItemLot[] = [
  {
    ItemCode: "FG-001",
    ItemName: "Nước tương Chinsu Tỏi Ớt 250ml",
    AvailableLots: [
      { LotCode: "260526NSX00601" },
      { LotCode: "260526NSX00602" },
    ],
  },
  {
    ItemCode: "FG-002",
    ItemName: "Mì Omachi Xốt Bò Hầm 80g",
    AvailableLots: [
      { LotCode: "260701NSX00601" },
      { LotCode: "260701NSX00602" },
    ],
  },
  {
    ItemCode: "FG-003",
    ItemName: "Nước mắm Nam Ngư Đệ Nhị 900ml",
    AvailableLots: [{ LotCode: "260601NSX00601" }],
  },
  {
    ItemCode: "FG-004",
    ItemName: "Tương ớt Chinsu Siêu Cay 250g",
    AvailableLots: [{ LotCode: "260615NSX00601" }],
  },
  {
    ItemCode: "FG-005",
    ItemName: "Mì Kokomi Đại 90g",
    AvailableLots: [{ LotCode: "260705NSX00602" }],
  },
  {
    ItemCode: "FG-007",
    ItemName: "Tương cà Chinsu thơm ngọt 250g",
    AvailableLots: [{ LotCode: "260710NSX00603" }],
  },
  {
    ItemCode: "FG-012",
    ItemName: "Nước tăng lực Compact Hoa Anh Đào 330ml",
    AvailableLots: [{ LotCode: "260715NSX00604" }],
  },
];

export const mockTraceBackwardData: Record<string, TraceBackwardData> = {
  // FG-002 - Mì Omachi Xốt Bò Hầm 80g - 260701NSX00601
  "FG-002_260701NSX00601": {
    ItemCode: "FG-002",
    LotCode: "260701NSX00601",
    PL1: {
      productName: "Mì Omachi Xốt Bò Hầm 80g",
      packaging: "Gói 80g (Thùng 30 gói)",
      lotNo: "260701NSX00601",
      mfgDateFG: "2026-07-01",
      mfgDateNVL: "2026-05-18",
      expDate: "2027-01-01",
      reason: "",
      safetyIssueQtyInfo: "",
      qtyProducedFG: "50,000 Thùng",
      qtyInboundNVL: "4,000 kg",
      qtyImported: "10,000 kg",
      qtyConsumedFG: "45,000 Thùng",
      qtyRecalled: "",
      qtyNotYetRecalled: "",
      assemblyPoints: "",
      handlingMethod: "",
    },
    PL2: {
      businessEntity: {
        name: "Công ty Cổ phần Hàng tiêu dùng Masan",
        address:
          "Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam",
        contact: "028-62563862 / contact@masanconsumer.com",
        taxCode: "0302012345",
        licenseNo: "0302012345 cấp ngày 15/05/2000 tại Sở KHĐT TP.HCM",
        attpCertificate:
          "Số 123/2024/ATTP-CNĐK do Cục An toàn thực phẩm cấp ngày 20/08/2024",
      },
      manufacturer: {
        productName: "Mì Omachi Xốt Bò Hầm 80g",
        imageUrl:
          "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=300",
        barcode: "8936012345678",
        packagingMaterials: "Màng co OPP bọc gói mì, thùng carton đóng ngoài",
        shelfLife: "6 tháng kể từ ngày sản xuất",
        standardsApplied: "TCCS 02:2025/MSN - Bản tự công bố số 789/MSN/2025",
        traceLocation: "",
        traceTime: "",
        customers: [
          {
            name: "Trung tâm phân phối WinCommerce Miền Nam",
            address: "Lô B, KCN Sóng Thần 2, Dĩ An, Bình Dương",
            taxCode: "0311223344",
          },
          {
            name: "Nhà phân phối Tiến Phát",
            address: "128 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
            taxCode: "0315456789",
          },
        ],
        transporters: [
          {
            name: "Công ty Cổ phần Vận tải Masan (Masan Logistics)",
            address: "39 Lê Duẩn, Quận 1, TP.HCM",
            taxCode: "0305556667",
          },
        ],
        rawMaterialsUsed: [
          {
            name: "Nước cốt hầm xương bò đặc chế",
            lotCode: "260620NSX006101",
            weight: "1,500 Lít",
            deliveryTime: "2026-06-25 08:30",
            expDate: "2026-12-20",
            packaging: "Bồn chuyên dụng 1000L",
            additives: "Không",
            supplier: "Nội bộ (Nhà máy BTP Masan)",
          },
          {
            name: "Hành lá sấy khô nguyên chất",
            lotCode: "240526NCC00112345",
            weight: "250 kg",
            deliveryTime: "2026-06-26 14:00",
            expDate: "2027-05-18",
            packaging: "Bao PE 25kg",
            additives: "Không",
            supplier: "Công ty TNHH Cung cấp Gia vị Việt Nam",
          },
          {
            name: "Màng co OPP bọc gói mì Omachi",
            lotCode: "240526NCC00522334",
            weight: "50,000 cái",
            deliveryTime: "2026-06-20 10:15",
            expDate: "2028-05-15",
            packaging: "Cuộn màng OPP",
            additives: "Không",
            supplier: "Công ty Cổ phần Nhựa Duy Tân",
          },
        ],
      },
      additionalBusiness: {
        location:
          "Siêu thị WinMart Thảo Điền (159 Xa lộ Hà Nội, Thảo Điền, Quận 2, TP.HCM)",
        time: "2026-07-02 09:00",
      },
      importedFood: {
        exporterName: "IndoFoods & Seasonings Ltd",
        exporterAddress: "Jl. Sudirman No. 23, Jakarta, Indonesia",
        exporterContact: "+62-21-5551234 / export@indofoods.co.id",
        importerName: "Công ty Cổ phần Hàng tiêu dùng Masan",
        importerAddress:
          "Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
        importerTaxCode: "0302012345",
        coNumber: "C/O Form D số ID-JV-2026-908712 cấp ngày 12/04/2026",
        testResultNo:
          "Giấy xác nhận đạt ATTP nhập khẩu số 1122/KQKN-Quatest3 cấp ngày 28/04/2026",
        quantityImported: "5,000 kg bột gia vị hương bò",
        lotNumber: "260412IND99",
      },
      exportedFood: {
        russiaCzCode: "CZ-RU-8936012345678-202607-001",
      },
      origin: {
        country: "Việt Nam",
        standards:
          "QCVN 8-2:2011/BYT (Quy chuẩn giới hạn ô nhiễm kim loại nặng trong thực phẩm)",
      },
      brand: {
        name: "OMACHI",
        patentNo:
          "Văn bằng bảo hộ nhãn hiệu số 45678/SHTT cấp ngày 20/02/2006 bởi Cục Sở hữu Trí tuệ",
        pdfUrl: "/files/shtt/omachi_patent.pdf",
      },
    },
    CircularDeclaration: {
      productName: "Mì Omachi Xốt Bò Hầm 80g",
      imageUrl:
        "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=300",
      originCountry: "Việt Nam",
      producerName:
        "Công ty Cổ phần Hàng tiêu dùng Masan - Chi nhánh Bình Dương",
      producerAddress:
        "Lô 6, KCN Tân Đông Hiệp A, Dĩ An, Tỉnh Bình Dương, Việt Nam",
      brandName: "OMACHI",
      lotCode: "260701NSX00601",
      expDate: "2027-01-01",
      qualityStandard: "TCCS 02:2025/MSN - Bản tự công bố số 789/MSN/2025",
      distributorName:
        "Công ty Cổ phần Thương mại Dịch vụ Tổng hợp WinCommerce",
      distributorAddress:
        "Tà nhà Netland, 20 Cộng Hòa, Phường 12, Quận Tân Bình, TP.HCM",
      shttPatentNo:
        "Bằng bảo hộ độc quyền kiểu dáng công nghiệp & nhãn hiệu số 45678/SHTT",
    },
  },

  // FG-005 - Mì Kokomi Đại 90g - 260705NSX00602
  "FG-005_260705NSX00602": {
    ItemCode: "FG-005",
    LotCode: "260705NSX00602",
    PL1: {
      productName: "Mì Kokomi Đại 90g",
      packaging: "Gói 90g (Thùng 30 gói)",
      lotNo: "260705NSX00602",
      mfgDateFG: "2026-07-05",
      mfgDateNVL: "2026-05-20",
      expDate: "2027-01-05",
      reason: "",
      safetyIssueQtyInfo: "",
      qtyProducedFG: "40,000 Thùng",
      qtyInboundNVL: "3,600 kg",
      qtyImported: "8,000 kg",
      qtyConsumedFG: "38,000 Thùng",
      qtyRecalled: "",
      qtyNotYetRecalled: "",
      assemblyPoints: "",
      handlingMethod: "",
    },
    PL2: {
      businessEntity: {
        name: "Công ty Cổ phần Hàng tiêu dùng Masan",
        address:
          "Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam",
        contact: "028-62563862 / contact@masanconsumer.com",
        taxCode: "0302012345",
        licenseNo: "0302012345 cấp ngày 15/05/2000",
        attpCertificate: "Số 123/2024/ATTP-CNĐK do Cục An toàn thực phẩm cấp",
      },
      manufacturer: {
        productName: "Mì Kokomi Đại 90g",
        imageUrl:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300",
        barcode: "8936012345005",
        packagingMaterials: "Màng OPP Kokomi dai chắc chống thấm nước",
        shelfLife: "6 tháng",
        standardsApplied: "TCCS 05:2025/MSN",
        traceLocation: "",
        traceTime: "",
        customers: [
          {
            name: "Trung tâm phân phối WinCommerce Miền Bắc",
            address: "Văn Giang, Hưng Yên",
            taxCode: "0311223344",
          },
        ],
        transporters: [
          {
            name: "Công ty Cổ phần Vận tải Masan (Masan Logistics)",
            address: "39 Lê Duẩn, Quận 1, TP.HCM",
            taxCode: "0305556667",
          },
        ],
        rawMaterialsUsed: [
          {
            name: "Gói súp gia vị Kokomi bán thành phẩm",
            lotCode: "260515NSX006105",
            weight: "2,000 kg",
            deliveryTime: "2026-06-28 09:00",
            expDate: "2026-12-15",
            packaging: "Thùng carton PE trong",
            additives: "Chất điều vị",
            supplier: "Nội bộ",
          },
          {
            name: "Bột mì cao cấp nhập khẩu",
            lotCode: "240812NCC00733445",
            weight: "18,000 kg",
            deliveryTime: "2026-06-25 11:30",
            expDate: "2027-08-05",
            packaging: "Bao tải 50kg",
            additives: "Không",
            supplier: "Tổng công ty Lương thực miền Bắc",
          },
        ],
      },
      additionalBusiness: {
        location: "WinMart Hải Dương",
        time: "2026-07-06 10:00",
      },
      importedFood: {
        exporterName: "Wheat & Flour Supplies Corp",
        exporterAddress: "Sydney, Australia",
        exporterContact: "+61-2-99887766",
        importerName: "Công ty Cổ phần Hàng tiêu dùng Masan",
        importerAddress: "39 Lê Duẩn, Q1, TP.HCM",
        importerTaxCode: "0302012345",
        coNumber: "C/O Form AUA số AU-MSN-99882 cấp ngày 05/01/2026",
        testResultNo: "Số 987/KN-ATTP-Quatest1",
        quantityImported: "100,000 kg lúa mì",
        lotNumber: "260105AUW88",
      },
      exportedFood: {
        russiaCzCode: "N/A (Chưa xuất khẩu sang Nga)",
      },
      origin: {
        country: "Việt Nam",
        standards: "TCVN 5786:2009 về Mì ăn liền",
      },
      brand: {
        name: "KOKOMI",
        patentNo:
          "Văn bằng bảo hộ nhãn hiệu số 98765/SHTT do Cục SHTT cấp ngày 15/09/2010",
        pdfUrl: "/files/shtt/kokomi_patent.pdf",
      },
    },
    CircularDeclaration: {
      productName: "Mì Kokomi Đại 90g",
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300",
      originCountry: "Việt Nam",
      producerName:
        "Công ty Cổ phần Hàng tiêu dùng Masan - Chi nhánh Hải Dương",
      producerAddress: "KCN Nam Sách, Phường Ái Quốc, TP. Hải Dương, Việt Nam",
      brandName: "KOKOMI",
      lotCode: "260705NSX00602",
      expDate: "2027-01-05",
      qualityStandard: "TCCS 05:2025/MSN - Bản tự công bố số 112/MSN-HD/2025",
      distributorName:
        "Công ty Cổ phần Thương mại Dịch vụ Tổng hợp WinCommerce",
      distributorAddress:
        "Tà nhà Netland, 20 Cộng Hòa, Phường 12, Quận Tân Bình, TP.HCM",
      shttPatentNo: "Bằng bảo hộ độc quyền nhãn hiệu số 98765/SHTT",
    },
  },

  // FG-001 - Nước tương Chinsu Tỏi Ớt 250ml - 260526NSX00601
  "FG-001_260526NSX00601": {
    ItemCode: "FG-001",
    LotCode: "260526NSX00601",
    PL1: {
      productName: "Nước tương Chinsu Tỏi Ớt 250ml",
      packaging: "Chai 250ml (Thùng 24 chai)",
      lotNo: "260526NSX00601",
      mfgDateFG: "2026-05-26",
      mfgDateNVL: "2026-04-10",
      expDate: "2027-05-26",
      reason: "",
      safetyIssueQtyInfo: "",
      qtyProducedFG: "25,000 Thùng",
      qtyInboundNVL: "5,000 Lít nước cốt tương",
      qtyImported: "0 kg",
      qtyConsumedFG: "22,000 Thùng",
      qtyRecalled: "",
      qtyNotYetRecalled: "",
      assemblyPoints: "",
      handlingMethod: "",
    },
    PL2: {
      businessEntity: {
        name: "Công ty Cổ phần Hàng tiêu dùng Masan",
        address:
          "Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam",
        contact: "028-62563862 / contact@masanconsumer.com",
        taxCode: "0302012345",
        licenseNo: "0302012345 cấp ngày 15/05/2000",
        attpCertificate: "Số 123/2024/ATTP-CNĐK do Cục An toàn thực phẩm cấp",
      },
      manufacturer: {
        productName: "Nước tương Chinsu Tỏi Ớt 250ml",
        imageUrl:
          "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300",
        barcode: "8936012345001",
        packagingMaterials:
          "Chai nhựa PET chuyên dụng đựng nước tương, thùng carton",
        shelfLife: "12 tháng",
        standardsApplied: "TCCS 01:2024/MSN",
        traceLocation: "",
        traceTime: "",
        customers: [
          {
            name: "WinMart Bình Dương",
            address: "Đại lộ Bình Dương, Thủ Dầu Một",
            taxCode: "0311223344",
          },
        ],
        transporters: [
          {
            name: "Công ty Cổ phần Vận tải Masan (Masan Logistics)",
            address: "39 Lê Duẩn, Quận 1, TP.HCM",
            taxCode: "0305556667",
          },
        ],
        rawMaterialsUsed: [
          {
            name: "Mỡ heo sơ chế",
            lotCode: "260510NSX006103",
            weight: "500 kg",
            deliveryTime: "2026-05-20 08:00",
            expDate: "2026-11-10",
            packaging: "Thùng nhựa chuyên dụng",
            additives: "Không",
            supplier: "Nội bộ",
          },
          {
            name: "Ớt tươi chỉ thiên",
            lotCode: "240710NCC00144556",
            weight: "120 kg",
            deliveryTime: "2026-05-24 07:30",
            expDate: "2026-12-10",
            packaging: "Sọt nhựa thoáng khí",
            additives: "Không",
            supplier: "Hợp tác xã nông nghiệp ớt chỉ thiên Quảng Nam",
          },
        ],
      },
      additionalBusiness: {
        location: "WinMart Thủ Dầu Một",
        time: "2026-06-01 08:30",
      },
      importedFood: {
        exporterName: "N/A",
        exporterAddress: "N/A",
        exporterContact: "N/A",
        importerName: "N/A",
        importerAddress: "N/A",
        importerTaxCode: "N/A",
        coNumber: "N/A",
        testResultNo: "N/A",
        quantityImported: "N/A",
        lotNumber: "N/A",
      },
      exportedFood: {
        russiaCzCode: "N/A",
      },
      origin: {
        country: "Việt Nam",
        standards: "QCVN 8-2:2011/BYT và QCVN 8-1:2011/BYT",
      },
      brand: {
        name: "CHIN-SU",
        patentNo: "Văn bằng bảo hộ nhãn hiệu số 12345/SHTT cấp ngày 10/01/2003 bởi Cục Sở hữu Trí tuệ",
        pdfUrl: "/files/shtt/chinsu_soy_patent.pdf",
      },
    },
    CircularDeclaration: {
      productName: "Nước tương Chinsu Tỏi Ớt 250ml",
      imageUrl:
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300",
      originCountry: "Việt Nam",
      producerName: "Công ty Cổ phần Hàng tiêu dùng Masan",
      producerAddress: "Lô 6, KCN Tỉnh Bình Dương, Việt Nam",
      brandName: "CHIN-SU",
      lotCode: "260526NSX00601",
      expDate: "2027-05-26",
      qualityStandard: "TCCS 01:2024/MSN - Bản tự công bố số 456/MSN/2024",
      distributorName:
        "Công ty Cổ phần Thương mại Dịch vụ Tổng hợp WinCommerce",
      distributorAddress:
        "Tà nhà Netland, 20 Cộng Hòa, Phường 12, Quận Tân Bình, TP.HCM",
      shttPatentNo: "Bằng bảo hộ độc quyền nhãn hiệu số 12345/SHTT",
    },
  },
};
