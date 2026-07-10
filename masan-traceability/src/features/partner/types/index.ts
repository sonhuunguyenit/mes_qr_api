import { DocStatus } from "../../doc/types";
export { DocStatus };

export enum PartnerType {
  NCC = 'NCC',
  NSX = 'NSX'
}

export interface Partner {
  PartnerId: string;      // PK

  PartnerType: PartnerType; 
  PartnerCode: string;    
  PartnerName: string;
  Email?: string;         // Email liên hệ của đối tác
  Status?: DocStatus;
  Docs?: any[]; // avoid circular dependency or import dynamically from doc
}

export interface PartnerItemMapping {
  MappingId: string;
  ItemCode: string;
  PartnerId: string; // References PartnerId
}

