import {
  DatabaseOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilePdfOutlined,
  CarryOutOutlined,
  ApartmentOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Tabs,
  Alert,
  message,
  QRCode,
  Drawer,
} from "antd";
import React, { useState } from "react";
import { PRIMARY_COLOR } from "../../../contants";
import { useAppSelector } from "../../../store/hooks";
import { LicenseType } from "../../facility/types";
import {
  mockFgLots,
  mockTraceBackwardData,
  TraceBackwardData,
} from "../../../local-data/trace-backward";
import { mockPartnerItemMappings } from "../../../local-data/partner";
import { mockBarcodes } from "../../../local-data/barcode";
import { getFgLotInfo, getNvlLotDetail } from "../services/erp-lot.service";
import {
  ShttType,
  ShttTypeConfig,
  IpmsStatus,
  IpmsStatusConfig,
} from "../../../enums";

export const TraceBackwardList: React.FC = () => {
  const items = useAppSelector((state) => state.item.items);
  // Filter only Finished Goods (FG)
  const fgItems = items.filter((it) => it.ItemType === "FG");

  // Page States
  const [traceType, setTraceType] = useState<"INTERNAL" | "CIRCULAR">(
    "INTERNAL",
  );
  const [itemCode, setItemCode] = useState<string | undefined>(undefined);
  const [lotCode, setLotCode] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchData, setSearchData] = useState<TraceBackwardData | null>(null);

  // Get available lots for selected Finished Good
  const selectedItemLots =
    mockFgLots.find((it) => it.ItemCode === itemCode)?.AvailableLots || [];

  const partners = useAppSelector((state) => state.partner.partners) || [];
  const boms = useAppSelector((state) => state.bom.boms) || [];
  const hscbs = useAppSelector((state) => state.hscb.hscbs) || [];
  const facilities = useAppSelector((state) => state.facility.facilities) || [];
  const specs = useAppSelector((state) => state.spec.specs) || [];
  const shttMappings = useAppSelector((state) => state.shtt.mappings) || [];
  const ipmsInfo = useAppSelector((state) => state.shtt.ipmsInfo) || {};

  const [parsedLotInfo, setParsedLotInfo] = useState<{
    internalDate: string;
    partnerName: string;
    partnerCode: string;
    vendorLot: string;
  } | null>(null);

  const [erpData, setErpData] = useState<{
    FactoryVersionBOM: string;
    mfgDateFG: string;
    FactoryCode: string;
  } | null>(null);

  // BOM Lines của mẻ sản xuất — lấy thẳng từ Redux BOM store
  const [activeBomLines, setActiveBomLines] = useState<any[]>([]);
  const [activeShttMappings, setActiveShttMappings] = useState<any[]>([]);

  // PDF Preview Drawer states
  const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfDocType, setPdfDocType] = useState<
    "GPKD" | "TCCS" | "SHTT" | "HSCB"
  >("HSCB");
  const [pdfMetaData, setPdfMetaData] = useState<any>(null);

  // Business logic parser for LotCode (e.g. 260701MSN01)
  const parseLotCode = (lot: string, partnerList: any[]) => {
    if (lot.length < 7) return null;

    // 1. First 6 chars: YYMMDD Date of warehouse receipt (Ngày nhận hàng nội bộ tại kho)
    const dateStr = lot.substring(0, 6);
    const yy = dateStr.substring(0, 2);
    const mm = dateStr.substring(2, 4);
    const dd = dateStr.substring(4, 6);
    const internalDate = `${dd}/${mm}/20${yy}`;

    // 2. Extract remaining string for partner code abbreviation & vendor lot
    const remaining = lot.substring(6);

    // 3. Search for partner matching the prefix (abbreviation)
    let matchedPartner = null;
    let vendorLot = remaining;

    // First try matching standard partner code prefixes without hyphens (e.g. NCC-001)
    for (const p of partnerList) {
      const cleanCode = p.PartnerCode.replace(/-/g, "").toLowerCase();
      if (cleanCode && remaining.toLowerCase().startsWith(cleanCode)) {
        matchedPartner = p;
        vendorLot = remaining.substring(cleanCode.length);
        break;
      }
    }

    // If no exact dictionary match is found, check if remaining starts with abbreviation letters
    if (!matchedPartner) {
      const matchLetters = remaining.match(/^([a-zA-Z]+)(.*)$/);
      if (matchLetters) {
        const abbreviation = matchLetters[1];
        vendorLot = matchLetters[2] || "";

        // Find if any partner matches the abbreviation (mapping to partners in Module 4)
        const found = partnerList.find((p) => {
          const cleanP = p.PartnerCode.replace(/-/g, "").toLowerCase();
          const cleanName = p.PartnerName.toLowerCase();
          return (
            cleanP.includes(abbreviation.toLowerCase()) ||
            abbreviation.toLowerCase().includes(cleanP) ||
            cleanName.includes(abbreviation.toLowerCase()) ||
            (abbreviation.toLowerCase() === "msn" &&
              cleanName.includes("masan"))
          );
        });

        if (found) {
          matchedPartner = found;
        } else {
          matchedPartner = {
            PartnerCode: abbreviation.toUpperCase(),
            PartnerName: `Công ty TNHH ${abbreviation.toUpperCase()}`,
          };
        }
      }
    }

    return {
      internalDate,
      partner: matchedPartner,
      vendorLot,
    };
  };

  const getTraceData = (
    selectedItemCode: string,
    selectedLotCode: string
  ): TraceBackwardData => {
    const key = `${selectedItemCode}_${selectedLotCode}`;
    if (mockTraceBackwardData[key]) {
      return mockTraceBackwardData[key];
    }

    const selectedItem = fgItems.find(
      (it) => it.ItemCode === selectedItemCode
    ) || {
      ItemName: "Sản phẩm Chưa Xác Định",
      UoM: "Chai",
    };

    const foundBarcode = mockBarcodes.find((bc) =>
      bc.BarcodeItems?.some((item) => item.ItemCode === selectedItemCode)
    );
    const barcodeNumber = foundBarcode ? foundBarcode.BarcodeNumber : "8936012340001";

    return {
      ItemCode: selectedItemCode,
      LotCode: selectedLotCode,
      PL1: {
        productName: selectedItem.ItemName,
        packaging: `${selectedItem.UoM} tiêu chuẩn`,
        lotNo: selectedLotCode,
        mfgDateFG: "2026-06-20",
        mfgDateNVL: "2026-06-05",
        expDate: "2027-06-20",
        reason: "",
        safetyIssueQtyInfo: "",
        qtyProducedFG: "10,000 Thùng",
        qtyInboundNVL: "2,000 kg",
        qtyImported: "0 kg",
        qtyConsumedFG: "8,500 Thùng",
        qtyRecalled: "",
        qtyNotYetRecalled: "",
        assemblyPoints: "",
        handlingMethod: "",
      },
      PL2: {
        businessEntity: {
          name: "Công ty Cổ phần Hàng tiêu dùng Masan",
          address:
            "Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
          contact: "028-62563862 / contact@masanconsumer.com",
          taxCode: "0302012345",
          licenseNo: "0302012345",
          attpCertificate: "Số 123/2024/ATTP-CNĐK",
        },
        manufacturer: {
          productName: selectedItem.ItemName,
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300",
          barcode: barcodeNumber,
          packagingMaterials: "Bao bì nhựa PP/PET",
          shelfLife: "12 tháng",
          standardsApplied: "TCCS 01:2024/MSN",
          traceLocation: "",
          traceTime: "",
          customers: [
            {
              name: "Hệ thống Siêu thị WinMart",
              address: "Toàn quốc",
              taxCode: "0311223344",
            },
          ],
          transporters: [
            {
              name: "Công ty Cổ phần Vận tải Masan",
              address: "39 Lê Duẩn, Q1, TP.HCM",
              taxCode: "0305556667",
            },
          ],
          rawMaterialsUsed: [
            {
              name: "Nguyên liệu gia vị tiêu chuẩn",
              lotCode: "240526NCC00112345",
              weight: "500 kg",
              deliveryTime: "2026-06-08",
              expDate: "2027-05-18",
              packaging: "Bao 25kg",
              additives: "Không",
              supplier: "Công ty TNHH Cung cấp Gia vị Việt Nam",
            },
          ],
        },
        additionalBusiness: {
          location: "Hệ thống siêu thị WinMart+",
          time: "2026-06-25",
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
          standards: "QCVN tương ứng",
        },
        brand: {
          name: "MASAN",
          patentNo: "Số 12345/SHTT",
          pdfUrl: "#",
        },
      },
      CircularDeclaration: {
        productName: selectedItem.ItemName,
        imageUrl:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300",
        originCountry: "Việt Nam",
        producerName: "Công ty Cổ phần Hàng tiêu dùng Masan",
        producerAddress:
          "Lô 6, KCN Tân Đông Hiệp A, Dĩ An, Tỉnh Bình Dương, Việt Nam",
        brandName: "MASAN",
        lotCode: selectedLotCode,
        expDate: "2027-06-20",
        qualityStandard: "TCCS 01:2024/MSN",
        distributorName:
          "Công ty Cổ phần Thương mại Dịch vụ Tổng hợp WinCommerce",
        distributorAddress:
          "Tà nhà Netland, 20 Cộng Hòa, Phường 12, Quận Tân Bình, TP.HCM",
        shttPatentNo: "Bằng bảo hộ độc quyền nhãn hiệu số 12345/SHTT",
      },
    };
  };

  const handleSearch = () => {
    if (!itemCode) {
      message.error("Vui lòng chọn sản phẩm!");
      return;
    }
    if (!lotCode) {
      message.error("Vui lòng chọn số lô!");
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setHasSearched(true);
      const data = getTraceData(itemCode, lotCode);

      // --- BƯỚC 1: Gọi API ERP (Mock) ---
      // Lấy về FactoryVersionBOM, Ngày sản xuất, FactoryCode
      const parseLotCodeDate = (lot: string) => {
        if (lot.length < 6) return new Date("2026-07-01");
        const dateStr = lot.substring(0, 6);
        const yy = parseInt(dateStr.substring(0, 2), 10);
        const mm = parseInt(dateStr.substring(2, 4), 10);
        const dd = parseInt(dateStr.substring(4, 6), 10);
        return new Date(2000 + yy, mm - 1, dd);
      };

      const mfgFGDate = parseLotCodeDate(lotCode);
      const mfgFGDateStr = mfgFGDate.toISOString().split("T")[0]; // yyyy-mm-dd

      // =================================================================
      // BƯỚC 1: Gọi API ERP — lấy thông tin lô Thành Phẩm
      // Input : itemCode + lotCode
      // Output: FactoryVersionBOM, FactoryCode, NSX, HSD, số lượng
      // =================================================================
      const fgLotResp = getFgLotInfo(itemCode, lotCode);
      const erpOutput = fgLotResp.data;
      setErpData({
        FactoryVersionBOM: erpOutput.FactoryVersionBOM,
        mfgDateFG: erpOutput.NSX_ThanhPham,
        FactoryCode: erpOutput.FactoryCode,
      });

      // =================================================================
      // BƯỚC 2: Tìm BOM tương ứng — DỪNG DATA ĐÃ CÓ TRONG REDUX
      // Dùng FactoryVersionBOM (từ ERP) để tra trong boms (Redux)
      // =================================================================
      const matchedBom =
        boms.find(
          (b) =>
            b.ItemCode === itemCode &&
            (b.Version === erpOutput.FactoryVersionBOM ||
              b.ErpVersion === erpOutput.FactoryVersionBOM),
        ) || boms.find((b) => b.ItemCode === itemCode);

      // Lưu BOM Lines vào state để render bảng NVL trực tiếp
      setActiveBomLines(matchedBom?.BomLines || []);

      let matchedHscbVersion: any = null;
      let matchedHscb: any = null;

      if (matchedBom && matchedBom.Selected_HscbVersionId) {
        for (const h of hscbs) {
          const v = h.HscbVersions?.find(
            (ver) => ver.HscbVersionId === matchedBom.Selected_HscbVersionId,
          );
          if (v) {
            matchedHscbVersion = v;
            matchedHscb = h;
            break;
          }
        }
      }

      // Fallback if not found through BOM
      if (!matchedHscbVersion) {
        const h = hscbs.find(
          (x) =>
            x.HscbCode === `HSCB-${itemCode}` ||
            x.HscbVersions?.some((ver) =>
              ver.HscbItems?.some((it) => it.ItemCode === itemCode),
            ),
        );
        if (h) {
          matchedHscb = h;
          matchedHscbVersion =
            h.HscbVersions?.find((v) => v.Status === "APPROVED") ||
            h.HscbVersions?.[0];
        }
      }

      // Lưu SHTT Mappings vào state để hiển thị ở Nhóm 7
      const versionShtts = matchedHscbVersion
        ? shttMappings.filter(
            (m) => m.HscbVersionId === matchedHscbVersion.HscbVersionId,
          )
        : [];
      setActiveShttMappings(versionShtts);

      // --- BƯỚC 3: Xổ Data cho 6 trường PL2 - Nhóm 1 (Cơ sở kinh doanh TP) ---
      const declaringFacilityId = matchedHscb?.declaringFacilityId || "FAC-001";
      const companyFacility = facilities.find(
        (fac) => fac.FacilityId === declaringFacilityId,
      );

      // Lấy GPKD license valid during NSX (ValidFrom <= Ngày sản xuất <= ValidTo)
      const gpkdLicense =
        companyFacility?.Licenses?.find((lic) => {
          if (lic.LicenseType !== LicenseType.GPKD) return false;
          const validFrom = lic.ValidFrom;
          const validTo = lic.ValidTo;
          const isAfterFrom = !validFrom || erpOutput.NSX_ThanhPham >= validFrom;
          const isBeforeTo = !validTo || erpOutput.NSX_ThanhPham <= validTo;
          return isAfterFrom && isBeforeTo;
        }) ||
        companyFacility?.Licenses?.find(
          (lic) => lic.LicenseType === LicenseType.GPKD,
        );

      // Giấy chứng nhận ATTP từ HscbVersion
      const attpCode = matchedHscbVersion?.AttpCode || "ATTP-2026-0019A";

      // Tìm nhà máy sản xuất trong danh sách nhà máy được khai báo ở HSCB (producingFacilityIds)
      let producingFacility = facilities.find(
        (fac) =>
          matchedHscb?.producingFacilityIds?.includes(fac.FacilityId) &&
          (fac.FacilityCode === erpOutput.FactoryCode || fac.FacilityId === erpOutput.FactoryCode)
      );

      // Nếu không tìm thấy chính xác qua FactoryCode từ ERP trong danh sách HSCB, ưu tiên lấy nhà máy đầu tiên thuộc danh sách producingFacilityIds của HSCB đó
      if (!producingFacility && matchedHscb?.producingFacilityIds?.length > 0) {
        producingFacility = facilities.find(
          (fac) => fac.FacilityId === matchedHscb.producingFacilityIds[0]
        );
      }

      // Fallback nếu vẫn không tìm thấy
      if (!producingFacility) {
        producingFacility = facilities.find(
          (fac) =>
            fac.FacilityCode === erpOutput.FactoryCode ||
            fac.FacilityId === erpOutput.FactoryCode
        );
      }

      const attpLicense =
        producingFacility?.Licenses?.find((lic) => {
          if (lic.LicenseType !== LicenseType.ATVSTP) return false;
          const validFrom = lic.ValidFrom;
          const validTo = lic.ValidTo;
          const isAfterFrom = !validFrom || erpOutput.NSX_ThanhPham >= validFrom;
          const isBeforeTo = !validTo || erpOutput.NSX_ThanhPham <= validTo;
          return isAfterFrom && isBeforeTo;
        }) ||
        producingFacility?.Licenses?.find(
          (lic) => lic.LicenseType === LicenseType.ATVSTP,
        );

      // Xổ dữ liệu vào searchData
      if (data) {
        data.PL2.businessEntity = {
          name:
            companyFacility?.FacilityName ||
            "Công ty Cổ phần Hàng tiêu dùng Masan",
          address:
            gpkdLicense?.Address ||
            "Tầng 12, Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
          contact: "028-62563862 / contact@masanconsumer.com",
          taxCode: gpkdLicense?.LicenseNo || "0305001234",
          licenseNo: gpkdLicense?.FileURL || "/files/gpkd_masan_consumer.pdf", // Link tải file GPKD
          attpCertificate: attpCode, // Mã chứng nhận ATTP
          attpCertificateFileUrl: attpLicense?.FileURL, // Link tải file ATTP nếu cần
        };

        // 2. Nhóm Cơ sở sản xuất Thành Phẩm (TP) — dùng data đã có trong Redux
        const matchedSpec = specs.find((s) => s.SpecId === matchedHscb?.SpecId);

        // TCCS — từ Spec store (đã có sẵn)
        const tccsStandard = matchedSpec
          ? `${matchedSpec.SpecCode} - ${matchedHscbVersion?.VersionName || "Bản tự công bố"}`
          : undefined;

        // TCVN + QCVN — từ HSCB.AppliedStandards (đã có sẵn sau khi user nhập)
        const appliedStds = (matchedHscbVersion as any)?.AppliedStandards || [];
        const tcvnStandards = appliedStds
          .filter((s: any) => s.StandardType === "TCVN")
          .map((s: any) => ({
            code: s.StandardCode,
            description: s.Description || "",
          }));
        const qcvnStandards = appliedStds
          .filter((s: any) => s.StandardType === "QCVN")
          .map((s: any) => ({
            code: s.StandardCode,
            description: s.Description || "",
          }));

        // standardsApplied legacy — gộp lại để backward compat
        const standardsApplied =
          [
            tccsStandard,
            ...tcvnStandards.map((s: any) => s.code),
            ...qcvnStandards.map((s: any) => s.code),
          ]
            .filter(Boolean)
            .join(" | ") || "Chưa xác định";

        data.PL2.manufacturer.standardsApplied = standardsApplied;
        data.PL2.manufacturer.tccsStandard = tccsStandard;
        data.PL2.manufacturer.tcvnStandards = tcvnStandards;
        data.PL2.manufacturer.qcvnStandards = qcvnStandards;

        // Tên sản phẩm từ HSCB (ưu tiên LegalProductName)
        data.PL2.manufacturer.productName =
          matchedHscb?.LegalProductName || data.PL2.manufacturer.productName;

        // Barcode — tìm từ mockBarcodes cho nhất quán với Module Barcode
        const foundBarcodeObj = mockBarcodes.find((bc) =>
          bc.BarcodeItems?.some((item) => item.ItemCode === itemCode)
        );
        data.PL2.manufacturer.barcode = foundBarcodeObj
          ? foundBarcodeObj.BarcodeNumber
          : `893601${itemCode.replace(/\D/g, "").padStart(6, "0")}`;

        // Ảnh sản phẩm — fake 4 ảnh từ unsplash cho layout (1 lớn + 3 nhỏ)
        data.PL2.manufacturer.productImages = [
          "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600",
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200",
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=200",
          "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200",
        ];

        // Chi tiết Nguyên vật liệu / Bán thành phẩm / Bao bì cấu thành lô hàng (Từ BOM)
        if (matchedBom && matchedBom.BomLines) {
          data.PL2.manufacturer.rawMaterialsUsed = matchedBom.BomLines.map(
            (line: any, idx: number) => {
              const item = items.find((it) => it.ItemCode === line.ErpItemCode);

              // Tra cứu NCC của NVL / Bao bì trong Module 4
              const mappings = mockPartnerItemMappings.filter(
                (m) => m.ItemCode === line.ErpItemCode,
              );
              let partner = null;
              for (const map of mappings) {
                const p = partners.find(
                  (part) => part.PartnerId === map.PartnerId,
                );
                if (p) {
                  partner = p;
                  if (p.PartnerType === "NCC") {
                    break; // Ưu tiên nhà cung cấp (NCC)
                  }
                }
              }

              let supplierName = "Công ty TNHH Cung cấp Gia vị Việt Nam";
              if (line.ErpItemCode.startsWith("IP")) {
                supplierName = "Nội bộ - Nhà máy Masan Bình Dương";
              } else if (partner) {
                supplierName = partner.PartnerName;
              }

              const rawLotDate = "260620";
              const partnerAbbrev = partner
                ? partner.PartnerCode.replace(/-/g, "")
                : "NCC001";
              const rawLotNo = `${rawLotDate}${partnerAbbrev}123${idx}`;

              return {
                name: item?.ItemName || line.ErpItemCode,
                itemCode: item?.ItemCode || line.ErpItemCode,
                lotCode: rawLotNo,
                weight: line.ErpItemCode.startsWith("RM")
                  ? "2,500 kg"
                  : line.ErpItemCode.startsWith("IP")
                    ? "1,200 Lít"
                    : "50,000 cái",
                deliveryTime: "2026-06-25 08:30",
                expDate: "2027-12-31",
                packaging: line.ErpItemCode.startsWith("PG")
                  ? "Cuộn màng OPP"
                  : "Bao PE 25kg",
                additives: "Không",
                supplier: supplierName,
              };
            },
          );
        }

        // 7. Nhóm Thương Hiệu, Nhãn Hiệu Sản Phẩm (Từ SHTT mapping)
        const shttMapping = shttMappings.find(
          (m) => m.HscbVersionId === matchedHscbVersion?.HscbVersionId,
        );
        const ipms = shttMapping ? ipmsInfo[shttMapping.ShttCode] : null;

        data.PL2.brand = {
          name: ipms?.Trademark_Name || "OMACHI",
          patentNo: shttMapping?.ShttCode || "4-2026-22222",
          pdfUrl: ipms?.Certificate_URL || "/files/shtt_omachi_bo_ham.pdf",
        };

        // Cập nhật thông tin Bản Công bố truy xuất nguồn gốc (CircularDeclaration) theo Thông tư
        const circularBrandName = ipms?.Trademark_Name || matchedHscb?.Spec?.Brand || "MASAN";
        const circularShttPatentNo = shttMapping?.ShttCode 
          ? `Bằng bảo hộ độc quyền nhãn hiệu số ${shttMapping.ShttCode}`
          : "Bằng bảo hộ độc quyền nhãn hiệu số 12345/SHTT";

        const circularQualityStandard = matchedSpec
          ? `${matchedSpec.SpecCode} - Bản tự công bố số ${matchedHscb?.HscbCode || "456/MSN/2024"}`
          : "TCCS 01:2024/MSN - Bản tự công bố số 456/MSN/2024";

        const attpLicenseOfFactory = producingFacility?.Licenses?.find(
          (lic) => lic.LicenseType === LicenseType.ATVSTP
        );

        data.CircularDeclaration = {
          productName: matchedHscb?.LegalProductName || data.CircularDeclaration.productName,
          imageUrl: data.CircularDeclaration.imageUrl,
          originCountry: "Việt Nam",
          producerName: producingFacility?.FacilityName || "Nhà máy Masan Bình Dương",
          producerAddress: attpLicenseOfFactory?.Address || "Khu công nghiệp Sóng Thần 1, Dĩ An, Tỉnh Bình Dương",
          brandName: circularBrandName,
          lotCode: lotCode,
          expDate: erpOutput?.HSD || data.CircularDeclaration.expDate,
          qualityStandard: circularQualityStandard,
          distributorName: data.CircularDeclaration.distributorName,
          distributorAddress: data.CircularDeclaration.distributorAddress,
          shttPatentNo: circularShttPatentNo,
        };
      }

      setSearchData(data);

      // Parse lot code dynamically and map supplier to Module 4
      const parsed = parseLotCode(lotCode, partners);
      if (parsed) {
        setParsedLotInfo({
          internalDate: parsed.internalDate,
          partnerName: parsed.partner?.PartnerName || "Chưa xác định",
          partnerCode: parsed.partner?.PartnerCode || "N/A",
          vendorLot: parsed.vendorLot,
        });
      } else {
        setParsedLotInfo(null);
      }

      message.success("Truy xuất dữ liệu thành phẩm thành công!");
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleReset = () => {
    setItemCode(undefined);
    setLotCode(undefined);
    setHasSearched(false);
    setSearchData(null);
    setParsedLotInfo(null);
    setErpData(null);
    setActiveBomLines([]);
    setActiveShttMappings([]);
    message.success("Đã thiết lập lại bộ lọc!");
  };

  return (
    <div>
      {/* Filter Bar */}
      <Collapse
        defaultActiveKey={["filterPanel"]}
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
        }}
      >
        <Collapse.Panel
          key="filterPanel"
          header={
            <span
              style={{
                color: PRIMARY_COLOR,
                fontWeight: "bold",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <DatabaseOutlined style={{ marginRight: 8, fontSize: "14px" }} />
              Bộ lọc truy xuất nguồn gốc thành phẩm
            </span>
          }
          style={{ background: "#ffffff", border: "none" }}
        >
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Loại hình truy xuất:
              </div>
              <Select
                value={traceType}
                onChange={(val) => setTraceType(val)}
                style={{ width: "100%" }}
                options={[
                  { value: "INTERNAL", label: "Truy xuất nội bộ (PL1 & PL2)" },
                  { value: "CIRCULAR", label: "Truy xuất theo thông tư" },
                ]}
              />
            </Col>

            <Col xs={24} md={12} lg={7}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Thành phẩm (FG):
              </div>
              <Select
                value={itemCode}
                onChange={(val) => {
                  setItemCode(val);
                  setLotCode(undefined);
                }}
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn hoặc nhập mã/tên thành phẩm..."
                optionFilterProp="label"
                options={fgItems.map((it) => ({
                  value: it.ItemCode,
                  label: `${it.ItemCode} - ${it.ItemName}`,
                }))}
              />
            </Col>

            <Col xs={24} md={12} lg={5}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Số lô (Lot):
              </div>
              <Select
                value={lotCode}
                onChange={(val) => setLotCode(val)}
                placeholder={
                  itemCode ? "Chọn số lô..." : "Chọn thành phẩm trước..."
                }
                disabled={!itemCode}
                style={{ width: "100%" }}
                options={selectedItemLots.map((lot) => ({
                  value: lot.LotCode,
                  label: lot.LotCode,
                }))}
                notFoundContent={
                  itemCode ? "Không tìm thấy lô khả dụng" : "Chưa chọn vật tư"
                }
                showSearch
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Space size="small">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                  }}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  Reload
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* Main Content Area */}
      <Spin spinning={loading} tip="Đang truy xuất thông tin từ hệ thống...">
        {!hasSearched ? (
          <Card
            style={{
              textAlign: "center",
              padding: "40px 0",
              background: "#ffffff",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                color: "#bfbfbf",
                marginBottom: "16px",
              }}
            >
              <SearchOutlined />
            </div>
            <h3 style={{ color: "#595959" }}>Chưa có dữ liệu truy xuất</h3>
            <p style={{ color: "#8c8c8c" }}>
              Vui lòng chọn loại hình truy xuất, thành phẩm, số lô và nhấn nút
              "Tìm kiếm" để hiển thị dữ liệu.
            </p>
          </Card>
        ) : (
          <div>
            {/* Render based on traceType */}
            {traceType === "INTERNAL" ? (
              // 1. TRUY XUẤT NỘI BỘ (PL1 & PL2)
              <Tabs
                defaultActiveKey="pl1"
                className="custom-trace-tabs"
                items={[
                  {
                    key: "pl1",
                    label: (
                      <span>
                        <CarryOutOutlined style={{ marginRight: "8px" }} />
                        PHỤ LỤC 1 (PL1) - Báo cáo truy xuất
                      </span>
                    ),
                    children: (
                      <div>
                        {/* PL1 Card 1: Thông tin sản phẩm & lô */}
                        <Card
                          title={
                            <span
                              style={{
                                color: PRIMARY_COLOR,
                                fontWeight: "bold",
                              }}
                            >
                              I. Thông tin chung về Lô thành phẩm
                            </span>
                          }
                          size="small"
                          style={{ marginBottom: "16px", borderRadius: "8px" }}
                        >
                          <Descriptions bordered size="small" column={2}>
                            <Descriptions.Item label="Tên sản phẩm" span={2}>
                              <strong>{searchData?.PL1.productName}</strong>
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="Quy cách đóng gói"
                              span={2}
                            >
                              {searchData?.PL1.packaging}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lô">
                              <Tag
                                color="blue"
                                style={{ fontSize: "13px", fontWeight: "bold" }}
                              >
                                {searchData?.PL1.lotNo}
                              </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="NSX (Thành Phẩm)">
                              {searchData?.PL1.mfgDateFG}
                            </Descriptions.Item>
                            <Descriptions.Item label="NSX (NVL, Bao Bì)">
                              {searchData?.PL1.mfgDateNVL}
                            </Descriptions.Item>
                            <Descriptions.Item label="HSD (Hạn sử dụng)">
                              {searchData?.PL1.expDate}
                            </Descriptions.Item>
                            {parsedLotInfo && (
                              <>
                                <Descriptions.Item
                                  label="Ngày nhập kho nội bộ (Từ Số lô)"
                                  span={2}
                                >
                                  <strong
                                    style={{
                                      fontSize: "14px",
                                      color: PRIMARY_COLOR,
                                    }}
                                  >
                                    {parsedLotInfo.internalDate}
                                  </strong>
                                </Descriptions.Item>
                                <Descriptions.Item
                                  label="Đơn vị sản xuất / NCC (Từ Số lô)"
                                  span={2}
                                >
                                  <Space>
                                    <Tag color="cyan">
                                      {parsedLotInfo.partnerCode}
                                    </Tag>
                                    <strong>{parsedLotInfo.partnerName}</strong>
                                  </Space>
                                </Descriptions.Item>
                              </>
                            )}
                            <Descriptions.Item
                              label="Lý do truy xuất nguồn gốc"
                              span={2}
                            >
                              <Input
                                value={searchData?.PL1.reason}
                                onChange={(e) => {
                                  if (searchData) {
                                    setSearchData({
                                      ...searchData,
                                      PL1: {
                                        ...searchData.PL1,
                                        reason: e.target.value,
                                      },
                                    });
                                  }
                                }}
                                placeholder="Nhập lý do truy xuất..."
                              />
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>

                        {/* PL1 Card 2: Số liệu số lượng */}
                        <Card
                          title={
                            <span
                              style={{
                                color: PRIMARY_COLOR,
                                fontWeight: "bold",
                              }}
                            >
                              II. Thông tin về số lượng sản phẩm
                            </span>
                          }
                          size="small"
                          style={{ marginBottom: "16px", borderRadius: "8px" }}
                        >
                          <Descriptions bordered size="small" column={2}>
                            <Descriptions.Item label="Số lượng đã sản xuất (Thành Phẩm)">
                              {searchData?.PL1.qtyProducedFG}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng đã nhập kho (NVL, Bao Bì)">
                              {searchData?.PL1.qtyInboundNVL}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng đã nhập khẩu">
                              {searchData?.PL1.qtyImported}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng đã tiêu thụ (Thành Phẩm)">
                              {searchData?.PL1.qtyConsumedFG}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng đã thu hồi">
                              <Input
                                value={searchData?.PL1.qtyRecalled}
                                onChange={(e) => {
                                  if (searchData) {
                                    setSearchData({
                                      ...searchData,
                                      PL1: {
                                        ...searchData.PL1,
                                        qtyRecalled: e.target.value,
                                      },
                                    });
                                  }
                                }}
                                placeholder="Nhập số lượng đã thu hồi..."
                                style={{ fontWeight: "bold", color: "#d32f2f" }}
                              />
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng chưa thu hồi được">
                              <Input
                                value={searchData?.PL1.qtyNotYetRecalled}
                                onChange={(e) => {
                                  if (searchData) {
                                    setSearchData({
                                      ...searchData,
                                      PL1: {
                                        ...searchData.PL1,
                                        qtyNotYetRecalled: e.target.value,
                                      },
                                    });
                                  }
                                }}
                                placeholder="Nhập số lượng chưa thu hồi..."
                              />
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>

                        {/* PL1 Card 3: Sự cố & Xử lý */}
                        <Card
                          title={
                            <span
                              style={{
                                color: PRIMARY_COLOR,
                                fontWeight: "bold",
                              }}
                            >
                              III. Thông tin xử lý & Thu hồi sản phẩm không an
                              toàn
                            </span>
                          }
                          size="small"
                          style={{ marginBottom: "16px", borderRadius: "8px" }}
                        >
                          <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="Thông tin về số lượng sản phẩm không bảo đảm an toàn thực phẩm">
                              <Input.TextArea
                                rows={2}
                                value={searchData?.PL1.safetyIssueQtyInfo}
                                onChange={(e) => {
                                  if (searchData) {
                                    setSearchData({
                                      ...searchData,
                                      PL1: {
                                        ...searchData.PL1,
                                        safetyIssueQtyInfo: e.target.value,
                                      },
                                    });
                                  }
                                }}
                                placeholder="Nhập chi tiết về số lượng / tình trạng sản phẩm lỗi..."
                              />
                            </Descriptions.Item>
                            <Descriptions.Item label="Danh sách tên, địa chỉ, các địa điểm tập kết sản phẩm không an toàn">
                              <Input.TextArea
                                rows={2}
                                value={searchData?.PL1.assemblyPoints}
                                onChange={(e) => {
                                  if (searchData) {
                                    setSearchData({
                                      ...searchData,
                                      PL1: {
                                        ...searchData.PL1,
                                        assemblyPoints: e.target.value,
                                      },
                                    });
                                  }
                                }}
                                placeholder="Nhập danh sách địa điểm thu gom..."
                              />
                            </Descriptions.Item>
                            <Descriptions.Item label="Hình thức xử lý sản phẩm không an toàn">
                              <Input.TextArea
                                rows={2}
                                value={searchData?.PL1.handlingMethod}
                                onChange={(e) => {
                                  if (searchData) {
                                    setSearchData({
                                      ...searchData,
                                      PL1: {
                                        ...searchData.PL1,
                                        handlingMethod: e.target.value,
                                      },
                                    });
                                  }
                                }}
                                placeholder="Nhập hình thức xử lý hủy bỏ / tiêu hủy..."
                              />
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </div>
                    ),
                  },
                  {
                    key: "pl2",
                    label: (
                      <span>
                        <ApartmentOutlined style={{ marginRight: "8px" }} />
                        PHỤ LỤC 2 (PL2) - Thông tin chuỗi cung ứng (Điều 5 TT
                        11)
                      </span>
                    ),
                    children: (
                      <div>
                        <Collapse
                          defaultActiveKey={["g1", "g2", "g3", "g4", "g5", "g6", "g7"]}
                          ghost
                        >
                          <Collapse.Panel
                            key="g1"
                            header={
                              <strong style={{ color: PRIMARY_COLOR }}>
                                1. Nhóm Cơ sở kinh doanh Thành Phẩm (TP)
                              </strong>
                            }
                          >
                            <Descriptions bordered size="small" column={2}>
                              <Descriptions.Item
                                label="Tên cơ sở kinh doanh"
                                span={2}
                              >
                                <strong>
                                  {searchData?.PL2.businessEntity.name}
                                </strong>
                              </Descriptions.Item>
                              <Descriptions.Item label="Địa chỉ" span={2}>
                                {searchData?.PL2.businessEntity.address}
                              </Descriptions.Item>
                              <Descriptions.Item label="Thông tin liên hệ">
                                {searchData?.PL2.businessEntity.contact}
                              </Descriptions.Item>
                              <Descriptions.Item label="Mã số doanh nghiệp">
                                <Tag color="cyan">
                                  {searchData?.PL2.businessEntity.taxCode}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Giấy phép kinh doanh">
                                {searchData?.PL2.businessEntity.licenseNo &&
                                (searchData.PL2.businessEntity.licenseNo.startsWith(
                                  "/",
                                ) ||
                                  searchData.PL2.businessEntity.licenseNo.includes(
                                    ".pdf",
                                  )) ? (
                                  <Button
                                    type="link"
                                    icon={<FilePdfOutlined />}
                                    style={{ padding: 0 }}
                                    onClick={() => {
                                      setPdfTitle(
                                        "GIẤY CHỨNG NHẬN ĐĂNG KÝ DOANH NGHIỆP",
                                      );
                                      setPdfDocType("GPKD");
                                      setPdfMetaData(
                                        searchData?.PL2.businessEntity,
                                      );
                                      setIsPdfDrawerOpen(true);
                                    }}
                                  >
                                    Xem GPKD
                                  </Button>
                                ) : (
                                  searchData?.PL2.businessEntity.licenseNo
                                )}
                              </Descriptions.Item>
                              <Descriptions.Item label="Giấy chứng nhận cơ sở đủ điều kiện ATTP">
                                <Space>
                                  <strong>
                                    {
                                      searchData?.PL2.businessEntity
                                        .attpCertificate
                                    }
                                  </strong>
                                  {searchData?.PL2.businessEntity
                                    .attpCertificateFileUrl && (
                                    <Button
                                      type="link"
                                      icon={<FilePdfOutlined />}
                                      style={{ padding: 0 }}
                                      onClick={() => {
                                        setPdfTitle(
                                          "BẢN TỰ CÔNG BỐ SẢN PHẨM / CHỨNG NHẬN ATTP",
                                        );
                                        setPdfDocType("HSCB");
                                        setPdfMetaData({
                                          name: searchData?.PL2.businessEntity
                                            .name,
                                          address:
                                            searchData?.PL2.businessEntity
                                              .address,
                                          contact:
                                            searchData?.PL2.businessEntity
                                              .contact,
                                          attpNo:
                                            searchData?.PL2.businessEntity
                                              .attpCertificate,
                                          productName:
                                            searchData?.PL2.manufacturer
                                              .productName,
                                        });
                                        setIsPdfDrawerOpen(true);
                                      }}
                                    >
                                      Xem chứng nhận ATTP
                                    </Button>
                                  )}
                                </Space>
                              </Descriptions.Item>
                            </Descriptions>
                          </Collapse.Panel>

                          {/* Nhóm 2 */}
                          <Collapse.Panel
                            key="g2"
                            header={
                              <strong style={{ color: PRIMARY_COLOR }}>
                                2. Nhóm Cơ sở sản xuất Thành Phẩm (TP)
                              </strong>
                            }
                          >
                            {/* Layout 2 cột: Info trái | Ảnh phải */}
                            <Row gutter={24} style={{ marginBottom: 16 }}>
                              {/* CỘT TRÁI — Thông tin */}
                              <Col span={16}>
                                <Descriptions
                                  bordered
                                  size="small"
                                  column={1}
                                  style={{ marginBottom: 8 }}
                                >
                                  <Descriptions.Item label="Tên sản phẩm">
                                    <strong>
                                      {searchData?.PL2.manufacturer.productName}
                                    </strong>
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Mã số mã vạch (EAN)">
                                    <Tag color="geekblue">
                                      {searchData?.PL2.manufacturer.barcode}
                                    </Tag>
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Chất liệu bao bì & thành phần">
                                    {
                                      searchData?.PL2.manufacturer
                                        .packagingMaterials
                                    }
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Thời hạn bảo quản (Shelf-life)">
                                    {searchData?.PL2.manufacturer.shelfLife}
                                  </Descriptions.Item>

                                  {/* TCCS — từ Spec store */}
                                  <Descriptions.Item label="Tiêu chuẩn cơ sở (TCCS)">
                                    {searchData?.PL2.manufacturer
                                      .tccsStandard ? (
                                      <Space>
                                        <Tag color="gold">
                                          {
                                            searchData.PL2.manufacturer
                                              .tccsStandard
                                          }
                                        </Tag>
                                        <Button
                                          type="link"
                                          size="small"
                                          icon={<FilePdfOutlined />}
                                          style={{ padding: 0 }}
                                          onClick={() => {
                                            setPdfTitle(
                                              `TIÊU CHUẨN CƠ SỞ (TCCS) - ${searchData.PL2.manufacturer.productName}`,
                                            );
                                            setPdfDocType("TCCS");
                                            setPdfMetaData({
                                              productName:
                                                searchData.PL2.manufacturer
                                                  .productName,
                                              itemCode: searchData.ItemCode,
                                              tccsCode:
                                                searchData.PL2.manufacturer
                                                  .tccsStandard,
                                            });
                                            setIsPdfDrawerOpen(true);
                                          }}
                                        >
                                          Xem TCCS
                                        </Button>
                                      </Space>
                                    ) : (
                                      <span style={{ color: "#999" }}>
                                        Chưa có dữ liệu
                                      </span>
                                    )}
                                  </Descriptions.Item>

                                  {/* TCVN — từ HSCB.AppliedStandards */}
                                  <Descriptions.Item label="Tiêu chuẩn quốc gia (TCVN)">
                                    {searchData?.PL2.manufacturer.tcvnStandards
                                      ?.length ? (
                                      <Space wrap>
                                        {searchData.PL2.manufacturer.tcvnStandards.map(
                                          (s, i) => (
                                            <Tag
                                              key={i}
                                              color="blue"
                                              title={s.description}
                                            >
                                              {s.code}
                                            </Tag>
                                          ),
                                        )}
                                      </Space>
                                    ) : (
                                      <span style={{ color: "#999" }}>
                                        Chưa có dữ liệu
                                      </span>
                                    )}
                                  </Descriptions.Item>

                                  <Descriptions.Item label="Quy chuẩn kỹ thuật quốc gia (QCVN)">
                                    {searchData?.PL2.manufacturer.qcvnStandards
                                      ?.length ? (
                                      <Space wrap>
                                        {searchData.PL2.manufacturer.qcvnStandards.map(
                                          (s, i) => (
                                            <Tag
                                              key={i}
                                              color="green"
                                              title={s.description}
                                            >
                                              {s.code}
                                            </Tag>
                                          ),
                                        )}
                                      </Space>
                                    ) : (
                                      <span style={{ color: "#999" }}>
                                        Chưa có dữ liệu
                                      </span>
                                    )}
                                  </Descriptions.Item>

                                  <Descriptions.Item label="Địa điểm diễn ra sự kiện">
                                    <Input
                                      value={
                                        searchData?.PL2.manufacturer
                                          .traceLocation
                                      }
                                      onChange={(e) => {
                                        if (searchData)
                                          setSearchData({
                                            ...searchData,
                                            PL2: {
                                              ...searchData.PL2,
                                              manufacturer: {
                                                ...searchData.PL2.manufacturer,
                                                traceLocation: e.target.value,
                                              },
                                            },
                                          });
                                      }}
                                      placeholder="Nhập địa điểm diễn ra sự kiện..."
                                    />
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Thời gian diễn ra sự kiện">
                                    <Input
                                      value={
                                        searchData?.PL2.manufacturer.traceTime
                                      }
                                      onChange={(e) => {
                                        if (searchData)
                                          setSearchData({
                                            ...searchData,
                                            PL2: {
                                              ...searchData.PL2,
                                              manufacturer: {
                                                ...searchData.PL2.manufacturer,
                                                traceTime: e.target.value,
                                              },
                                            },
                                          });
                                      }}
                                      placeholder="Nhập thời gian diễn ra sự kiện..."
                                    />
                                  </Descriptions.Item>
                                </Descriptions>
                              </Col>

                              {/* CỘT PHẢI — Ảnh sản phẩm: 1 lớn + 3 nhỏ dạng placeholder */}
                              <Col span={8}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {/* Ảnh lớn */}
                                  <div
                                    style={{
                                      width: "100%",
                                      aspectRatio: "1.2/1",
                                      background: "#fafafa",
                                      borderRadius: 8,
                                      border: "1px dashed #d9d9d9",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#8c8c8c",
                                      marginBottom: 8,
                                      padding: "8px",
                                    }}
                                  >
                                    <PictureOutlined
                                      style={{
                                        fontSize: "28px",
                                        marginBottom: "4px",
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        fontWeight: 500,
                                        textAlign: "center",
                                      }}
                                    >
                                      Ảnh nhãn mặt trước
                                    </span>
                                  </div>
                                  {/* 3 ảnh nhỏ */}
                                  <Row gutter={8}>
                                    <Col span={8}>
                                      <div
                                        style={{
                                          width: "100%",
                                          aspectRatio: "1/1",
                                          background: "#fafafa",
                                          borderRadius: 6,
                                          border: "1px dashed #d9d9d9",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#8c8c8c",
                                          padding: "2px",
                                        }}
                                      >
                                        <PictureOutlined
                                          style={{
                                            fontSize: "16px",
                                            marginBottom: "2px",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "8px",
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                          }}
                                        >
                                          Mặt sau
                                        </span>
                                      </div>
                                    </Col>
                                    <Col span={8}>
                                      <div
                                        style={{
                                          width: "100%",
                                          aspectRatio: "1/1",
                                          background: "#fafafa",
                                          borderRadius: 6,
                                          border: "1px dashed #d9d9d9",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#8c8c8c",
                                          padding: "2px",
                                        }}
                                      >
                                        <PictureOutlined
                                          style={{
                                            fontSize: "16px",
                                            marginBottom: "2px",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "8px",
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                          }}
                                        >
                                          Bao bì
                                        </span>
                                      </div>
                                    </Col>
                                    <Col span={8}>
                                      <div
                                        style={{
                                          width: "100%",
                                          aspectRatio: "1/1",
                                          background: "#fafafa",
                                          borderRadius: 6,
                                          border: "1px dashed #d9d9d9",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#8c8c8c",
                                          padding: "2px",
                                        }}
                                      >
                                        <PictureOutlined
                                          style={{
                                            fontSize: "16px",
                                            marginBottom: "2px",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "8px",
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                          }}
                                        >
                                          Kiểu dáng
                                        </span>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>

                            {/* Raw Materials Table */}
                            <div style={{ marginBottom: "16px" }}>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  marginBottom: 8,
                                  color: PRIMARY_COLOR,
                                }}
                              >
                                Chi tiết Nguyên vật liệu / Bán thành phẩm / Bao
                                bì cấu thành lô hàng:
                              </div>
                              <table
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                  fontSize: "12px",
                                }}
                                border={1}
                                cellPadding={6}
                              >
                                <thead>
                                  <tr
                                    style={{
                                      background: "#fafafa",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <td>Mã Vật Tư</td>
                                    <td>Tên NVL / BTP</td>
                                    <td>Mã Lô (Lot)</td>
                                    <td>Khối lượng</td>
                                    <td>Nhà cung cấp</td>
                                    <td>HSD</td>
                                    <td>Bao bì</td>
                                    <td>Thời gian giao nhận</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {activeBomLines.map(
                                    (line: any, index: number) => {
                                      // Data đã có trong Redux — KHÔNG gọi API
                                      const lineItem = items.find(
                                        (it) =>
                                          it.ItemCode === line.ErpItemCode,
                                      );

                                      // BƯỚC 3: Gọi ERP API — lấy lot NVL thực tế của mẻ này
                                      const nvlResp = lotCode
                                        ? getNvlLotDetail(
                                            lotCode,
                                            line.ErpItemCode,
                                          )
                                        : null;
                                      const nvl = nvlResp?.data;

                                      // Xác định Nhà cung cấp (Ưu tiên phân rã từ NvlLotCode của ERP)
                                      let supplierName = "—";
                                      if (line.ErpItemCode.startsWith("IP")) {
                                        supplierName = "Nội bộ (Nhà máy Masan)";
                                      } else if (nvl?.NvlLotCode) {
                                        const parsedPartnerInfo = parseLotCode(
                                          nvl.NvlLotCode,
                                          partners,
                                        );
                                        supplierName =
                                          parsedPartnerInfo?.partner
                                            ?.PartnerName || "—";
                                      } else {
                                        // Fallback về mapping tĩnh trong Redux nếu không có lot thực tế
                                        const mappings =
                                          mockPartnerItemMappings.filter(
                                            (m) =>
                                              m.ItemCode === line.ErpItemCode,
                                          );
                                        let fallbackPartner = null;
                                        for (const map of mappings) {
                                          const p = partners.find(
                                            (pt) =>
                                              pt.PartnerId === map.PartnerId,
                                          );
                                          if (p) {
                                            fallbackPartner = p;
                                            if (p.PartnerType === "NCC") break;
                                          }
                                        }
                                        supplierName =
                                          fallbackPartner?.PartnerName || "—";
                                      }

                                      return (
                                        <tr key={index}>
                                          <td>
                                            <Tag color="cyan">
                                              {line.ErpItemCode}
                                            </Tag>
                                          </td>
                                          <td>
                                            <strong>
                                              {lineItem?.ItemName ||
                                                line.ErpItemCode}
                                            </strong>
                                          </td>
                                          <td>
                                            <Tag color="blue">
                                              {nvl?.NvlLotCode || "—"}
                                            </Tag>
                                          </td>
                                          <td>{nvl?.QtyUsed || "—"}</td>
                                          <td>{supplierName}</td>
                                          <td>{nvl?.HSD || "—"}</td>
                                          <td>{nvl?.Packaging || "—"}</td>
                                          <td>{nvl?.DeliveryDate || "—"}</td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </div>

                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <Card
                                  size="small"
                                  title="Khách hàng / NPP liên quan"
                                  style={{ background: "#fafafa" }}
                                >
                                  {searchData?.PL2.manufacturer.customers.map(
                                    (c, i) => (
                                      <div key={i} style={{ marginBottom: 6 }}>
                                        <div>
                                          <strong>{c.name}</strong>
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "11px",
                                            color: "#8c8c8c",
                                          }}
                                        >
                                          {c.address} (MST: {c.taxCode})
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card
                                  size="small"
                                  title="Đơn vị vận chuyển / Bảo quản"
                                  style={{ background: "#fafafa" }}
                                >
                                  {searchData?.PL2.manufacturer.transporters.map(
                                    (t, i) => (
                                      <div key={i} style={{ marginBottom: 6 }}>
                                        <div>
                                          <strong>{t.name}</strong>
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "11px",
                                            color: "#8c8c8c",
                                          }}
                                        >
                                          {t.address} (MST: {t.taxCode})
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </Card>
                              </Col>
                            </Row>
                          </Collapse.Panel>

                          {/* Nhóm 3 */}
                          <Collapse.Panel
                            key="g3"
                            header={
                              <strong style={{ color: PRIMARY_COLOR }}>
                                3. Nhóm Cơ sở kinh doanh bổ sung
                              </strong>
                            }
                          >
                            <Descriptions bordered size="small" column={2}>
                              <Descriptions.Item label="Địa điểm phân phối bán lẻ">
                                {searchData?.PL2.additionalBusiness.location}
                              </Descriptions.Item>
                              <Descriptions.Item label="Thời gian nhận hàng tại điểm bán">
                                {searchData?.PL2.additionalBusiness.time}
                              </Descriptions.Item>
                            </Descriptions>
                          </Collapse.Panel>

                          {/* Nhóm 4 */}
                          <Collapse.Panel
                            key="g4"
                            header={
                              <strong style={{ color: PRIMARY_COLOR }}>
                                4. Nhóm Thực phẩm nhập khẩu
                              </strong>
                            }
                          >
                            {(() => {
                              const imp = searchData?.PL2.importedFood;
                              const isNa =
                                !imp ||
                                imp.exporterName === "N/A" ||
                                !imp.exporterName;

                              const exporterName = isNa
                                ? "IndoFoods & Seasonings Ltd"
                                : imp.exporterName;
                              const exporterAddress = isNa
                                ? "Jl. Sudirman No. 23, Jakarta, Indonesia"
                                : imp.exporterAddress;
                              const exporterContact = isNa
                                ? "+62-21-5551234 / export@indofoods.co.id"
                                : imp.exporterContact;

                              const importerName = isNa
                                ? "Công ty Cổ phần Hàng tiêu dùng Masan"
                                : imp.importerName;
                              const importerAddress = isNa
                                ? "Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                                : imp.importerAddress;
                              const importerContact =
                                "028-62563862 / contact@masanconsumer.com";
                              const importerTaxCode = isNa
                                ? "0302012345"
                                : imp.importerTaxCode;

                              const coNumber = isNa
                                ? "C/O Form D số ID-JV-2026-908712 cấp ngày 12/04/2026"
                                : imp.coNumber;
                              const testResultNo = isNa
                                ? "Giấy xác nhận đạt ATTP nhập khẩu số 1122/KQKN-Quatest3"
                                : imp.testResultNo;
                              const quantityImported = isNa
                                ? "5,000 kg bột gia vị hương bò"
                                : imp.quantityImported;
                              const lotNumber = isNa
                                ? "260412IND99"
                                : imp.lotNumber;

                              return (
                                <Descriptions bordered size="small" column={2}>
                                  <Descriptions.Item
                                    label="Nhà sản xuất / xuất khẩu nước ngoài"
                                    span={2}
                                  >
                                    <strong>{exporterName}</strong> (
                                    {exporterAddress})
                                    <div>Liên hệ: {exporterContact}</div>
                                  </Descriptions.Item>
                                  <Descriptions.Item
                                    label="Đơn vị nhập khẩu chính thức"
                                    span={2}
                                  >
                                    <strong>{importerName}</strong> (
                                    {importerAddress})
                                    <div>
                                      MST: {importerTaxCode} | Liên hệ:{" "}
                                      {importerContact}
                                    </div>
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Chứng nhận xuất xứ (C/O)">
                                    <Tag color="purple">{coNumber}</Tag>
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Kết quả kiểm nghiệm ATTP">
                                    <Tag color="green">{testResultNo}</Tag>
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Khối lượng nhập khẩu">
                                    {quantityImported}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Số lô hàng nhập khẩu">
                                    <Tag color="blue">{lotNumber}</Tag>
                                  </Descriptions.Item>
                                </Descriptions>
                              );
                            })()}
                          </Collapse.Panel>

                          {/* Nhóm 5 */}
                          <Collapse.Panel
                            key="g5"
                            header={
                              <strong style={{ color: PRIMARY_COLOR }}>
                                5. Nhóm Thực phẩm xuất khẩu
                              </strong>
                            }
                          >
                            <Descriptions bordered size="small" column={1}>
                              <Descriptions.Item label="Mã CZ Code (Thị trường Nga)">
                                <Tag
                                  color={
                                    searchData?.PL2.exportedFood
                                      .russiaCzCode === "N/A"
                                      ? "default"
                                      : "blue"
                                  }
                                >
                                  {searchData?.PL2.exportedFood.russiaCzCode}
                                </Tag>
                              </Descriptions.Item>
                            </Descriptions>
                          </Collapse.Panel>

                          {/* Nhóm 6 */}
                          <Collapse.Panel
                            key="g6"
                            header={
                              <strong style={{ color: PRIMARY_COLOR }}>
                                6. Nhóm Xuất xứ thành phẩm
                              </strong>
                            }
                          >
                            <Descriptions bordered size="small" column={2}>
                              <Descriptions.Item label="Quốc gia xuất xứ">
                                <strong>
                                  {searchData?.PL2.origin.country}
                                </strong>
                              </Descriptions.Item>
                              <Descriptions.Item label="Quy chuẩn / Tiêu chuẩn áp dụng đối chiếu">
                                {searchData?.PL2.origin.standards}
                              </Descriptions.Item>
                            </Descriptions>
                          </Collapse.Panel>

                          {/* Nhóm 7 */}
                          <Collapse.Panel
                            key="g7"
                            header={
                              <strong style={{ color: PRIMARY_COLOR }}>
                                7. Nhóm Thương Hiệu, Nhãn Hiệu Sản Phẩm
                              </strong>
                            }
                          >
                            {(() => {
                              // Nếu không có activeShttMappings từ Redux, fallback về thông tin brand mặc định
                              const shttsToRender =
                                activeShttMappings.length > 0
                                  ? activeShttMappings
                                  : searchData?.PL2.brand.patentNo
                                    ? [
                                        {
                                          ShttType: "PRIMARY_BRAND",
                                          ShttCode:
                                            searchData.PL2.brand.patentNo,
                                        },
                                      ]
                                    : [];

                              if (shttsToRender.length === 0) {
                                return (
                                  <Alert
                                    message="Không có thông tin sở hữu trí tuệ / nhãn hiệu đã đăng ký."
                                    type="warning"
                                    showIcon
                                  />
                                );
                              }

                              return (
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "12px",
                                  }}
                                  border={1}
                                  cellPadding={6}
                                >
                                  <thead>
                                    <tr
                                      style={{
                                        background: "#fafafa",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      <td>Phân loại bảo hộ SHTT</td>
                                      <td>Nhãn hiệu / Kiểu dáng công nghiệp</td>
                                      <td>Số đơn / Số văn bằng SHTT</td>
                                      <td>Chủ sở hữu bảo hộ</td>
                                      <td style={{ textAlign: "center" }}>
                                        Trạng thái IPMS
                                      </td>
                                      <td style={{ textAlign: "center" }}>
                                        Tài liệu đính kèm
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {shttsToRender.map((s, index) => {
                                      const registry = ipmsInfo[s.ShttCode];
                                      const typeConfig = ShttTypeConfig[
                                        s.ShttType as ShttType
                                      ] || {
                                        label: s.ShttType,
                                        color: "default",
                                      };
                                      const statusConfig = registry
                                        ? IpmsStatusConfig[
                                            registry.Status as IpmsStatus
                                          ]
                                        : null;

                                      const trademarkName =
                                        registry?.Trademark_Name ||
                                        searchData?.PL2.brand.name ||
                                        "—";
                                      const owner =
                                        registry?.Owner ||
                                        "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)";
                                      const pdfUrl =
                                        registry?.Certificate_URL ||
                                        searchData?.PL2.brand.pdfUrl ||
                                        "#";

                                      return (
                                        <tr key={index}>
                                          <td>
                                            <Tag color={typeConfig.color}>
                                              {typeConfig.label}
                                            </Tag>
                                          </td>
                                          <td>
                                            <strong
                                              style={{ color: PRIMARY_COLOR }}
                                            >
                                              {trademarkName}
                                            </strong>
                                          </td>
                                          <td>
                                            <Tag color="purple">
                                              {s.ShttCode}
                                            </Tag>
                                          </td>
                                          <td>{owner}</td>
                                          <td style={{ textAlign: "center" }}>
                                            <Tag
                                              color={
                                                statusConfig?.color || "success"
                                              }
                                            >
                                              {statusConfig?.label || "Valid"}
                                            </Tag>
                                          </td>
                                          <td style={{ textAlign: "center" }}>
                                            {pdfUrl && pdfUrl !== "#" ? (
                                              <Button
                                                type="link"
                                                icon={<FilePdfOutlined />}
                                                style={{ padding: 0 }}
                                                onClick={() => {
                                                  setPdfTitle(
                                                    `VĂN BẰNG BẢO HỘ SỞ HỮU TRÍ TUỆ - ${trademarkName}`,
                                                  );
                                                  setPdfDocType("SHTT");
                                                  setPdfMetaData({
                                                    trademarkName,
                                                    shttCode: s.ShttCode,
                                                    shttType: s.ShttType,
                                                    owner,
                                                  });
                                                  setIsPdfDrawerOpen(true);
                                                }}
                                              >
                                                Xem văn bằng PDF
                                              </Button>
                                            ) : (
                                              "—"
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              );
                            })()}
                          </Collapse.Panel>
                        </Collapse>
                      </div>
                    ),
                  },
                ]}
              />
            ) : (
              // 2. TRUY XUẤT THEO THÔNG TƯ (CIRCULAR COMPLIANCE CARD VIEW)
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px 0",
                }}
              >
                <Card
                  bordered
                  style={{
                    width: "100%",
                    maxWidth: "800px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    borderRadius: "12px",
                    border: "2px solid #d4b106",
                    background: "#ffffff",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Certificate Header Accent */}
                  <div
                    style={{
                      height: "6px",
                      background: "#d4b106",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  />

                  {/* Header */}
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                      marginBottom: "25px",
                    }}
                  >
                    <h2
                      style={{
                        color: "#a17f00",
                        margin: 0,
                        fontSize: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      BẢN CÔNG BỐ TRUY XUẤT NGUỒN GỐC SẢN PHẨM
                    </h2>
                    <span style={{ fontSize: "11px", color: "#8c8c8c" }}>
                      (Theo Thông tư hướng dẫn về Truy xuất nguồn gốc và An toàn
                      thực phẩm)
                    </span>
                  </div>

                  {/* Body Content */}
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                      <Descriptions
                        bordered
                        size="small"
                        column={1}
                        labelStyle={{ width: "35%", fontWeight: "bold" }}
                      >
                        <Descriptions.Item label="Tên sản phẩm">
                          <span
                            style={{
                              fontSize: "14px",
                              color: PRIMARY_COLOR,
                              fontWeight: "bold",
                            }}
                          >
                            {searchData?.CircularDeclaration.productName}
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thương hiệu">
                          <strong>
                            {searchData?.CircularDeclaration.brandName}
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Xuất xứ">
                          {searchData?.CircularDeclaration.originCountry}
                        </Descriptions.Item>
                        <Descriptions.Item label="Cơ sở sản xuất">
                          <div>
                            {searchData?.CircularDeclaration.producerName}
                          </div>
                          <div style={{ fontSize: "11px", color: "#8c8c8c" }}>
                            Địa chỉ:{" "}
                            {searchData?.CircularDeclaration.producerAddress}
                          </div>
                        </Descriptions.Item>
                        {searchData?.CircularDeclaration.importerName && (
                          <Descriptions.Item label="Đơn vị nhập khẩu">
                            <div>
                              {searchData?.CircularDeclaration.importerName}
                            </div>
                            <div style={{ fontSize: "11px", color: "#8c8c8c" }}>
                              Địa chỉ:{" "}
                              {searchData?.CircularDeclaration.importerAddress}
                            </div>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Đơn vị phân phối">
                          <div>
                            {searchData?.CircularDeclaration.distributorName}
                          </div>
                          <div style={{ fontSize: "11px", color: "#8c8c8c" }}>
                            Địa chỉ:{" "}
                            {searchData?.CircularDeclaration.distributorAddress}
                          </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lô sản xuất">
                          <Tag
                            color="gold"
                            style={{ fontWeight: "bold", fontSize: "12px" }}
                          >
                            {searchData?.CircularDeclaration.lotCode}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Hạn sử dụng">
                          <strong>
                            {searchData?.CircularDeclaration.expDate}
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tiêu chuẩn áp dụng">
                          {searchData?.CircularDeclaration.qualityStandard}
                        </Descriptions.Item>
                        {searchData?.CircularDeclaration.shttPatentNo && (
                          <Descriptions.Item label="Bảo hộ Sở hữu trí tuệ">
                            {searchData?.CircularDeclaration.shttPatentNo}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </Col>

                    {/* Cột 2: Hình ảnh trên, QR dưới */}
                    <Col xs={24} md={8}>
                      {/* Lưới hình ảnh (1 lớn + 3 nhỏ) */}
                      <div style={{ marginBottom: "20px" }}>
                        {/* Ảnh lớn */}
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "1.2/1",
                            borderRadius: 8,
                            overflow: "hidden",
                            marginBottom: 8,
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          }}
                        >
                          <img
                            src={
                              searchData?.PL2?.manufacturer?.productImages?.[0] ||
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600"
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            alt="Mặt trước"
                          />
                        </div>
                        {/* 3 ảnh nhỏ */}
                        <Row gutter={6}>
                          <Col span={8}>
                            <div
                              style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                borderRadius: 6,
                                overflow: "hidden",
                                border: "1px solid #f0f0f0",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                              }}
                            >
                              <img
                                src={
                                  searchData?.PL2?.manufacturer?.productImages?.[1] ||
                                  "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=200"
                                }
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                alt="Mặt sau"
                              />
                            </div>
                          </Col>
                          <Col span={8}>
                            <div
                              style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                borderRadius: 6,
                                overflow: "hidden",
                                border: "1px solid #f0f0f0",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                              }}
                            >
                              <img
                                src={
                                  searchData?.PL2?.manufacturer?.productImages?.[2] ||
                                  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=200"
                                }
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                alt="Nhãn phụ"
                              />
                            </div>
                          </Col>
                          <Col span={8}>
                            <div
                              style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                borderRadius: 6,
                                overflow: "hidden",
                                border: "1px solid #f0f0f0",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                              }}
                            >
                              <img
                                src={
                                  searchData?.PL2?.manufacturer?.productImages?.[3] ||
                                  "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200"
                                }
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                alt="Khác"
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* QR Code bên dưới */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Card
                          size="small"
                          style={{
                            textAlign: "center",
                            border: "1px dashed #d9d9d9",
                            background: "#fafafa",
                            width: "100%",
                            maxWidth: "180px",
                          }}
                        >
                          <div style={{ padding: "5px", display: "flex", justifyContent: "center" }}>
                            <QRCode
                              value={`${import.meta.env.VITE_PUBLIC_URL || window.location.origin}/fg/${searchData?.ItemCode}?lot/${searchData?.LotCode}`}
                              size={120}
                              bordered={false}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#8c8c8c",
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            Quét mã để tra cứu
                          </span>
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#bfbfbf",
                              display: "block",
                            }}
                          >
                            Masan Traceability QR
                          </span>
                        </Card>

                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            gap: "8px",
                            width: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            type="primary"
                            danger
                            icon={<FilePdfOutlined />}
                          >
                            Xuất PDF
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Stamp Seal Indicator */}
                  <div
                    style={{
                      border: "2px solid #52c41a",
                      color: "#52c41a",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "inline-block",
                      position: "absolute",
                      bottom: "15px",
                      right: "15px",
                      transform: "rotate(-10deg)",
                    }}
                  >
                    ĐÃ XÁC MINH GS1
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </Spin>

      {/* PDF Preview Drawer */}
      <Drawer
        title={
          <span style={{ display: "flex", alignItems: "center" }}>
            <FilePdfOutlined
              style={{ color: "#ff4d4f", marginRight: 8, fontSize: "20px" }}
            />
            {pdfTitle}
          </span>
        }
        placement="right"
        width={750}
        onClose={() => {
          setIsPdfDrawerOpen(false);
          setPdfMetaData(null);
        }}
        open={isPdfDrawerOpen}
        destroyOnClose
        styles={{
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "#f0f2f5",
          },
        }}
      >
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {/* PDF Page Container */}
          <div
            style={{
              background: "#ffffff",
              width: "100%",
              minHeight: "842px",
              padding: "40px 50px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "4px",
              fontFamily: "Times New Roman, serif",
              lineHeight: 1.5,
              position: "relative",
              color: "#333",
            }}
          >
            {pdfDocType === "GPKD" && pdfMetaData && (
              <div>
                {/* GIẤY PHÉP ĐĂNG KÝ KINH DOANH */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <strong style={{ fontSize: 13 }}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </strong>
                  <br />
                  <strong
                    style={{
                      fontSize: 12,
                      borderBottom: "1px solid #333",
                      paddingBottom: 2,
                    }}
                  >
                    Độc lập - Tự do - Hạnh phúc
                  </strong>
                </div>

                <div style={{ textAlign: "center", marginBottom: 30 }}>
                  <h2
                    style={{ fontSize: 18, color: "#b71c1c", margin: "10px 0" }}
                  >
                    GIẤY CHỨNG NHẬN ĐĂNG KÝ DOANH NGHIỆP
                  </h2>
                  <strong style={{ fontSize: 13 }}>
                    CÔNG TY CỔ PHẦN CÔNG NGHỆ TẾ BÀO VÀ SẢN XUẤT
                  </strong>
                  <br />
                  <span>
                    Mã số doanh nghiệp: {pdfMetaData.taxCode || "0302012345"}
                  </span>
                  <br />
                  <span>Đăng ký lần đầu: Ngày 12 tháng 05 năm 2008</span>
                </div>

                <div style={{ fontSize: 14 }}>
                  <p>
                    <strong>1. Tên công ty:</strong>{" "}
                    {pdfMetaData.name || "Công ty Cổ phần Hàng tiêu dùng Masan"}
                  </p>
                  <p>
                    <strong>2. Địa chỉ trụ sở chính:</strong>{" "}
                    {pdfMetaData.address || "39 Lê Duẩn, Quận 1, TP. HCM"}
                  </p>
                  <p>
                    <strong>3. Vốn điều lệ:</strong> 12,500,000,000,000 VNĐ
                  </p>
                  <p>
                    <strong>4. Người đại diện theo pháp luật:</strong>
                  </p>
                  <div style={{ paddingLeft: 20 }}>
                    <p>
                      - Họ và tên: <strong>TRẦN ĐỨC HOÀNG</strong>
                    </p>
                    <p>- Chức danh: Tổng Giám Đốc</p>
                    <p>
                      - Số CCCD: 001085001234 cấp bởi Cục CSQLHC về trật tự xã
                      hội
                    </p>
                  </div>
                  <p>
                    <strong>5. Thông tin liên hệ:</strong>{" "}
                    {pdfMetaData.contact || "028-62563862"}
                  </p>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 100,
                    right: 80,
                    textAlign: "center",
                  }}
                >
                  <span>
                    <em>TP. Hồ Chí Minh, ngày 24 tháng 03 năm 2026</em>
                  </span>
                  <br />
                  <strong>PHÒNG ĐĂNG KÝ KINH DOANH</strong>
                  <br />
                  <strong
                    style={{
                      display: "block",
                      marginTop: 10,
                      color: "#d32f2f",
                    }}
                  >
                    ĐÃ KÝ SỐ / SIGNED
                  </strong>
                </div>
              </div>
            )}

            {pdfDocType === "TCCS" && pdfMetaData && (
              <div>
                {/* TIÊU CHUẨN CƠ SỞ (TCCS) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "2px solid #333",
                    paddingBottom: 10,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <strong>TẬP ĐOÀN MASAN</strong>
                    <br />
                    <span>Masan Consumer Corp</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong>TIÊU CHUẨN CƠ SỞ</strong>
                    <br />
                    <span style={{ color: "#d32f2f" }}>
                      {pdfMetaData.tccsCode || "TCCS 01:2024/MSN"}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: 30 }}>
                  <h2 style={{ fontSize: 20, margin: "10px 0" }}>
                    TIÊU CHUẨN KỸ THUẬT SẢN PHẨM
                  </h2>
                  <strong>
                    Sản phẩm: {pdfMetaData.productName || "Nước mắm Nam Ngư"}
                  </strong>
                  <br />
                  <span>Mã hàng ERP: {pdfMetaData.itemCode}</span>
                </div>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: 20,
                  }}
                  border={1}
                  cellPadding={8}
                >
                  <thead>
                    <tr style={{ background: "#f0f0f0" }}>
                      <th style={{ width: "8%" }}>STT</th>
                      <th style={{ width: "42%" }}>Chỉ tiêu kiểm soát</th>
                      <th style={{ width: "30%" }}>Yêu cầu kỹ thuật</th>
                      <th style={{ width: "20%" }}>Phương pháp thử</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" }}>1</td>
                      <td>Trạng thái cảm quan</td>
                      <td>Chất lỏng trong suốt, không cặn</td>
                      <td>TCVN 1055:2015</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center" }}>2</td>
                      <td>Màu sắc đặc trưng</td>
                      <td>Đỏ nâu đến cánh gián sáng</td>
                      <td>Cảm quan trực tiếp</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center" }}>3</td>
                      <td>Mùi vị đặc trưng</td>
                      <td>Mùi thơm nồng đặc trưng, vị đậm ngọt</td>
                      <td>Thử nếm trực tiếp</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center" }}>4</td>
                      <td>Hàm lượng Nitơ toàn phần (Độ đạm)</td>
                      <td>&ge; 15 g/l</td>
                      <td>TCVN 3705:1990</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center" }}>5</td>
                      <td>Hàm lượng muối (NaCl)</td>
                      <td>200 - 240 g/l</td>
                      <td>TCVN 3701:1990</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ fontSize: 13, marginTop: 30 }}>
                  <p>
                    <strong>QUY CÁCH ĐÓNG GÓI & BẢO QUẢN:</strong>
                  </p>
                  <ul>
                    <li>
                      Chất liệu chai nhựa PET nguyên sinh chuyên dụng thực phẩm.
                    </li>
                    <li>
                      Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực
                      tiếp. Hạn sử dụng 12 tháng kể từ ngày sản xuất.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {pdfDocType === "SHTT" && pdfMetaData && (
              <div>
                {/* VĂN BẰNG BẢO HỘ SỞ HỮU TRÍ TUỆ */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <strong style={{ fontSize: 13 }}>
                    BỘ KHOA HỌC VÀ CÔNG NGHỆ
                  </strong>
                  <br />
                  <strong style={{ fontSize: 14 }}>CỤC SỞ HỮU TRÍ TUỆ</strong>
                  <div
                    style={{
                      borderBottom: "1px solid #333",
                      width: "120px",
                      margin: "5px auto",
                    }}
                  />
                </div>

                <div style={{ textAlign: "center", marginBottom: 30 }}>
                  <h2
                    style={{ fontSize: 20, color: "#0d47a1", margin: "10px 0" }}
                  >
                    VĂN BẰNG BẢO HỘ NHÃN HIỆU
                  </h2>
                  <strong>
                    Số quyết định: {pdfMetaData.shttCode || "4-2026-11111"}
                    /QĐ-SHTT
                  </strong>
                  <br />
                  <span>
                    Trạng thái: <strong>ĐANG HIỆU LỰC</strong>
                  </span>
                </div>

                <div style={{ fontSize: 14 }}>
                  <p>
                    <strong>1. Nhãn hiệu bảo hộ:</strong>{" "}
                    <span
                      style={{
                        color: "#d32f2f",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {pdfMetaData.trademarkName}
                    </span>
                  </p>
                  <p>
                    <strong>2. Phân loại nhóm SHTT:</strong>{" "}
                    {pdfMetaData.shttType === "PRIMARY_BRAND"
                      ? "Nhãn hiệu chính (Primary Brand)"
                      : pdfMetaData.shttType === "SECONDARY_BRAND"
                        ? "Nhãn hiệu phụ (Secondary Brand)"
                        : "Kiểu dáng công nghiệp"}
                  </p>
                  <p>
                    <strong>3. Chủ văn bằng bảo hộ:</strong> {pdfMetaData.owner}
                  </p>
                  <p>
                    <strong>4. Địa chỉ chủ sở hữu:</strong> Tòa nhà MPlaza
                    Saigon, 39 Lê Duẩn, Bến Nghé, Quận 1, TP. HCM
                  </p>
                  <p>
                    <strong>5. Nhóm sản phẩm mang nhãn hiệu:</strong> Nhóm 30
                    (Gia vị, nước tương, nước mắm, mì ăn liền, thực phẩm đóng
                    hộp)
                  </p>
                  <p>
                    <strong>6. Ngày nộp đơn đăng ký:</strong> Ngày 10 tháng 01
                    năm 2024
                  </p>
                  <p>
                    <strong>7. Ngày cấp văn bằng chính thức:</strong> Ngày 15
                    tháng 06 năm 2024
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 50,
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      border: "2px solid #52c41a",
                      color: "#52c41a",
                      padding: "6px 12px",
                      borderRadius: 4,
                      transform: "rotate(-5deg)",
                      alignSelf: "center",
                    }}
                  >
                    CỤC SỞ HỮU TRÍ TUỆ
                    <br />
                    <strong>ĐÃ XÁC THỰC CẤP PHÉP</strong>
                  </div>
                  <div style={{ width: "200px" }}>
                    <span>
                      <em>Hà Nội, ngày 15 tháng 06 năm 2024</em>
                    </span>
                    <br />
                    <strong>CỤC TRƯỞNG CỤC SHTT</strong>
                    <br />
                    <strong
                      style={{
                        display: "block",
                        marginTop: 10,
                        color: "#d32f2f",
                      }}
                    >
                      ĐÃ KÝ SỐ / SIGNED
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {pdfDocType === "HSCB" && pdfMetaData && (
              <div>
                {/* BẢN TỰ CÔNG BỐ SẢN PHẨM / CHỨNG NHẬN ATTP */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <strong style={{ fontSize: 13 }}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </strong>
                  <br />
                  <strong
                    style={{
                      fontSize: 12,
                      borderBottom: "1px solid #333",
                      paddingBottom: 2,
                    }}
                  >
                    Độc lập - Tự do - Hạnh phúc
                  </strong>
                </div>

                <div style={{ textAlign: "center", marginBottom: 30 }}>
                  <h2
                    style={{ fontSize: 18, color: "#1b5e20", margin: "10px 0" }}
                  >
                    BẢN TỰ CÔNG BỐ SẢN PHẨM
                  </h2>
                  <span>
                    Theo Nghị định số 15/2018/NĐ-CP quy định chi tiết thi hành
                    Luật An toàn thực phẩm
                  </span>
                </div>

                <div style={{ fontSize: 14 }}>
                  <p>
                    <strong>
                      I. Thông tin về tổ chức tự công bố sản phẩm:
                    </strong>
                  </p>
                  <div style={{ paddingLeft: 20 }}>
                    <p>
                      - Tên tổ chức:{" "}
                      <strong>
                        {pdfMetaData.name ||
                          "Công ty Cổ phần Hàng tiêu dùng Masan"}
                      </strong>
                    </p>
                    <p>
                      - Địa chỉ:{" "}
                      {pdfMetaData.address || "39 Lê Duẩn, Quận 1, TP. HCM"}
                    </p>
                    <p>
                      - Số điện thoại liên hệ:{" "}
                      {pdfMetaData.contact || "028-62563862"}
                    </p>
                    <p>
                      - Số Giấy chứng nhận cơ sở đủ điều kiện ATTP:{" "}
                      <strong>{pdfMetaData.attpNo || "ATTP-2026-9081A"}</strong>
                    </p>
                  </div>

                  <p>
                    <strong>II. Thông tin về sản phẩm công bố:</strong>
                  </p>
                  <div style={{ paddingLeft: 20 }}>
                    <p>
                      - Tên sản phẩm:{" "}
                      <strong>
                        {pdfMetaData.productName || "Sản phẩm Masan"}
                      </strong>
                    </p>
                    <p>- Hạn sử dụng: 12 tháng kể từ ngày sản xuất</p>
                    <p>- Quy cách bao bì đóng gói tiêu chuẩn.</p>
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 100,
                    right: 80,
                    textAlign: "center",
                  }}
                >
                  <span>
                    <em>Ngày công bố: 12 tháng 03 năm 2026</em>
                  </span>
                  <br />
                  <strong>ĐẠI DIỆN HỢP PHÁP DOANH NGHIỆP</strong>
                  <br />
                  <strong
                    style={{
                      display: "block",
                      marginTop: 10,
                      color: "#d32f2f",
                    }}
                  >
                    ĐÃ KÝ SỐ / SIGNED
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default TraceBackwardList;
