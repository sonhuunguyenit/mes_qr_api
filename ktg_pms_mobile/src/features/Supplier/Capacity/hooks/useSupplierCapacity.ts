import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "~/hooks/useToast";
import { supplierCapacityService } from "~/services/supplier/supplier-capacity.service";
import { SupplierCapacityFilterParams } from "~/services/supplier/supplier-capacity.type";

export const useSupplierCapacity = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const useCapacityList = (filters: SupplierCapacityFilterParams) =>
    useInfiniteQuery({
      queryKey: ["supplier-capacity-list", filters],
      queryFn: ({ pageParam = 1 }) =>
        supplierCapacityService.getSupplierCapacityList({
          ...filters,
          pageIndex: pageParam,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage.data?.[1] || 0;
        const currentCount = allPages.reduce(
          (acc, page) => acc + (page.data?.[0]?.length || 0),
          0,
        );
        return currentCount < total ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const useCapacityDetail = (id?: string) =>
    useQuery({
      queryKey: ["supplier-capacity-detail", id],
      queryFn: () => supplierCapacityService.getSupplierCapacityDetail(id!),
      enabled: !!id,
      select: (res) => res.data,
    });

  const useApprove = () =>
    useMutation({
      mutationFn: supplierCapacityService.approveSupplierCapacity,
      onSuccess: (res) => {
        showToast({
          type: "success",
          message: res.data?.message || "Duyệt thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["supplier-capacity-list"] });
        queryClient.invalidateQueries({ queryKey: ["supplier-capacity-detail"] });
      },
      onError: (err: any) => {
        showToast({
          type: "danger",
          message: err?.response?.data?.message || "Duyệt thất bại",
        });
      },
    });

  const useReject = () =>
    useMutation({
      mutationFn: supplierCapacityService.rejectSupplierCapacity,
      onSuccess: (res) => {
        showToast({
          type: "success",
          message: res.data?.message || "Từ chối thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["supplier-capacity-list"] });
        queryClient.invalidateQueries({ queryKey: ["supplier-capacity-detail"] });
      },
      onError: (err: any) => {
        showToast({
          type: "danger",
          message: err?.response?.data?.message || "Từ chối thất bại",
        });
      },
    });

  return {
    useCapacityList,
    useCapacityDetail,
    useApprove,
    useReject,
  };
};
