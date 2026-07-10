import type { Doc, Doc_Item } from "../../doc/types";
import { DocStatus, DocType } from "../../doc/types";
import type { Partner } from "../../partner/types";
import { PartnerType } from "../../partner/types";
import type { Barcode, Barcode_Item } from "../../barcode/types";

export type { Doc, Doc_Item, Partner, Barcode, Barcode_Item };
export { DocStatus, DocType, PartnerType };

export enum SpecType {
  SPEC = "SPEC",
  TCCS = "TCCS",
}

export interface Spec {
  SpecId: string; // PK
  SpecType: SpecType;
  SpecCode: string;
  QloneCode?: string;
  SpecName: string;
  FileURL: string;
  ValidFrom: Date | string;
  ValidTo?: Date | string | null;
  Status?: DocStatus;

  SpecItems?: Spec_Item[];
  Hscbs?: any[]; // avoid circular dependency
  Barcodes?: Barcode[];
}

export interface Spec_Item {
  SpecItemId: string; // PK
  ItemCode: string;
  SpecId: string; // FK -> Spec
  Spec?: Spec;
}
