import { DocStatus } from "../../doc/types";

export enum FacilityType {
  CONG_TY = "CONG_TY",
  NHA_MAY = "NHA_MAY",
}

export enum LicenseType {
  GPKD = "GPKD",
  ATVSTP = "ATVSTP",
}

export enum FacilityRole {
  THUONG_NHAN_CONG_BO = "THUONG_NHAN_CONG_BO",
  NHA_MAY_SAN_XUAT = "NHA_MAY_SAN_XUAT",
}

export interface Facility {
  FacilityId: string;
  FacilityCode: string;
  FacilityName: string;
  FacilityType: FacilityType;
  Licenses?: Facility_License[];
}

export interface Facility_License {
  LicenseId: string;
  FacilityId: string;
  LicenseType: LicenseType;
  LicenseNo: string;
  Address: string;
  ValidFrom: string;
  ValidTo?: string | null;
  FileURL: string;
}
