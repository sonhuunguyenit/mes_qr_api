import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "~/services/invoice/invoice.service";
import { InvoiceFilterParams } from "~/services/invoice/invoice.type";

export const useInvoiceList = (params: InvoiceFilterParams) => {
  return useQuery({
    queryKey: ["invoice-list", params],
    queryFn: () => invoiceService.getInvoiceList(params),
    select: (res: any) => {
      const [data, total] = res.data || [[], 0];
      return { data, total };
    },
  });
};
