import { Spec } from "../../spec/types";
import { IpmsStatus } from "../../../enums";
import { DocStatus } from "../../doc/types";

export interface Hscb {
  HscbId: string; // PK
  HscbCode: string;
  SpecId: string; // FK -> Spec
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

  Hscb?: Hscb;
  HscbItems?: Hscb_Item[];
}

export interface Hscb_Item {
  HscbItemId: string; // PK
  HscbVersionId: string; // FK -> Hscb_Version
  ItemCode: string;
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
