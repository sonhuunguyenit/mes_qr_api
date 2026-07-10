import { Hscb_Shtt } from "../features/shtt/types";
import { ShttType, IpmsStatus } from "../enums";

export const mockShttMappings: Hscb_Shtt[] = [
  // 1-6
  {
    HscbShttId: "SHTT-M-001",
    HscbVersionId: "HSCB-VERSION-001",
    ShttCode: "4-2026-11111",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-001-V2",
    HscbVersionId: "HSCB-VERSION-001-V2",
    ShttCode: "4-2026-11111",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-002",
    HscbVersionId: "HSCB-VERSION-002",
    ShttCode: "4-2026-22222",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-002-V2",
    HscbVersionId: "HSCB-VERSION-002-V2",
    ShttCode: "4-2026-22222",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-003",
    HscbVersionId: "HSCB-VERSION-003",
    ShttCode: "4-2026-33333",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-004",
    HscbVersionId: "HSCB-VERSION-004",
    ShttCode: "4-2026-44444",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-004-V2",
    HscbVersionId: "HSCB-VERSION-004-V2",
    ShttCode: "4-2026-44444",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-005",
    HscbVersionId: "HSCB-VERSION-005",
    ShttCode: "4-2026-55555",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-006",
    HscbVersionId: "HSCB-VERSION-006",
    ShttCode: "4-2026-66666",
    ShttType: ShttType.PRIMARY_BRAND,
  },

  // 7-12 (Double size!)
  {
    HscbShttId: "SHTT-M-007",
    HscbVersionId: "HSCB-VERSION-007",
    ShttCode: "4-2026-77777",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-008",
    HscbVersionId: "HSCB-VERSION-008",
    ShttCode: "4-2026-88888",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-009",
    HscbVersionId: "HSCB-VERSION-009",
    ShttCode: "4-2026-99999",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-010",
    HscbVersionId: "HSCB-VERSION-010",
    ShttCode: "4-2026-10101",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-011",
    HscbVersionId: "HSCB-VERSION-011",
    ShttCode: "4-2026-12121",
    ShttType: ShttType.PRIMARY_BRAND,
  },
  {
    HscbShttId: "SHTT-M-012",
    HscbVersionId: "HSCB-VERSION-012",
    ShttCode: "4-2026-13131",
    ShttType: ShttType.PRIMARY_BRAND,
  },
];

export const mockIpmsInfo: Record<
  string,
  {
    Trademark_Name: string;
    Owner: string;
    Certificate_URL: string;
    Status: IpmsStatus;
  }
> = {
  "4-2026-11111": {
    Trademark_Name: "CHIN-SU Tỏi Ớt",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_chinsu_toi_ot.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-22222": {
    Trademark_Name: "OMACHI Xốt Bò Hầm",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_omachi_bo_ham.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-33333": {
    Trademark_Name: "NAM NGƯ Đệ Nhị",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_nam_ngu_de_nhi.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-44444": {
    Trademark_Name: "CHIN-SU Siêu Cay",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_chinsu_sieu_cay.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-55555": {
    Trademark_Name: "KOKOMI",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_kokomi.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-66666": {
    Trademark_Name: "VĨNH HẢO",
    Owner: "Công ty Cổ phần Nước khoáng Vĩnh Hảo",
    Certificate_URL: "/files/shtt_vinh_hao.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-77777": {
    Trademark_Name: "CHIN-SU Tương Cà",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_chinsu_tuong_ca.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-88888": {
    Trademark_Name: "KOKOMI Xốt Cay",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_kokomi_xot_cay.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-99999": {
    Trademark_Name: "NAM NGƯ Nhãn Vàng",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_nam_ngu_nhan_vang.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-10101": {
    Trademark_Name: "MINH TRUNG Cháo Sen",
    Owner: "Công ty Cổ phần Thực phẩm Minh Trung",
    Certificate_URL: "/files/shtt_minh_trung.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-12121": {
    Trademark_Name: "CHIN-SU Hạt Nêm",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_chinsu_hat_nem.pdf",
    Status: IpmsStatus.VALID,
  },
  "4-2026-13131": {
    Trademark_Name: "COMPACT",
    Owner: "Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)",
    Certificate_URL: "/files/shtt_compact.pdf",
    Status: IpmsStatus.VALID,
  },
};
