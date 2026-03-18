export interface InboundItem {
  id: string;
  inboundNumber: string;
  sapShipmentNumber: string;
  shippingType: string;
  shipmentCostNumber: string;
  supplierName: string;
  dateArrivalPort: string;
  dateArrivalWarehouse: string;
  createdAt: string;
  createdByName: string;
  statusName: string;
  status?: string;
  statusColor?: string;
  tagStatusColor?: string;
  statusStyle?: any;
  statusDotStyle?: any;
}

export interface InboundFilterParams {
  pageIndex?: number;
  pageSize?: number;
  inboundNumber?: string;
  sapShipmentNumber?: string;
  shippingType?: string;
  shipmentCostNumber?: string;
  supplierName?: string;
  dateArrivalPort?: Date;
  dateArrivalWarehouse?: Date;
  createdAt?: Date;
  createdByName?: string;
  statusName?: string;
}
