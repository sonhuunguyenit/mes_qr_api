// ==========================================
// ENUMS
// ==========================================
export enum SpecType { SPEC = 'SPEC', TCCS = 'TCCS' }
export enum PartnerType { NCC = 'NCC', NSX = 'NSX' }
export enum DocType {
COA = 'COA', // Giấy chứng nhận phân tích chất lượng của từng lô hàng nhập thực tế (COA)
SPECIFICATION = 'SPECIFICATION', // Bản đặc tính kỹ thuật/tiêu chuẩn của NVL do nhà cung cấp ban hành (Specification)
HSCB = 'HSCB', // Tài liệu pháp lý lưu hành sản phẩm của NCC (HSCB)
TCCS = 'TCCS', // Tiêu chuẩn cơ sở (TCCS) của nhà cung cấp
DI_UNG = 'DI_UNG', // Biểu mẫu thông tin dị ứng do nhà cung cấp điền và cập nhật (Cảnh báo dị ứng)
DINH_DUONG = 'DINH_DUONG', // Bảng thông tin hàm lượng dinh dưỡng của nguyên liệu (Thông tin dinh dưỡng)
HDSD = 'HDSD', // Hướng dẫn sử dụng
HD_BAO_QUAN = 'HD_BAO_QUAN', // Hướng dẫn bảo quản
CERTIFICATE = 'CERTIFICATE', // Các chứng nhận chất lượng (ISO, HACCP, HALAL...)
CO_KQKN = 'CO_KQKN', // Chứng nhận C/O hoặc Kết quả kiểm nghiệm tại nước xuất xứ (KQ KN)
KIEM_DICH = 'KIEM_DICH', // Giấy kiểm dịch / kiểm định
OTHER = 'OTHER' // Loại giấy tờ khác (OTHER)
}

