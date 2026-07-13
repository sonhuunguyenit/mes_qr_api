import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "~/constants";
import { bidService } from "~/services/bid/bid.service";
import {
  BID_PURPOSE_DISPLAY,
  BID_REFERENCE_DISPLAY,
  BID_STATUS_DISPLAY,
  BID_TYPE_DISPLAY,
} from "~/enums";
import {
  BidActionRequest,
  BidDetailData,
  BidFilterParams,
} from "~/services/bid/bid.type";

export const useBidFilterOptions = () => {
  return useQuery({
    queryKey: ["bid-filter-options"],
    queryFn: async () => {
      const [guaranteesRes, projectsRes, companiesRes] =
        await Promise.allSettled([
          bidService.getSettingString("masterBidGuarantee"),
          bidService.getProjects(),
          bidService.getCompanies(),
        ]);

      const getArray = (res: any) => {
        const body =
          res.status === "fulfilled" ? (res.value?.data ?? res.value) : [];
        return Array.isArray(body) ? body : body?.data || [];
      };

      const formatLabel = (item: any) => {
        const name = item.name || item.companyName;
        const code = item.code || item.companyCode;
        return code && name && code !== name
          ? `${code} - ${name}`
          : name || code;
      };

      return {
        purposes: BID_PURPOSE_DISPLAY,
        bidTypes: BID_TYPE_DISPLAY,
        references: BID_REFERENCE_DISPLAY,
        statuses: BID_STATUS_DISPLAY,
        masterBidGuarantees: getArray(guaranteesRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        projects: getArray(projectsRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.id,
        })),
        companies: getArray(companiesRes).map((item: any) => ({
          label: formatLabel(item),
          value: item.id || item.companyId,
        })),
      };
    },
  });
};

export const useBidList = (params: BidFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["bidList", params],
    queryFn: ({ pageParam = 1 }) =>
      bidService.getBidList({ ...params, pageIndex: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.data[1];
      const currentCount = allPages.length * (params.pageSize || PAGE_SIZE);
      return currentCount < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useBidDetail = (id: string) => {
  return useQuery({
    queryKey: ["bidDetail", id],
    queryFn: async () => {
      const results = await Promise.allSettled([
        bidService.getBidDetail(id),
        bidService.getBidTech(id),
        bidService.getBidTrade(id),
        bidService.getBidPrice(id),
        bidService.getBidHistory(id),
        bidService.getBidItems(id),
        bidService.getBidApprovalProgress(id),
      ]);

      const [
        detailRes,
        techRes,
        tradeRes,
        priceRes,
        historyRes,
        itemsRes,
        approvalRes,
      ] = results;

      const getData = (res: any) =>
        res.status === "fulfilled" ? res.value?.data : null;

      const detail = getData(detailRes);
      const tech = getData(techRes);
      const trade = getData(tradeRes);
      const price = getData(priceRes);
      const history = getData(historyRes);

      const getList = (base: any, key: string, fallback?: any[]) => {
        if (!base) return fallback || [];
        if (Array.isArray(base[key])) return base[key];
        if (base.data && Array.isArray(base.data[key])) return base.data[key];
        if (Array.isArray(base.data)) return base.data;
        if (Array.isArray(base)) return base;
        return fallback || [];
      };

      if (!detail && !tech && !trade) {
        throw new Error("Failed to fetch bid detail data");
      }

      const response = {
        data: {
          ...detail,
          // Priority 1: Data from sub-requests, Priority 2: Nested data in detail
          listTech: getList(tech, "listTech", detail?.listTech),
          listTrade: getList(trade, "listTrade", detail?.listTrade),
          listPrice: getList(price, "listPrice", detail?.__prices__),
          listPriceCol: Array.isArray(price)
            ? price
            : price?.listPriceCol || detail?.listPriceCol || [],
          listBidItems: detail?.lstDetail || [],
          lstBidSupplier: detail?.lstSupplier || [],
          lstApprovalProgress: Array.isArray(getData(approvalRes))
            ? getData(approvalRes)
            : detail?.lstApprovalProgress || [],
          auditLogs: Array.isArray(getData(historyRes)?.data?.[0])
            ? getData(historyRes).data[0]
            : Array.isArray(getData(historyRes))
              ? getData(historyRes)[0]
              : detail?.lstHistories || [],
        },
      };

      return response;
    },
    enabled: !!id,
  });
};

export const useApproveBid = () => {
  return useMutation({
    mutationFn: (data: BidActionRequest) => bidService.approveBid(data),
  });
};

export const useRejectBid = () => {
  return useMutation({
    mutationFn: (data: BidActionRequest) => bidService.rejectBid(data),
  });
};

export const useRecheckBid = () => {
  return useMutation({
    mutationFn: (data: BidActionRequest) => bidService.sendCheckAgain(data),
  });
};
