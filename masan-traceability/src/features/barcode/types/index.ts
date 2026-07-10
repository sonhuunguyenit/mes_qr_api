import { Spec } from '../../spec/types';

export interface Barcode {
  BarcodeId: string;      // PK
  BarcodeNumber: string;  
  SpecId: string;         // FK -> Spec
  Spec?: Spec;
  BarcodeItems?: Barcode_Item[];
}

export interface Barcode_Item {
  BarcodeItemId: string;  // PK
  BarcodeId: string;      // FK -> Barcode
  ItemCode: string;       
  Barcode?: Barcode;
}