export enum DocStatus { PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED' }
export enum LicenseType { GPKD = 'GPKD', ATVSTP = 'ATVSTP' } // Giấy phép kinh doanh / An toàn VSTP
export enum FacilityType { CONG_TY = 'CONG_TY', NHA_MAY = 'NHA_MAY' }
export enum FacilityRole { THUONG_NHAN_CONG_BO = 'THUONG_NHAN_CONG_BO', NHA_MAY_SAN_XUAT = 'NHA_MAY_SAN_XUAT' }
export enum AppliedStandardType {
TCVN = 'TCVN', // Tiêu chuẩn quốc gia Việt Nam (Ví dụ: TCVN 5786:2009)
QCVN = 'QCVN', // Quy chuẩn kỹ thuật quốc gia (Ví dụ: QCVN 8-1:2011/BYT)
}

// ==========================================
// 0. MODULE DANH MỤC VẬT TƯ / SẢN PHẨM (ITEM MASTER)
// ==========================================
export interface Item {
ItemCode: string; // PK
ItemName: string;
ItemType: "FG" | "IP" | "RM" | "PG"; // FG: Thành phẩm, IP: Bán thành phẩm, RM: Nguyên liệu, PG: Bao bì
UoM: string; // Đơn vị tính (Chai, Gói, Lít, Kg...)
VersionERP?: number;
VersionStorage?: number;

// -- Quan hệ 1-N --
ItemVersions?: Item_Version[];
}

export interface Item_Version {
ItemVersionId: string; // PK
ItemCode: string; // FK -> Item
Version: number; // Số phiên bản (Ví dụ: 1, 2, 3...)
VersionName: string; // Tên phiên bản (Ví dụ: "Bản tự công bố gốc - 2026")
ChangeDescription?: string; // Nội dung thay đổi so với phiên bản trước
Status: DocStatus; // Trạng thái phê duyệt phiên bản
ValidFrom: Date;
ValidTo?: Date;
ModifiedBy?: string;
ModifiedAt?: Date;

// -- Quan hệ N-1 --
Item?: Item;
}

// ==========================================
// 1. MODULE TIÊU CHUẨN (SPEC / TCCS)
// ==========================================
export interface Spec {
SpecId: string; // PK (ví dụ: 'SPEC-FG001-V1')
SpecType: SpecType;  
 SpecCode: string;  
 QloneCode?: string;  
 SpecName: string;
FileURL: string;
ValidFrom: Date;
ValidTo?: Date;
Status: DocStatus;

// -- Quan hệ 1-N --
SpecItems?: Spec_Item[];
Hscbs?: Hscb[]; // 1 TCCS đẻ ra N bộ HSCB
Barcodes?: Barcode[]; // 1 TCCS xin được N mã Barcode
}

export interface Spec_Item {
SpecItemId: string; // PK
ItemCode: string;  
 SpecId: string; // FK -> Spec

// -- Quan hệ N-1 --
Spec?: Spec;
}

// ==========================================
// 2. MODULE HỒ SƠ CÔNG BỐ (HSCB)
// ==========================================
export interface Hscb {
HscbId: string; // PK (ví dụ: 'HSCB-FG001')
HscbCode: string;  
 SpecId: string; // FK -> Spec
LegalProductName?: string; // Tên sản phẩm công bố (Ví dụ: Nước mắm Nam Ngư Đệ Nhị)
Spec?: Spec;

// -- Quan hệ 1-N --
HscbVersions?: Hscb_Version[]; // 1 HSCB có nhiều phiên bản (Nhãn gốc, Mùa hè...)
}

export interface Hscb_Version {
HscbVersionId: string; // PK (ví dụ: 'HSCB-FG001-V1')
HscbId: string; // FK -> Hscb
VersionName: string;  
 FileURL: string;
ValidFrom: Date;
ValidTo?: Date;
Status: DocStatus;
AttpCode?: string; // Số giấy ATTP
ArtworkCode?: string; // Mã kiểm soát AW (Artwork)

// -- Quan hệ N-1 --
Hscb?: Hscb;

// -- Quan hệ 1-N --
HscbItems?: Hscb_Item[];
AppliedStandards?: Hscb_AppliedStandard[]; // Danh sách TCVN/QCVN áp dụng cho phiên bản nhãn này
}

export interface Hscb_Item {
HscbItemId: string; // PK
HscbVersionId: string; // FK -> Hscb_Version
ItemCode: string;

// -- Quan hệ N-1 --
HscbVersion?: Hscb_Version;
}

export interface Hscb_AppliedStandard {
Id: string; // PK
HscbVersionId: string; // FK -> Hscb_Version
StandardType: AppliedStandardType; // Phân loại: TCVN | QCVN
StandardCode: string; // Mã tiêu chuẩn (Ví dụ: "QCVN 8-1:2011/BYT", "TCVN 5786:2009")
Description: string; // Mô tả ngắn (Ví dụ: "Quy chuẩn kỹ thuật quốc gia đối với giới hạn ô nhiễm độc tố vi nấm...")

// -- Quan hệ N-1 --
HscbVersion?: Hscb_Version;
}

// ==========================================
// 2.5 MODULE SỞ HỮU TRÍ TUỆ (SHTT) - NỐI VỚI ITEM [3], [4]
// ==========================================
export interface Hscb_Shtt {
HscbShttId: string; // PK
HscbVersionId: string; // FK -> Trỏ về đích danh phiên bản Nhãn mác/HSCB chứa cái SHTT này
ShttCode: string; // Số đơn SHTT (Rã ra từ file file PDF nhãn)
ShttType: string; // Enum: 'PRIMARY_BRAND' (Nhãn chính) | 'SECONDARY_BRAND' (Nhãn phụ) | 'INDUSTRIAL_DESIGN' (Kiểu dáng công nghiệp)
}

// ==========================================
// 3. MODULE CHỨNG TỪ NHÀ CUNG CẤP (DOCS)
// ==========================================
export interface Partner {
PartnerId: string; // PK
PartnerType: PartnerType;
PartnerCode: string;  
 PartnerName: string;
Email?: string;  
 Status: DocStatus;

// -- Quan hệ 1-N --
Docs?: Doc[]; // 1 Đối tác cung cấp nhiều Chứng từ
}

export interface Doc {
DocId: string;  
 PartnerId: string;  
 DocCode: string;  
 Version: string;
DocType: DocType;
DocName: string;
FileURL: string;
ValidFrom: Date;
ValidTo?: Date;
Status: DocStatus;

// -- Quan hệ N-1 --
Partner?: Partner;

// -- Quan hệ 1-N --
DocItems?: Doc_Item[];
}

export interface Doc_Item {
DocItemId: string; // PK
DocId: string; // FK -> Doc
ItemCode: string;

// -- Quan hệ N-1 --
Doc?: Doc;
}

// ==========================================
// 4. MODULE BARCODE (MÃ VẠCH GS1)
// ==========================================
export interface Barcode {
BarcodeId: string; // PK
BarcodeNumber: string;  
 SpecId: string; // FK -> Spec

// -- Quan hệ N-1 --
Spec?: Spec;

// -- Quan hệ 1-N --
BarcodeItems?: Barcode_Item[];
}

export interface Barcode_Item {
BarcodeItemId: string; // PK
BarcodeId: string; // FK -> Barcode
ItemCode: string;

// -- Quan hệ N-1 --
Barcode?: Barcode;
}

// ==========================================
// 5. MODULE GIAO DỊCH BOM (MẺ NẤU THỰC TẾ)
// ==========================================

/\*

- NOTE: LOGIC LIÊN KẾT, ĐỒNG BỘ & NÂNG CẤP BOM (QUY TẮC NGHIỆP VỤ)
- ***
- 1.  Phân loại & Hồ sơ tự công bố (HSCB):
- - CHỈ có Thành phẩm (TP) mới có hồ sơ tự công bố (HSCB).
- - Tiêu chuẩn cơ sở (TCCS): Chỉ dành cho Thành phẩm (TP).
- - Tiêu chuẩn kiểm định (TCKD / SPEC): Dành cho tất cả các loại Item (TP, BTP, NVL, BAOBI, Rework).
- - Do đó, cột Selected_HscbVersionId ở bảng Bom (BOM Cha) dùng để lưu HSCB của cha (chỉ điền khi cha là TP, BTP/NVL thì để NULL).
- - Các nguyên liệu con (NVL, BAOBI, BTP) trong Bom_Line sẽ KHÔNG có HSCB (để trống), trừ khi nguyên liệu con là một TP khác có HSCB riêng.
-
- 2.  Cơ chế Đồng bộ & Nâng cấp (Upgrade BOM):
- - ERP quản lý định mức nguyên liệu thô. Đồng bộ ERP sẽ đối chiếu ErpVersion vs Version hiện tại của BOM.
- - Nếu khác nhau (ERP cao hơn) -> Cảnh báo nâng cấp lên UI.
- - Khi người dùng bấm "Nâng cấp": Tạo bản ghi mới trong bảng Bom (chung ItemCode, tăng Version, cập nhật ErpVersion mới).
- - Bản ghi BOM mới sẽ tự động kế thừa (copy) cấu hình SpecId và HscbVersionId của các dòng nguyên liệu con từ bản ghi cũ.
-
- 3.  Hiệu lực BOM:
- - Sử dụng trường ValidFrom và ValidTo trên bảng Bom để xác định phiên bản BOM nào đang hoạt động tại thời điểm sản xuất thực tế.
-
- 4.  Bài toán Đệ quy Vô hạn (BOM trong BOM - Cây nhiều cấp):
- - Một TP có thể chứa TP con hoặc BTP con, tạo thành cây BOM nhiều cấp.
- - Để tránh đệ quy vô hạn hoặc treo hệ thống, giới hạn tối đa hiển thị trên cây là 7 cấp (MAX 7 LEVELS).
- - Nếu muốn xem sâu hơn (cấp 8+), hệ thống hiển thị nút điều hướng (link) để người dùng mở xem độc lập từ cấp 7 thay vì đệ quy tiếp.
    \*/

export interface Bom {
BomId: string; // PK
ItemCode: string; // Mã ERP Thành phẩm / Bán thành phẩm (BOM Cha)
ErpVersion: string; // Phiên bản định mức hiện tại trên ERP
Version: string; // Phiên bản hiện tại trên hệ thống
Selected_HscbVersionId?: string; // FK -> Hscb_Version (HSCB của cha, chỉ điền khi cha là TP)
ValidFrom: Date; // Ngày bắt đầu hiệu lực
ValidTo?: Date; // Ngày hết hiệu lực

// -- Quan hệ 1-N --
BomLines?: Bom_Line[]; // 1 BOM có nhiều Nguyên liệu (BOM Con)
}

export interface Bom_Line {
BomLineId: string; // PK
BomId: string; // FK -> Bom
ErpItemCode: string; // Mã NVL/Bao bì/BTP đổ vào nồi

Selected_SpecId: string;
Selected_SpecCode: string;

Selected_HscbVersionId?: string; // FK -> Hscb_Version (Chỉ chọn khi con là TP có HSCB riêng)

// -- Quan hệ N-1 --
Bom?: Bom;
}

// ==========================================
// Dùng để làm cấu hình chuẩn cho hệ thống đọc file Excel
// ==========================================
export interface Template_Master {
TemplateId: string; // PK (VD: 'TPL_001')
TemplateCode: string; // Mã template (VD: 'TEMPLATE_DI_UNG')
TemplateName: string; // Tên template
TemplateType: 'DI_UNG' | 'DINH_DUONG';
ItemCount: number;
LastUpdated: Date;
FileURL: string;
Status: DocStatus; // Trạng thái duyệt của cấu hình Template này
}

export interface Allergen_Master {
AllergenCode: string; // PK (VD: 'AL_SUA', 'AL_DAUNANH', 'AL_HAI_SAN')
AllergenName: string; // Tên chất dị ứng (VD: 'Sữa và các sản phẩm từ sữa')
ExcelCellRef?: string; // (Tùy chọn) Cấu hình tọa độ ô Excel để code BE parse tự động (VD: 'C5')
}

export interface Nutrition_Master {
NutritionCode: string; // PK (VD: 'NU_CALO', 'NU_FAT', 'NU_SODIUM')
NutritionName: string; // Tên chỉ tiêu (VD: 'Năng lượng', 'Chất béo', 'Natri')
Unit: string; // Đơn vị đo (VD: 'kcal/100g', 'g', 'mg')
ExcelCellRef?: string; // Tọa độ ô Excel chứa dữ liệu
}

// ==========================================
// Kết nối trực tiếp giữa Item + NCC + Document chứa bằng chứng
// ==========================================
export interface Item_Partner_Allergen {
ItemPartnerAllergenId: string; // PK
ItemCode: string; // Mã ERP Thành phẩm / NVL
PartnerId: number; // FK -> Bảng Partner (Nhà cung cấp)
DocId: number; // FK -> Bảng Doc (Link thẳng về file Excel gốc mà NCC đã up để làm bằng chứng)

AllergenCode: string; // FK -> Allergen_Master (Nhặt được dấu tick nào thì Insert mã đó vào đây)

// Quan hệ N-1 để Query cho mượt
Partner?: Partner;
Doc?: Doc;
Allergen?: Allergen_Master;
}

export interface Item_Partner_Nutrition {
ItemPartnerNutritionId: string; // PK
ItemCode: string;  
 PartnerId: number; // FK -> Partner
DocId: number; // FK -> Doc

NutritionCode: string; // FK -> Nutrition_Master
DeclaredValue: string; // Giá trị NCC khai báo rã từ ô Excel ra (VD: '319.3', '5.6')

// Quan hệ N-1
Partner?: Partner;
Doc?: Doc;
Nutrition?: Nutrition_Master;
}

| **DANH MỤC DỊ ỨNG** | | |
| | | |
| Dị ứng | Có | |
| Sữa và sản phẩm từ sữa | X | ← C0 |
| Trứng | | ← C1 |
| Cá | | ← C2 |
| Động vật giáp xác | | ← C3 |
| Đậu phộng | | ← C4 |
| Đậu nành và sản phẩm từ đậu nành | X | ← C5 |
| Lúa mì (Gluten) | | ← C6 |
| Hạt cây (Tree Nuts) | | ← C7 |
| Mè (Sesame) | | ← C8 |
| Sulfite | | ← C9 |

| **THÀNH PHẦN DINH DƯỠNG** | | | |
| Chỉ tiêu | Đơn vị | Giá trị | |
| Năng lượng | kcal/100g | 364.5 | ← D5 |
| Protein | g/100g | 10.2 | ← D6 |
| Carbohydrate | g/100g | 75.8 | ← D7 |
| Đường | g/100g | 1.5 | ← D8 |
| Chất béo | g/100g | 0.8 | ← D9 |
| Chất béo bão hòa | g/100g | 0.1 | ← D10 |
| Chất xơ | g/100g | 3.6 | ← D11 |
| Natri | mg/100g | 15 | ← D12 |

// ==========================================
// 6. MODULE PHÁP LÝ DOANH NGHIỆP (LEGAL ENTITY)
// ==========================================
export interface Facility {
FacilityId: string; // PK
FacilityCode: string; // Mã nội bộ, VD: VCF, MSD...
FacilityName: string; // Tên doanh nghiệp / Tên nhà máy
FacilityType: FacilityType;

// -- Quan hệ 1-N --
Licenses?: Facility_License[];
HscbMappings?: Hscb_Facility_Mapping[];
}

export interface Facility_License {
LicenseId: string; // PK
FacilityId: string; // FK trỏ về Facility
LicenseType: LicenseType; // Dùng lại LicenseType có sẵn: GPKD / ATVSTP
LicenseNo: string; // Số giấy phép
Address: string; // Địa chỉ trên giấy phép tại thời điểm đó
ValidFrom: Date; // Ngày bắt đầu hiệu lực
ValidTo?: Date; // Ngày hết hạn giấy phép
FileURL: string; // File scan PDF của giấy phépư

// -- Quan hệ N-1 --
Facility?: Facility;
}

export interface Hscb_Facility_Mapping {
HscbId: string; // FK trỏ về Hscb
FacilityId: string; // FK trỏ về Facility
Role: FacilityRole; // Enum: THUONG_NHAN_CONG_BO hoặc NHA_MAY_SAN_XUAT

// -- Quan hệ N-1 --
Hscb?: Hscb;
Facility?: Facility;
}

// ==========================================
// 9. MODULE TRUY XUẤT NGUYÊN VẬT LIỆU (LOT & API PARSING)
// ==========================================
// _ Lưu ý: Danh sách Lot của nguyên vật liệu được lấy bằng cách gọi API qua hệ thống ERP/Kho.
// _ Quy tắc phân rã chuỗi LotCode (Ví dụ: "240526ABC12345"):
// - 6 ký tự đầu (240526): Ngày nhận hàng nội bộ tại kho (YYMMDD - ngày 26/05/2024), tuyệt đối KHÔNG được hiểu ngầm đây là NSX của nguyên vật liệu.
// - Cụm ký tự tiếp theo (ABC): Mã viết tắt đối tác Nhà cung cấp. Backend sẽ đối chiếu với bảng "Từ điển danh mục Nhà cung cấp" để nội suy tên đầy đủ (Ví dụ: Công ty TNHH ABC).
// - Phần đuôi còn lại (12345): Số lô gốc của nhà cung cấp (Vendor Lot).
export interface Item_Lot {
ItemCode: string;
ItemName: string;
AvailableLots: Lot_Info[];
}

export interface Lot_Info {
LotCode: string; // Số lô nhận diện (Ví dụ: "240526ABC12345")
LotType: "NVL" | "BAOBI";
}

export interface Erp_Transaction_Response {
status: "success" | "error";
message: string;
data: {
ItemCode: string;
LotCode: string;
TransactionInfo: {
NSX_ThanhPham: string | null; // Sẽ có giá trị nếu ItemCode là Thành Phẩm
NSX_NVL_BaoBi: string; // Ngày sản xuất gốc của lô NVL này
HSD: string; // Hạn sử dụng của lô hàng
SoLuongDaSanXuat_ThanhPham: number; // Tổng SL đã sản xuất (áp dụng cho Thành Phẩm)
SoLuongDaNhapKho_NVL_BaoBi: number; // SL NVL/Bao bì thực tế đã nhập vào kho
SoLuongDaNhapKhau: number; // SL nhập khẩu (nếu là hàng nhập khẩu)
SoLuongDaTieuThu_ThanhPham: number; // SL Thành Phẩm đã xuất bán đi (áp dụng cho Thành Phẩm)
}
}
}
