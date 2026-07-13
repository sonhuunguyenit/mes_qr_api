import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "~/hooks/useToast";
import { contractService } from "~/services/contract/contract.service";
import { ContractFilterParams } from "~/services/contract/contract.type";
import { poService } from "~/services/po/po.service";

export const useContract = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 1. List with Infinite Scroll
  const useContractList = (filters: ContractFilterParams) => {
    return useInfiniteQuery({
      queryKey: ["contract-list", filters],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await contractService.getContractList({
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
  const useContractDetail = (id: string | undefined) => {
    return useQuery({
      queryKey: ["contract-detail", id],
      queryFn: async () => {
        const res = await contractService.getContractDetail(id!);
        return res.data;
      },
      enabled: !!id,
    });
  };

  // 3. Lots
  const useContractLots = (contractId: string | undefined) => {
    return useQuery({
      queryKey: ["contract-lots", contractId],
      queryFn: async () => {
        const res = await contractService.getContractLots(contractId!);
        return res.data;
      },
      enabled: !!contractId,
    });
  };

  // 4. Approve Mutation
  const useApprove = () => {
    return useMutation({
      mutationFn: (data: { id: string }) =>
        contractService.approveContract(data),
      onSuccess: (res) => {
        showToast({
          type: "success",
          message: res.data?.message || "Duyệt hợp đồng thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["contract-list"] });
        queryClient.invalidateQueries({ queryKey: ["contract-detail"] });
      },
      onError: (error: any) => {
        showToast({
          type: "danger",
          message: error?.response?.data?.message || "Không thể duyệt hợp đồng",
        });
      },
    });
  };

  // 5. Reject Mutation
  const useReject = () => {
    return useMutation({
      mutationFn: (data: { id: string }) =>
        contractService.rejectContract(data),
      onSuccess: (res) => {
        showToast({
          type: "success",
          message: res.data?.message || "Từ chối hợp đồng thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["contract-list"] });
        queryClient.invalidateQueries({ queryKey: ["contract-detail"] });
      },
      onError: (error: any) => {
        showToast({
          type: "danger",
          message:
            error?.response?.data?.message || "Không thể từ chối hợp đồng",
        });
      },
    });
  };

  // 6. Recheck Mutation
  const useRecheck = () => {
    return useMutation({
      mutationFn: (data: { id: string; reason: string }) =>
        contractService.recheckContract(data),
      onSuccess: (res) => {
        showToast({
          type: "success",
          message: res.data?.message || "Yêu cầu kiểm tra lại thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["contract-list"] });
        queryClient.invalidateQueries({ queryKey: ["contract-detail"] });
      },
      onError: (error: any) => {
        showToast({
          type: "danger",
          message:
            error?.response?.data?.message || "Không thể yêu cầu kiểm tra lại",
        });
      },
    });
  };

  // 7. Filter Options (Companies)
  const useContractFilterOptions = () => {
    return useQuery({
      queryKey: ["contract-filter-options"],
      queryFn: async () => {
        const companyData = await poService.getCompanies();

        const getArray = (res: any): any[] => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res?.data && Array.isArray(res.data)) return res.data;
          return [];
        };

        const companies = getArray(companyData).map(
          (item: Record<string, any>) => ({
            label: item.code ? `${item.code} - ${item.name}` : item.name,
            value: item.code,
          }),
        );

        return {
          companies: [{ label: "Tất cả", value: undefined }, ...companies],
        };
      },
    });
  };

  return {
    useContractList,
    useContractDetail,
    useContractLots,
    useApprove,
    useReject,
    useRecheck,
    useContractFilterOptions,
  };
};
