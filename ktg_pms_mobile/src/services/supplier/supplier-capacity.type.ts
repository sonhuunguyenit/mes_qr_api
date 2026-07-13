import { SupplierLawItem, SupplierLawDetail, SupplierLawFilterParams } from "./supplier-law.type";

export interface ProductService {
  name: string;
  supplyCapacityPerMonth: string;
  supplyCapacityPerMonth1?: string;
}

export interface Facility {
  name: string;
  totalAreaM2: string;
  avgWorkHour: string;
  officeAreaM2: string;
  productionAreaM2: string;
  rawMaterialAreaM2: string;
  finishedGoodsAreaM2: string;
}

export interface ProductionLine {
  step: string;
  equipmentName: string;
  quantity: string;
  commissioningYear: string;
  designCapacity: string;
  actualCapacity: string;
}

export interface Certification {
  name: string;
  fileAttachment: string;
}

export interface CapacityJson {
  paymentMethodName?: string;
  paymentTermName?: string;
  decider?: string;
  deciderPosition?: string;
  deciderPhone?: string;
  deciderFax?: string;
  deciderEmail?: string;
  deciderNote?: string;
  trader?: string;
  traderPosition?: string;
  traderPhone?: string;
  traderFax?: string;
  traderEmail?: string;
  traderNote?: string;
  lstProductService?: ProductService[];
  facilities?: Facility[];
  lstProductionLine?: ProductionLine[];
  lstCertification?: Certification[];
}

export interface SupplierCapacityItem extends SupplierLawItem {
  serviceName: string;
}

export interface SupplierCapacityDetail extends SupplierLawDetail {
  newJson: string; // JSON string of CapacityJson
  oldJson: string; // JSON string of CapacityJson
  jsonCapacity?: string; // Some Admin components use this instead of newJson
}

export interface SupplierCapacityFilterParams extends SupplierLawFilterParams {
  supplierCode?: string;
}
