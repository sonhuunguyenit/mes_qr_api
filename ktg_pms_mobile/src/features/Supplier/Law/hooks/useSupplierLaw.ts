import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "~/hooks/useToast";
import { supplierLawService } from "~/services/supplier/supplier-law.service";
import { SupplierLawFilterParams } from "~/services/supplier/supplier-law.type";

export const useSupplierLaw = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 1. List with Infinite Scroll
  const useLawList = (filters: SupplierLawFilterParams) => {
    return useInfiniteQuery({
      queryKey: ["supplier-law-list", filters],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await supplierLawService.getSupplierLawList({
          ...filters,
          pageIndex: pageParam as number,
        });
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage?.[1] || 0;
        const currentCount = allPages.reduce(
          (acc, page) => acc + (page?.[0]?.length || 0),
          0,
        );
        return currentCount < total ? allPages.length + 1 : undefined;
      },
    });
  };

  // 2. Detail
  const useLawDetail = (id: string | undefined) => {
    return useQuery({
      queryKey: ["supplier-law-detail", id],
      queryFn: async () => {
        const res = await supplierLawService.getSupplierLawDetail(id!);
        return res.data;
      },
      enabled: !!id,
    });
  };

  // 3. Approve Mutation
  const useApprove = () => {
    return useMutation({
      mutationFn: (data: {
        requestUpdateSupplierId: string;
        supplierId: string;
        jsonLaw: string;
      }) => supplierLawService.approveSupplierLaw(data),
      onSuccess: (res) => {
        showToast({
          type: "success",
          message: res.data?.message || "Duyệt yêu cầu thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["supplier-law-list"] });
        queryClient.invalidateQueries({ queryKey: ["supplier-law-detail"] });
      },
      onError: (error: any) => {
        showToast({
          type: "danger",
          message: error?.response?.data?.message || "Không thể duyệt yêu cầu",
        });
      },
    });
  };

  // 4. Reject Mutation
  const useReject = () => {
    return useMutation({
      mutationFn: (data: {
        id: string;
        status: string;
        supplierId?: string;
        level?: number;
        type?: string;
      }) => supplierLawService.rejectSupplierLaw(data),
      onSuccess: (res) => {
        showToast({
          type: "success",
          message: res.data?.message || "Từ chối yêu cầu thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["supplier-law-list"] });
        queryClient.invalidateQueries({ queryKey: ["supplier-law-detail"] });
      },
      onError: (error: any) => {
        showToast({
          type: "danger",
          message:
            error?.response?.data?.message || "Không thể từ chối yêu cầu",
        });
      },
    });
  };

  // 5. Bank Country List
  const useBankCountries = () => {
    return useQuery({
      queryKey: ["bank-countries"],
      queryFn: async () => {
        const res = await supplierLawService.getBankCountryList();
        return res.data;
      },
    });
  };

  // 6. Bank Region List
  const useBankRegions = () => {
    return useQuery({
      queryKey: ["bank-regions"],
      queryFn: async () => {
        const res = await supplierLawService.getBankRegionList();
        return res.data;
      },
    });
  };

  // 7. Bank List
  const useBankList = () => {
    return useQuery({
      queryKey: ["banks"],
      queryFn: async () => {
        const res = await supplierLawService.getBankList();
        return res.data;
      },
    });
  };

  // 8. Bank Branch List
  const useBankBranchList = () => {
    return useQuery({
      queryKey: ["bank-branches"],
      queryFn: async () => {
        const res = await supplierLawService.getBankBranchList();
        return res.data;
      },
    });
  };

  return {
    useLawList,
    useLawDetail,
    useApprove,
    useReject,
    useBankCountries,
    useBankRegions,
    useBankList,
    useBankBranchList,
  };
};
