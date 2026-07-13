import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "~/constants";
import {
  BID_PURPOSE_DISPLAY,
  BID_TYPE_DISPLAY,
} from "~/enums";
import { bidService } from "~/services/bid/bid.service";
import { bidRateService } from "~/services/bidRate/bidRate.service";
import {
  BidEvaluationApproveRequest,
  BidEvaluationRejectRequest,
  BidRateFilterParams,
} from "~/services/bidRate/bidRate.type";

export const useBidRateFilterOptions = () => {
  return useQuery({
    queryKey: ["bid-rate-filter-options"],
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
        return code && name && code !== name ? `${code} - ${name}` : name || code;
      };

      return {
        purposes: BID_PURPOSE_DISPLAY,
        bidTypes: BID_TYPE_DISPLAY,
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

export const useBidRateList = (params: BidRateFilterParams) => {
  return useInfiniteQuery({
    queryKey: ["bidRateList", params],
    queryFn: ({ pageParam = 1 }) =>
      bidRateService.getBidRateList({ ...params, pageIndex: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.data[1];
      const currentCount = allPages.length * (params.pageSize || PAGE_SIZE);
      return currentCount < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useBidEvaluationData = (bidId: string) => {
  return useQuery({
    queryKey: ["bidEvaluationData", bidId],
    queryFn: async () => {
      const response = await bidRateService.loadSupplierData(bidId);
      return response.data;
    },
    enabled: !!bidId,
  });
};

export const useApproveSupplierWinBid = () => {
  return useMutation({
    mutationFn: (data: BidEvaluationApproveRequest) =>
      bidRateService.approveSupplierWinBid(data),
  });
};

export const useEvalBidSupplier = () => {
  return useMutation({
    mutationFn: (data: BidEvaluationApproveRequest) =>
      bidRateService.evaluationBidSupplier(data),
  });
};

export const useRejectSupplierWinBid = () => {
  return useMutation({
    mutationFn: (data: BidEvaluationRejectRequest) =>
      bidRateService.rejectSupplierWinBid(data),
  });
};

export const useRecheckSupplierWinBid = () => {
  return useMutation({
    mutationFn: (data: BidEvaluationRejectRequest) =>
      bidRateService.recheckSupplierWinBid(data),
  });
};

export const useSendRequestFinishBid = () => {
  return useMutation({
    mutationFn: (data: {
      id: string;
      fileScan?: string;
      noteFinishBidMPO?: string;
    }) => bidRateService.sendRequestFinishBid(data),
  });
};

export const useApproveFinishBid = () => {
  return useMutation({
    mutationFn: (data: { id: string }) => bidRateService.approveFinishBid(data),
  });
};
