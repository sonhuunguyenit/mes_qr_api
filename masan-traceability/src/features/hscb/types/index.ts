import { Spec } from "../../spec/types";
import { IpmsStatus } from "../../../enums";
import { DocStatus } from "../../doc/types";

export interface Hscb {
  HscbId: string; // PK
  HscbCode: string;
  SpecId: string; // FK -> Spec
  LegalProductName?: string; // Tên sản phẩm công bố
  declaringFacilityId?: string; // Thương nhân công bố
  producingFacilityIds?: string[]; // Sản xuất tại (Danh sách các nhà máy)
  Spec?: Spec;
  HscbVersions?: Hscb_Version[];
}

export interface Hscb_Version {
  HscbVersionId: string; // PK
  HscbId: string; // FK -> Hscb
  VersionName: string;
  FileURL: string;
  ValidFrom: Date | string;
  ValidTo?: Date | string | null;
  Status: DocStatus;
  AttpCode?: string; // Số giấy ATTP
  ArtworkCode?: string; // Mã kiểm soát AW (Artwork)
  AppliedStandards?: Hscb_AppliedStandard[];

  Hscb?: Hscb;
  HscbItems?: Hscb_Item[];
}

export interface Hscb_Item {
  HscbItemId: string; // PK
  HscbVersionId: string; // FK -> Hscb_Version
  ItemCode: string;
  HscbVersion?: Hscb_Version;
}

export interface Hscb_AppliedStandard {
  Id: string; // PK
  HscbVersionId: string; // FK -> Hscb_Version
  StandardType: string; // "TCVN" | "QCVN"
  StandardCode: string;
  Description: string;
  HscbVersion?: Hscb_Version;
}

// IPMS SHTT response info
export interface IpmsInfo {
  Application_No: string;
  Trademark_Name: string;
  Owner: string;
  Certificate_URL: string;
  Status: IpmsStatus;
}
