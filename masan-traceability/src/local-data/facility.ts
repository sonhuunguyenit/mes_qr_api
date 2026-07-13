import { Facility, FacilityType, LicenseType } from "../features/facility/types";

export const mockFacilities: Facility[] = [
  {
    FacilityId: "FAC-001",
    FacilityCode: "MSC",
    FacilityName: "Công ty Cổ phần Hàng tiêu dùng Masan",
    FacilityType: FacilityType.CONG_TY,
    Licenses: [
      {
        LicenseId: "LIC-001-GPKD",
        FacilityId: "FAC-001",
        LicenseType: LicenseType.GPKD,
        LicenseNo: "0305001234",
        Address: "Tầng 12, Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        ValidFrom: "2007-05-31",
        ValidTo: null,
        FileURL: "/files/gpkd_masan_consumer.pdf",
      },
    ],
  },
  {
    FacilityId: "FAC-002",
    FacilityCode: "NMBINHHUONG",
    FacilityName: "Nhà máy Masan Bình Dương",
    FacilityType: FacilityType.NHA_MAY,
    Licenses: [
      {
        LicenseId: "LIC-002-ATTP",
        FacilityId: "FAC-002",
        LicenseType: LicenseType.ATVSTP,
        LicenseNo: "123/2024/ATTP-BD",
        Address: "Khu công nghiệp Sóng Thần 1, Dĩ An, Tỉnh Bình Dương",
        ValidFrom: "2024-03-15",
        ValidTo: "2027-03-15",
        FileURL: "/files/attp_masan_binhduong.pdf",
      },
    ],
  },
  {
    FacilityId: "FAC-003",
    FacilityCode: "NMPHUQUOC",
    FacilityName: "Nhà máy Nước mắm Masan Phú Quốc",
    FacilityType: FacilityType.NHA_MAY,
    Licenses: [
      {
        LicenseId: "LIC-003-ATTP",
        FacilityId: "FAC-003",
        LicenseType: LicenseType.ATVSTP,
        LicenseNo: "456/2025/ATTP-PQ",
        Address: "Khu phố 1, Dương Đông, Phú Quốc, Tỉnh Kiên Giang",
        ValidFrom: "2025-06-20",
        ValidTo: "2028-06-20",
        FileURL: "/files/attp_masan_phuquoc.pdf",
      },
    ],
  },
];
