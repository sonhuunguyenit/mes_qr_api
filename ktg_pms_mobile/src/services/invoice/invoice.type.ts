export interface InvoiceItem {
  id: string;
  code: string;
  fileXml: string;
  currencyName: string;
  invoiceValue: number;
  vat: number;
  totalInvoiceValue: number;
  createdAt: string;
  createdByName: string;
  statusId: string;
  statusName: string;
}

export interface InvoiceFilterParams {
  pageIndex?: number;
  pageSize?: number;
  billCode?: string;
  poId?: string;
  currencyName?: string;
  invoiceValue?: string;
  vat?: string;
  totalInvoiceValue?: string;
  statusName?: string;
}
