import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { poService } from "~/services/po/po.service";
import { POFilterParams } from "~/services/po/po.type";
import {
  PO_STATUS_DISPLAY,
  PO_REFERENCE_SOURCE_DISPLAY,
  PO_BUDGET_STATUS_DISPLAY,
} from "~/enums";

export const usePOFilterOptions = () => {
  return useQuery({
    queryKey: ["po-filter-options"],
    queryFn: async () => {
      const results = await Promise.allSettled([poService.getCompanies()]);

      const getArray = (res: any): any[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (res?.data && Array.isArray(res.data)) return res.data;
        if (res?.success && Array.isArray(res.data)) return res.data;
        return [];
      };

      const companyData =
        results[0].status === "fulfilled" ? results[0].value : [];

      const companies = getArray(companyData).map(
        (item: Record<string, any>) => ({
          label: item.name || item.code,
          value: item.id,
        }),
      );

      return {
        statuses: PO_STATUS_DISPLAY,
        budgetStatuses: PO_BUDGET_STATUS_DISPLAY,
        referenceSources: PO_REFERENCE_SOURCE_DISPLAY,
        companies: [{ label: "Tất cả", value: undefined }, ...companies],
      };
    },
  });
};

export const usePOList = (params: POFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["po-list", params],
    queryFn: ({ pageParam = 1 }) =>
      poService.getPOList({
        ...params,
        pageIndex: pageParam as number,
      }),
    getNextPageParam: (lastPage: any, allPages) => {
      const total = lastPage.data?.[1] || 0;
      const currentCount = allPages.reduce(
        (acc, page) => acc + (page.data?.[0]?.length || 0),
        0,
      );
      return currentCount < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const usePODetail = (id: string) => {
  return useQuery({
    queryKey: ["po-detail", id],
    queryFn: () => poService.getPODetail(id),
    enabled: !!id,
    select: (res) => res.data,
  });
};

export const useUoms = () => {
  return useQuery({
    queryKey: ["uoms"],
    queryFn: () => poService.getUoms(),
    select: (res: any) => {
      return res.data || [];
    },
  });
};
